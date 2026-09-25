import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

function AppLayout() {
  const { currentUser } = useAuth();

  return (
    <>
      <NavigationBar />
      <div className={currentUser ? 'app-layout' : 'app-layout-full'}>
        {currentUser && <Sidebar />}
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AppLayout;