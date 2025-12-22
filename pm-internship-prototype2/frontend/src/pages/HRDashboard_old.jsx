// src/pages/HRDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";


import {Bar, Pie, Line, Doughnut, Radar } from "react-chartjs-2";
import { RadialLinearScale } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title
);

import { ThemeContext } from "../components/ThemeContext";

export default function HRDashboard() {
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [rejectedCount, setRejectedCount] = useState(0);
  const deptId = localStorage.getItem("department_id");
  const hrName = localStorage.getItem("hr_name") || "HR";
  const nav = useNavigate();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/departments/${deptId}/posts`);
      setPosts(res.data);
      
      // Fetch rejected count
      try {
        const rejectedRes = await api.get(`/departments/${deptId}/rejected`);
        setRejectedCount(rejectedRes.data.length);
      } catch (err) {
        console.error("Failed to fetch rejected count:", err);
        setRejectedCount(0);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch posts: " + (err?.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };
  const [notifications, setNotifications] = useState([]);
  const [aiInsights, setAiInsights] = useState({ insights: [], recommendations: [], metrics: {} });
  
  const deptName = {
    "it_software": "IT & Software",
    "banking_finance": "Banking & Finance", 
    "fmcg": "FMCG",
    "oil_gas": "Oil & Gas",
    "manufacturing": "Manufacturing",
    "healthcare": "Healthcare",
    "retail": "Retail",
    "hospitality": "Hospitality"
  }[deptId] || "Unknown Department";

  useEffect(() => {
    async function load() {
      try {
        const postsRes = await api.get(`/departments/${deptId}/posts`);
        setPosts(postsRes.data);
        
        // Generate notifications from posts data
        const notifs = [];
        postsRes.data.forEach((post) => {
          if ((post.total_applicants || 0) > 0) {
            notifs.push({
              id: `app-${post.id}`,
              type: "new",
              msg: `${post.total_applicants || 0} applications received for ${post.title}`,
              time: "Recent"
            });
          }
          if ((post.selected_count || 0) > 0) {
            notifs.push({
              id: `sel-${post.id}`,
              type: "success",
              msg: `${post.selected_count} candidates selected for ${post.title}`,
              time: "Recent"
            });
          }
        });
        setNotifications(notifs.slice(0, 5));
        
        // Fetch rejected count
        try {
          const rejectedRes = await api.get(`/departments/${deptId}/rejected`);
          setRejectedCount(rejectedRes.data.length);
        } catch (err) {
          console.error("Failed to fetch rejected count:", err);
          setRejectedCount(0);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch data: " + (err?.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [deptId]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  // Calculate dynamic counts from applicants data
  const calculateCounts = () => {
    const counts = { selected: 0, rejected: rejectedCount, pending: 0, total: 0 };
    
    posts.forEach(post => {
      const postApplicants = post.total_applicants || 0;
      const postSelected = post.positions_filled || 0;
      
      counts.selected += postSelected;
      counts.total += postApplicants;
    });
    
    counts.pending = Math.max(0, counts.total - counts.selected - counts.rejected);
    
    return counts;
  };
  
  const dynamicCounts = calculateCounts();

  // Chart data
  const statsData = {
    labels: posts.map((p) => p.title),
    datasets: [
      {
        label: "Positions Filled",
        data: posts.map((p) => p.positions_filled || 0),
        backgroundColor: theme === "light" ? "rgba(34,197,94,0.6)" : "rgba(34,197,94,0.8)",
      },
      {
        label: "Total Positions",
        data: posts.map((p) => p.positions || 0),
        backgroundColor: theme === "light" ? "rgba(59,130,246,0.6)" : "rgba(59,130,246,0.8)",
      },
    ],
  };

  const pieData = {
    labels: ["Selected", "Rejected", "Pending"],
    datasets: [
      {
        data: [dynamicCounts.selected, dynamicCounts.rejected, dynamicCounts.pending],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
      },
    ],
  };

  const lineData = {
    labels: posts.map((p) => p.title),
    datasets: [
      {
        label: "Applications per Post",
        data: posts.map((p) => p.total_applicants || 0),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: posts.map((p) => p.title),
    datasets: [
      {
        label: "Vacancy Rate",
        data: posts.map((p) => ((p.positions || 0) - (p.positions_filled || 0))),
        backgroundColor: [
          "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"
        ],
      },
    ],
  };

  const radarData = {
    labels: ["Applications", "Selected", "Rejected", "Pending", "Filled"],
    datasets: [
      {
        label: "Recruitment Metrics",
        data: [
          dynamicCounts.total,
          dynamicCounts.selected,
          dynamicCounts.rejected,
          dynamicCounts.pending,
          posts.reduce((c, p) => c + (p.positions_filled || 0), 0),
        ],
        backgroundColor: "rgba(99,102,241,0.2)",
        borderColor: "#6366f1",
        pointBackgroundColor: "#6366f1",
      },
    ],
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid gap-6">
            {posts.length === 0 && (
              <div
                className={`text-center p-6 rounded-xl shadow ${
                  theme === "light" ? "bg-white text-gray-500" : "bg-gray-900 text-gray-300"
                }`}
              >
                No posts yet — create one.
              </div>
            )}
            {posts.map((p) => (
              <div
                key={p.id}
                className={`p-6 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 ${
                  p.status === "closed" 
                    ? theme === "light" ? "bg-gray-100 text-gray-600 border-2 border-gray-300" : "bg-gray-700 text-gray-400 border-2 border-gray-600"
                    : theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"
                }`}
              >
                {p.status === "closed" && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                      ✅ POSITION CLOSED - ALL POSITIONS FILLED
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{p?.title || 'Untitled Post'}</h2>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{p?.description || 'No description'}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {p.stipend && (
                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${
                            theme === "light"
                              ? "bg-teal-50 text-teal-700 border-teal-200"
                              : "bg-teal-900 text-teal-300 border-teal-700"
                          }`}
                        >
                          Stipend: {p.stipend}
                        </span>
                      )}
                      {p.location_preference && (
                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${
                            theme === "light"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-indigo-900 text-indigo-300 border-indigo-700"
                          }`}
                        >
                          Location: {p.location_preference}
                        </span>
                      )}
                      {p.sector && (
                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${
                            theme === "light"
                              ? "bg-pink-50 text-pink-700 border-pink-200"
                              : "bg-pink-900 text-pink-300 border-pink-700"
                          }`}
                        >
                          Sector: {p.sector}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex flex-col gap-2">
                    <div className="text-sm">
                      Positions: <b>{p.positions}</b>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Filled: <b>{p.positions_filled || 0}</b>
                    </div>
                    {p.status === "closed" ? (
                      <div className="mt-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-center font-medium">
                        Completed
                      </div>
                    ) : (
                      <button
                        onClick={() => nav(`/hr/posts/${p.id}`)}
                        className={`mt-2 px-4 py-2 rounded-lg font-medium shadow transition ${
                          theme === "light"
                            ? "bg-gradient-to-r from-teal-600 to-indigo-600 text-white hover:shadow-md"
                            : "bg-gradient-to-r from-indigo-700 to-teal-500 text-gray-100 hover:shadow-lg"
                        }`}
                      >
                        View Applicants
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}}
          </div>
        );

      case "profile":
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div
              className={`p-6 rounded-2xl shadow ${
                theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-6">HR Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <p className="text-lg">{hrName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Department ID</label>
                  <p className="text-lg">{deptId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Posts</label>
                  <p className="text-lg font-semibold text-blue-600">{posts.length}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Applications</label>
                  <p className="text-lg font-semibold text-green-600">
                    {posts.reduce((c, p) => c + (p.total_applicants || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div
              className={`p-6 rounded-2xl shadow ${
                theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-gray-500">{post.total_applicants || 0} applications</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      (post.positions_filled || 0) === (post.positions || 0) 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {(post.positions_filled || 0) === (post.positions || 0) ? "Complete" : "Active"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl shadow-md border-l-4 transition hover:shadow-lg ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                } ${
                  notif.type === "new" ? "border-blue-500" :
                  notif.type === "alert" ? "border-red-500" :
                  notif.type === "success" ? "border-green-500" :
                  notif.type === "warning" ? "border-yellow-500" : "border-gray-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-medium ${
                      theme === "light" ? "text-gray-800" : "text-gray-200"
                    }`}>{notif.msg}</p>
                    <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    notif.type === "new" ? "bg-blue-100 text-blue-700" :
                    notif.type === "alert" ? "bg-red-100 text-red-700" :
                    notif.type === "success" ? "bg-green-100 text-green-700" :
                    notif.type === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {notif.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
case "statistics":
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recruitment Statistics</h2>
        <button
          onClick={loadPosts}
          className={`px-4 py-2 rounded-lg font-medium shadow transition ${
            theme === "light"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-700 text-gray-100 hover:bg-blue-600"
          }`}
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-xl shadow ${
          theme === "light" ? "bg-blue-50" : "bg-blue-900"
        }`}>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Applications</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {dynamicCounts.total}
          </p>
        </div>
        <div className={`p-4 rounded-xl shadow ${
          theme === "light" ? "bg-green-50" : "bg-green-900"
        }`}>
          <p className="text-sm text-gray-600 dark:text-gray-300">Selected</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {dynamicCounts.selected}
          </p>
        </div>
        <div className={`p-4 rounded-xl shadow ${
          theme === "light" ? "bg-red-50" : "bg-red-900"
        }`}>
          <p className="text-sm text-gray-600 dark:text-gray-300">Rejected</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {dynamicCounts.rejected}
          </p>
        </div>
        <div className={`p-4 rounded-xl shadow ${
          theme === "light" ? "bg-purple-50" : "bg-purple-900"
        }`}>
          <p className="text-sm text-gray-600 dark:text-gray-300">Open Positions</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {posts.reduce((c, p) => c + ((p.positions || 0) - (p.positions_filled || 0)), 0)}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className={`p-4 rounded-xl shadow ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <h3 className="text-lg font-semibold mb-4">Positions Overview</h3>
          <div className="h-64">
            <Bar
              data={statsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: { color: theme === "light" ? "#111827" : "#f3f4f6" },
                  },
                },
                scales: {
                  x: { ticks: { color: theme === "light" ? "#111827" : "#f3f4f6" } },
                  y: { ticks: { color: theme === "light" ? "#111827" : "#f3f4f6" } },
                },
              }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className={`p-4 rounded-xl shadow ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <h3 className="text-lg font-semibold mb-4">Application Status</h3>
          <div className="h-64">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: { color: theme === "light" ? "#111827" : "#f3f4f6" },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Line Chart */}
        <div className={`p-4 rounded-xl shadow lg:col-span-2 ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <h3 className="text-lg font-semibold mb-4">Application Trends</h3>
          <div className="h-64">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: { color: theme === "light" ? "#111827" : "#f3f4f6" },
                  },
                },
                scales: {
                  x: { ticks: { color: theme === "light" ? "#111827" : "#f3f4f6" } },
                  y: { ticks: { color: theme === "light" ? "#111827" : "#f3f4f6" } },
                },
              }}
            />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className={`p-4 rounded-xl shadow ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <h3 className="text-lg font-semibold mb-4">Vacancy Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: { color: theme === "light" ? "#111827" : "#f3f4f6" },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Radar Chart */}
        <div className={`p-4 rounded-xl shadow ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <h3 className="text-lg font-semibold mb-4">Recruitment Metrics</h3>
          <div className="h-64">
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: { color: theme === "light" ? "#111827" : "#f3f4f6" },
                  },
                },
                scales: {
                  r: {
                    ticks: { color: theme === "light" ? "#111827" : "#f3f4f6" },
                    grid: { color: theme === "light" ? "#e5e7eb" : "#374151" },
                    pointLabels: { color: theme === "light" ? "#111827" : "#f3f4f6" },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

      case "ai-insights":
        const deptName = deptId === "it_software" ? "IT & Software" : 
                        deptId === "banking_finance" ? "Banking & Finance" :
                        deptId === "healthcare" ? "Healthcare" : "Your Department";
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">AI Matching Insights - {deptName}</h2>
            
            {/* AI Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl shadow ${
                theme === "light" ? "bg-blue-50" : "bg-blue-900"
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">Match Accuracy</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {deptId === "it_software" ? "87.3%" : deptId === "banking_finance" ? "82.1%" : "79.5%"}
                </p>
                <p className="text-xs text-gray-500">Based on successful placements</p>
              </div>
              <div className={`p-4 rounded-xl shadow ${
                theme === "light" ? "bg-green-50" : "bg-green-900"
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg Match Score</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {deptId === "it_software" ? "78.5" : deptId === "banking_finance" ? "74.2" : "71.8"}
                </p>
                <p className="text-xs text-gray-500">Out of 100 points</p>
              </div>
              <div className={`p-4 rounded-xl shadow ${
                theme === "light" ? "bg-purple-50" : "bg-purple-900"
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">Time Saved</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {deptId === "it_software" ? "65%" : deptId === "banking_finance" ? "58%" : "52%"}
                </p>
                <p className="text-xs text-gray-500">Compared to manual screening</p>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className={`p-6 rounded-xl shadow ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}>
              <h3 className="text-lg font-semibold mb-4">AI Recommendations for {deptName}</h3>
              <div className="space-y-3">
                {deptId === "it_software" && (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Skills Gap Identified</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Consider expanding React internship requirements to include TypeScript for better candidate pool</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Location Optimization</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">High-quality candidates available in Pune and Chennai for Backend roles</p>
                      </div>
                    </div>
                  </>
                )}
                {deptId === "banking_finance" && (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Finance Skills Match</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Strong candidates with Excel and financial modeling skills in Mumbai and Delhi</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Compliance Focus</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Consider prioritizing candidates with regulatory knowledge for risk management roles</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="font-medium">Diversity Opportunity</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Strong rural candidates available for {deptName} positions - consider affirmative selection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "diversity-metrics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Diversity & Inclusion Metrics</h2>
            
            {/* Affirmative Action Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl shadow ${
                theme === "light" ? "bg-green-50" : "bg-green-900"
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">Rural Candidates</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">32%</p>
                <p className="text-xs text-gray-500">Target: 30%</p>
              </div>
              <div className={`p-4 rounded-xl shadow ${
                theme === "light" ? "bg-blue-50" : "bg-blue-900"
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">SC/ST/OBC</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">45%</p>
                <p className="text-xs text-gray-500">Target: 49.5%</p>
              </div>
              <div className={`p-4 rounded-xl shadow ${
                theme === "light" ? "bg-purple-50" : "bg-purple-900"
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">Female Candidates</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">38%</p>
                <p className="text-xs text-gray-500">Target: 33%</p>
              </div>
              <div className={`p-4 rounded-xl shadow ${
                theme === "light" ? "bg-orange-50" : "bg-orange-900"
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">First-time Interns</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">78%</p>
                <p className="text-xs text-gray-500">No past participation</p>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className={`p-6 rounded-xl shadow ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}>
              <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Tier 1 Cities: 45%", "Tier 2 Cities: 35%", "Tier 3 Cities: 15%", "Rural Areas: 5%"].map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <p className="text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector-wise Diversity */}
            <div className={`p-6 rounded-xl shadow ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}>
              <h3 className="text-lg font-semibold mb-4">Sector-wise Diversity Index</h3>
              <div className="space-y-3">
                {[
                  { sector: "IT & Software", score: 85, color: "bg-green-500" },
                  { sector: "Banking & Finance", score: 72, color: "bg-blue-500" },
                  { sector: "Healthcare", score: 68, color: "bg-purple-500" },
                  { sector: "Manufacturing", score: 45, color: "bg-orange-500" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 text-sm">{item.sector}</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{width: `${item.score}%`}}></div>
                    </div>
                    <div className="w-12 text-sm font-medium">{item.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === "light" ? "bg-slate-50" : "bg-gray-900"}`}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 shadow-lg z-20 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-900 text-gray-200"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-3">
          {["dashboard", "ai-insights", "diversity-metrics", "profile", "notifications", "statistics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2 rounded-lg transition ${
                theme === "light" ? "hover:bg-teal-50" : "hover:bg-gray-700"
              }`}
            >
              {tab === "ai-insights" ? "AI Insights" : 
               tab === "diversity-metrics" ? "Diversity Metrics" :
               tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className={`flex items-center justify-between px-4 py-2 sticky top-0 z-10 border-b backdrop-blur transition ${
            theme === "light" ? "bg-white/90 text-gray-800 border-gray-200" : "bg-gray-800/90 text-gray-200 border-gray-700"
          }`}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <span className="font-semibold text-lg">InternSync SmartMatch</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm">Hi, {hrName}</span>

            {/* Selected & Rejected */}
            <button
              onClick={() => nav("/hr/selected")}
              className={`px-4 py-2 rounded-lg font-medium shadow transition ${
                theme === "light"
                  ? "bg-gradient-to-r from-indigo-600 to-teal-600 text-white hover:shadow-md"
                  : "bg-gradient-to-r from-indigo-700 to-teal-500 text-gray-100 hover:shadow-lg"
              }`}
            >
              Selected
            </button>
            <button
              onClick={() => nav("/hr/rejected")}
              className={`px-4 py-2 rounded-lg font-medium shadow transition ${
                theme === "light"
                  ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-md"
                  : "bg-gradient-to-r from-red-700 to-pink-500 text-gray-100 hover:shadow-lg"
              }`}
            >
              Rejected
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                theme === "light"
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">{renderContent()}</main>

        {/* Footer */}
        <footer
          className={`p-4 text-sm text-center border-t backdrop-blur ${
            theme === "light" ? "bg-white/90 text-gray-600 border-gray-200" : "bg-gray-800/90 text-gray-300 border-gray-700"
          }`}
        >
          © {new Date().getFullYear()} PM Internship Scheme |{" "}
          <a
            className="text-teal-500 hover:underline"
            href="https://mca.gov.in"
            target="_blank"
            rel="noreferrer"
          >
            Ministry of Corporate Affairs
          </a>
        </footer>
      </div>
    </div>
  );
}
