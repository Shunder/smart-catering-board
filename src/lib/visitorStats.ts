import { useEffect, useState } from 'react';

type CounterState = {
  visitors: number | null;
  visits: number | null;
  loading: boolean;
};

const BUSUANZI_SCRIPT_ID = 'busuanzi-script';
const BUSUANZI_SCRIPT_SRC = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
const POLL_INTERVAL_MS = 300;
const TIMEOUT_MS = 10000;

function readCounter(id: string): number | null {
  const value = document.getElementById(id)?.textContent?.trim() ?? '';
  if (!value) return null;
  const parsed = Number(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function ensureBusuanziScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(BUSUANZI_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === '1') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('busuanzi load failed')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = BUSUANZI_SCRIPT_ID;
    script.src = BUSUANZI_SCRIPT_SRC;
    script.async = true;
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = '1';
        resolve();
      },
      { once: true }
    );
    script.addEventListener('error', () => reject(new Error('busuanzi load failed')), { once: true });
    document.body.appendChild(script);
  });
}

export function useSiteCounters(): CounterState {
  const [state, setState] = useState<CounterState>({
    visitors: null,
    visits: null,
    loading: true
  });

  useEffect(() => {
    let cancelled = false;

    const update = () => {
      const visitors = readCounter('busuanzi_value_site_uv');
      const visits = readCounter('busuanzi_value_site_pv');
      const ready = visitors !== null || visits !== null;

      if (!cancelled) {
        setState({
          visitors,
          visits,
          loading: !ready
        });
      }

      return ready;
    };

    const run = async () => {
      try {
        await ensureBusuanziScript();
      } catch {
        if (!cancelled) {
          setState({ visitors: null, visits: null, loading: false });
        }
        return;
      }

      if (update()) return;

      const startedAt = Date.now();
      const timer = window.setInterval(() => {
        const done = update();
        const timeout = Date.now() - startedAt > TIMEOUT_MS;

        if (done || timeout || cancelled) {
          window.clearInterval(timer);
          if (timeout && !cancelled) {
            setState((current) => ({ ...current, loading: false }));
          }
        }
      }, POLL_INTERVAL_MS);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
