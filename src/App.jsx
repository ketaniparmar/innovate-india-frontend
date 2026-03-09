import { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    email: '',
    projectName: '',
    cityTier: '1',
    bedCount: 50,
    specialtyFocus: 'General'
  });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://innovate-india-suite.onrender.com/api/admin/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          projectName: formData.projectName,
          cityTier: parseInt(formData.cityTier),
          bedCount: parseInt(formData.bedCount),
          specialtyFocus: formData.specialtyFocus
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data.financials);
      } else {
        alert("Error calculating project: " + data.error);
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      alert("Failed to connect to the backend engine.");
    }
    
    setLoading(false);
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Smart Feasibility Estimator</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email Address (For Report)</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                placeholder="investor@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Project Name</label>
              <input type="text" name="projectName" required value={formData.projectName} onChange={handleChange} 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                placeholder="Apollo Horizon" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">City Tier</label>
                <select name="cityTier" value={formData.cityTier} onChange={handleChange} 
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                  <option value="1">Tier 1 (Metro)</option>
                  <option value="2">Tier 2</option>
                  <option value="3">Tier 3</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Bed Count</label>
                <input type="number" name="bedCount" required min="10" value={formData.bedCount} onChange={handleChange} 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Primary Specialty Focus</label>
              <select name="specialtyFocus" value={formData.specialtyFocus} onChange={handleChange} 
                className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                <option value="General">Multispecialty (General)</option>
                <option value="Oncology">Oncology (Cancer Care)</option>
                <option value="Cardiology">Cardiology (Heart Center)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} 
              className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
              {loading ? 'Calculating...' : 'Generate Estimate'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Results Dashboard */}
        <div className="flex flex-col justify-center">
          {results ? (
            <div className="bg-slate-900 text-white p-8 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Instant Viability Report</h3>
              <p className="text-slate-400 text-sm mb-6">Generated by Innovate India AI Engine</p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider">Estimated CAPEX</p>
                  <p className="text-4xl font-bold text-white">{formatINR(results.estimatedCapex)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider">IRR Preview</p>
                    <p className="text-2xl font-semibold text-emerald-400">{results.irrPreview}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider">Viability Score</p>
                    <p className="text-2xl font-semibold text-blue-400">{results.viabilityScore} / 100</p>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600">
                  Download 20-Page DPR
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-200 border-2 border-dashed border-slate-300 p-8 rounded-xl flex items-center justify-center h-full text-slate-500 text-center">
              <div>
                <p className="font-medium">Awaiting Project Data...</p>
                <p className="text-sm mt-2">Enter your hospital specifications on the left to instantly calculate CAPEX and viability.</p>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}