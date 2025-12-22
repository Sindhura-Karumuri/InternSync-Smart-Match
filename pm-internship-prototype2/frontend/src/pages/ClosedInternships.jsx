import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
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
        // Fetch all posts and filter closed ones
        const postsRes = await api.get(`/departments/${deptId}/posts`);
        const allPosts = postsRes.data || [];
        
        // Also fetch past posts (moved to past when closed)
        let pastPosts = [];
        try {
          const pastRes = await api.get(`/departments/${deptId}/past`);
          pastPosts = pastRes.data || [];
        } catch (err) {
          console.log("No past posts endpoint or no past posts");
        }
        
        // Combine closed posts from both active and past
        const closedFromActive = allPosts.filter(post => post.status === "closed");
        const allClosed = [...closedFromActive, ...pastPosts];
        
        setClosedPosts(allClosed);

        // Fetch selected candidates for each closed post
        const candidatesData = {};
        for (const post of allClosed) {
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

  if (loading) return <div className="p-6 text-center">Loading closed internships...</div>;

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-slate-50" : "bg-gray-900"}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => nav("/hr/dashboard")}
            className={`p-2 rounded-lg transition ${
              theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
            }`}
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className={`text-2xl font-bold ${
            theme === "light" ? "text-gray-800" : "text-gray-200"
          }`}>
            Closed Internships & Selected Candidates
          </h1>
        </div>

        {closedPosts.length === 0 ? (
          <div className={`text-center p-8 rounded-xl shadow ${
            theme === "light" ? "bg-white text-gray-500" : "bg-gray-800 text-gray-300"
          }`}>
            No closed internships found.
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
                  theme === "light" ? "border-gray-200 bg-green-50" : "border-gray-700 bg-green-900"
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                        ✅ {post.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {post.description}
                      </p>
                      <div className="flex gap-4 mt-3 text-sm">
                        <span>Positions: <b>{post.positions}</b></span>
                        <span>Filled: <b>{post.positions_filled}</b></span>
                        <span>Stipend: <b>{post.stipend}</b></span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      COMPLETED
                    </span>
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