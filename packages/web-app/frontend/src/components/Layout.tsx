import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Sparkles,
  LogOut
} from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">Supranorma</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <NavLink to="/" icon={<LayoutDashboard size={18} />}>
                  Dashboard
                </NavLink>
                <NavLink to="/projects" icon={<FolderKanban size={18} />}>
                  Projects
                </NavLink>
                <NavLink to="/tasks" icon={<CheckSquare size={18} />}>
                  Tasks
                </NavLink>
                <NavLink to="/ai" icon={<Sparkles size={18} />}>
                  AI Assistant
                </NavLink>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({
  to,
  children,
  icon
}: {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
}
