import { useState } from 'react';
import axios from 'axios';
import { Plane, MapPin, Calendar, Loader2, Sparkles, Send } from 'lucide-react';

function App() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTrip = async () => {
    if (!destination || !days) {
      alert("Please enter both destination and days.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate', {
        destination,
        days
      });
      setPlan(response.data.plan);
    } catch (error) {
      console.error("Error generating trip:", error);
      alert("Failed to connect to the backend. Is the server running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans text-gray-900">
      {/* Header Section */}
      <div className="max-w-2xl w-full text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Plane className="text-white w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          AI Trip <span className="text-blue-600">Architect</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Smart travel itineraries powered by Llama 3 & Groq AI.
        </p>
      </div>

      {/* Input Form Section */}
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 p-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="e.g. Ella, Sri Lanka" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                onChange={(e) => setDestination(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">How many days?</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="number"
                placeholder="Number of days" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                onChange={(e) => setDays(e.target.value)} 
              />
            </div>
          </div>

          <button 
            onClick={generateTrip} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Crafting Your Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Itinerary
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {plan && (
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <Send className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Your Travel Plan</h2>
          </div>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {plan}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-10 text-gray-400 text-sm">
        Built with MERN Stack & Groq AI
      </footer>
    </div>
  );
}

export default App;