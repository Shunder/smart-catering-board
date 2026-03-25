import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DishesPage } from './pages/DishesPage';
import { HomePage } from './pages/HomePage';
import { IngredientsPage } from './pages/IngredientsPage';
import { MenusPage } from './pages/MenusPage';
import { ProjectEditorPage } from './pages/ProjectEditorPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectSummaryPage } from './pages/ProjectSummaryPage';
import { UsagePage } from './pages/UsagePage';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/dishes" element={<DishesPage />} />
        <Route path="/menus" element={<MenusPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<ProjectEditorPage />} />
        <Route path="/projects/:id/edit" element={<ProjectEditorPage />} />
        <Route path="/projects/:id/summary" element={<ProjectSummaryPage />} />
        <Route path="/usage" element={<UsagePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
