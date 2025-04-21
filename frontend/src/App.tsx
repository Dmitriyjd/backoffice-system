import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {JSX} from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailsPage from './pages/TransactionDetailsPage';
import UsersPage from "./pages/UsersPage";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { token, user } = useAuth();

    if (!token || user?.role?.name !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/transactions"
                        element={
                            <PrivateRoute>
                                <TransactionsPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/transactions/:id"
                        element={
                            <PrivateRoute>
                                <TransactionDetailsPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <AdminRoute>
                                <UsersPage />
                            </AdminRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;