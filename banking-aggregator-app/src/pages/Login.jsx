// src/pages/Login.jsx
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }
    setLoading(true);
    try {
      const res = await login(username, password); // { token, role, userId, ... }
      if (!res || !res.token) throw new Error("Login failed: no token returned");

      // store basics
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role ?? "Customer");
      localStorage.setItem("userId", String(res.userId ?? ""));

      // ---- TEMPORARY STATIC MAPPING (development/demo only) ----
      // Map test username -> customerId so frontend fetches correct account
      // Remove this block when backend returns customerId dynamically
      const testMapping = {
        "nooru": "109",
        "pavi": "108"
        // add more test users here as needed: "lowercase-username": "customerId"
      };
      const uname = (username || "").toLowerCase();
      if (testMapping[uname]) {
        localStorage.setItem("customerId", testMapping[uname]);
        console.info("Applied test mapping:", uname, "-> customerId", testMapping[uname]);
      }
      // ---------------------------------------------------------

      alert("Login successful");
      navigate("/accounts");
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.response?.data ?? err?.message ?? "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#f3f7fb,#ffffff)",
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ width: 420, p: 5, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}>
          Bank Aggregator — Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button variant="contained" fullWidth type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
