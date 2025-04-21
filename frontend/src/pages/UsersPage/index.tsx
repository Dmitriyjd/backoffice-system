import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    TextField,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: {
        name: string;
    };
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (!confirmed) return;

        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error('Failed to delete user', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <Dialog
                maxWidth="sm"
                fullWidth
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <DialogTitle>Edit User Role</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={selectedRole}
                            label="Role"
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!editingUser) return;
                            try {
                                await api.put(`/users/${editingUser._id}`, { role: selectedRole });
                                fetchUsers();
                            } catch (err) {
                                console.error('Failed to update role', err);
                            } finally {
                                setModalOpen(false);
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Users
                </Typography>

                <TextField
                    label="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                {loading ? (
                    <CircularProgress />
                ) : (
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filtered.map((user) => (
                                        <TableRow key={user._id} hover>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role?.name}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <IconButton color="primary">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => {
                                                                setEditingUser(user);
                                                                setSelectedRole(user.role?.name || 'user');
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton color="error" onClick={() => handleDeleteUser(user._id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Container>
        </>
    );
};

export default UsersPage;
