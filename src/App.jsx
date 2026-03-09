import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    projectName: '',
    email: '',
    bedCount: '',
    specialtyFocus: 'General',
    cityTier: '2',
    totalArea: '', // NEW
    numFloors: ''  // NEW
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Connects to your Render Engine
      const response = await fetch('https://innovate-india-suite.onrender.com/api/admin/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          projectName: formData.projectName,
          cityTier: parseInt(formData.cityTier),
          bedCount: parseInt(formData.bedCount),
          specialtyFocus: formData.specialtyFocus,
          totalArea: parseInt(formData.totalArea), // NEW
          numFloors: parseInt(formData.numFloors)  // NEW
        })
      });

      const data = await response.json();
      if (data.success) {
        alert("Success! Check your email for the detailed roadmap.");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      alert("Failed to connect to the backend engine.");
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 bg-dark text-white p-4">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4">Smart Feasibility Estimator</h2>
        <form onSubmit={handleSubmit} className="p-4 border border-secondary rounded bg-black">
          
          <div className="mb-3">
            <label className="form-label">Project Name</label>
            <input name="projectName" className="form-control bg-dark text-white border-secondary" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control bg-dark text-white border-secondary" onChange={handleChange} required />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Bed Capacity</label>
              <input type="number" name="bedCount" className="form-control bg-dark text-white border-secondary" onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">City Tier</label>
              <select name="cityTier" className="form-select bg-dark text-white border-secondary" onChange={handleChange}>
                <option value="1">Tier 1 (Metro)</option>
                <option value="2">Tier 2 (Growing)</option>
                <option value="3">Tier 3 (District)</option>
              </select>
            </div>
          </div>

          {/* NEW SPACE PLANNING SECTION */}
          <div className="row border-top border-secondary pt-3 mt-2">
            <div className="col-md-6 mb-3">
              <label className="form-label text-info">Built-up Area (Sq. Ft.)</label>
              <input type="number" name="totalArea" className="form-control bg-dark text-white border-info" onChange={handleChange} required placeholder="e.g. 25000" />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-info">Number of Floors</label>
              <input type="number" name="numFloors" className="form-control bg-dark text-white border-info" onChange={handleChange} required placeholder="G + X" />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Specialty Focus</label>
            <input name="specialtyFocus" className="form-control bg-dark text-white border-secondary" onChange={handleChange} required placeholder="e.g. Multi-Specialty" />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 mt-3" disabled={loading}>
            {loading ? "Generating Report..." : "Generate Branded Roadmap"}
          </button>
        </form>
      </div>
    </div>
  );
}