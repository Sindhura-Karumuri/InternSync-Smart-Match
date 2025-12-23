import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiDownload } from "react-icons/fi";
import { CheckCircle, Sun, Moon, Calendar, Users } from "lucide-react";
import { ThemeContext } from "../components/ThemeContext";

function ClosedInternships() {
  const { theme } = useContext(ThemeContext);
  const [closedPosts, setClosedPosts] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const deptId = localStorage.getItem("department_id");
  const nav = useNavigate();

  useEffect(() => {
    async function loadClosedInternships() {
      try {
        // Fetch closed posts from the new endpoint
        const closedRes = await api.get(`/departments/${deptId}/closed`);
        const closedPostsData = closedRes.data || [];
        setClosedPosts(closedPostsData);

        // Fetch selected candidates for each closed post
        const candidatesData = {};
        for (const post of closedPostsData) {
          try {
            const selectedRes = await api.get(`/departments/${deptId}/selected`);
            candidatesData[post.id] = selectedRes.data.filter(candidate => 
              candidate.post_id === post.id
            );
          } catch (err) {
            console.error(`Failed to fetch candidates for post ${post.id}:`, err);
            candidatesData[post.id] = [];
          }
        }
        setSelectedCandidates(candidatesData);
      } catch (err) {
        console.error("Failed to fetch closed internships:", err);
        alert("Failed to load data: " + (err?.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    }
    loadClosedInternships();
  }, [deptId]);

  function safeDateDisplay(isoString) {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return isNaN(d.getTime()) ? isoString : d.toLocaleDateString();
    } catch {
      return isoString;
    }
  }

  async function downloadClosedReport() {
    try {
      const csvContent = generateCSVReport();
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `closed_internships_${deptId}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed");
    }
  }

  function generateCSVReport() {
    const headers = ["Post ID", "Title", "Total Positions", "Filled Positions", "Closed Date", "Company", "Duration", "Stipend", "Selected Candidates"];
    const rows = closedPosts.map(post => [
      post.id,
      post.title,
      post.positions || 0,
      post.selected_candidates_count || 0,
      safeDateDisplay(post.closed_at),
      post.company_name || "N/A",
      post.duration || "N/A",
      post.stipend || "N/A",
      selectedCandidates[post.id]?.map(c => c.name).join("; ") || "N/A"
    ]);
    
    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }

  if (loading) return (
    <div className={`min-h-screen p-6 ${theme === "light" ? "bg-slate-50" : "bg-gray-900"}`}>
      <div className="text-center animate-pulse">Loading closed internships...</div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50" : "bg-gray-900"} p-10`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => nav("/hr/dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                theme === "light" 
                  ? "bg-gray-600 hover:bg-gray-700 text-white" 
                  : "bg-gray-700 hover:bg-gray-600 text-gray-100"
              }`}
            >
              <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div>
              <h1 className={`text-3xl font-extrabold flex items-center gap-2 ${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              }`}>
                <CheckCircle className={`${theme === "light" ? "text-green-500" : "text-green-400"} w-8 h-8`} />
                Closed Internships
              </h1>
              <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} text-sm mt-1`}>
                Department: <span className="font-semibold text-green-700">{deptId}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={downloadClosedReport} 
              className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all transform hover:scale-105"
            >
              <FiDownload className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${theme === "light" ? "bg-white" : "bg-gray-800"} p-6 rounded-2xl shadow-md`}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} text-sm`}>Total Closed</p>
                <p className="text-2xl font-bold text-green-600">{closedPosts.length}</p>
              </div>
            </div>
          </div>

          <div className={`${theme === "light" ? "bg-white" : "bg-gray-800"} p-6 rounded-2xl shadow-md`}>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} text-sm`}>Total Positions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {closedPosts.reduce((sum, post) => sum + (post.positions || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className={`${theme === "light" ? "bg-white" : "bg-gray-800"} p-6 rounded-2xl shadow-md`}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <div>
                <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} text-sm`}>Filled Positions</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {closedPosts.reduce((sum, post) => sum + (post.selected_candidates_count || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className={`${theme === "light" ? "bg-white" : "bg-gray-800"} p-6 rounded-2xl shadow-md`}>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} text-sm`}>Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {closedPosts.length > 0 ? "100%" : "0%"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closed Posts List */}
        {closedPosts.length === 0 ? (
          <div className={`${theme === "light" ? "bg-white text-gray-500" : "bg-gray-800 text-gray-300"} p-14 rounded-2xl shadow-md text-center`}>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Closed Internships Yet</h3>
            <p>Internships will appear here once all positions are filled.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {closedPosts.map((post) => (
              <div
                key={post.id}
                className={`rounded-xl shadow-lg overflow-hidden ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                }`}
              >
                {/* Post Header */}
                <div className={`p-6 border-b ${
                  theme === "light" ? "border-gray-200 bg-green-50" : "border-gray-700 bg-green-900/20"
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <h2 className="text-xl font-bold text-green-700 dark:text-green-300">
                          {post.title}
                        </h2>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          ✅ COMPLETED
                        </span>
                      </div>

                      <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} mb-4`}>
                        {post.description || "No description available"}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className={`${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm`}>Total Positions</p>
                          <p className="font-semibold text-blue-600">{post.positions || 0}</p>
                        </div>
                        <div>
                          <p className={`${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm`}>Filled</p>
                          <p className="font-semibold text-green-600">{post.selected_candidates_count || 0}</p>
                        </div>
                        <div>
                          <p className={`${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm`}>Closed Date</p>
                          <p className="font-semibold">{safeDateDisplay(post.closed_at)}</p>
                        </div>
                        <div>
                          <p className={`${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm`}>Duration</p>
                          <p className="font-semibold">{post.duration || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {post.stipend && (
                          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                            💰 {post.stipend}
                          </span>
                        )}
                        {post.location && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                            📍 {post.location}
                          </span>
                        )}
                        {post.company_name && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                            🏢 {post.company_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {Math.round(((post.selected_candidates_count || 0) / (post.positions || 1)) * 100)}%
                      </div>
                      <p className={`${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm`}>Fill Rate</p>
                    </div>
                  </div>
                </div>

                {/* Selected Candidates */}
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}>
                    Selected Candidates ({selectedCandidates[post.id]?.length || 0})
                  </h3>
                  
                  {selectedCandidates[post.id]?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedCandidates[post.id].map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`p-4 rounded-lg border transition hover:shadow-md ${
                            theme === "light" 
                              ? "bg-gray-50 border-gray-200 hover:bg-gray-100" 
                              : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              theme === "light" ? "bg-blue-100" : "bg-blue-900"
                            }`}>
                              <FiUser className="text-blue-600" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium truncate ${
                                theme === "light" ? "text-gray-800" : "text-gray-200"
                              }`}>
                                {candidate.name}
                              </h4>
                              <div className="space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <FiMail size={12} />
                                  <span className="truncate">{candidate.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiMapPin size={12} />
                                  <span>{candidate.location}</span>
                                </div>
                              </div>
                              <div className="mt-2 flex gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                  Score: {candidate.match_score || candidate.score || 'N/A'}
                                </span>
                                {candidate.qualifications && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                    {candidate.qualifications}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center p-4 rounded-lg ${
                      theme === "light" ? "bg-gray-50 text-gray-500" : "bg-gray-700 text-gray-400"
                    }`}>
                      No selected candidates data available
                    </div>
                  )}

                  {/* Success Message */}
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                      🎉 All {post.positions || 0} positions successfully filled! 
                      {post.selected_candidates_count && post.selected_candidates_count > 0 && (
                        <span className="ml-2">
                          {post.selected_candidates_count} candidates selected and onboarded.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClosedInternships;