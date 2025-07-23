import { useState, useEffect } from "react";
import { Box, Card, Button, Typography, Grid, Divider } from "@mui/material";
import { Dashboard, Assessment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../contexts/ColorModeContext";
import DCutBagMakingOrderList from "./components/DCutBagMakingOrderList";
import OrderService from "../../services/dcutBagMakingService";
import { formatSnakeCase } from "../../utils/formatSnakeCase";

export default function DcutBagMakingDashboard({ type }) {
  const navigate = useNavigate();
  const { toggleColorMode } = useColorMode();
  const [activeStatus, setActiveStatus] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [noOrdersFound, setNoOrdersFound] = useState(false);

  const bagType = type === "wcut" ? "w_cut_bagmaking" : "d_cut_bagmaking";
  const basePath = `/production/${type}/bagmaking`;

  const fetchOrders = (status) => {
    OrderService.listOrders(status)
      .then((data) => {
        if (data.success && data.data?.length) {
          setOrders(data.data);
          setNoOrdersFound(false);
        } else {
          setOrders([]);
          setNoOrdersFound(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setOrders([]);
        setNoOrdersFound(true);
      });
  };

  useEffect(() => {
    fetchOrders(activeStatus);
  }, [activeStatus]);

  return (
    <Box sx={{ pb: 7 }}>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Dashboard />}
              onClick={() => navigate(`${basePath}/dashboard`)}
              sx={{ height: "60px" }}
            >
              Dashboard
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Assessment />}
              onClick={() => navigate(`${basePath}/reports`)}
              sx={{ height: "60px" }}
            >
              Reports
            </Button>
          </Grid>
        </Grid>

        <Card sx={{ mb: 3 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Production Orders
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {["pending", "in_progress", "completed"].map((status) => (
                <Grid item xs={4} key={status}>
                  <Button
                    variant={activeStatus === status ? "contained" : "outlined"}
                    onClick={() => setActiveStatus(status)}
                    fullWidth
                  >
                    {formatSnakeCase(status)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
        <DCutBagMakingOrderList
          orders={orders}
          status={activeStatus}
          noOrdersFound={noOrdersFound}
          bagType={bagType}
        />
      </Box>
    </Box>
  );
}
