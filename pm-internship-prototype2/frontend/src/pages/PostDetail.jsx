// // src/pages/PostDetail.jsx

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../utils/api";
// import Profile from "./Profile";
// // const response = await axios.post('http://localhost:5678/webhook-test/ai-match', {
// //   students: allStudentsFromYourApp
// // }, {
// //   headers: {
// //     'Content-Type': 'application/json'
// //   }
// // });
// // console.log(response.data);


// export default function PostDetail() {
//   const { postId } = useParams();
//   const deptId = localStorage.getItem("department_id");
//   const token = localStorage.getItem("token");
//   const [post, setPost] = useState(null);
//   const [apps, setApps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [matched, setMatched] = useState(null);
//   const [topApplicants, setTopApplicants] = useState([]);
//   const [meetings, setMeetings] = useState([]);
//   const [selectedApplicants, setSelectedApplicants] = useState([]);
// const [rejectedApplicants, setRejectedApplicants] = useState([]);
//  const [notification, setNotification] = useState(null);
//   const [tieLinks, setTieLinks] = useState({});
//   const [scheduleModal, setScheduleModal] = useState({
//   visible: false,
//   applicant: null,
//   datetime: "",
// });
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
// const [selectedCandidate, setSelectedCandidate] = useState(null);
// const [scheduleDate, setScheduleDate] = useState("");
//   const [matchOption, setMatchOption] = useState("20%");
//   const [emailPreview, setEmailPreview] = useState(null); // for modal
//   const [sendingEmails, setSendingEmails] = useState(false);
//   const [emailModal, setEmailModal] = useState({
//   visible: false,
//   content: "",
//   applicant: null,
// });

//  const API_BASE = "http://localhost:8000";
//   useEffect(() => {
//     async function load() {
//       try {
//         const r1 = await api.get(`/posts/${postId}`);
//         setPost(r1.data);
//         const r2 = await api.get(`/departments/${deptId}/posts/${postId}/applicants`);
//         setApps(r2.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load post or applicants");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [postId, deptId]);

//   async function runMatch(option) {
//     try {
//       const r = await api.post(`/posts/${postId}/match`, { mode: option });
//       let top = r.data?.matched_top ?? [];

//       if (top.length === 0) {
//         top = [...apps].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
//       }

//       if (option === "positions") {
//         const numPositions = post?.positions ?? 0;
//         setTopApplicants(top.slice(0, numPositions));
//       } else {
//         const percent = parseInt(option.replace("%", ""));
//         const count = Math.ceil((percent / 100) * top.length);
//         setTopApplicants(top.slice(0, count));
//       }

//       setMatched(r.data);
//     } catch (err) {
//       console.error(err);
//       alert("AI match failed: " + (err?.response?.data?.detail || err.message));
//     }
//   }

//   async function sendEmails() {
//     try {
//     setSendingEmails(true);

//     let method, value;
//     if (matchOption === "positions") {
//       method = "positions";
//       value = post?.positions ?? 0;
//     } else {
//       method = "top_percent";
//       value = parseInt(matchOption.replace("%", ""));
//     }

//     const url = `/posts/${postId}/send_top_emails?method=${method}&value=${value}`;
//     const res = await api.post(url);

//    setEmailPreview({
//       content: res.data.emails.map(
//         (e, i) => `To: ${e.to}\nSubject: ${e.subject}\nBody:\n${e.body}\n\n---\n`
//       ).join(""),
//       applicant_ids: res.data.emails.map(e => e.applicant_id)
//     });

//     // Show temporary confirmation message for 1 minute
//     setTimeout(() => setEmailPreview(null), 60000);
//   } catch (err) {
//     console.error(err);
//     alert("Failed to send top emails: " + (err?.response?.data?.detail || err.message));
//   } finally {
//     setSendingEmails(false);
//   }
// }
//  async function selectAllTopApplicants() {
//   const token = localStorage.getItem("token");
//   try {
//     for (let a of topApplicants) {
//       if (a.status !== "selected") {
//         await fetch(`${API_BASE}/posts/${postId}/select`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//           body: JSON.stringify({ applicant_id: a.id || a.applicant_id }),
//         });
//       }
//     }
//     alert("All top candidates selected successfully!");
//     reloadApplicants();
//   } catch (err) {
//     console.error(err);
//     alert("Failed to select top candidates: " + err.message);
//   }
// }


