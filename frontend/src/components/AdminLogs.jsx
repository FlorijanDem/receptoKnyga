import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLog() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    userId: "",
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
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  async function fetchLogs() {
    setIsLoading(true);
    setError(null);
    try {
      // Validate date range
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
      setError(
        err.response?.data?.message
          ? `Failed to fetch logs: ${err.response.data.message}`
          : err.message || "Failed to fetch logs. Please try again."
      );
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Activity Logs</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="userId"
          placeholder="Filter by User ID"
          value={filters.userId}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="action"
          placeholder="Filter by Action"
          value={filters.action}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">IP</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{log.user_id || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{log.user_ip}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{log.action}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              disabled={filters.page === 1 || isLoading}
              onClick={() => handlePageChange(filters.page - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {filters.page} of {Math.ceil(total / filters.limit)}
            </span>
            <button
              disabled={filters.page * filters.limit >= total || isLoading}
              onClick={() => handlePageChange(filters.page + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}