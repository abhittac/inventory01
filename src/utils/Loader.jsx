import { Card, CircularProgress } from "@mui/material";
import React from "react";

export default function Loader() {
  return (
    <Card>
      <div className="flex items-center justify-center mt-[18rem] pb-[18rem]">
        <CircularProgress />
      </div>
    </Card>
  );
}
