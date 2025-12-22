// src/pages/RejectedTab.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { XCircle, Sun, Moon, ArrowLeft } from "lucide-react";

export default function RejectedTab() {
  const dept = localStorage.getItem("department_id");
  const [list, setList] = useState([]);
  const [darkTheme, setDarkTheme] = useState(true); // default dark
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const r = await api.get(`/departments/${dept}/rejected`);
        setList(r.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load rejected candidates");
      }
    }
    load();
  }, [dept]);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  return (
    <div
      className={`min-h-screen p-8 ${
        darkTheme
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-rose-50 to-slate-50 text-gray-800"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header with Theme Toggle */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/hr/dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                darkTheme 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-100" 
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <XCircle className={`w-8 h-8 ${darkTheme ? "text-red-400" : "text-red-500"}`} />
                Rejected Candidates
              </h1>
              <p className={`${darkTheme ? "text-gray-300" : "text-gray-600"} text-sm`}>
                Department: <span className="font-medium">{dept}</span>
              </p>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 dark:bg-gray-200 rounded-xl hover:opacity-80 transition text-white dark:text-gray-900"
          >
            {darkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {darkTheme ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Empty state */}
        {list.length === 0 ? (
          <div
            className={`p-10 rounded-xl shadow text-center ${
              darkTheme ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
            }`}
          >
            No candidates rejected yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {list.map((c) => (
              <div
                key={c.email + c.post_id}
                className={`p-6 rounded-xl shadow hover:shadow-md transition ${
                  darkTheme ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className={`${darkTheme ? "text-gray-100" : "text-gray-800"} text-lg font-semibold`}>
                      {c?.name || 'Unknown Candidate'}
                    </h2>
                    <p className={`${darkTheme ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      {c?.email || 'No email'}
                    </p>
                    <p className={`${darkTheme ? "text-gray-400" : "text-gray-500"} text-sm mt-1`}>
                      Post: <span className="font-medium">{c.post_id}</span>
                    </p>
                  </div>
                  <div className="text-xs text-red-500 font-medium">❌ Rejected (Mail Sent)</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
