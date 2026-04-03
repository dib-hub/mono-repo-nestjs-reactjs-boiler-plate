import { JSX, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@src/redux/slices/authSlice';
import { AppDispatch, RootState } from '@src/redux/store';

const Dashboard = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.authSlice);

  const handleLogout = useCallback((): void => {
    dispatch(logout());
  }, [dispatch]);

  const handleProfile = useCallback((): void => {
    navigate('/profile');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

          {user && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Welcome, {user.firstName}!</h2>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Role: {user.role}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
          <button
            onClick={handleProfile}
            className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 mx-2 rounded-lg transition-colors"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
