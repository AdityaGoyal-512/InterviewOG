import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getSessionById } from '../features/sessions/sessionSlice';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const diff = new Date(end) - new Date(start);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
};

const sanitizeQuestionText = (text) => {
    return text.replace(/^\d+[\s\.\)]+/, '').trim();
};

const formatIdealAnswer = (text) => {
    try {
        if (!text) return "Pending evaluation.";

        let cleanText = text.trim();

        
        if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }

      
        if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
            const parsed = JSON.parse(cleanText);

           
            if (parsed.verbalAnswer || parsed.idealAnswer || parsed.idealanswer) {
                return parsed.verbalAnswer || parsed.idealAnswer || parsed.idealanswer;
            }

            
            const explanation = parsed.explanation || parsed.understanding || "";
            const code = parsed.code || parsed.codeExample || parsed.example || "";

            if (explanation || code) {
                return `${explanation}\n\n${code}`.trim();
            }
        }

       
        return text;
    } catch (e) {
      
        return text;
    }
};

function SessionReview() {
    const { sessionId } = useParams();
    const dispatch = useDispatch();
    const { activeSession, isLoading } = useSelector(state => state.sessions);

    useEffect(() => {
        dispatch(getSessionById(sessionId));
    }, [dispatch, sessionId]);

    if (isLoading) return <div className="min-h-screen bg-black text-center py-20 font-bold text-slate-400 animate-pulse uppercase tracking-widest">Generating Analysis...</div>;

    if (!activeSession || activeSession.status !== 'completed') {
        return (
            <div className="min-h-screen bg-black flex items-start justify-center">
                <div className="max-w-xl w-full mx-4 mt-10 sm:mt-20 p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] text-center border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl">
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-4 tracking-tighter uppercase">Report Not Ready</h2>
                    <p className="text-slate-400 mb-8 font-medium text-sm sm:text-base">This session is still being processed by our AI network.</p>
                    <Link to="/" className="inline-block bg-white text-black px-8 py-3 sm:px-10 sm:py-4 rounded-2xl font-black uppercase tracking-widest transition hover:bg-slate-200 active:scale-95 text-xs sm:text-sm">Dashboard</Link>
                </div>
            </div>
        );
    }

    const { overallScore, metrics, role, level, questions, startTime, endTime } = activeSession;
    const finalMetrics = metrics || {};

    const barData = {
        labels: questions.map((_, i) => `Q${i + 1}`),
        datasets: [{
            label: 'Technical Score',
            data: questions.map(q => q.technicalScore || 0),
            backgroundColor: questions.map(q => (q.technicalScore || 0) > 70 ? '#10b981' : '#f59e0b'),
            borderRadius: 8,
        }],
    };

    return (
        <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12 animate-in fade-in duration-700">

         
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6 sm:pb-10">
                <div>
                    <span className="text-teal-400 font-black uppercase tracking-[0.2em] text-[10px]">Assessment Complete</span>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2 uppercase">
                        {role} <span className="text-slate-500 font-medium lowercase block sm:inline">({level})</span>
                    </h1>
                </div>
            </div>

          
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 sm:pb-0 no-scrollbar snap-x">
                {[
                    { label: 'Overall Result', value: `${overallScore}%`, color: 'teal' },
                    { label: 'Avg Technical', value: `${finalMetrics.avgTechnical}%`, color: 'slate' },
                    { label: 'Avg Confidence', value: `${finalMetrics.avgConfidence}%`, color: 'slate' },
                    { label: 'Session Time', value: formatDuration(startTime, endTime), color: 'slate' }
                ].map((stat, i) => (
                    <div key={i} className={`min-w-[160px] snap-center bg-white/[0.04] p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-white/10 border-l-[8px] ${stat.color === 'teal' ? 'border-l-teal-400' : 'border-l-white/10'}`}>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{stat.label}</p>
                        <p className={`text-2xl sm:text-4xl font-black mt-2 leading-none ${stat.color === 'teal' ? 'text-teal-400' : 'text-white'}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

          
            <div className="bg-white/[0.04] p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] border border-white/10">
                <h3 className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Per-Question Performance</h3>
                <div className="h-64 sm:h-80">
                    <Bar
                        data={barData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } },
                                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                            }
                        }}
                    />
                </div>
            </div>

        
            <div className="space-y-6 sm:space-y-10">
                <h3 className="text-xl sm:text-3xl font-black text-white px-2 flex items-center tracking-tighter uppercase">
                    <span className="w-8 h-8 sm:w-12 sm:h-12 bg-white text-black rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-5 text-base sm:text-xl">✓</span>
                    Answer Intelligence
                </h3>
                <div className="space-y-6 sm:space-y-10">
                    {questions.map((q, index) => (
                        <div key={index} className="bg-white/[0.04] rounded-3xl sm:rounded-[3rem] border border-white/10 overflow-hidden group hover:bg-white/[0.06] transition-all duration-500">
                            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">

                               
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-6">
                                    <h4 className="text-lg sm:text-2xl font-bold text-white flex-1 leading-snug">
                                        <span className="text-teal-400 mr-2 font-black italic">Q{index + 1}.</span> {sanitizeQuestionText(q.questionText)}
                                    </h4>
                                    <div className="flex gap-2 shrink-0">
                                        <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl border flex items-center gap-2 bg-emerald-400/10 border-emerald-400/20">
                                            <span className="text-[8px] sm:text-[10px] font-black uppercase text-slate-500">Tech</span>
                                            <span className="text-xs sm:text-sm font-black text-emerald-400">{q.technicalScore}%</span>
                                        </div>
                                        <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl border border-sky-400/20 bg-sky-400/10 flex items-center gap-2">
                                            <span className="text-[8px] sm:text-[10px] font-black uppercase text-slate-500">Conf</span>
                                            <span className="text-xs sm:text-sm font-black text-sky-400">{q.confidenceScore}%</span>
                                        </div>
                                    </div>
                                </div>

                              
                                <div className="space-y-3">
                                    <label className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block ml-1">Your Submission</label>
                                    <div className="bg-black/40 rounded-2xl sm:rounded-[2rem] border border-white/10 overflow-hidden">

                                     
                                        {q.userSubmittedCode && q.userSubmittedCode !== "undefined" && (
                                            <div className="p-4 sm:p-6 border-b border-white/10 last:border-0">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Code</span>
                                                <pre className="text-[11px] sm:text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto">
                                                    {q.userSubmittedCode}
                                                </pre>
                                            </div>
                                        )}

                                    
                                        {q.userAnswerText && (
                                            <div className="p-4 sm:p-6">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Transcript</span>
                                                <p className="text-xs sm:text-sm text-slate-400 italic leading-relaxed">
                                                    "{q.userAnswerText}"
                                                </p>
                                            </div>
                                        )}

                                    
                                        {(!q.userSubmittedCode || q.userSubmittedCode === "undefined") && !q.userAnswerText && (
                                            <div className="p-6 text-center text-slate-600 text-xs italic">
                                                No answer recorded.
                                            </div>
                                        )}
                                    </div>
                                </div>

                            
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 pt-6 sm:pt-8 border-t border-white/10">
                                    <div className="space-y-3">
                                        <label className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block ml-1">AI Analytical Feedback</label>
                                        <div className="bg-black/30 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] text-xs sm:text-sm italic text-slate-300 border-l-[4px] sm:border-l-[6px] border-teal-400 leading-relaxed">
                                            "{q.aiFeedback}"
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block ml-1">Ideal Implementation</label>
                                        <pre className="bg-black text-slate-400 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] text-[11px] sm:text-[13px] overflow-x-auto whitespace-pre-wrap font-mono border border-white/10 leading-relaxed">
                                          
                                            {formatIdealAnswer(q.idealAnswer)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
}

export default SessionReview;