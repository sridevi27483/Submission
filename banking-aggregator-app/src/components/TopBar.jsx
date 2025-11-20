// src/components/TopBar.jsx
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "Admin" or "Customer"

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side buttons */}
        <Box>
          {role === "Customer" && (
            <Button
              color="inherit"
              onClick={() => navigate("/transactions")}
            >
              Transactions
            </Button>
          )}
        </Box>

        {/* Right side logout */}
        <Button
          color="inherit"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
