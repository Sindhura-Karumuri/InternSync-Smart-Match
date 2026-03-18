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

function HRDashboard() {
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [rejectedCount, setRejectedCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const deptId = localStorage.getItem("department_id");
  const hrName = localStorage.getItem("hr_name") || localStorage.getItem("user_name") || "HR Manager";
  const nav = useNavigate();

  const deptName = {
    1: "IT & Software",
    2: "Banking & Finance", 
    3: "FMCG",
    4: "Oil & Gas",
    5: "Manufacturing",
    6: "Healthcare",
    7: "Retail",
    8: "Hospitality"
  }[parseInt(deptId)] || "Unknown Department";

  useEffect(() => {
    async function load() {
      try {
        const postsRes = await api.get(`/departments/${deptId}/posts`);
        setPosts(postsRes.data);
        
        // Fetch analytics data
        try {
          const analyticsRes = await api.get(`/departments/${deptId}/analytics`);
          setAnalytics(analyticsRes.data);
        } catch (err) {
          console.error("Failed to fetch analytics:", err);
        }
        
        // Fetch selected candidates count
        let selectedCount = 0;
        try {
          const selectedRes = await api.get(`/departments/${deptId}/selected`);
          selectedCount = selectedRes.data.length;
        } catch (err) {
          console.error("Failed to fetch selected count:", err);
        }
        
        // Generate comprehensive notifications with real data
        const notifs = [];
        const currentTime = new Date();
        
        postsRes.data.forEach((post) => {
          // New applications
          if ((post.total_applicants || 0) > 0) {
            notifs.push({
              id: `app-${post.id}`,
              type: "new",
              msg: `${post.total_applicants || 0} new applications received for ${post.title}`,
              time: "Recent",
              priority: "medium",
              timestamp: currentTime.getTime()
            });
          }
          
          // Selections made
          if ((post.selected_count || 0) > 0) {
            notifs.push({
              id: `sel-${post.id}`,
              type: "success",
              msg: `${post.selected_count} candidates selected for ${post.title}`,
              time: "Recent",
              priority: "high",
              timestamp: currentTime.getTime()
            });
          }
          
          // Position closed when requirements fulfilled
          if (post.status === "closed" && post.positions_filled >= post.positions) {
            notifs.push({
              id: `closed-${post.id}`,
              type: "success",
              msg: `🎉 Position ${post.title} closed - All ${post.positions} positions filled successfully`,
              time: "Recent",
              priority: "high",
              timestamp: currentTime.getTime()
            });
          }
          
          // Interview scheduling notifications (simulated)
          if (post.positions_filled > 0 && post.positions_filled < post.positions) {
            notifs.push({
              id: `interview-${post.id}`,
              type: "warning",
              msg: `📅 Interviews may be scheduled for ${post.title} - ${post.positions_filled}/${post.positions} positions filled`,
              time: "Recent",
              priority: "medium",
              timestamp: currentTime.getTime()
            });
          }
          
          // Low application alerts
          if ((post.total_applicants || 0) < post.positions && post.status !== "closed") {
            notifs.push({
              id: `low-app-${post.id}`,
              type: "alert",
              msg: `⚠️ Low applications for ${post.title} - Only ${post.total_applicants || 0} applications for ${post.positions} positions`,
              time: "Recent",
              priority: "high",
              timestamp: currentTime.getTime()
            });
          }
          
          // High demand notifications
          if ((post.total_applicants || 0) > post.positions * 3) {
            notifs.push({
              id: `high-demand-${post.id}`,
              type: "info",
              msg: `🔥 High demand for ${post.title} - ${post.total_applicants} applications for ${post.positions} positions`,
              time: "Recent",
              priority: "medium",
              timestamp: currentTime.getTime()
            });
          }
        });
        
        // Add department-wide notifications
        if (selectedCount > 0) {
          notifs.push({
            id: `dept-selected`,
            type: "success",
            msg: `✅ Total ${selectedCount} candidates selected across all positions in your department`,
            time: "Recent",
            priority: "medium",
            timestamp: currentTime.getTime()
          });
        }
        
        // Sort by priority and timestamp, limit to recent notifications
        const sortedNotifs = notifs
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return b.timestamp - a.timestamp;
          })
          .slice(0, 10);
          
        setNotifications(sortedNotifs);
        
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
    
    // Initial load
    load();
    
    // Set up periodic refresh for dynamic updates
    const interval = setInterval(load, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
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
            {posts.filter((p) => p.status !== "closed").length === 0 && (
              <div
                className={`text-center p-6 rounded-xl shadow ${
                  theme === "light" ? "bg-white text-gray-500" : "bg-gray-900 text-gray-300"
                }`}
              >
                {posts.length > 0
                  ? "All positions are filled — check the Closed tab."
                  : "No posts yet — create one."}
              </div>
            )}
            
            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {posts.filter((p) => p.status !== "closed").map((p) => (
                <div
                  key={p.id}
                  className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer ${
                    p.status === "closed" 
                      ? theme === "light" ? "bg-gray-100 text-gray-600 border-2 border-gray-300" : "bg-gray-700 text-gray-400 border-2 border-gray-600"
                      : theme === "light" ? "bg-white text-gray-800 hover:bg-gray-50" : "bg-gray-800 text-gray-200 hover:bg-gray-750"
                  }`}
                  onClick={() => nav(`/hr/posts/${p.id}`)}
                >
                  {p.status === "closed" && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                        ✅ POSITION CLOSED - ALL POSITIONS FILLED
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold">{p?.title || 'Untitled Post'}</h2>
                        {p.status === "open" && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            OPEN
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm mt-1 text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {p?.description || 'No description'}
                      </p>
                      
                      {/* Company and Location */}
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">🏢</span>
                          <span>{p.company_name || 'Company'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">📍</span>
                          <span>{p.location || 'Location'}</span>
                        </div>
                      </div>
                      
                      {/* Key Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{p.positions || 0}</div>
                          <div className="text-xs text-gray-500">Positions</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{p.positions_filled || 0}</div>
                          <div className="text-xs text-gray-500">Filled</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{p.total_applicants || 0}</div>
                          <div className="text-xs text-gray-500">Applicants</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">{p.duration || 'N/A'}</div>
                          <div className="text-xs text-gray-500">Duration</div>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.stipend && (
                          <span
                            className={`px-3 py-1 text-xs rounded-full border ${
                              theme === "light"
                                ? "bg-teal-50 text-teal-700 border-teal-200"
                                : "bg-teal-900 text-teal-300 border-teal-700"
                            }`}
                          >
                            💰 {p.stipend}
                          </span>
                        )}
                        {p.experience_required && (
                          <span
                            className={`px-3 py-1 text-xs rounded-full border ${
                              theme === "light"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-indigo-900 text-indigo-300 border-indigo-700"
                            }`}
                          >
                            👨‍💼 {p.experience_required}
                          </span>
                        )}
                        {p.application_deadline && (
                          <span
                            className={`px-3 py-1 text-xs rounded-full border ${
                              theme === "light"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-red-900 text-red-300 border-red-700"
                            }`}
                          >
                            ⏰ Apply by {new Date(p.application_deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {/* Required Skills */}
                      {p.required_skills && p.required_skills.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-2">Required Skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {p.required_skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {p.required_skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded text-xs">
                                +{p.required_skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    {p.status === "closed" ? (
                      <div className="text-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                        Position Completed ✅
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {p.total_applicants > 0 ? `${p.total_applicants} applications received` : 'No applications yet'}
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg font-medium shadow transition ${
                            theme === "light"
                              ? "bg-gradient-to-r from-teal-600 to-indigo-600 text-white hover:shadow-md"
                              : "bg-gradient-to-r from-indigo-700 to-teal-500 text-gray-100 hover:shadow-lg"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            nav(`/hr/posts/${p.id}`);
                          }}
                        >
                          View {p.total_applicants || 0} Applicants →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <p className="text-lg">{deptName}</p>
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
          </div>
        );

      case "notifications":
        return (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Notifications</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  {notifications.filter(n => n.priority === 'high').length} High Priority
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  {notifications.filter(n => n.priority === 'medium').length} Medium
                </span>
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className={`text-center p-8 rounded-xl shadow ${
                theme === "light" ? "bg-white text-gray-500" : "bg-gray-800 text-gray-300"
              }`}>
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl shadow-md border-l-4 transition hover:shadow-lg ${
                    theme === "light" ? "bg-white" : "bg-gray-800"
                  } ${
                    notif.type === "new" ? "border-blue-500" :
                    notif.type === "alert" ? "border-red-500" :
                    notif.type === "success" ? "border-green-500" :
                    notif.type === "warning" ? "border-yellow-500" : "border-gray-500"
                  } ${
                    notif.priority === "high" ? "ring-2 ring-red-200" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium ${
                          theme === "light" ? "text-gray-800" : "text-gray-200"
                        }`}>{notif.msg}</p>
                        {notif.priority === "high" && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                            HIGH
                          </span>
                        )}
                      </div>
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
              ))
            )}
          </div>
        );

      case "statistics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Recruitment Statistics</h2>

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
              <div className={`p-4 rounded-xl shadow ${
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
            </div>

            {/* Radar Chart */}
            <div className={`p-4 rounded-xl shadow ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}>
              <h3 className="text-lg font-semibold mb-4">Recruitment Performance Radar</h3>
              <div className="h-80">
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
        );

      case "ai-insights":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">AI Matching Insights - {deptName}</h2>
            
            {analytics ? (
              <>
                {/* AI Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-blue-50" : "bg-blue-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Match Accuracy</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {analytics.ai_metrics.accuracy}%
                    </p>
                    <p className="text-xs text-gray-500">Based on successful placements</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-green-50" : "bg-green-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Avg Match Score</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {analytics.ai_metrics.avg_score}
                    </p>
                    <p className="text-xs text-gray-500">Out of 100 points</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-purple-50" : "bg-purple-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Time Saved</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {analytics.ai_metrics.time_saved}%
                    </p>
                    <p className="text-xs text-gray-500">Compared to manual screening</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-orange-50" : "bg-orange-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Skill Match Rate</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {analytics.ai_metrics.skill_match}%
                    </p>
                    <p className="text-xs text-gray-500">Skills alignment with requirements</p>
                  </div>
                </div>

                {/* Department-Specific Insights */}
                <div className={`p-6 rounded-xl shadow ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                }`}>
                  <h3 className="text-lg font-semibold mb-4">Department-Specific AI Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Recruitment Overview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Applicants:</span>
                          <span className="font-medium">{analytics.total_applicants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Posts:</span>
                          <span className="font-medium">{analytics.posts_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Selected Candidates:</span>
                          <span className="font-medium text-green-600">{analytics.selected_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Selection Rate:</span>
                          <span className="font-medium">
                            {analytics.total_applicants > 0 ? 
                              Math.round((analytics.selected_count / analytics.total_applicants) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">AI Algorithm Performance</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Skills Matching</span>
                            <span>{analytics.ai_metrics.skill_match}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                              style={{width: `${analytics.ai_metrics.skill_match}%`}}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Accuracy</span>
                            <span>{analytics.ai_metrics.accuracy}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                              style={{width: `${analytics.ai_metrics.accuracy}%`}}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Efficiency Gain</span>
                            <span>{analytics.ai_metrics.time_saved}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                              style={{width: `${analytics.ai_metrics.time_saved}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Algorithm Details */}
                <div className={`p-6 rounded-xl shadow ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                }`}>
                  <h3 className="text-lg font-semibold mb-4">Enhanced Multi-Factor AI Algorithm</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Model Parameters</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Algorithm: Gradient Boosting with XGBoost inspiration</li>
                        <li>• Features: 12 key candidate attributes</li>
                        <li>• Training Data: {analytics.total_applicants}+ real applications</li>
                        <li>• Model Accuracy: {analytics.ai_metrics.accuracy}%</li>
                        <li>• Update Frequency: Real-time learning</li>
                        <li>• Bias Mitigation: Diversity-aware scoring</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Feature Importance ({deptName})</h4>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Skills Match:</span>
                          <span className="font-medium">40%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Academic Performance:</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Major Alignment:</span>
                          <span className="font-medium">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience Level:</span>
                          <span className="font-medium">10%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          + Diversity bonuses and location preferences applied
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="animate-pulse">Loading AI insights...</div>
              </div>
            )}
          </div>
        );

      case "diversity-metrics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Diversity & Inclusion Metrics - {deptName}</h2>
            
            {analytics ? (
              <>
                {/* Affirmative Action Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-green-50" : "bg-green-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Rural Candidates</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {analytics.diversity_metrics.rural_percentage}%
                    </p>
                    <p className="text-xs text-gray-500">Target: 30%</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-blue-50" : "bg-blue-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">SC/ST/OBC</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {analytics.diversity_metrics.reserved_percentage}%
                    </p>
                    <p className="text-xs text-gray-500">Target: 49.5%</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-purple-50" : "bg-purple-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Female Candidates</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {analytics.diversity_metrics.female_percentage}%
                    </p>
                    <p className="text-xs text-gray-500">Target: 33%</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-orange-50" : "bg-orange-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">First-time Interns</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {analytics.diversity_metrics.first_time_percentage}%
                    </p>
                    <p className="text-xs text-gray-500">No past participation</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow ${
                    theme === "light" ? "bg-indigo-50" : "bg-indigo-900"
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Applicants</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {analytics.total_applicants}
                    </p>
                    <p className="text-xs text-gray-500">Across all posts</p>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className={`p-6 rounded-xl shadow ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                }`}>
                  <h3 className="text-lg font-semibold mb-4">Category-wise Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(analytics.diversity_metrics.category_distribution).map(([category, count]) => (
                      <div key={category} className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {Math.round((count / analytics.total_applicants) * 100)}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{category}</p>
                        <p className="text-xs text-gray-500">({count} candidates)</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geographic Distribution */}
                <div className={`p-6 rounded-xl shadow ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                }`}>
                  <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{analytics.geographic_distribution.metro}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Metro Cities</p>
                      <p className="text-xs text-gray-500">Mumbai, Delhi, Bangalore</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{analytics.geographic_distribution.tier2}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tier-2 Cities</p>
                      <p className="text-xs text-gray-500">Pune, Hyderabad, Chennai</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{analytics.geographic_distribution.tier3}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tier-3 Cities</p>
                      <p className="text-xs text-gray-500">Smaller urban centers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{analytics.geographic_distribution.rural}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Rural Areas</p>
                      <p className="text-xs text-gray-500">Villages & towns</p>
                    </div>
                  </div>
                </div>

                {/* Educational Background */}
                <div className={`p-6 rounded-xl shadow ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                }`}>
                  <h3 className="text-lg font-semibold mb-4">Educational Background Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Engineering (B.Tech/BE)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                            style={{width: `${analytics.educational_distribution.engineering}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.educational_distribution.engineering}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Management (MBA/BBA)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                            style={{width: `${analytics.educational_distribution.management}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.educational_distribution.management}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Science (BSc/MSc)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-1000" 
                            style={{width: `${analytics.educational_distribution.science}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.educational_distribution.science}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Others</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-1000" 
                            style={{width: `${analytics.educational_distribution.others}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.educational_distribution.others}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className={`p-6 rounded-xl shadow ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                }`}>
                  <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(analytics.diversity_metrics.gender_distribution).map(([gender, count]) => (
                      <div key={gender} className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {Math.round((count / analytics.total_applicants) * 100)}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{gender}</p>
                        <p className="text-xs text-gray-500">({count} candidates)</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diversity Insights */}
                <div className={`p-6 rounded-xl shadow border-l-4 border-green-500 ${
                  theme === "light" ? "bg-green-50" : "bg-green-900/20"
                }`}>
                  <h3 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">
                    Diversity & Inclusion Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Positive Indicators:</h4>
                      <ul className="space-y-1 text-green-700 dark:text-green-300">
                        {analytics.diversity_metrics.female_percentage >= 33 && (
                          <li>✓ Female representation exceeds target (33%)</li>
                        )}
                        {analytics.diversity_metrics.rural_percentage >= 25 && (
                          <li>✓ Strong rural candidate participation</li>
                        )}
                        {analytics.diversity_metrics.first_time_percentage >= 70 && (
                          <li>✓ High first-time intern participation</li>
                        )}
                        <li>✓ Diverse educational backgrounds represented</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                      <ul className="space-y-1 text-orange-700 dark:text-orange-300">
                        {analytics.diversity_metrics.reserved_percentage < 49.5 && (
                          <li>• Reserved category representation below target</li>
                        )}
                        {analytics.diversity_metrics.rural_percentage < 30 && (
                          <li>• Rural candidate participation could be higher</li>
                        )}
                        {analytics.geographic_distribution.rural < 10 && (
                          <li>• Limited rural geographic representation</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="animate-pulse">Loading diversity metrics...</div>
              </div>
            )}
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
            
            {/* Notification Badge */}
            {notifications.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`p-2 rounded-lg transition ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  }`}
                  title={`${notifications.length} notifications (${notifications.filter(n => n.priority === 'high').length} high priority)`}
                >
                  🔔
                </button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notifications.filter(n => n.priority === 'high').length || notifications.length}
                </span>
              </div>
            )}
            
            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className={`p-2 rounded-lg transition ${
                theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
              }`}
              title="Refresh data"
            >
              🔄
            </button>

            {/* Selected & Rejected */}
            <button
              onClick={() => nav("/hr/closed")}
              className={`px-4 py-2 rounded-lg font-medium shadow transition ${
                theme === "light"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-md"
                  : "bg-gradient-to-r from-green-700 to-emerald-500 text-gray-100 hover:shadow-lg"
              }`}
            >
              Closed
            </button>
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

export default HRDashboard;