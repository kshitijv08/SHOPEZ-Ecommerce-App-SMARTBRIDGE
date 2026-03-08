import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <Loader />;
    if (!user || user.usertype !== 'admin') return <Navigate to="/" replace />;
    return children;
};
export default AdminRoute;