//   async function selectApplicant(appId) {
//     const token = localStorage.getItem("token");
//    try {
//     const res = await fetch(`${API_BASE}/posts/${postId}/select`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({ applicant_id: appId }) // ⚠ snake_case
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.detail || "Failed to select candidate");
//     console.log("Selected:", data.candidate);
//     alert(`Candidate ${data.candidate.name} selected!`);
//     reloadApplicants();
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
//   }

//   async function rejectApplicant(appId) {
//    try {
//     const res = await fetch(`${API_BASE}/posts/${postId}/reject`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({ applicant_id: appId }) // ⚠ snake_case
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.detail || "Failed to reject candidate");
//     console.log("Rejected:", data.candidate);
//     alert(`Candidate ${data.candidate.name} rejected!`);
//     reloadApplicants();
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
//   }

//   async function reloadApplicants() {
//     const r = await api.get(`/departments/${deptId}/posts/${postId}/applicants`);
//     setApps(r.data);
//     const rp = await api.get(`/posts/${postId}`);
//     setPost(rp.data);
//   }

//   async function scheduleInterview(applicant, datetime) {
//   if (!datetime) return alert("Please select date & time");

//   try {
//     // API call to schedule interview AND send structured email
//     const res = await api.post(`/posts/${postId}/schedule`, {
//       applicant_id: applicant.id || applicant.applicant_id,
//       datetime_iso: datetime,
//       note: "Interview scheduled",
//     });

//     // Reload meetings
//     const m = await api.get(`/posts/${postId}/meetings`);
//     setMeetings(m.data);

//     // Show confirmation
//     alert(`Interview scheduled and email sent to ${applicant.name}`);

//   } catch (err) {
//     console.error(err);
//     alert("Failed to schedule interview: " + (err?.response?.data?.detail || err.message));
//   }
// }


//   async function createTieBreak() {
//     const url = prompt("Enter custom tie-break test URL (optional):");
//     try {
//       const r = await api.post(`/posts/${postId}/tiebreak`, { custom_link: url });
//       setTieLinks(r.data.links || {});
//       alert(`Created ${r.data.created} tie-break tests for score ${r.data.score}`);
//     } catch (e) {
//       console.error(e);
//       alert("Failed to create tie-break tests");
//     }
//   }

//   async function sendTieBreakEmails() {
//     try {
//       if (!tieLinks || Object.keys(tieLinks).length === 0) {
//         alert("No tie-break tests created yet.");
//         return;
//       }
//       const r = await api.post(`/posts/${postId}/tiebreak/send`, { links: tieLinks });
//       alert(`Tie-break emails sent to ${r.data.sent_count} applicants`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send tie-break emails: " + (err?.response?.data?.detail || err.message));
//     }
//   }
 
//   if (loading) return <div className="p-6">Loading...</div>;
//   return (
//     <div className="min-h-screen bg-slate-50 p-8">
//       {/* Post Header */}
//       <div className="bg-white p-6 rounded-2xl shadow mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">{post?.title}</h1>
//         <p className="text-gray-600 mb-4">{post?.description}</p>
//         <div className="flex flex-wrap gap-4 text-sm">
//           <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">Stipend: {post?.stipend || "—"}</span>
//           <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Positions: {post?.positions}</span>
//           <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200">Filled: {post?.positions_filled}</span>
//         </div>

//         {/* AI Match Controls */}
//         <div className="mt-6 flex flex-wrap gap-3 items-center">
//           <select value={matchOption} onChange={(e) => setMatchOption(e.target.value)} className="px-3 py-1 border rounded-lg">
//             <option value="20%">Top 20%</option>
//             <option value="30%">Top 30%</option>
//             <option value="positions">By No. of Positions</option>
//           </select>

//           <button onClick={() => runMatch(matchOption)} className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-600 text-white font-medium shadow hover:shadow-md transition">Run AI Match</button>

//           <button onClick={sendEmails} className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700 transition">
//             {sendingEmails ? "Sending..." : "Send Emails to Top Candidates"}
//           </button>
            
//   {topApplicants.length > 0 && (
//     <button
//       onClick={selectAllTopApplicants}
//       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//     >
//       Select All Top Candidates
//     </button>
//   )}
//           <button onClick={createTieBreak} className="px-5 py-2 rounded-lg bg-amber-500 text-white font-medium shadow hover:bg-amber-600 transition">Generate Tie-break Tests</button>

