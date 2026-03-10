"use client"

import React, { useState, useMemo } from "react"
import { 
  LayoutDashboard, Calculator, Landmark, FileText, 
  Building2, ChevronLeft, Search, Printer, CheckCircle2, 
  ShoppingCart, Star, Phone
} from "lucide-react"

// ============================================================================
// 1. BRAND IDENTITY & SYSTEM THEME
// ============================================================================
const THEME = {
  bg: "bg-[#051626]",
  panel: "bg-[#0A2540]",
  gold: "text-[#D4AF37]",
  goldBg: "bg-[#D4AF37]",
  emerald: "text-emerald-400",
  border: "border-white/10"
}

const USER_CONFIG = {
  name: "Ketan Parmar",
  email: "director@hospitalprojectconsultancy.com",
  phone: "+91 9879576332",
  reportEmail: "report@hospitalprojectconsultancy.com"
}

function calculateFinancials(beds: number, costPerBed: number, revPerBed: number, opexPct: number, marginPct: number, interestRate: number, tenure: number) {
  const totalCapex = beds * costPerBed
  const annualRev = beds * revPerBed
  const annualOpex = annualRev * (opexPct / 100)
  const ebitda = annualRev - annualOpex
  const promoterEquity = totalCapex * (marginPct / 100)
  const loanPrincipal = totalCapex - promoterEquity
  const monthlyRate = (interestRate / 100) / 12
  const totalMonths = tenure * 12
  const emi = loanPrincipal > 0 ? (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1) : 0
  const dscr = (emi * 12) > 0 ? (ebitda / (emi * 12)) : 0
  return { totalCapex, annualRev, annualOpex, ebitda, promoterEquity, loanPrincipal, dscrFormatted: dscr.toFixed(2), isBankable: dscr >= 1.25 }
}

