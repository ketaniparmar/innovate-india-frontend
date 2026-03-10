import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    projectName: '', email: '', bedCount: '', specialtyFocus: 'General',
    cityTier: '2', totalArea: '', numFloors: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://innovate-india-suite.onrender.com/api/admin/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cityTier: parseInt(formData.cityTier),
          bedCount: parseInt(formData.bedCount),
          totalArea: parseInt(formData.totalArea),
          numFloors: parseInt(formData.numFloors)
        })
      });
      if (response.ok) alert("Roadmap sent to your inbox!");
    } catch (error) {
      alert("Backend connection error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Header - Brand Authority */}
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">INNOVATE INDIA</h1>
          <p className="text-blue-100 mt-2 font-medium opacity-90">Smart Hospital Feasibility Suite</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 gap-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Project Name</label>
              <input name="projectName" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} required placeholder="e.g. Surat Super Specialty" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" name="email" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} required placeholder="director@hospital.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Bed Count */}
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Beds</label>
              <input type="number" name="bedCount" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} required />
            </div>
            {/* City Tier */}
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">City Category</label>
              <select name="cityTier" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange}>
                <option value="1">Tier 1 (Metro)</option>
                <option value="2">Tier 2 (Growing)</option>
                <option value="3">Tier 3 (District)</option>
              </select>
            </div>
          </div>

          {/* Space Planning Highlighted Section */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-xl border border-blue-900/30">
            <div>
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Area (Sq. Ft.)</label>
              <input type="number" name="totalArea" className="w-full bg-slate-900 border border-blue-800/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Total Floors</label>
              <input type="number" name="numFloors" className="w-full bg-slate-900 border border-blue-800/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} required />
            </div>
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Clinical Specialty</label>
            <input name="specialtyFocus" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} required placeholder="e.g. Multi-Specialty / Cardiac" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2" disabled={loading}>
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>GENERATING ROADMAP...</span>
              </>
            ) : (
              <span>GENERATE BRANDED ROADMAP</span>
            )}
          </button>
        </form>
        <div className="bg-slate-900/50 p-4 text-center">
            <p className="text-slate-500 text-xs font-medium">© 2026 Innovate India | Hospital Project Consultancy</p>
        </div>
      </div>
    </div>
  );
}