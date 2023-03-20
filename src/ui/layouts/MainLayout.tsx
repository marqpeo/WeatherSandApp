import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div className='h-screen max-h-screen flex bg-gray-200'>
      <Sidebar />

      <div className='container p-10 md:p-16'>
        <Outlet />
      </div>
    </div>
  );
}
