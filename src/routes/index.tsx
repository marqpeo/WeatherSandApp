import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../ui/layouts/MainLayout';
import ErrorPage from '../ui/pages/ErrorPage';
import MainPage from '../ui/pages/MainPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
    ],
  },
]);

export default router;
