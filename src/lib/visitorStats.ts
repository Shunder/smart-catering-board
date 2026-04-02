import { useEffect, useState } from 'react';

const COUNT_API_BASE = 'https://api.countapi.xyz';
const VISITOR_FLAG_KEY = 'scb-visitor-counted-v1';

type CounterState = {
  visitors: number | null;
  visits: number | null;
  loading: boolean;
};

type CountApiResponse = {
  value?: number;
};

function sanitizeKey(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function getCounterNamespace(): string {
  const host = sanitizeKey(window.location.hostname || 'local');
  const site = sanitizeKey(window.location.pathname.split('/')[1] || 'root');
  return `smart-catering-board-${host}-${site}`;
}

async function countApi(path: string): Promise<number | null> {
  try {
    const response = await fetch(`${COUNT_API_BASE}${path}`);
    if (!response.ok) return null;
    const data = (await response.json()) as CountApiResponse;
    return typeof data.value === 'number' ? data.value : null;
  } catch {
    return null;
  }
}

export function useSiteCounters(): CounterState {
  const [state, setState] = useState<CounterState>({
    visitors: null,
    visits: null,
    loading: true
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const namespace = getCounterNamespace();
      const hasCountedVisitor = window.localStorage.getItem(VISITOR_FLAG_KEY) === '1';

      const visitsPromise = countApi(`/hit/${namespace}/total-visits`);
      const visitorsPromise = hasCountedVisitor
        ? countApi(`/get/${namespace}/total-visitors`)
        : countApi(`/hit/${namespace}/total-visitors`);

      const [visits, visitors] = await Promise.all([visitsPromise, visitorsPromise]);

      if (!hasCountedVisitor && visitors !== null) {
        window.localStorage.setItem(VISITOR_FLAG_KEY, '1');
      }

      if (!cancelled) {
        setState({
          visitors,
          visits,
          loading: false
        });
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
