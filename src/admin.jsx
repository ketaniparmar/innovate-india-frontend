import { useState, useEffect } from 'react';
import { Users, Activity, FileText, IndianRupee } from 'lucide-react';

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('https://innovate-india-suite.onrender.com/api/admin/leads');
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
    setLoading(false);
  };

  const handleGeneratePDF = async (lead) => {
    alert(`Spinning up the PDF Engine for ${lead.project_name}... Please wait a few seconds.`);
    
    try {
      const response = await fetch('https://innovate-india-suite.onrender.com/api/admin/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            leadId: lead.id,
            projectName: lead.project_name,
            cityTier: lead.city_tier,
            beds: lead.bed_count,
            specialty: lead.specialty_focus
        })
      });

      // Convert the response into a downloadable file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Innovate_India_DPR_${lead.project_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
    } catch (error) {
      console.error("PDF Download failed:", error);
      alert("Failed to connect to the PDF engine.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Innovate India Command Center</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Leads</p>
                <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Users size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">DPRs Pending</p>
                <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600"><FileText size={24} /></div>
            </div>
          </div>
        </div>

        {/* CRM Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Recent Hospital Projects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="p-4 font-medium">Project Name</th>
                  <th className="p-4 font-medium">Client Email</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Beds / Specialty</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {loading ? (
                  <tr><td colSpan="6" className="p-4 text-center text-slate-500">Loading pipeline...</td></tr>
                ) : leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{lead.project_name}</td>
                    <td className="p-4 text-slate-600">{lead.organizations?.name}</td>
                    <td className="p-4 text-slate-600">Tier {lead.city_tier}</td>
                    <td className="p-4 text-slate-600">{lead.bed_count} ({lead.specialty_focus})</td>
                    <td className="p-4 text-slate-600">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleGeneratePDF(lead)}
                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 font-medium cursor-pointer">
                        Generate PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}