//           <button onClick={sendTieBreakEmails} className="px-5 py-2 rounded-lg bg-purple-600 text-white font-medium shadow hover:bg-purple-700 transition">Send Tie-break Emails</button>

//           <button onClick={() => window.history.back()} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">Back</button>
//           <div className="flex justify-between items-center mb-4">

// </div>

//         </div>

//         {/* Display Tie-break Links */}
//         {tieLinks && Object.keys(tieLinks).length > 0 && (
//           <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
//             <h4 className="font-semibold mb-2">Tie-break Links:</h4>
//             <ul className="list-disc list-inside text-sm text-gray-700">
//               {Object.entries(tieLinks).map(([appId, link]) => (
//                 <li key={appId}>{appId}: <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{link}</a></li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Top Applicants Table */}
//       {topApplicants.length > 0 && (
//         <div className="mt-6 bg-white p-6 rounded-xl shadow overflow-x-auto">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800">Top Candidates ({matchOption})</h3>
//           <table className="w-full min-w-[700px] table-auto border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="px-3 py-2 border">Name</th>
//                 <th className="px-3 py-2 border">Email</th>
//                 <th className="px-3 py-2 border">Skills</th>
//                 <th className="px-3 py-2 border">Qualification</th>
//                 <th className="px-3 py-2 border">Location</th>
//                 <th className="px-3 py-2 border">AI Score</th>
//                 <th className="px-3 py-2 border">Status</th>
//                 <th className="px-3 py-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topApplicants.map((a) => (
//                 <tr key={a.id || a.applicant_id} className="hover:bg-gray-50">
//                   <td className="px-3 py-2 border">{a.name || "—"}</td>
//                   <td className="px-3 py-2 border">{a.email || "—"}</td>
//                   <td className="px-3 py-2 border">{(a.skills || []).join(", ")}</td>
//                   <td className="px-3 py-2 border">{a.qualifications || "—"}</td>
//                   <td className="px-3 py-2 border">{a.location || "—"}</td>
//                   <td className="px-3 py-2 border font-medium text-teal-700">{a.score ?? "N/A"}</td>
//                   <td className="px-3 py-2 border">{a.status || "Pending"}</td>
//                   <td className="px-3 py-2 border flex flex-wrap gap-1">
//                     <button onClick={() => selectApplicant(a.id || a.applicant_id)} className="px-2 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 transition">Select</button>
//                     <button onClick={() => rejectApplicant(a.id || a.applicant_id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition">Reject</button>
//                 <button
//   onClick={() =>
//     setScheduleModal({ visible: true, applicant: a, datetime: "" })
//   }
//   className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
// >
//   Schedule Interview
// </button>



//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* All Applicants */}
//       <h2 className="text-2xl font-bold mb-4 text-gray-800 mt-8">All Applicants</h2>
//       <div className="grid gap-4">
//         {apps.map((a) => (
//           <div key={a.id} className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex justify-between items-start">
//             <div>
//               <div className="font-semibold text-lg text-gray-800">{a.name}</div>
//               <div className="text-sm text-gray-600">{a.email}</div>
//               <div className="text-sm mt-1">Skills: {(a.skills || []).join(", ") || "—"}</div>
//               <div className="text-sm mt-1">Score: <span className="font-medium text-teal-700">{a.score ?? "N/A"}</span></div>
//               {a.status === "selected" && <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 border border-green-200 rounded">Selected</span>}
//               {a.status === "rejected" && <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 border border-red-200 rounded">Rejected</span>}
//             </div>
//             <div className="flex flex-col gap-2">
//               <button onClick={() => window.open(`/profile/${a.id}`, "_blank", "noopener")} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 transition">View Profile</button>
//               {a.status !== "selected" && a.status !== "rejected" && (
//                 <>
//                   <button onClick={() => selectApplicant(a.id || a.applicantId)} className="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition">Select</button>
//                   <button onClick={() => rejectApplicant(a.id || a.applicantId)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">Reject</button>
//                 </>
//               )}
//               <button
//   onClick={() =>
//     setScheduleModal({ visible: true, applicant: a, datetime: "" })
//   }
//   className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
// >
//   Schedule Interview
// </button>

//             </div>
//           </div>
//         ))}
//       </div>

