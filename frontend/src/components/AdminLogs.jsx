import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    action: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  async function fetchLogs() {
    setIsLoading(true);
    setError(null);
    try {
      if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
        throw new Error("End date cannot be earlier than start date");
      }

      const params = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      const response = await axios.get(`${API_URL}/logs?${params}`, {
        withCredentials: true,
      });
      setLogs(response.data.logs);
      setTotal(response.data.total);
    } catch (err) {
      const errorMessage = err.response?.data?.message
        ? `Failed to fetch logs: ${err.response.data.message}`
        : err.message || "Failed to fetch logs. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="admin-logs__container">
      <h1 className="admin-logs__header">User Activity Logs</h1>

      {error && <div className="admin-logs__error">{error}</div>}

      <div className="admin-logs__filters">
        <input
          type="text"
          name="username"
          placeholder="Filter by Username"
          value={filters.username}
          onChange={handleFilterChange}
          className="admin-logs__filter-input"
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="admin-logs__filter-input"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="admin-logs__filter-input"
        />
      </div>

      {isLoading ? (
        <div className="admin-logs__loading">Loading...</div>
      ) : (
        <>
          <div className="admin-logs__table-container">
            <table className="admin-logs__table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>IP Address</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-logs__table-empty">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    let formattedDetails = log.details;
                    try {
                      formattedDetails = log.details.recipeId
                        ? `Recipe: ${log.details.title || "Unknown"} (ID: ${log.details.recipeId})`
                        : JSON.stringify(log.details);
                    } catch (e) {

                    }
                    return (
                      <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td>{log.username || log.user_id || "N/A"}</td>
                        <td>{log.user_ip}</td>
                        <td>{log.action}</td>
                        <td>{formattedDetails}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-logs__pagination">
            <button
              disabled={filters.page === 1 || isLoading}
              onClick={() => handlePageChange(filters.page - 1)}
              className="admin-logs__pagination-button"
            >
              Previous
            </button>
            <span className="admin-logs__pagination-info">
              Page {filters.page} of {Math.ceil(total / filters.limit)}
            </span>
            <button
              disabled={filters.page * filters.limit >= total || isLoading}
              onClick={() => handlePageChange(filters.page + 1)}
              className="admin-logs__pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminLogPage