
import React, { useRef, useState, useEffect } from 'react';

export const LandingView: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('Operations');
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
  // Refs for scroll tracking in How It Works
  const stepRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // Precise Step Tracking for How It Works
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-step-index'));
            setActiveStep(index);
          }
        });
      },
      { threshold: 0.6, rootMargin: "-10% 0px -40% 0px" }
    );

    stepRefs.forEach((ref) => {
      if (ref.current) stepObserver.observe(ref.current);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      revealObserver.disconnect();
      stepObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const departments = [
    { id: 'Sales', icon: '📈', color: 'text-white', bg: 'bg-emerald-950', border: 'border-emerald-800/30' },
    { id: 'HR', icon: '👥', color: 'text-white', bg: 'bg-indigo-950', border: 'border-indigo-800/30' },
    { id: 'Finance', icon: '💰', color: 'text-white', bg: 'bg-amber-950', border: 'border-amber-800/30' },
    { id: 'Marketing', icon: '📣', color: 'text-white', bg: 'bg-rose-950', border: 'border-rose-800/30' },
    { id: 'Operations', icon: '⚙️', color: 'text-white', bg: 'bg-slate-900', border: 'border-slate-700/30' }
  ];

  const useCases = {
    Sales: ['Lead handling & qualification', 'CRM workflows', 'Handoffs and follow-ups'],
    HR: ['Hiring and onboarding', 'Internal policies', 'Employee lifecycle SOPs'],
    Finance: ['Billing and invoicing', 'Audit procedures', 'Financial controls'],
    Marketing: ['Campaign execution', 'Content workflows', 'Approval processes'],
    Operations: ['Day-to-day execution', 'Escalation paths', 'Quality checks']
  };

  const socialLogos = [
    { name: 'Stripe', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
    { name: 'Slack', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg' },
    { name: 'Airbnb', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Belo.svg' },
    { name: 'Uber', url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg' },
    { name: 'Intercom', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Intercom_logo.svg' },
    { name: 'Shopify', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' }
  ];

  const steps = [
    {
      step: '01',
      title: 'Contextualize',
      desc: 'Define your business nodes. Map your departments and unique operational DNA into our system architecture.',
      visual: 'Architect'
    },
    {
      step: '02',
      title: 'Synthesize',
      desc: 'Our AI interviews your process managers. We map your specific tools, compliance rules, and hierarchies.',
      visual: 'Form'
    },
    {
      step: '03',
      title: 'Logic-Check',
      desc: 'Audit the generated procedural logic. Every section is cross-referenced with your specific business profile.',
      visual: 'Audit'
    },
    {
      step: '04',
      title: 'Distribute',
      desc: 'One-click export to professional Word or PDF formats. Ready for immediate deployment across your stack.',
      visual: 'Export'
    },
  ];

  return (
    <div className="bg-white selection:bg-indigo-100 selection:text-indigo-900 min-h-screen font-sans overflow-x-hidden">
      {/* Navigation */}
    <nav className={`fixed top-0 w-full z-50 px-4 sm:px-8 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>

  {/* Logo */}
  <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">O</div>
    <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">OPOR8</span>
  </div>

  {/* Desktop Menu */}
  <div className="hidden md:flex items-center space-x-8">
    <button onClick={() => scrollTo(howItWorksRef)} className="text-sm text-slate-500 font-black uppercase tracking-widest hover:text-indigo-600">How it works</button>
    <button onClick={() => scrollTo(pricingRef)} className="text-sm text-slate-500 font-black uppercase tracking-widest hover:text-indigo-600">Pricing</button>

    <button
      onClick={onStart}
      className={`px-6 py-2.5 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      Get Started Free
    </button>
  </div>

<div className='bg-indigo-600 p-2 md:hidden rounded-xl text-white'>
  <button
    className="md:hidden flex items-center"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {menuOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
  </div>
</nav>
{menuOpen && (
  <div className="md:hidden transition-all duration-300 ease-in-out fixed top-[70px] left-0 w-full bg-white shadow-md border-t p-4 flex flex-col gap-4 z-40">

    <button onClick={() => { scrollTo(howItWorksRef); setMenuOpen(false); }} className="text-sm text-slate-700 font-bold uppercase">
      How it works
    </button>

    <button onClick={() => { scrollTo(pricingRef); setMenuOpen(false); }} className="text-sm text-slate-700 font-bold uppercase">
      Pricing
    </button>

    <button
      onClick={() => { onStart(); setMenuOpen(false); }}
      className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-sm"
    >
      Get Started Free
    </button>

  </div>
)}

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-8 overflow-hidden reveal">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <div className="stagger-item inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase tracking-[0.25em] mb-8 border border-indigo-100">
              AI SOP Generator for Modern Teams
            </div>
            <h1 className="stagger-item text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.85] mb-10">
              Build SOPs. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 italic font-serif">Paperless.</span>
            </h1>
            <p className="stagger-item text-xl text-slate-500 max-w-xl mb-12 leading-relaxed font-medium">
              Create clear, department-ready SOPs in minutes. Export to <strong className="text-indigo-600">Word or PDF</strong>. Keep everything structured, searchable, and up to date.
            </p>
            <div className="stagger-item flex flex-col sm:flex-row items-center gap-6 mb-8">
              <button onClick={onStart} className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0">
                Generate your first SOP
              </button>
              <button onClick={() => scrollTo(howItWorksRef)} className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all">
                View a sample SOP
              </button>
            </div>
            <div className="stagger-item flex items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg" className="w-6 h-6" alt="Word" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Word Ready</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Adobe_Acrobat_Reader_DC_logo.svg" className="w-6 h-6" alt="PDF" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">PDF Export</span>
              </div>
            </div>
          </div>

          <div className="relative group perspective-1000 hidden lg:block stagger-item">
            <div className="bg-white rounded-[3rem] shadow-[0_64px_128px_-12px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden transform rotate-y-neg-5 group-hover:rotate-0 transition-transform duration-1000 ease-out">
              <div className="h-14 bg-slate-900 flex items-center justify-between px-8 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30"></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Synthesis Engine</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>
              <div className="flex h-[500px]">
                <div className="w-24 border-r border-slate-100 bg-slate-50/50 flex flex-col items-center py-6 gap-6">
                  {departments.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setActiveTab(d.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${activeTab === d.id ? `bg-indigo-600 text-white shadow-lg ring-1 ring-slate-200` : 'text-slate-300 hover:bg-white hover:text-slate-500'}`}
                    >
                      {d.icon}
                    </button>
                  ))}
                </div>
                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                  <div className="space-y-6">
                    <div className="h-4 bg-slate-100 rounded-full w-24 mb-2"></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight transition-all duration-500">
                      {activeTab} {activeTab === 'HR' ? 'Onboarding Protocol' : 'Operational SOP'}
                    </h3>
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center text-[10px] font-bold">1</div>
                        <div className="h-3 bg-slate-100 rounded-full w-48"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center text-[10px] font-bold">2</div>
                        <div className="h-3 bg-slate-100 rounded-full w-64"></div>
                      </div>
                      <div className="ml-8 space-y-2 opacity-40">
                        <div className="h-2 bg-slate-50 rounded-full w-40"></div>
                        <div className="h-2 bg-slate-50 rounded-full w-32"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Social Proof Marquee */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden border-y border-white/5 reveal">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="stagger-item text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-16">Trusted by teams who want clarity, not chaos</p>
          <div className="relative flex gap-12 group overflow-hidden stagger-item">
            <div className="flex animate-[marquee_30s_linear_infinite] gap-12 items-center whitespace-nowrap min-w-full">
              {[...socialLogos, ...socialLogos].map((logo, i) => (
                <div key={i} className="flex items-center gap-4 transition-all opacity-40 hover:opacity-100">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-2xl flex items-center justify-center p-2.5 border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                    <img src={logo.url} alt={logo.name} className="w-full h-full object-contain filter brightness-0 invert" />
                  </div>
                  <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Staggered Cards */}
      <section className="py-32 px-8 bg-slate-50 reveal">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h2 className="stagger-item text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">SOPs shouldn’t feel like paperwork.</h2>
          <p className="stagger-item text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            They usually live in random folders, outdated docs, or someone’s head. Hard to maintain. Harder to scale. This is SOPs done the modern way.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Built by AI, shaped by you', desc: 'Answer guided questions. Our synthesis engine builds the logic while you provide the nuance.' },
            { title: 'Structured, consistent, editable', desc: 'No more messy formatting. Consistent sections across every department module.' },
            { title: 'Ready to train and audit', desc: 'Exportable documents ready for employee onboarding or ISO-level compliance checks.' }
          ].map((item, i) => (
            <div key={i} className="stagger-item bg-white p-6 sm:p-12 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2 cursor-default group">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl mb-8 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">{i + 1}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works - Clean Interactive Section */}
      <section ref={howItWorksRef} className="py-24 bg-gradient-to-b from-white to-slate-50 px-8 reveal relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="stagger-item text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">How It Works</h2>
            <p className="stagger-item text-slate-500 text-lg font-medium max-w-2xl mx-auto">
              From business context to deployment-ready documents in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className="stagger-item group relative"
                onMouseEnter={() => setActiveStep(i)}
              >
                <div className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-500 h-full flex flex-col ${activeStep === i
                  ? 'border-indigo-600 shadow-2xl shadow-indigo-100 scale-105 -translate-y-2'
                  : 'border-slate-100 hover:border-slate-200 hover:shadow-lg'
                  }`}>
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 shadow-xl ${activeStep === i
                    ? 'bg-indigo-600 text-white scale-110 rotate-12'
                    : 'bg-slate-900 text-white'
                    }`}>
                    {s.step}
                  </div>

                  {/* Icon Area */}
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl transition-all duration-500 ${activeStep === i
                    ? 'bg-indigo-50 scale-110'
                    : 'bg-slate-50'
                    }`}>
                    {i === 0 && '🎯'}
                    {i === 1 && '✨'}
                    {i === 2 && '✓'}
                    {i === 3 && '🚀'}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 flex-1">
                    {s.desc}
                  </p>

                  {/* Progress Indicator */}
                  <div className={`h-1 bg-slate-100 rounded-full overflow-hidden transition-all duration-500 ${activeStep === i ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 w-full animate-[shimmer_2s_ease-in-out_infinite]"></div>
                  </div>

                  {/* Connecting Arrow (desktop only) */}
                  {i < 3 && (
                    <div className={`hidden lg:block absolute top-1/2 -right-3 w-6 h-6 transition-all duration-500 ${activeStep === i ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'
                      }`}>
                      <svg className="w-full h-full text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Visual Demo Area */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              {/* Browser Chrome */}
              <div className="h-12 bg-slate-900 gap-4 flex items-center px-6 justify-between border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs font-black uppercase text-white/40 tracking-widest">
                  {steps[activeStep].title}
                </span>
                <div className="w-20"></div>
              </div>

              {/* Content Area */}
              <div className="p-12 min-h-[300px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
                {/* Step 0: Contextualize */}
                {activeStep === 0 && (
                  <div className="w-full max-w-lg animate-fadeIn">
                    <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-8 mb-12">
                      {['📈 Sales', '⚙️ Operations', '👥 HR'].map((dept, idx) => (
                        <div
                          key={idx}
                          className={`w-28 h-28 bg-white border-2 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all duration-700 ${idx === 1 ? 'border-indigo-600 scale-110 shadow-indigo-200' : 'border-slate-200'
                            }`}
                          style={{ animationDelay: `${idx * 200}ms` }}
                        >
                          <span className="text-2xl mb-2">{dept.split(' ')[0]}</span>
                          <span className="text-xs font-black text-slate-600">{dept.split(' ')[1]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select your departments</p>
                    </div>
                  </div>
                )}

                {/* Step 1: Synthesize */}
                {activeStep === 1 && (
                  <div className="w-full max-w-md animate-fadeIn">
                    <div className="space-y-4">
                      <div className="p-4 bg-white border-2 border-indigo-100 rounded-xl">
                        <div className="h-3 bg-slate-100 rounded-full w-3/4 mb-2"></div>
                        <div className="h-2 bg-slate-50 rounded-full w-1/2"></div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-200 rounded-2xl relative overflow-hidden">
                        <div className="space-y-2 mb-4">
                          <div className="h-2 bg-indigo-200 rounded-full w-full animate-pulse"></div>
                          <div className="h-2 bg-indigo-200 rounded-full w-5/6 animate-pulse" style={{ animationDelay: '100ms' }}></div>
                          <div className="h-2 bg-indigo-200 rounded-full w-4/6 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-600">
                          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-black uppercase tracking-wider">AI Processing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Logic-Check */}
                {activeStep === 2 && (
                  <div className="w-full max-w-md animate-fadeIn">
                    <div className="bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden">
                      <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                        <span className="text-sm font-black text-emerald-700">Quality Score</span>
                        <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full">98.5%</span>
                      </div>
                      <div className="p-6 space-y-3">
                        {[true, true, false, true].map((checked, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${checked ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                              {checked ? '✓' : '!'}
                            </div>
                            <div className={`h-2 rounded-full flex-1 ${checked ? 'bg-slate-100' : 'bg-amber-50 border border-amber-200'}`}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Distribute */}
                {activeStep === 3 && (
                  <div className="flex flex-col items-center animate-fadeIn">
                    <div className="w-48 h-64 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-6 mb-8 transform hover:scale-105 transition-transform">
                      <div className="h-4 bg-indigo-600 rounded w-20 mb-6"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-100 rounded-full"></div>
                        <div className="h-2 bg-slate-100 rounded-full"></div>
                        <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
                        <div className="h-2 bg-slate-100 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        PDF
                      </button>
                      <button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        WORD
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -z-10"></div>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes shimmer {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />
      </section>

      {/* Department Grid - High Contrast Brand Scheme */}
      <section className="py-32 bg-slate-950 text-white rounded-[4rem] mx-8 mb-32 border border-white/5 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-10">
          <div className="text-center mb-24">
            <h2 className="stagger-item text-4xl md:text-5xl font-black tracking-tight mb-6 uppercase">SOPs for every team.</h2>
            <p className="stagger-item text-slate-500 text-xl font-medium">Standardize the core procedures that run your business nodes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map(dept => (
              <div key={dept.id} className={`${dept.bg} ${dept.border} stagger-item p-6 sm:p-10 rounded-[3rem] transition-all duration-500 group hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/50 border flex flex-col justify-between h-80 relative overflow-hidden`}>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-4xl bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">{dept.icon}</span>
                    <h3 className="text-2xl font-black tracking-tight uppercase">{dept.id}</h3>
                  </div>
                  <ul className="space-y-3">
                    {useCases[dept.id as keyof typeof useCases].map((uc, i) => (
                      <li key={i} className="flex items-center text-white/70 text-sm font-bold group-hover:text-white transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-white mr-3 opacity-50"></div>
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
              </div>
            ))}
            <div className="stagger-item p-10 bg-indigo-600 rounded-[3rem] flex flex-col items-center justify-center text-center shadow-2xl shadow-indigo-500/30 group hover:scale-[1.03] transition-all cursor-pointer border border-indigo-400/30" onClick={onStart}>
              <h3 className="text-2xl font-black mb-4 uppercase">Ready to automate?</h3>
              <p className="text-indigo-100 text-sm font-bold mb-8">Start building your team's procedural manual today.</p>
              <div className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl group-hover:scale-110 transition-transform">Launch Generator</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Metrics Section */}
      <section className="py-32 bg-indigo-50 mx-8 rounded-[4rem] mb-32 reveal">
        <div className="max-w-5xl mx-auto px-10 text-center">
          <div className="stagger-item w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-10 text-3xl shadow-lg shadow-indigo-200">✨</div>
          <h2 className="stagger-item text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">SOPs without the paperwork.</h2>
          <p className="stagger-item text-xl text-slate-600 font-medium leading-relaxed mb-12">
            No printing. No scattered files. No outdated versions. Everything lives in one system. Always accessible. Always current.
            <strong> Fewer process gaps. Faster onboarding. Consistent execution.</strong>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '70%', lab: 'Time Saved' },
              { val: '100%', lab: 'Doc Accuracy' },
              { val: '44+', lab: 'Templates' },
              { val: '0', lab: 'Setup Fee' }
            ].map((stat, i) => (
              <div key={i} className="stagger-item bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-2xl font-black text-indigo-600">{stat.val}</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.lab}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Module */}
      <section ref={pricingRef} className="py-32 px-8 reveal">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h2 className="stagger-item text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">SOP SaaS Plans</h2>
          <p className="stagger-item text-slate-500 font-medium text-xl">Simple plans that grow with your team. Start small, scale fast.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="stagger-item p-12 rounded-[3rem] border-2 border-slate-100 bg-white flex flex-col group hover:border-slate-200 transition-all hover:shadow-lg">
            <h3 className="text-2xl font-black mb-2">SOP Starter</h3>
            <div className="text-4xl font-black mb-8">$0</div>
            <ul className="space-y-4 mb-12 flex-1">
              {['2 Sample Documents', 'Business Profile Mapping', 'Basic AI SOP builder', 'PDF Export Only'].map((f, i) => (
                <li key={i} className="flex items-center text-slate-600 font-medium text-sm">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={onStart} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-95">Start Free</button>
          </div>
          <div className="stagger-item p-12 rounded-[3rem] border-4 border-indigo-600 bg-white shadow-2xl shadow-indigo-100 flex flex-col relative md:scale-105 z-10 transition-transform hover:scale-[1.07]">
            <div className="absolute top-0 right-12 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Recommended</div>
            <h3 className="text-2xl font-black mb-2">Enterprise SOP Pack</h3>
            <div className="text-4xl font-black mb-8">$49<span className="text-sm font-bold text-slate-400">/one-time</span></div>
            <ul className="space-y-4 mb-12 flex-1">
              {['All 44+ SOP Documents', 'Unlimited PDF & Word Exports', 'Audit-Ready Compliance', 'Custom Team Branding'].map((f, i) => (
                <li key={i} className="flex items-center text-slate-900 font-black text-sm">
                  <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={onStart} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95">Unlock Professional SaaS</button>
          </div>
        </div>
      </section>

      {/* Final Conversion CTA */}
      <section className="py-48 px-8 bg-slate-900 text-white text-center rounded-t-[5rem] reveal">
        <div className="max-w-4xl mx-auto">
          <h2 className="stagger-item text-5xl md:text-7xl font-black tracking-tight mb-8">Build SOPs your team actually follows.</h2>
          <p className="stagger-item text-xl text-slate-400 mb-12 font-medium leading-relaxed">Paperless. Structured. Export-ready. No credit card required. Experience the elite procedural engine today.</p>
          <button onClick={onStart} className="stagger-item px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-500/20 transition-all active:scale-95">
            Generate your first SOP
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-32 px-8 font-sans border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-24">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center space-x-2 text-white mb-8">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-900/50">O</div>
                <span className="text-2xl font-black tracking-tight uppercase">OPOR8</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed mb-8 font-medium text-slate-400">
                The world's premier <strong>AI SOP generator</strong> and <strong>process documentation software</strong>. Standardize your operations today.
              </p>
            </div>

            <div>
              <h4 className="font-black text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Product</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button className="hover:text-indigo-400 transition-colors">Features</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Departments</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Templates</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Security</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Pricing</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Company</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button className="hover:text-indigo-400 transition-colors">About</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Resources</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button className="hover:text-indigo-400 transition-colors">Guides</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Blog</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Support</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Legal</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button className="hover:text-indigo-400 transition-colors">Privacy</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Terms</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Security</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
            <p>&copy; 2025 OPOR8 AI Technologies S.A. | The Ultimate <strong>SOP Documentation Tool</strong>.</p>
            <div className="flex items-center gap-6">
              {/* <span className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 Gemini 3 Pro Uplink: Optimal
               </span> */}
              {/* <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">v2.5.0-STABLE</span> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
