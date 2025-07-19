import { useState } from "react";
import { Grid, Box, CircularProgress, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReportSummary from "./components/ReportSummary";
import ReportTable from "./components/ReportTable";
import ReportCharts from "./components/ReportCharts";
import { useFlexoRecords } from "../../../hooks/useFlexoRecords";
import Loader from "../../../utils/Loader";

export default function FlexoReportsPage() {
  const navigate = useNavigate();
  const { records, isLoading } = useFlexoRecords();

  const handleBack = () => {
    navigate("/production/flexo/dashboard");
  };

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ pb: 7 }}>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ReportSummary records={Array.isArray(records) ? records : []} />
          </Grid>

          <Grid item xs={12}>
            <ReportCharts records={Array.isArray(records) ? records : []} />
          </Grid>

          <Grid item xs={12}>
            <ReportTable records={records} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
