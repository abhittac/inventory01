// components/dashboard/AnalyticsBoard.jsx
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import toast from "react-hot-toast";
import salesOrderService from "../../services/orderService";
import SummaryCard from "../../components/dashboard/SummaryCard";

export default function SaleAnalyticBoard() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await salesOrderService.getOrderStats();
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to fetch analytics stats");
      console.error("AnalyticsBoard: fetchStats error", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return null; // Optional: Replace with a loader/spinner if needed

  return (
    <>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Total Orders"
          value={stats.totalOrders?.value}
          changeFromLastMonth={stats.totalOrders?.changeFromLastMonth}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Pending Orders"
          value={stats.pendingOrders?.value}
          changeFromLastMonth={stats.pendingOrders?.changeFromLastMonth}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Completed Orders"
          value={stats.completedOrders?.value}
          changeFromLastMonth={stats.completedOrders?.changeFromLastMonth}
          color="success"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Total Amount"
          value={stats.totalAmount?.value}
          changeFromLastMonth={stats.totalAmount?.changeFromLastMonth}
          color="info"
        />
      </Grid>
    </>
  );
}
