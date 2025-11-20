// src/pages/Landing.jsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&s=...')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      {/* ⭐ TOP-RIGHT BUTTONS (Login + About + Contact) */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          variant="text"
          sx={{ color: "#fff" }}
          onClick={() => navigate("/about")}
        >
          About
        </Button>

        <Button
          variant="text"
          sx={{ color: "#fff" }}
          onClick={() => navigate("/contact")}
        >
          Contact
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Box>

      {/* center content */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            backdropFilter: "blur(4px)",
            p: 6,
            borderRadius: 2,
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
            One place for all your banks
          </Typography>

          <Typography variant="h6" sx={{ mb: 4 }}>
            View accounts, manage transactions and more — securely.
          </Typography>

          {/* Get Started */}
          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              color: "#fff",
              borderColor: "#fff",
              mb: 3,
              px: 4,
            }}
          >
            Get Started
          </Button>

          

           
          
        </Box>
      </Box>
    </Box>
  );
}