//      {scheduleModal.visible && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
//       <h3 className="text-lg font-semibold mb-4">
//         Schedule Interview - {scheduleModal.applicant.name}
//       </h3>

//       <label className="block mb-2 text-sm font-medium">Select Date & Time</label>
//       <input
//         type="datetime-local"
//         value={scheduleModal.datetime}
//         onChange={(e) =>
//           setScheduleModal({ ...scheduleModal, datetime: e.target.value })
//         }
//         className="w-full border px-3 py-2 rounded mb-4"
//       />

//       <h4 className="font-semibold mb-2">Email Preview:</h4>
//       <div className="bg-gray-50 p-3 rounded mb-4 text-sm whitespace-pre-line">
//         {`Subject: Interview Invitation for ${post.title}\n\nHello ${scheduleModal.applicant.name},\n\nYou have been shortlisted for the ${post.title} position.\nInterview Date & Time: ${scheduleModal.datetime || "[Select Date & Time]"}\n\nRegards,\n${post.company_name || "HR"}`}
//       </div>

//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => setScheduleModal({ visible: false, applicant: null, datetime: "" })}
//           className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//         >
//           Close
//         </button>
//         <button
//           onClick={() => {
//             alert(`Email sent to ${scheduleModal.applicant.name}`);
//             setScheduleModal({ visible: false, applicant: null, datetime: "" });
//           }}
//           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           Send Email
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//       {/* Email Preview Modal */}
//       {emailPreview && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl shadow-lg relative">
//             <h3 className="text-lg font-semibold mb-4">Send Email</h3>
//             {/* <pre className="text-sm bg-gray-50 p-4 rounded overflow-x-auto">{emailPreview.content}</pre> */}
//             <div className="mt-4 flex justify-end gap-3">
//               <button onClick={() => setEmailPreview(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
//               <button
//                 // Inside the modal's "Send Emails" button
// onClick={async () => {
//   try {
//     // Determine method and value just like sendEmails()
//     const method = matchOption === "positions" ? "positions" : "top_percent";
//     const value = matchOption === "positions" ? post.positions : parseInt(matchOption.replace("%",""));
//     const url = `/posts/${postId}/send_top_emails?method=${method}&value=${value}`;

//     const res = await api.post(url); // call your existing backend route

//     alert(`Emails sent successfully to applicants`);
//     setEmailPreview(null);
//   } catch (err) {
//     console.error(err);
//     alert("Failed to send emails: " + (err?.response?.data?.detail || err.message));
//   }
// }}

//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 Send Emails
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


// src/pages/PostDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import Profile from "./Profile";

