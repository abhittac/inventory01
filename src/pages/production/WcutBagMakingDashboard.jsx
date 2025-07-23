import { useState, useEffect } from "react";
import { Box, Card, Button, Typography, Grid, Divider } from "@mui/material";
import { Dashboard, Assessment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../contexts/ColorModeContext";
import OrderService from "../../../src/services/wcutBagMakingServices";
import WcutBagMakingOrderList from "./components/WCutBagMakingOrderLists";
import { formatSnakeCase } from "../../utils/formatSnakeCase";

export default function WcutBagMakingDashboard({ type }) {
  const navigate = useNavigate();
  const { toggleColorMode } = useColorMode();
  const [activeStatus, setActiveStatus] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [noOrdersFound, setNoOrdersFound] = useState(false);

  const bagType = type === "wcut" ? "W-Cut" : "D-Cut";
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

  const handleStatusUpdated = () => {
    fetchOrders(activeStatus);
  };

  return (
    <Box sx={{ pb: 7, px: { xs: 2, sm: 3 } }}>
      {" "}
      {/* Padding for better spacing on small screens */}
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            {" "}
            {/* Full width on mobile, half on larger screens */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<Dashboard />}
              onClick={() => navigate(`${basePath}/dashboard`)}
              sx={{ height: { xs: "50px", sm: "60px" } }}
            >
              Dashboard
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Assessment />}
              onClick={() => navigate(`${basePath}/reports`)}
              sx={{ height: { xs: "50px", sm: "60px" } }}
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
            <Grid container spacing={1}>
              {" "}
              {/* Adjust spacing for smaller screens */}
              {["pending", "in_progress", "completed"].map((status) => (
                <Grid item xs={12} sm={4} key={status}>
                  {" "}
                  {/* Full width on mobile, third on larger screens */}
                  <Button
                    variant={activeStatus === status ? "contained" : "outlined"}
                    onClick={() => setActiveStatus(status)}
                    fullWidth
                    sx={{ fontSize: { xs: "12px", sm: "14px" } }}
                  >
                    {formatSnakeCase(status)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>

        <WcutBagMakingOrderList
          orders={orders}
          status={activeStatus}
          noOrdersFound={noOrdersFound}
          onStatusUpdated={handleStatusUpdated}
          bagType={bagType}
        />
      </Box>
    </Box>
  );
}
