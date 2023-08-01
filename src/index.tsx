import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import router from './routes';
import { store } from './redux/store';
import './locales'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);


root.render(
  <Suspense fallback="loading">
    <Provider store={store} >
      <RouterProvider router={router} />
    </Provider>
  </Suspense>
);
