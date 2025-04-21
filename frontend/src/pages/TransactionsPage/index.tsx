import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    CircularProgress,
    TablePagination,
} from '@mui/material';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

interface Transaction {
    _id: string;
    type: string;
    subType: string;
    amount: number;
    status: string;
    description: string;
    user: { email: string };
    createdAt: string;
}

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        subType: '',
        status: '',
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const navigate = useNavigate();

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/transactions', {
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    ...filters,
                },
            });
            setTransactions(res.data.transactions);
            setTotalCount(res.data.total || 0);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters, page, rowsPerPage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name as string]: value }));
    };

    // @ts-ignore
    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Transactions
                </Typography>

                <Grid container spacing={2} mb={2}>
                    {/* @ts-ignore */}
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Search"
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    {/* @ts-ignore */}
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth sx={{ minWidth: 180 }}>
                            <InputLabel>Type</InputLabel>
                            {/* @ts-ignore */}
                            <Select name="type" value={filters.type} onChange={handleChange} label="Type">
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="deposit">Deposit</MenuItem>
                                <MenuItem value="credit">Credit</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* @ts-ignore */}
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Sub-Type"
                            name="subType"
                            value={filters.subType}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    {/* @ts-ignore */}
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth sx={{ minWidth: 180 }}>
                            <InputLabel>Status</InputLabel>
                            {/* @ts-ignore */}
                            <Select name="status" value={filters.status} onChange={handleChange} label="Status">
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Sub-Type</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.isArray(transactions) && transactions.map((tx) => (
                                        <TableRow
                                            key={tx._id}
                                            hover
                                            sx={{ '&:hover': { backgroundColor: 'action.hover' }, cursor: 'pointer'}}
                                            onClick={() => navigate(`/transactions/${tx._id}`)}
                                        >
                                            <TableCell>{tx.user?.email}</TableCell>
                                            <TableCell>{tx.type}</TableCell>
                                            <TableCell>{tx.subType}</TableCell>
                                            <TableCell>{tx.amount}</TableCell>
                                            <TableCell>
                                                <Paper sx={{
                                                    bgcolor:
                                                        tx.status === 'completed'
                                                            ? 'success.light'
                                                            : tx.status === 'pending'
                                                                ? 'warning.light'
                                                                : 'error.light',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    textTransform: 'capitalize',
                                                    display: 'inline-block',
                                                    textAlign: 'center',
                                                    m: 'auto',
                                                    width: 'fit-content',
                                                    minWidth: 80,
                                                }}>
                                                    {tx.status}
                                                </Paper>
                                            </TableCell>
                                            <TableCell>{tx.description}</TableCell>x
                                            <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={(_e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </Paper>
                )}
            </Container>
        </>
    );
};

export default TransactionsPage;
