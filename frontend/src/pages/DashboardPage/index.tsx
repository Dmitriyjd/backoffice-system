import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Skeleton } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
    const [monthlyData, setMonthlyData] = useState<any>(null);
    const [weeklyData, setWeeklyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const [monthRes, weekRes] = await Promise.all([
                    api.get('/revenue/monthly'),
                    api.get('/revenue/weekly'),
                ]);
                setMonthlyData(monthRes.data);
                setWeeklyData(weekRes.data);
            } catch (err) {
                console.error('Failed to load revenue data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenue();
    }, []);

    const renderChart = (data: any, title: string) => {
        const chartData = {
            labels: Object.keys(data || {}),
            datasets: [
                {
                    label: title,
                    data: Object.values(data || {}),
                    backgroundColor: '#1976d2',
                },
            ],
        };

        return <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />;
    };

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Dashboard
                </Typography>
                <Grid container spacing={4}>
                    {/* @ts-ignore */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Revenue This Month
                            </Typography>
                            {loading ? <Skeleton variant="rectangular" height={200} /> : renderChart(monthlyData, 'Monthly Revenue')}
                        </Paper>
                    </Grid>
                    {/* @ts-ignore */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Revenue This Week
                            </Typography>
                            {loading ? <Skeleton variant="rectangular" height={200} /> : renderChart(weeklyData, 'Weekly Revenue')}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default DashboardPage;
