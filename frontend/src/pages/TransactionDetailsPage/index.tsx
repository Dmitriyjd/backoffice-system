// src/pages/TransactionDetailsPage/index.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    CircularProgress,
    Divider,
    Button,
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

const TransactionDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await api.get(`/transactions/${id}`);
                setTransaction(res.data);
            } catch (err) {
                console.error('Failed to load transaction', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [id]);

    if (loading) {
        return (
            <Container sx={{ mt: 4 }}>
                <Navbar />
                <CircularProgress />
            </Container>
        );
    }

    if (!transaction) {
        return (
            <Container sx={{ mt: 4 }}>
                <Navbar />
                <Typography variant="h6">Transaction not found.</Typography>
            </Container>
        );
    }

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                    ← Back
                </Button>
                <Typography variant="h4" gutterBottom>
                    Transaction Details
                </Typography>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1"><strong>ID:</strong> {transaction._id}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography><strong>User:</strong> {transaction.user?.email}</Typography>
                    <Typography><strong>Type:</strong> {transaction.type}</Typography>
                    <Typography><strong>Sub-Type:</strong> {transaction.subType}</Typography>
                    <Typography><strong>Amount:</strong> ${transaction.amount}</Typography>
                    <Typography><strong>Status:</strong> {transaction.status}</Typography>
                    <Typography><strong>Description:</strong> {transaction.description}</Typography>
                    <Typography><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</Typography>
                </Paper>
            </Container>
        </>
    );
};

export default TransactionDetailsPage;
