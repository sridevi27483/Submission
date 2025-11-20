// src/pages/Transactions.jsx
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import TopBar from "../components/TopBar";
import { getTransactions } from "../api/api";

export default function Transactions() {
  const [rows, setRows] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId") || localStorage.getItem("customerId") || 1;
  const role = localStorage.getItem("role") ?? "Customer";

  const fetch = async (useFrom = from, useTo = to) => {
    setLoading(true);
    try {
      const data = await getTransactions(userId, role, useFrom || undefined, useTo || undefined);
      const mapped = (data || []).map((t) => ({
        id: t.transactionId ?? t.id ?? `${t.type}-${t.createdAt}-${Math.random()}`,
        date: t.createdAt,
        type: t.type,
        amount: t.amount,
        description: t.description ?? t.note ?? "",
        accountId: t.accountId ?? t.destinationAccountId ?? t.destinationAccountId,
      }));
      setRows(mapped);
      // also save to localStorage as fallback
      localStorage.setItem("transactions", JSON.stringify(mapped));
    } catch (err) {
      console.warn("Transactions fetch failed, falling back to localStorage", err);
      // fallback to localStorage (e.g. when backend endpoint not available)
      const stored = JSON.parse(localStorage.getItem("transactions") || "[]");
      setRows(stored);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { field: "date", headerName: "Date", width: 200 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "amount", headerName: "Amount", width: 140, type: "number" },
    { field: "accountId", headerName: "AccountId", width: 140 },
    { field: "description", headerName: "Description", flex: 1 },
  ];

  return (
    <Box>
      <TopBar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Transactions
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="From (YYYY-MM-DD)" value={from} onChange={(e) => setFrom(e.target.value)} />
          <TextField label="To (YYYY-MM-DD)" value={to} onChange={(e) => setTo(e.target.value)} />
          <Button variant="contained" onClick={() => fetch(from, to)}>
            Filter
          </Button>
          <Button variant="outlined" onClick={() => { setFrom(""); setTo(""); fetch("", ""); }}>
            Clear
          </Button>
        </Box>

        <div style={{ height: 520, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} loading={loading} />
        </div>
      </Box>
    </Box>
  );
}
