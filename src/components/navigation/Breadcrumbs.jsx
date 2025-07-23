import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  const navigate = useNavigate();

  return (
    <MuiBreadcrumbs
      separator={<NavigateNext fontSize="small" />}
      sx={{ mb: 3, mt: 1 }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.path) {
          return (
            <Typography key={index} color="text.primary">
              {item.title}
            </Typography>
          );
        }
        return (
          <Link
            key={index}
            color="inherit"
            underline="none"
            onClick={() => navigate(item.path)}
            sx={{ cursor: "pointer" }}
          >
            {item.title}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
