import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">
                    Backoffice
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="inherit" component={NavLink} to="/dashboard">
                        Dashboard
                    </Button>
                    {user?.role?.name === 'admin' && (
                        <Button color="inherit" component={NavLink} to="/users">
                            Users
                        </Button>
                    )}
                    <Button color="inherit" component={NavLink} to="/transactions">
                        Transactions
                    </Button>
                    <Typography variant="body2">{user?.email}</Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
