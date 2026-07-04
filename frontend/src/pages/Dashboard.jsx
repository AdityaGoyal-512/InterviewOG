import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createSession, getSessions,reset,deleteSession } from '../features/sessions/sessionSlice'
import { toast } from 'react-toastify'
import SessionCard from "../components/SessionCard"

const ROLES = [
  "MERN Stack Developer",
  "MERN Stack Developer",
  "Full Stack Python",
  "Full Stack Java",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer (AWS/Azure/GCP)",
  "Cybersecurity Engineer",
  "Blockchain Developer",
  "Mobile Developer (iOS/Android)",
  "Game Developer",
  "UI/UX Designer",
  "QA Automation Engineer",
  "Product Manager"
];
const LEVELS = ["Junior", "Mid-Level", "Senior"];
const TYPES = [{ label: 'Oral only', value: 'oral-only' }, { label: 'Coding Mix', value: 'coding-mix' }];
const COUNTS = [5, 10, 15];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { sessions, isLoading, isGenerating, isError, message } = useSelector((state) => state.sessions);
  const isProcessing = isGenerating;

  const [formData, setFormData] = useState({
    role: user.preferredRole || ROLES[0],
    level: LEVELS[0],
    interviewType: TYPES[1].value,
    count: COUNTS[0],
  });

  useEffect(() => {
    dispatch(getSessions());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createSession(formData));
  }

  const viewSession = (session) => {
    if (session.status === 'completed') {
      navigate(`/review/${session._id}`);
    } else if(session.status === 'in-progress') {
      navigate(`/interview/${session._id}`);
    }else{
      toast.info('Session not ready yet')
    }
  }


 const handleDelete = (e, sessionId) => {
    console.log("DELETE CLICKED", sessionId);

    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this session?")) {
        dispatch(deleteSession(sessionId));
        toast.error("Session Deleted");
    }
};


  return (
    <div
      className="relative min-h-screen bg-black overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* ambient glows, purely decorative */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-teal-500/15 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-[28rem] w-[28rem] rounded-full bg-purple-500/15 blur-[130px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12 animate-in duration-700">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 sm:pb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">Welcome, <span className="text-teal-400">{user.name.split(' ')[0]}</span> </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-lg font-medium">Ready for your technical prep?</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-white/10 flex sm:block items-center gap-2">
              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Total Sessions</p>
              <p className="text-xl sm:text-2xl font-semibold text-white leading-none">{sessions.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] overflow-hidden backdrop-blur-xl">
          <div className="px-6 py-4 sm:px-8 sm:py-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <span className="bg-teal-400 w-1.5 h-5 rounded-full mr-3"></span>
              New Interview
            </h2>
          </div>
          <form onSubmit={onSubmit} className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Role</label>
              <select name="role" value={formData.role} onChange={onChange} className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 text-sm font-medium text-white outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/30">
                {ROLES.map((role) => <option key={role} value={role} className="bg-black text-white">{role}</option>)}</select>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:contents">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Level</label>
                <select name="level" value={formData.level} onChange={onChange} className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 text-sm font-medium text-white outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/30">
                  {LEVELS.map((level) => <option key={level} value={level} className="bg-black text-white">{level}</option>)}</select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Length</label>
                <select name="count" value={formData.count} onChange={onChange} className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 text-sm font-medium text-white outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/30">
                  {COUNTS.map((count) => <option key={count} value={count} className="bg-black text-white">{count} Qs</option>)}</select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Type</label>
              <select name="interviewType" value={formData.interviewType} onChange={onChange} className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 text-sm font-medium text-white outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/30">
                {TYPES.map((type) => <option key={type.value} value={type.value} className="bg-black text-white">{type.label}</option>)}</select>
            </div>
            <button type="submit" disabled={isProcessing} className={`w-full h-[48px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isProcessing ? 'bg-white/10 text-slate-400' : 'bg-white text-black hover:bg-slate-200'}`}>
              {isProcessing ? <><span className="animate-spin h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full"></span> Generating...</> : <span>Start Interview</span>}
            </button>
          </form>
  </div>

        {/* HISTORY LIST (Now separate from the creation card) */}
        <div className="space-y-6 pb-20 sm:pb-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center px-2"> Interview History</h2>
          {isLoading && sessions.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-teal-400 rounded-full"></div>
            </div>
          ) : (
            sessions.length === 0 ? (
              <div className="bg-white/[0.03] border-2 border-dashed border-white/10 rounded-2xl sm:rounded-[2rem] py-16 sm:py-20 text-center">
                <p className="text-slate-500 font-semibold text-base sm:text-lg">No sessions yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <SessionCard key={session._id} session={session} onClick={viewSession} onDelete={handleDelete}/>
                ))}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  )
}
export default Dashboard