export default function PostDetail() {
  const { postId } = useParams();
  const deptId = localStorage.getItem("department_id");
  const token = localStorage.getItem("token");

  const [post, setPost] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(null);
  const [topApplicants, setTopApplicants] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [rejectedApplicants, setRejectedApplicants] = useState([]);
  const [notification, setNotification] = useState(null);
  const [tieLinks, setTieLinks] = useState({});
  const [scheduleModal, setScheduleModal] = useState({ visible: false, applicant: null, datetime: "" });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [matchOption, setMatchOption] = useState("20%");
  const [emailPreview, setEmailPreview] = useState(null);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailModal, setEmailModal] = useState({ visible: false, content: "", applicant: null });

  const API_BASE = "http://localhost:8000";

  useEffect(() => {
    async function load() {
      try {
        const r1 = await api.get(`/posts/${postId}`);
        setPost(r1.data);
        const r2 = await api.get(`/departments/${deptId}/posts/${postId}/applicants`);
        setApps(r2.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load post or applicants");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId, deptId]);

 async function runMatch(option) {
  try {
    const r = await api.post(`/posts/${postId}/match`, { mode: option });

    await reloadApplicants();

    let allScored = r.data?.matched_top ?? [];

    if (allScored.length === 0) {
      const updatedApps = await api.get(`/departments/${deptId}/posts/${postId}/applicants`);
      allScored = [...updatedApps.data].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    }

    // Calculate top candidates based on selected option and AI scores
    let selectedCandidates = [];
    if (option === "positions") {
      const numPositions = post?.positions ?? 0;
      selectedCandidates = allScored.slice(0, numPositions);
    } else {
      const percent = parseInt(option.replace("%", ""));
      const count = Math.ceil((percent / 100) * allScored.length);
      selectedCandidates = allScored.slice(0, count);
    }

    setTopApplicants(selectedCandidates);
    setMatched(r.data);
    
    // Show algorithm info with selection details
    if (r.data?.algorithm) {
      const selectionType = option === 'positions' ? `top ${post?.positions} positions` : `top ${option}`;
      alert(`✅ AI Matching Complete!\n\nAlgorithm: ${r.data.algorithm}\n${r.data.description || ''}\n\nTotal scored: ${allScored.length} candidates\nSelected for display: ${selectedCandidates.length} candidates (${selectionType})\n\nCandidates are ranked by AI score from highest to lowest.`);
    }
  } catch (err) {
    console.error(err);
    alert("AI match failed");
  }
}


  async function sendEmails() {
    try {
      setSendingEmails(true);

      let method, value;
      if (matchOption === "positions") {
        method = "positions";
        value = post?.positions ?? 0;
      } else {
        method = "top_percent";
        value = parseInt(matchOption.replace("%", ""));
      }

      const url = `/posts/${postId}/send_top_emails?method=${method}&value=${value}`;
      const res = await api.post(url);

      setEmailPreview({
        content: res.data.emails.map(
          (e, i) => `To: ${e.to}\nSubject: ${e.subject}\nBody:\n${e.body}\n\n---\n`
        ).join(""),
        applicant_ids: res.data.emails.map(e => e.applicant_id)
      });

      setTimeout(() => setEmailPreview(null), 60000);
    } catch (err) {
      console.error(err);
      alert("Failed to send top emails: " + (err?.response?.data?.detail || err.message));
    } finally {
      setSendingEmails(false);
    }
  }

  async function selectAllTopApplicants() {
    try {
      let selectedCount = 0;
      const positionsAvailable = (post?.positions || 0) - (post?.positions_filled || 0);
      
      if (positionsAvailable <= 0) {
        alert("❌ No positions available for selection. All positions are already filled.");
        return;
      }

      // Select candidates up to available positions
      const candidatesToSelect = topApplicants.slice(0, positionsAvailable);
      
      for (let a of candidatesToSelect) {
        if (a.status !== "selected") {
          const res = await fetch(`${API_BASE}/posts/${postId}/select`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ applicant_id: a.id || a.applicant_id }),
          });
          
          if (res.ok) {
            selectedCount++;
            // Update local state immediately
            a.status = "selected";
          }
        }
      }
      
      const allPositionsFilled = (post?.positions_filled || 0) + selectedCount >= (post?.positions || 0);
      
      if (allPositionsFilled) {
        alert(`🎉 SUCCESS! ${selectedCount} top candidates selected successfully!\n\n✅ All ${post?.positions || 0} positions are now filled.\n🔒 This position will be automatically closed and moved to the closed internships section.\n\n📧 Selected candidates will receive confirmation emails shortly.`);
      } else {
        alert(`✅ ${selectedCount} top candidates selected successfully!\n\n📊 Positions Status: ${(post?.positions_filled || 0) + selectedCount}/${post?.positions || 0} filled\n📧 Selected candidates will receive confirmation emails.`);
      }
      
      // Update the topApplicants state to reflect selections
      setTopApplicants(prev => prev.map(a => 
        candidatesToSelect.find(c => c.id === a.id) ? { ...a, status: "selected" } : a
      ));
      
      await reloadApplicants();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to select top candidates: " + err.message);
    }
  }

  async function selectApplicant(appId) {
    try {
      // Check if positions are full before selection
      if (post?.positions_filled >= post?.positions) {
        alert("❌ Cannot select candidate. All positions are already filled.");
        return;
      }

      // Find the candidate first to get their name
      const candidate = apps.find(a => (a.id || a.applicant_id) === appId);
      
      const res = await fetch(`${API_BASE}/posts/${postId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ applicant_id: appId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to select candidate");
      
      // Show success message with position status
      const candidateName = candidate?.name || data.candidate?.name || 'Unknown';
      const positionStatus = data.position_closed ? 
        `\n\n🎉 CONGRATULATIONS! All ${data.total_positions} positions are now filled!\n🔒 This position will be automatically closed.` :
        `\n\n📊 Position Status: ${data.positions_filled}/${data.total_positions} filled`;
      
      alert(`✅ SUCCESS! Candidate ${candidateName} has been selected!${positionStatus}\n\n📧 Confirmation email will be sent to the candidate.`);
      
      reloadApplicants();
    } catch (err) {
      console.error(err);
      alert("❌ Selection failed: " + err.message);
    }
  }

  async function rejectApplicant(appId) {
    try {
      // Find the candidate first to get their name
      const candidate = apps.find(a => (a.id || a.applicant_id) === appId);
      
      const res = await fetch(`${API_BASE}/posts/${postId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ applicant_id: appId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to reject candidate");
      
      const candidateName = candidate?.name || data.candidate?.name || 'Unknown';
      alert(`❌ Candidate ${candidateName} has been rejected.\n\n📧 Rejection notification will be sent to the candidate.`);
      
      reloadApplicants();
    } catch (err) {
      console.error(err);
      alert("❌ Rejection failed: " + err.message);
    }
  }

  async function reloadApplicants() {
    const r = await api.get(`/departments/${deptId}/posts/${postId}/applicants`);
    setApps(r.data);
    const rp = await api.get(`/posts/${postId}`);
    setPost(rp.data);
  }

  async function scheduleInterview(applicant, datetime) {
    if (!datetime) return alert("Please select date & time");
    try {
      await api.post(`/posts/${postId}/schedule`, {
        applicant_id: applicant.id || applicant.applicant_id,
        datetime_iso: datetime,
        note: "Interview scheduled",
      });
      const m = await api.get(`/posts/${postId}/meetings`);
      setMeetings(m.data);
      alert(`Interview scheduled and email sent to ${applicant?.name || 'candidate'}`);
    } catch (err) {
      console.error(err);
      alert("Failed to schedule interview: " + (err?.response?.data?.detail || err.message));
    }
  }

  async function createTieBreak() {
    const url = prompt("Enter custom tie-break test URL (optional):");
    try {
      const r = await api.post(`/posts/${postId}/tiebreak`, { custom_link: url });
      setTieLinks(r.data.links || {});
      alert(`Created ${r.data.created} tie-break tests for score ${r.data.score}`);
    } catch (e) {
      console.error(e);
      alert("Failed to create tie-break tests");
    }
  }

  async function sendTieBreakEmails() {
    try {
      if (!tieLinks || Object.keys(tieLinks).length === 0) {
        alert("No tie-break tests created yet.");
        return;
      }
      const r = await api.post(`/posts/${postId}/tiebreak/send`, { links: tieLinks });
      alert(`Tie-break emails sent to ${r.data.sent_count} applicants`);
    } catch (err) {
      console.error(err);
      alert("Failed to send tie-break emails: " + (err?.response?.data?.detail || err.message));
    }
  }

  if (loading) return <div className="p-6 text-gray-800 dark:text-gray-200">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-8 text-gray-900 dark:text-gray-100">
      {/* Top Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => window.location.href = "/hr/dashboard"}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
          title="Back to Dashboard"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Post Details</h1>
      </div>

      {/* Post Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{post?.title}</h2>
              {post?.status === "closed" ? (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                  CLOSED
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  OPEN
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-6 mb-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-medium">🏢</span>
                <span>{post?.company_name || 'Company'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">📍</span>
                <span>{post?.location || 'Location'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">⏱️</span>
                <span>{post?.duration || 'Duration'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">💰</span>
                <span>{post?.stipend || 'Stipend'}</span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{post?.description}</p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{post?.positions || 0}</div>
                <div className="text-sm text-gray-500">Total Positions</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{post?.positions_filled || 0}</div>
                <div className="text-sm text-gray-500">Filled</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{apps.length || 0}</div>
                <div className="text-sm text-gray-500">Applicants</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {post?.positions ? Math.round(((post?.positions_filled || 0) / post.positions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-500">Fill Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Experience:</span>
            <span className="font-medium">{post?.experience_required || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Education:</span>
            <span className="font-medium">{post?.education_required || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date:</span>
            <span className="font-medium">
              {post?.start_date ? new Date(post.start_date).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>

        {/* Required Skills */}
        {post?.required_skills && post.required_skills.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {post.required_skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Match Controls - All in one line */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <select 
              value={matchOption} 
              onChange={(e) => setMatchOption(e.target.value)} 
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-500 text-sm"
            >
              <option value="20%">Top 20%</option>
              <option value="30%">Top 30%</option>
              <option value="positions">By No. of Positions</option>
            </select>

            <button 
              onClick={() => runMatch(matchOption)} 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-600 text-white font-medium shadow hover:shadow-md transition text-sm"
            >
              🤖 Run AI Match
            </button>

            <button 
              onClick={sendEmails} 
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700 transition text-sm"
            >
              {sendingEmails ? "Sending..." : "📧 Send Emails"}
            </button>

            {topApplicants.length > 0 && (
              <button 
                onClick={selectAllTopApplicants} 
                disabled={topApplicants.every(a => a.status === "selected") || (post?.positions_filled >= post?.positions)}
                className={`px-4 py-2 rounded transition text-sm ${
                  topApplicants.every(a => a.status === "selected") || (post?.positions_filled >= post?.positions)
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {topApplicants.every(a => a.status === "selected") ? "✅ All Selected" : 
                 (post?.positions_filled >= post?.positions) ? "🔒 Position Closed" : 
                 "⚡ Select All Top"}
              </button>
            )}

            <button 
              onClick={createTieBreak} 
              className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium shadow hover:bg-amber-600 transition text-sm"
            >
              🎯 Tie-break Tests
            </button>

            <button 
              onClick={sendTieBreakEmails} 
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium shadow hover:bg-purple-700 transition text-sm"
            >
              📤 Send Tie-break
            </button>
          </div>
        </div>

        {/* Display Tie-break Links */}
        {tieLinks && Object.keys(tieLinks).length > 0 && (
          <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold mb-2">🔗 Tie-break Links Generated:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {Object.entries(tieLinks).map(([appId, link]) => (
                <li key={appId}>
                  Applicant {appId}: <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Top Applicants Table */}
      {topApplicants.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Top Candidates ({matchOption})</h3>
            {matched?.algorithm && (
              <div className="bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  ✅ Algorithm: {matched.algorithm}
                </p>
                {matched.description && (
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    {matched.description}
                  </p>
                )}
              </div>
            )}
          </div>
          <table className="w-full min-w-[700px] table-auto border-collapse text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">Skills</th>
                <th className="px-3 py-2 border">Qualification</th>
                <th className="px-3 py-2 border">Location</th>
                <th className="px-3 py-2 border">AI Score</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topApplicants.map((a) => (
                <tr key={a.id || a.applicant_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 border">{a.name || "—"}</td>
                  <td className="px-3 py-2 border">{a.email || "—"}</td>
                  <td className="px-3 py-2 border">{(a.skills || []).join(", ")}</td>
                  <td className="px-3 py-2 border">{a.qualifications || "—"}</td>
                  <td className="px-3 py-2 border">{a.location || "—"}</td>
                  <td className="px-3 py-2 border font-medium text-teal-700 dark:text-teal-300">{a.score ?? "N/A"}</td>
                  <td className="px-3 py-2 border">{a.status || "Pending"}</td>
                  <td className="px-3 py-2 border flex flex-wrap gap-1">
                    {a.status === "selected" ? (
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded">Selected</span>
                    ) : a.status === "rejected" ? (
                      <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded">Rejected</span>
                    ) : (
                      <>
                        <button 
                          onClick={() => selectApplicant(a.id || a.applicant_id)} 
                          disabled={post?.positions_filled >= post?.positions}
                          className={`px-2 py-1 text-xs rounded transition ${
                            post?.positions_filled >= post?.positions
                              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                              : "bg-teal-600 text-white hover:bg-teal-700"
                          }`}
                        >
                          {post?.positions_filled >= post?.positions ? "Closed" : "Select"}
                        </button>
                        <button onClick={() => rejectApplicant(a.id || a.applicant_id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition">Reject</button>
                        <button onClick={() => setScheduleModal({ visible: true, applicant: a, datetime: "" })} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Schedule Interview</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Applicants */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            All Applicants ({apps.length})
          </h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {apps.filter(a => a.status === "pending" || !a.status).length} Pending
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {apps.filter(a => a.status === "selected").length} Selected
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
              {apps.filter(a => a.status === "rejected").length} Rejected
            </span>
          </div>
        </div>
        
        <div className="grid gap-4">
          {apps.map((a) => (
            <div key={a.id} className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl shadow hover:shadow-md transition flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {a.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-800 dark:text-gray-100">{a.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{a.email}</div>
                  </div>
                  {a.status === "selected" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      ✅ SELECTED
                    </span>
                  )}
                  {a.status === "rejected" && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      ❌ REJECTED
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Skills</div>
                    <div className="text-sm">
                      {(a.skills || []).slice(0, 3).join(", ") || "—"}
                      {(a.skills || []).length > 3 && ` +${a.skills.length - 3} more`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Education</div>
                    <div className="text-sm">{a.major || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Location</div>
                    <div className="text-sm">{a.location || "—"}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">AI Score</div>
                    <div className="text-sm font-medium text-teal-700 dark:text-teal-300">
                      {a.score ? `${a.score}/100` : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">GPA</div>
                    <div className="text-sm">{a.gpa ? `${a.gpa}/4.0` : "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Experience</div>
                    <div className="text-sm">{a.experience_years || 0} years</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Category</div>
                    <div className="text-sm">{a.category || "General"}</div>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {a.background === "Rural" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      🌾 Rural Background
                    </span>
                  )}
                  {a.gender === "Female" && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      👩 Female Candidate
                    </span>
                  )}
                  {a.prev_internships === 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      🆕 First-time Intern
                    </span>
                  )}
                  {a.certifications && a.certifications.length > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                      🏆 {a.certifications.length} Certification{a.certifications.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  onClick={() => window.open(`/profile/${a.id}`, "_blank", "noopener")} 
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  👤 View Profile
                </button>
                
                {a.status !== "selected" && a.status !== "rejected" && (
                  <>
                    <button 
                      onClick={() => selectApplicant(a.id || a.applicantId)} 
                      disabled={post?.positions_filled >= post?.positions}
                      className={`px-3 py-1 text-sm rounded transition ${
                        post?.positions_filled >= post?.positions
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      {post?.positions_filled >= post?.positions ? "🔒 Closed" : "✅ Select"}
                    </button>
                    <button 
                      onClick={() => rejectApplicant(a.id || a.applicantId)} 
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setScheduleModal({ visible: true, applicant: a, datetime: "" })}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  📅 Schedule Interview
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {apps.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">📋</div>
            <div className="text-lg font-medium mb-2">No Applicants Yet</div>
            <div className="text-sm">Applications will appear here once candidates apply for this position.</div>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {scheduleModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-md shadow-lg relative text-gray-900 dark:text-gray-100">
            <h3 className="text-lg font-semibold mb-4">Schedule Interview - {scheduleModal.applicant?.name || 'Unknown'}</h3>
            <label className="block mb-2 text-sm font-medium">Select Date & Time</label>
            <input
              type="datetime-local"
              value={scheduleModal.datetime}
              onChange={(e) => setScheduleModal({ ...scheduleModal, datetime: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />

            <h4 className="font-semibold mb-2">Email Preview:</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-4 text-sm whitespace-pre-line">
              {`Subject: Interview Invitation for ${post?.title || 'Position'}\n\nHello ${scheduleModal.applicant?.name || 'Candidate'},\n\nYou have been shortlisted for the ${post?.title || 'Position'} position.\nInterview Date & Time: ${scheduleModal.datetime || "[Select Date & Time]"}\n\nRegards,\n${post?.company_name || "HR"}`}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setScheduleModal({ visible: false, applicant: null, datetime: "" })} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Close</button>
              <button
                onClick={() => { alert(`Email sent to ${scheduleModal.applicant?.name || 'candidate'}`); setScheduleModal({ visible: false, applicant: null, datetime: "" }); }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {emailPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-2xl shadow-lg relative text-gray-900 dark:text-gray-100">
            <h3 className="text-lg font-semibold mb-4">Send Email</h3>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setEmailPreview(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Close</button>
              <button
                onClick={async () => {
                  try {
                    const method = matchOption === "positions" ? "positions" : "top_percent";
                    const value = matchOption === "positions" ? post.positions : parseInt(matchOption.replace("%", ""));
                    const url = `/posts/${postId}/send_top_emails?method=${method}&value=${value}`;
                    await api.post(url);
                    alert(`Emails sent successfully to applicants`);
                    setEmailPreview(null);
                  } catch (err) {
                    console.error(err);
                    alert("Failed to send emails: " + (err?.response?.data?.detail || err.message));
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Send Emails
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