const formatINR = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`
  return `₹${Math.round(val).toLocaleString('en-IN')}`
}

// ============================================================================
// 2. MAIN ENGINE: INNOVATE IND'AI'
// ============================================================================
export default function InnovateIndAI() {
  const [activeTab, setActiveTab] = useState("Estimator")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [projectName, setProjectName] = useState("Dahej Public Hospital")
  const [clientEmail, setClientEmail] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)

  // Sliders State
  const [beds, setBeds] = useState(50)
  const [costPerBed, setCostPerBed] = useState(3500000)
  const [revPerBed, setRevPerBed] = useState(1200000)
  const [opexPct, setOpexPct] = useState(65)
  const [marginPct, setMarginPct] = useState(30)
  const [interestRate, setInterestRate] = useState(10.5)
  const [tenure, setTenure] = useState(7)

  const fin = useMemo(() => calculateFinancials(beds, costPerBed, revPerBed, opexPct, marginPct, interestRate, tenure), [beds, costPerBed, revPerBed, opexPct, marginPct, interestRate, tenure])

  const handleSyncToVault = async () => {
    if (!clientEmail) return alert("Director email required for secure synchronization.")
    setIsSyncing(true)
    try {
      const res = await fetch('https://innovate-india-suite.onrender.com/api/admin/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, email: clientEmail, from: USER_CONFIG.reportEmail, bedCount: beds, totalArea: beds * 600, cityTier: 2 })
      })
      if (res.ok) alert("Ind'AI' Vault updated successfully.")
    } catch (e) { alert("Engine Connection Error.") }
    setIsSyncing(false)
  }

  return (
    <div className={`flex h-screen w-full ${THEME.bg} text-white overflow-hidden font-sans`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`${sidebarCollapsed ? "w-20" : "w-72"} ${THEME.panel} border-r ${THEME.border} flex flex-col transition-all duration-300 z-50`}>
        <div className={`h-16 flex items-center px-4 border-b ${THEME.border}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-[#0A2540]">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">Innovate <span className="text-emerald-400">Ind'AI'</span></span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto text-white/40 hover:text-white p-1">
            <ChevronLeft className={sidebarCollapsed ? "rotate-180" : ""}/>
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {["Dashboard", "Estimator", "Funding", "DPR", "Vendors"].map(id => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === id ? 'bg-white/10 text-emerald-400 border border-white/10' : 'text-white/40 hover:bg-white/5'}`}>
              <Calculator className="w-5 h-5" />
              {!sidebarCollapsed && <span className="text-sm font-bold">{id}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 ${THEME.panel} border-b ${THEME.border} flex items-center justify-between px-8 shrink-0 z-40`}>
          <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold hidden md:block">Verified: {USER_CONFIG.email}</div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">{USER_CONFIG.name}</p>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Master Architect</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 overflow-hidden bg-white/5">
              <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=Ketan+Parmar&background=0A2540&color=34d399`; }} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">
            
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 gap-6">
              <div>
                <h1 className="text-4xl font-black">{activeTab}</h1>
                <p className="text-white/40 mt-1 uppercase tracking-widest text-[10px] font-bold">Ind'AI' Institutional Intelligence Engine</p>
              </div>
              <div className={`${THEME.panel} p-5 rounded-2xl border ${THEME.border} shadow-2xl text-right`}>
                 <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Total Project Outlay</p>
                 <p className="text-3xl font-bold text-emerald-400">{formatINR(fin.totalCapex)}</p>
              </div>
            </div>

            {/* MODULE: ESTIMATOR */}
            {activeTab === "Estimator" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                <div className={`${THEME.panel} p-8 rounded-3xl border ${THEME.border} space-y-8`}>
                   <h3 className="font-bold text-lg border-b border-white/5 pb-4">Modeling Parameters</h3>
                   <div className="space-y-6">
                     <div>
                       <label className="text-[10px] text-white/40 uppercase font-bold block mb-3">Capacity: {beds} Beds</label>
                       <input type="range" min="25" max="300" step="5" value={beds} onChange={(e) => setBeds(Number(e.target.value))} className="w-full accent-emerald-400" />
                     </div>
                     <div>
                       <label className="text-[10px] text-white/40 uppercase font-bold block mb-3">CAPEX/Bed: {formatINR(costPerBed)}</label>
                       <input type="range" min="1500000" max="6000000" step="100000" value={costPerBed} onChange={(e) => setCostPerBed(Number(e.target.value))} className="w-full accent-emerald-400" />
                     </div>
                   </div>
                </div>
                <div className="lg:col-span-2 bg-gradient-to-br from-[#0A2540] to-[#051626] p-10 rounded-3xl border ${THEME.border} shadow-2xl">
                  <h3 className={`text-xl font-bold ${THEME.gold} mb-10`}>Ind'AI' Viability Matrix</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between border-b border-white/5 pb-5"><span className="text-white/60">Annual Revenue Run-Rate</span><span className="text-xl font-bold">{formatINR(fin.annualRev)}</span></div>
                    <div className="flex justify-between pt-6"><span className="text-2xl font-black uppercase tracking-tight">Net EBITDA</span><span className="text-4xl font-black text-emerald-400">{formatINR(fin.ebitda)}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE: VENDORS (PREMIUM GOLD) */}
            {activeTab === "Vendors" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-500">
                {/* Lepu Card */}
                <div className={`${THEME.panel} p-10 rounded-3xl border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.05)] relative flex flex-col group`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F1CF6D] rounded-xl flex items-center justify-center text-[#051626] mb-8 shadow-lg">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-[#D4AF37] to-[#F1CF6D] bg-clip-text text-transparent mb-4">Lepu Medical</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">Direct institutional pipelines for Cardiology & ICU infrastructure. Access Tier-1 pricing for patient monitors and catheterization labs.</p>
                  <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F1CF6D] rounded-xl text-[#051626] font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">Request Institutional Quote</button>
                </div>

                {/* Diacare Card */}
                <div className={`${THEME.panel} p-10 rounded-3xl border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.05)] relative flex flex-col group`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F1CF6D] rounded-xl flex items-center justify-center text-[#051626] mb-8 shadow-lg">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-[#D4AF37] to-[#F1CF6D] bg-clip-text text-transparent mb-4">Diacare Solutions</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-8 flex-grow">Advanced Nephrology Architecture. Specialized turnkey dialysis setups with integrated RO filtration systems for South Gujarat.</p>
                  <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F1CF6D] rounded-xl text-[#051626] font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">Request Institutional Quote</button>
                </div>
              </div>
            )}

            {/* MODULE: DPR */}
            {activeTab === "DPR" && (
              <div className="bg-white text-[#0A2540] p-12 rounded-3xl shadow-2xl space-y-10 animate-in slide-in-from-bottom duration-500">
                 <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-[#0A2540] pb-8 gap-6">
                   <div className="flex-1">
                     <h2 className="text-3xl font-black uppercase tracking-tighter">Detailed Project Report</h2>
                     <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="text-2xl font-bold text-[#D4AF37] bg-transparent outline-none w-full border-b border-dashed border-[#D4AF37]/50 mt-4" />
                     <input placeholder="Enter Director's Email..." value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="block mt-6 text-sm font-bold outline-none border-b border-gray-200 w-full pb-2" />
                   </div>
                   <div className="text-right shrink-0">
                     <p className="font-bold text-lg leading-tight">INNOVATE INDIA</p>
                     <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Hospital Consultancy</p>
                     <p className="text-[10px] text-gray-400 mt-1 italic font-bold">Verified: {USER_CONFIG.phone}</p>
                   </div>
                 </div>
                 <button onClick={handleSyncToVault} disabled={isSyncing} className="w-full bg-[#0A2540] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all">
                   {isSyncing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle2 className="w-4 h-4"/>}
                   {isSyncing ? "Syncing Ind'AI' Vault..." : "Archive to Secure CRM"}
                 </button>
              </div>
            )}

          </div>
        </main>

        <footer className={`h-14 ${THEME.panel} border-t border-white/10 flex items-center justify-between px-8 text-[10px] text-white/20 font-bold uppercase tracking-widest`}>
          <div className="flex items-center gap-6">
            <p>© 2026 Innovate Ind'AI'</p>
            <p className="flex items-center gap-2"><Phone className="w-3 h-3"/> {USER_CONFIG.phone}</p>
          </div>
          <p className="hidden md:block">Master Instance: {USER_CONFIG.email}</p>
        </footer>
      </div>
    </div>
  )
}