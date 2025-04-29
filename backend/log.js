
// ============================
// 💻 FRONTEND (React + Vite)
// ============================

// 1. logging.js (add error handling)
export async function logPageView(pathname) {
  try {
    await fetch("http://localhost:3001/api/logs/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname }),
    });
  } catch (error) {
    console.error("Failed to log page view:", error);
  }
}

// 2. App.jsx (unchanged)
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logPageView } from "./logging";
function App() {
  const location = useLocation();
  useEffect(() => { logPageView(location.pathname); }, [location]);
  return (<YourRoutes />);
}

// 3. AdminLogPage.jsx (enhanced with filtering and pagination)
import { useEffect, useState } from "react";
export default function AdminLogPage() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    userId: "",
    action: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10
  });
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  async function fetchLogs() {
    try {
      const params = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString()
      });
      const res = await fetch(`http://localhost:3001/api/logs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Activity Logs</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="User ID"
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value, page: 1 })}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Action"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
          style={{ marginRight: "10px" }}
        />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
          style={{ marginRight: "10px" }}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
        />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>User</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>IP</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Action</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.user_id}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.user_ip}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.action}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {filters.page} of {Math.ceil(total / filters.limit)}
        </span>
        <button
          disabled={filters.page * filters.limit >= total}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  );
}


