import { useState } from 'react';
import axios from 'axios';
import { Plane, MapPin, Calendar, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

function App() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTrip = async () => {
    if (!destination || !days) return alert("Please fill all fields");
    setLoading(true);
    setPlan(null);
    try {
      const response = await axios.post('http://localhost:5000/api/generate', {
        destination,
        days
      });
      setPlan(response.data);
    } catch (error) {
      alert("Error connecting to server!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center p-6 font-sans">
      {/* Header Section */}
      <div className="text-center mb-10 mt-10">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Plane className="text-white size-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">AI Trip <span className="text-blue-600">Architect</span></h1>
        <p className="text-slate-500 font-medium">Your personal smart travel guide</p>
      </div>

      {/* Input Box */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 w-full max-w-md mb-12">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Destination</label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 text-blue-500 size-5" />
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                // 1. මෙතන Placeholder එක වෙනස් කළා
                placeholder="Ex: Galle or Anuradhapura to Badulla" 
                onChange={(e) => setDestination(e.target.value)} 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Days</label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-3 text-blue-500 size-5" />
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="How many days?" 
                type="number"
                onChange={(e) => setDays(e.target.value)} 
              />
            </div>
          </div>
          <button 
            onClick={generateTrip} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? "Architecting..." : "Plan My Trip"}
          </button>
        </div>
      </div>

      {/* Result Cards */}
      {plan && (
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col items-center gap-2 mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 px-4 uppercase tracking-tighter italic text-center">
               {plan.trip_name}
            </h2>
            
            {/* 2. මෙන්න මෙතන Road Trip බටන් එක දැම්මා */}
            {destination.toLowerCase().includes("to") && (
              <a 
                href={`https://www.google.com/maps/dir/${destination.replace(" to ", "/")}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-green-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 hover:bg-green-700 transition-all shadow-md active:scale-95"
              >
                🚗 View Full Route on Google Maps
              </a>
            )}
          </div>

          <div className="grid gap-6">
            {plan.itinerary.map((item, index) => (
              <div key={index} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-blue-600 text-white font-black px-5 py-1.5 rounded-full text-sm uppercase">
                    Day {item.day}
                  </span>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>
                <ul className="space-y-4">
                  {item.activities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-600 group-hover:text-slate-800 transition-colors">
                      <div className="bg-green-100 p-1 rounded-full mt-0.5">
                        <CheckCircle2 className="text-green-600 size-4 shrink-0" />
                      </div>
                      <span className="font-medium leading-relaxed">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;