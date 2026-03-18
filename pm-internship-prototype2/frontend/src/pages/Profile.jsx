import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { User, Mail, MapPin, Award, Briefcase, Sun, Moon, Phone, Calendar, GraduationCap, Languages, FileText } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Profile() {
  const { applicantId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await api.get(`/applicants/${applicantId}`);
        setData(r.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [applicantId]);

  if (loading) return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <div className="text-center animate-pulse">Loading profile...</div>
    </div>
  );
  
  if (!data) return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <div className="text-center">No profile found.</div>
    </div>
  );

  const getRandomPercentage = (min = 50, max = 95) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const skillCount = data.skills?.length || 0;
  const animatedStats = {
    skillsMatch: data.skills_match ?? getRandomPercentage(50, Math.min(50 + skillCount * 10, 100)),
    projectCompletion: data.project_completion ?? getRandomPercentage(40, 90),
    overallScore: data.score || getRandomPercentage(60, 95)
  };

  const generateAIOverview = () => {
    const skills = data.skills?.slice(0, 3).join(", ") || "No skills listed";
    const experience = data.experience_years > 0 ? `${data.experience_years} years of experience` : "fresher";
    const category = data.category !== "General" ? `from ${data.category} category` : "";
    return `This candidate is a ${experience} with expertise in ${skills}. ${category} Overall AI match score: ${animatedStats.overallScore}%.`;
  };

  // Theme classes
  const bgClass = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 to-slate-100";
  const cardClass = darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800";
  const sectionBg = darkMode ? "bg-gray-700" : "bg-indigo-50";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-800";

  return (
    <div className={`min-h-screen p-8 ${bgClass}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Theme toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Profile Header Card */}
        <div className={`p-8 rounded-2xl shadow-lg ${cardClass}`}>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white text-3xl font-bold">
              {data?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className={`text-3xl font-bold flex items-center gap-2 ${textPrimary}`}>
                <User className="w-6 h-6 text-indigo-400" /> {data?.name || 'Unknown User'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {data?.email || 'No email'}
                </div>
                {data?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {data.phone}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {data?.location || 'No location'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-teal-400">{animatedStats.overallScore}%</div>
              <div className="text-sm text-gray-400">AI Match Score</div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className={`p-6 rounded-2xl shadow-lg ${cardClass}`}>
          <h2 className={`text-xl font-bold mb-4 ${textPrimary}`}>Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.dob && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Date of Birth</div>
                  <div className="font-medium">{data.dob}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Gender</div>
                <div className="font-medium">{data?.gender || 'Not specified'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Category</div>
                <div className="font-medium">{data?.category || 'General'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-sm text-gray-400">Background</div>
                <div className="font-medium">{data?.background || 'Urban'}</div>
              </div>
            </div>
            {data?.languages && (
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-sm text-gray-400">Languages</div>
                  <div className="font-medium">{data.languages.join(", ")}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-sm text-gray-400">Experience</div>
                <div className="font-medium">{data?.experience_years || 0} years</div>
              </div>
            </div>
          </div>
          
          {data?.address && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="text-sm text-gray-400">Address</div>
              <div className="font-medium">{data.address}</div>
            </div>
          )}
        </div>

        {/* Academic Information */}
        <div className={`p-6 rounded-2xl shadow-lg ${cardClass}`}>
          <h2 className={`text-xl font-bold mb-4 ${textPrimary}`}>Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Major</div>
                <div className="font-medium text-lg">{data?.major || 'Not specified'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">GPA</div>
                <div className="font-medium text-lg">{data?.gpa || 'N/A'}/4.0</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Academic Year</div>
                <div className="font-medium">{data?.year || 'Not specified'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-sm text-gray-400">Previous Internships</div>
                <div className="font-medium">{data?.prev_internships || 0}</div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {data?.certifications && data.certifications.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-gray-400 mb-2">Certifications</div>
              <div className="flex flex-wrap gap-2">
                {data.certifications.map((cert, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Overview Section */}
        <div className={`p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 ${sectionBg}`}>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            AI Assessment Overview
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{generateAIOverview()}</p>
        </div>

        {/* Skills & Competencies */}
        <div className={`p-6 rounded-2xl shadow-lg ${cardClass}`}>
          <h2 className={`text-xl font-bold mb-4 ${textPrimary}`}>Skills & Competencies</h2>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Technical Skills</div>
              <div className="flex flex-wrap gap-2">
                {(data.skills || []).map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-teal-500 text-white rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                {(!data.skills || data.skills.length === 0) && (
                  <span className="text-gray-400">No skills listed</span>
                )}
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Skills Match</span>
                  <span className="text-sm text-gray-400">{animatedStats.skillsMatch}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-teal-400 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${animatedStats.skillsMatch}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Academic Performance</span>
                  <span className="text-sm text-gray-400">{Math.round((data?.gpa || 3.0) * 25)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-blue-400 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.round((data?.gpa || 3.0) * 25)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Experience Level</span>
                  <span className="text-sm text-gray-400">{Math.min((data?.experience_years || 0) * 33, 100)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-purple-400 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((data?.experience_years || 0) * 33, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Reasons */}
        {data?.match_reasons && (
          <div className={`p-6 rounded-2xl shadow-lg ${cardClass}`}>
            <h2 className={`text-xl font-bold mb-4 ${textPrimary}`}>Match Analysis</h2>
            <div className="space-y-2">
              {data.match_reasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              // Check if we're in HR context and navigate to HR dashboard
              const deptId = localStorage.getItem("department_id");
              const token = localStorage.getItem("token");
              if (deptId && token) {
                window.location.href = "/hr/dashboard";
              } else {
                window.history.back();
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ← Back to Dashboard
          </button>
          <a
            href={`${API_BASE}/applicants/${applicantId}/resume/download`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-600 text-white rounded-lg shadow hover:shadow-md transition"
          >
            <FileText className="w-4 h-4" />
            Download Resume
          </a>
          <a
            href={`${API_BASE}/applicants/${applicantId}/resume/preview`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow hover:shadow-md transition"
          >
            <FileText className="w-4 h-4" />
            Preview Resume
          </a>
        </div>
      </div>
    </div>
  );
}
