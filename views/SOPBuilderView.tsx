
import React, { useState } from 'react';
import { DB } from '../services/db';
import { SOPPack, StepStatus, User } from '../types';

export const SOPBuilderView: React.FC<{ user: User, onNext: (packId: string) => void }> = ({ user, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Industry State
  const [industries, setIndustries] = useState<any[]>([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const [loadingIndustries, setLoadingIndustries] = useState(false);

  // Add Company State
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [basicQuestions, setBasicQuestions] = useState<any[]>([]);
  const [loadingBasicQuestions, setLoadingBasicQuestions] = useState(false);
  const [newCompanyAnswers, setNewCompanyAnswers] = useState<Record<string, string>>({});
  const [savingCompany, setSavingCompany] = useState(false);

  // Search State
  const [industrySearch, setIndustrySearch] = useState('');
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  // Company & Questions State
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Generation State
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<{ title: string, businessVertical: string, pdfUrl: string, docxUrl: string, htmlUrl?: string } | null>(null);

  // Job State
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<'idle' | 'in-progress' | 'completed' | 'failed'>('idle');

  React.useEffect(() => {
    const fetchIndustries = async () => {
      setLoadingIndustries(true);
      try {
        const data = await DB.companies.getIndustryList();
        setIndustries(data.data || data.list || data || []);
      } catch (error) {
        console.error('Failed to fetch industries:', error);
      } finally {
        setLoadingIndustries(false);
      }
    };


    const checkActiveJob = async () => {
      try {
        const result = await DB.docs.getActiveJob();
        const activeJobId = result?.data?.jobId || result?.jobId;
        if (activeJobId) {
          setJobId(activeJobId);
          setJobStatus('in-progress');
          setCurrentStep(4);

          // Fetch initial progress immediately
          try {
            const progressData = await DB.docs.getJobProgress(activeJobId);
            if (progressData && progressData.progress !== undefined) {
              setJobProgress(progressData.progress);
            }
            // If it's already completed, we can handle that too
            if (progressData && progressData.status === 'completed' && progressData.result) {
              setGeneratedDoc(progressData.result);
              setJobStatus('completed');
              setJobProgress(100);
            }
          } catch (e) {
            console.warn('[SOPBuilder] Initial progress fetch failed:', e);
          }
        }
      } catch (error) {
        console.error('Failed to check active job:', error);
      }
    };

    fetchIndustries();
    checkActiveJob();
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();

    const connectSSE = async () => {
      if (jobStatus === 'in-progress' && jobId) {
        const sseUrl = DB.docs.getSSEUrl(jobId);
        console.log(`[SOPBuilder] Connecting to SSE at ${sseUrl} with headers`);

        const token = localStorage.getItem('op8_token');
        const headers: Record<string, string> = {
          'Accept': 'text/event-stream',
        };

        if (token && token !== 'undefined' && token !== 'null') {
          const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
          headers['Authorization'] = `Bearer ${cleanToken}`;
        }

        let retryCount = 0;

        while (isMounted && retryCount < 50) {
          try {
            const response = await fetch(sseUrl, {
              method: 'GET',
              headers: headers,
              signal: abortController.signal
            });

            if (!response.ok) {
              if (response.status === 404 || response.status >= 500) {
                // likely cold start or not ready yet, throw to trigger retry
                throw new Error(`HTTP error! status: ${response.status}`);
              } else {
                // unrecoverable error
                console.error(`[SOPBuilder] Fatal HTTP error: ${response.status}`);
                break;
              }
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            let streamActive = true;
            while (reader && streamActive) {
              const { done, value } = await reader.read();
              if (done) {
                streamActive = false;
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;

              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;

                let jsonString = trimmedLine;
                if (trimmedLine.startsWith('data:')) {
                  jsonString = trimmedLine.replace(/^data:\s*/, '').trim();
                }

                if (jsonString === '[DONE]') continue;

                try {
                  const data = JSON.parse(jsonString);
                  console.log(`[SOPBuilder] Stream Message for ${jobId}:`, data);

                  if (typeof data.progress === 'number') {
                    setJobProgress(data.progress);
                  } else if (typeof data.progress === 'string') {
                    const parsedProgress = parseInt(data.progress, 10);
                    if (!isNaN(parsedProgress)) setJobProgress(parsedProgress);
                  }

                  const status = (data.status || '').toLowerCase();

                  if (status === 'completed') {
                    setJobProgress(100);
                    if (data.data && data.data.list && data.data.list.length > 0) {
                      const resultData = data.data.list[0];
                      const rootURL = DB.docs.getSSEUrl('').replace(/\/api\/v1\/openai\/progress\/$/, '');
                      const formattedResult = {
                        ...resultData,
                        pdfUrl: resultData.pdfUrl ? (resultData.pdfUrl.startsWith('http') ? resultData.pdfUrl : `${rootURL}${resultData.pdfUrl}`) : '#',
                        docxUrl: resultData.docxUrl ? (resultData.docxUrl.startsWith('http') ? resultData.docxUrl : `${rootURL}${resultData.docxUrl}`) : '#',
                        htmlUrl: resultData.htmlUrl ? (resultData.htmlUrl.startsWith('http') ? resultData.htmlUrl : `${rootURL}${resultData.htmlUrl}`) : '#'
                      };
                      setGeneratedDoc(formattedResult);
                    } else if (data.result) {
                      const rootURL = DB.docs.getSSEUrl('').replace(/\/api\/v1\/openai\/progress\/$/, '');
                      const formattedResult = {
                        ...data.result,
                        pdfUrl: data.result.pdfUrl?.startsWith('http') ? data.result.pdfUrl : `${rootURL}${data.result.pdfUrl}`,
                        docxUrl: data.result.docxUrl?.startsWith('http') ? data.result.docxUrl : `${rootURL}${data.result.docxUrl}`,
                        htmlUrl: data.result.htmlUrl?.startsWith('http') ? data.result.htmlUrl : `${rootURL}${data.result.htmlUrl}`
                      };
                      setGeneratedDoc(formattedResult);
                    }
                    setJobStatus('completed');
                    streamActive = false;
                    isMounted = false; // exit retry loop
                    return;
                  } else if (status === 'failed') {
                    setJobStatus('failed');
                    streamActive = false;
                    isMounted = false; // exit retry loop
                    alert('Generation failed: ' + (data.error || 'Unknown error'));
                    return;
                  }
                } catch (e) {
                  // Ignore parse errors on partial chunks
                }
              }
            }

            // If we break out of the read loop normally, the stream ended.
            // Wait 2s and reconnect just in case it wasn't finished.
            if (isMounted) {
              await new Promise(res => setTimeout(res, 2000));
            }

          } catch (error: any) {
            if (error.name === 'AbortError') {
              break;
            }
            console.warn('[SOPBuilder] Stream read error, will retry...', error.message);
            retryCount++;
            if (isMounted) {
              await new Promise(res => setTimeout(res, 2000));
            }
          }
        }
      }
    };

    connectSSE();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [jobStatus, jobId]);

  const handleOpenAddCompany = async () => {
    setIsAddCompanyModalOpen(true);
    if (basicQuestions.length === 0) {
      setLoadingBasicQuestions(true);
      try {
        const data = await DB.companies.getBasicQuestions();
        setBasicQuestions(data.data || data.list || data || []);

        // Pre-fill industryId if selected
        if (selectedIndustryId) {
          setNewCompanyAnswers(prev => ({ ...prev, industryId: selectedIndustryId }));
        }
      } catch (error) {
        console.error('Failed to fetch basic questions:', error);
      } finally {
        setLoadingBasicQuestions(false);
      }
    } else if (selectedIndustryId && !newCompanyAnswers['industryId']) {
      setNewCompanyAnswers(prev => ({ ...prev, industryId: selectedIndustryId }));
    }
  };

  const handleSaveCompany = async () => {
    setSavingCompany(true);
    try {
      const payload: any = { ...newCompanyAnswers };
      if (!payload.documentLanguage) {
        payload.documentLanguage = "English";
      }

      if (payload.employeeCount) {
        const empStr = String(payload.employeeCount).toLowerCase();
        payload.hasRegularContractors = empStr.includes('yes') || empStr.includes('true');
      } else {
        payload.hasRegularContractors = false;
      }

      if (!payload.type) payload.type = "Private Limited";
      if (!payload.description) payload.description = payload.companyName || "N/A";

      await DB.companies.addCompany(payload);

      setIsAddCompanyModalOpen(false);
      setNewCompanyAnswers({});

      // Refresh companies and auto-select
      if (selectedIndustryId) {
        setLoadingCompanies(true);
        const data = await DB.companies.getCompanyList(selectedIndustryId);
        setCompanies(data.data || data.list || data || []);
        setLoadingCompanies(false);
        setCurrentStep(2); // Stay on company step after adding
      }
    } catch (error) {
      console.error('Failed to save company:', error);
      alert('Failed to save company. Please try again.');
    } finally {
      setSavingCompany(false);
    }
  };

  const handleIndustryClick = async (industryId: string) => {
    setSelectedIndustryId(industryId);
    setSelectedCompanyId(null);
    setCompanies([]);
    setQuestions([]);
    setLoadingCompanies(true);
    try {
      const data = await DB.companies.getCompanyList(industryId);
      setCompanies(data.data || data.list || data || []);
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleCompanyClick = async (companyId: string) => {
    setSelectedCompanyId(companyId);
    setLoadingQuestions(true);
    setAnswers({}); // Reset answers when company changes
    setJobId(null);
    setJobStatus('idle');
    setJobProgress(0);
    setGeneratedDoc(null);
    try {
      const data = await DB.companies.getQuestions(companyId);
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data && Array.isArray(data.list)) list = data.list;
      else if (data && data.data && Array.isArray(data.data.list)) list = data.data.list;
      else if (data && Array.isArray(data.data)) list = data.data;
      setQuestions(list);
      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitAnswers = async () => {
    // Check if all questions have been answered
    const unansweredQuestions = questions.filter(q => !answers[q._id] || answers[q._id].trim() === '');

    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions before generating. (${unansweredQuestions.length} remaining)`);
      return;
    }

    const payload = Object.entries(answers).map(([id, answer]) => {
      const q = questions.find(question => question._id === id);
      return {
        type: q?.type || 'BASIC',
        questionId: id,
        answer: answer
      };
    });

    setJobStatus('in-progress');
    setJobProgress(0);
    try {
      const result = await DB.docs.generateDocumentWithAnswers(payload);
      console.log('[SOPBuilder] Initial Answer Submission Result:', result);

      const status = (result.status || result.data?.status || '').toLowerCase();
      const jobId = result.jobId || result.id || result._id || result.data?.jobId || result.data?._id || result.data?.id;

      if (status === 'completed' || result.data?.list?.length > 0 || result.result) {
        // The document was generated instantly (e.g. cached or fast generation)
        setJobProgress(100);

        if (result.data && result.data.list && result.data.list.length > 0) {
          const resultData = result.data.list[0];
          const rootURL = DB.docs.getSSEUrl('').replace(/\/api\/v1\/openai\/progress\/$/, '');
          const formattedResult = {
            ...resultData,
            pdfUrl: resultData.pdfUrl ? (resultData.pdfUrl.startsWith('http') ? resultData.pdfUrl : `${rootURL}${resultData.pdfUrl}`) : '#',
            docxUrl: resultData.docxUrl ? (resultData.docxUrl.startsWith('http') ? resultData.docxUrl : `${rootURL}${resultData.docxUrl}`) : '#',
            htmlUrl: resultData.htmlUrl ? (resultData.htmlUrl.startsWith('http') ? resultData.htmlUrl : `${rootURL}${resultData.htmlUrl}`) : '#'
          };
          setGeneratedDoc(formattedResult);
        } else if (result.result) {
          const rootURL = DB.docs.getSSEUrl('').replace(/\/api\/v1\/openai\/progress\/$/, '');
          const formattedResult = {
            ...result.result,
            pdfUrl: result.result.pdfUrl?.startsWith('http') ? result.result.pdfUrl : `${rootURL}${result.result.pdfUrl}`,
            docxUrl: result.result.docxUrl?.startsWith('http') ? result.result.docxUrl : `${rootURL}${result.result.docxUrl}`,
            htmlUrl: result.result.htmlUrl?.startsWith('http') ? result.result.htmlUrl : `${rootURL}${result.result.htmlUrl}`
          };
          setGeneratedDoc(formattedResult);
        } else if (result.pdfUrl || result.docxUrl) {
          // Direct payload format
          const rootURL = DB.docs.getSSEUrl('').replace(/\/api\/v1\/openai\/progress\/$/, '');
          const formattedResult = {
            title: result.title || 'Custom SOP Document',
            businessVertical: result.businessVertical || 'Procedure',
            pdfUrl: result.pdfUrl?.startsWith('http') ? result.pdfUrl : `${rootURL}${result.pdfUrl}`,
            docxUrl: result.docxUrl?.startsWith('http') ? result.docxUrl : `${rootURL}${result.docxUrl}`,
            htmlUrl: result.htmlUrl?.startsWith('http') ? result.htmlUrl : `${rootURL}${result.htmlUrl}`
          };
          setGeneratedDoc(formattedResult);
        }
        setJobStatus('completed');
      } else if (jobId) {
        // Safe fallback for differently keyed job IDs
        setJobId(jobId);
      } else {
        throw new Error('No Job ID received from API: ' + JSON.stringify(result));
      }
    } catch (error) {
      console.error('Failed to submit answers:', error);
      setJobStatus('failed');
      alert('Failed to start document generation.');
    }
  };

  const steps = [
    { title: 'Industry', icon: '🏢' },
    { title: 'Company', icon: '🏗️' },
    { title: 'Questions', icon: '❓' },
    { title: 'Generate', icon: '✨' }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-2">
        <div className="text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-indigo-600 rounded-lg text-white">✨</span>
            <span className="uppercase italic">SOP Builder</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider mt-1 opacity-60">Enterprise AI Generator</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1 sm:gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${currentStep === idx + 1 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : idx + 1 < currentStep ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-white border-slate-100 text-slate-400 opacity-50'}`}
                onClick={() => {
                  if (idx + 1 < currentStep && jobStatus === 'idle') {
                    setCurrentStep(idx + 1);
                  }
                }}
                style={{ cursor: idx + 1 < currentStep && jobStatus === 'idle' ? 'pointer' : 'default' }}
              >
                <span className="text-xs font-black">{idx + 1}</span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-tighter hidden sm:inline">{step.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-4 sm:w-8 h-[2px] rounded-full ${idx + 1 < currentStep ? 'bg-indigo-400' : 'bg-slate-100'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Industry Selection */}
      {currentStep === 1 && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-indigo-50/20">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">1</span>
                What industry is your business in?
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-2 ml-14">This helps us tailor the specific operational questions to your sector.</p>
            </div>

            {loadingIndustries ? (
              <div className="flex justify-center p-8 sm:p-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                  className="w-full sm:max-w-md px-4 py-3 bg-white border-2 border-slate-200 rounded-xl flex justify-between items-center text-slate-700 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <div className="flex flex-col items-start truncate mr-4">
                    <span className="truncate w-full text-left">
                      {selectedIndustryId
                        ? (industries.find(i => i._id === selectedIndustryId)?.name || industries.find(i => i._id === selectedIndustryId)?.companyName || 'Unknown Industry')
                        : 'Search and Select an Industry...'}
                    </span>
                    {selectedIndustryId && (
                      <span className="text-[10px] text-slate-400 font-medium truncate w-full text-left mt-0.5">
                        {industries.find(i => i._id === selectedIndustryId)?.description || industries.find(i => i._id === selectedIndustryId)?.type}
                      </span>
                    )}
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${isIndustryDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isIndustryDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsIndustryDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full sm:max-w-md mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in fade-in duration-100">
                      <div className="p-2 border-b border-slate-100 bg-slate-50 relative">
                        <svg className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                          type="text"
                          value={industrySearch}
                          onChange={(e) => setIndustrySearch(e.target.value)}
                          placeholder="Search industries..."
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {industries.filter(ind => {
                          const label = (ind.name || ind.companyName || '').toLowerCase();
                          return label.includes(industrySearch.toLowerCase());
                        }).length === 0 ? (
                          <div className="p-6 text-center text-slate-500 text-sm font-bold bg-slate-50/50">No industries found</div>
                        ) : (
                          industries.filter(ind => {
                            const label = (ind.name || ind.companyName || '').toLowerCase();
                            return label.includes(industrySearch.toLowerCase());
                          }).map(industry => (
                            <button
                              key={industry._id}
                              onClick={() => {
                                handleIndustryClick(industry._id);
                                setIsIndustryDropdownOpen(false);
                                setIndustrySearch('');
                              }}
                              className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-slate-50 last:border-0 ${selectedIndustryId === industry._id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl opacity-80 group-hover:opacity-100">🏢</span>
                                <div className="flex flex-col overflow-hidden">
                                  <span className="truncate">{industry.name || industry.companyName}</span>
                                  <span className="text-[10px] text-slate-400 truncate mt-0.5">{industry.description || industry.type}</span>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 2: Company Selection */}
      {currentStep === 2 && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-indigo-50/20">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                  <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">2</span>
                  Select or create a company
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-2 ml-14">Choose your entity to load specific business parameters.</p>
              </div>
              <button
                onClick={handleOpenAddCompany}
                className="ml-14 sm:ml-0 px-6 py-3 bg-indigo-600 text-white text-xs font-black uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                Add Company
              </button>
            </div>

            {loadingCompanies ? (
              <div className="flex justify-center p-12 ml-14">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                  className="w-full sm:max-w-md px-4 py-3 bg-white border-2 border-slate-200 rounded-xl flex justify-between items-center text-slate-700 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <div className="flex flex-col items-start truncate mr-4">
                    <span className="truncate w-full text-left">
                      {selectedCompanyId
                        ? companies.find(c => c._id === selectedCompanyId)?.companyName || 'Unknown Company'
                        : 'Search and Select a Company...'}
                    </span>
                    {selectedCompanyId && (
                      <span className="text-[10px] text-slate-400 font-medium truncate w-full text-left mt-0.5">
                        {companies.find(c => c._id === selectedCompanyId)?.type}
                      </span>
                    )}
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isCompanyDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCompanyDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full sm:max-w-md mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in fade-in duration-100">
                      <div className="p-2 border-b border-slate-100 bg-slate-50 relative">
                        <svg className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                          type="text"
                          value={companySearch}
                          onChange={(e) => setCompanySearch(e.target.value)}
                          placeholder="Search companies..."
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {companies.filter(comp => {
                          const label = (comp.companyName || '').toLowerCase();
                          return label.includes(companySearch.toLowerCase());
                        }).length === 0 ? (
                          <div className="p-6 text-center text-slate-500 text-sm font-bold bg-slate-50/50">No companies found</div>
                        ) : (
                          companies.filter(comp => {
                            const label = (comp.companyName || '').toLowerCase();
                            return label.includes(companySearch.toLowerCase());
                          }).map(company => (
                            <button
                              key={company._id}
                              onClick={() => {
                                handleCompanyClick(company._id);
                                setIsCompanyDropdownOpen(false);
                                setCompanySearch('');
                              }}
                              className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-slate-50 last:border-0 ${selectedCompanyId === company._id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl opacity-80 group-hover:opacity-100">🏢</span>
                                <div className="flex flex-col overflow-hidden">
                                  <span className="truncate">{company.companyName}</span>
                                  <span className="text-[10px] text-slate-400 truncate mt-0.5">{company.type}</span>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 text-slate-400 font-black uppercase text-xs hover:text-slate-600 transition-colors"
              >
                Back to Industry
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Questions */}
      {currentStep === 3 && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-indigo-50/20">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">3</span>
                Assessment Questions
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-2 ml-14">Please answer the following to help our AI understand your specific operations.</p>
            </div>

            {loadingQuestions ? (
              <div className="flex justify-center p-12 ml-14">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {questions.length > 0 ? (
                    questions.map((q) => (
                      <div key={q._id} className="p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all group ring-1 ring-slate-100">
                        <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <span className="text-xs font-black">Q</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-xs sm:text-sm leading-snug">
                              {q.question} <span className="text-red-500">*</span>
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">{q.description || 'General Business Question'}</p>
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            value={answers[q._id] || ''}
                            onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                            required
                            placeholder="Provide details for this process... (Required)"
                            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border rounded-lg sm:rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none transition-all resize-none h-20 sm:h-24 ${!answers[q._id] || answers[q._id].trim() === '' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 focus:border-indigo-500 focus:bg-white'}`}
                          />
                          <div className="absolute right-3 bottom-3 opacity-20 pointer-events-none text-slate-900">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-8 sm:p-12 bg-slate-50 rounded-2xl sm:rounded-3xl text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs sm:text-sm">No questions found for this company</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 text-slate-400 font-black uppercase text-xs hover:text-slate-600 transition-colors"
                  >
                    Back to Company
                  </button>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 font-mono">Progress: {questions.length > 0 ? Math.round((Object.keys(answers).filter(k => answers[k]?.trim()).length / questions.length) * 100) : 0}% Complete</p>
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${questions.length > 0 ? (Object.keys(answers).filter(k => answers[k]?.trim()).length / questions.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentStep(4)}
                      disabled={questions.length === 0 || questions.some(q => !answers[q._id] || answers[q._id].trim() === '')}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-tight hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Proceed to Generation
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Step 4: Generation */}
      {currentStep === 4 && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-indigo-50/20">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">4</span>
                {jobStatus === 'completed' && generatedDoc ? 'SOP Documentation Ready' : 'Document Synthesis'}
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-2 ml-14">
                {jobStatus === 'completed' && generatedDoc
                  ? "Your enterprise documentation has been finalized and is ready for download."
                  : "We're synthesizing your operational inputs into a professional SOP blueprint."}
              </p>
            </div>

            {(jobStatus === 'in-progress' || (jobStatus === 'completed' && !generatedDoc)) ? (
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">
                    {jobStatus === 'completed' ? 'Finalizing Document...' : 'Generating Document...'}
                  </span>
                  <span className="text-sm font-black text-indigo-900">{jobProgress}%</span>
                </div>
                <div className="w-full h-4 bg-white rounded-full overflow-hidden border border-indigo-100 p-1 shadow-sm">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${Math.max(5, jobProgress)}%` }}
                  ></div>
                </div>
              </div>
            ) : jobStatus === 'completed' && generatedDoc ? (
              <div className="w-full max-w-2xl animate-fade-in">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-indigo-100 shadow-xl ring-1 ring-indigo-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="min-w-0">
                      <h4 className="font-black text-lg sm:text-xl md:text-2xl mb-1 text-slate-900">{generatedDoc.title}</h4>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest">{generatedDoc.businessVertical}</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest shrink-0">Completed</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <a href={generatedDoc.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-3 sm:py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl sm:rounded-2xl font-black text-sm hover:bg-red-100 transition-all shadow-sm active:scale-95">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      Download PDF
                    </a>
                    <a href={generatedDoc.docxUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-3 sm:py-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl sm:rounded-2xl font-black text-sm hover:bg-blue-100 transition-all shadow-sm active:scale-95">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Download DOCX
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSubmitAnswers}
                disabled={questions.length === 0 || questions.some(q => !answers[q._id] || answers[q._id].trim() === '')}
                className="px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-indigo-600 text-white rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] font-black text-sm sm:text-base md:text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-2 sm:gap-3"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Generate Document Now
              </button>
            )}

            {jobStatus === 'idle' && (
              <div className="mt-8 pt-6 border-t border-slate-50">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 text-slate-400 font-black uppercase text-xs hover:text-slate-600 transition-colors"
                >
                  Back to Questions
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Departments Section */}
      {/* <section className="space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">{selectedCompanyId ? '3' : '2'}</div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Departments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Finance', icon: '💰', sub: 'Audit-ready finance SOPs' },
            { name: 'Marketing', icon: '📣', sub: 'Campaign & marketing workflows' },
            { name: 'HR & People', icon: '👥', sub: 'HR policy & onboarding SOPs' },
            { name: 'Operations', icon: '⚙️', sub: 'Internal operations documentation' },
            { name: 'Sales', icon: '📈', sub: 'CRM & sales process SOPs' },
            { name: 'Support', icon: '🎧', sub: 'Customer success procedures' }
          ].map(dept => (
            <div
              key={dept.name}
              onClick={() => setSelectedDepts(prev => prev.includes(dept.name) ? prev.filter(d => d !== dept.name) : [...prev, dept.name])}
              className={`p-8 border-2 rounded-[2.5rem] cursor-pointer transition-all flex flex-col items-center text-center group ${selectedDepts.includes(dept.name) ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{dept.icon}</div>
              <h3 className="font-black text-xl text-slate-900 mb-2">{dept.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dept.sub}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* <div className="flex justify-center pt-6">
        <button
          onClick={handleContinue}
          disabled={selectedDepts.length === 0 || loading}
          className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Initialize AI SOP Generator'}
        </button>
      </div> */}


      {/* AI SOP Generation Section */}
      {/* <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden mt-12">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/10 mx-auto">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="font-black text-3xl mb-4 tracking-tight uppercase">Instant SOP Generator</h3>

          {!generatedDoc ? (
            <>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">Need a specific SOP right now? Describe your process and our AI will generate the documentation instantly.</p>
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Employee Expense Reimbursement Process..."
                  className="flex-1 px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-base font-medium"
                />
                <button
                  onClick={() => (user.isPaid || user.isPro) ? handleGenerate() : window.location.href = '/billing'}
                  disabled={isGenerating || ((user.isPaid || user.isPro) && !question.trim())}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-base hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      {!(user.isPaid || user.isPro) && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                      {!(user.isPaid || user.isPro) ? 'Upgrade to Generate' : 'Generate SOP'}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 animate-fade-in max-w-2xl mx-auto text-left">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-2xl mb-2 text-white">{generatedDoc.title}</h4>
                  <p className="text-sm text-slate-400 uppercase tracking-wider">{generatedDoc.businessVertical}</p>
                </div>
                <button onClick={() => setGeneratedDoc(null)} className="text-sm text-indigo-400 hover:text-indigo-300 font-bold">New Search</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href={generatedDoc.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  Download PDF
                </a>
                <a href={generatedDoc.docxUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-4 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl font-bold hover:bg-blue-500/20 transition-all">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download DOCX
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute -left-16 -top-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]"></div>
      </div> */}

      {/* Add Company Modal */}
      {isAddCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">Add New Company</h2>
              <button
                onClick={() => setIsAddCompanyModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {loadingBasicQuestions ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {basicQuestions.filter(q => q.key !== 'documentLanguage').map(q => (
                    <div key={q._id} className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">{q.question}</label>
                      {q.key === 'industryId' ? (
                        <select
                          value={newCompanyAnswers[q.key] || selectedIndustryId || ''}
                          onChange={(e) => setNewCompanyAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                        >
                          <option value="" disabled>Select an industry</option>
                          {industries.map(ind => (
                            <option key={ind._id} value={ind._id}>{ind.name || ind.companyName}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={newCompanyAnswers[q.key] || ''}
                          onChange={(e) => setNewCompanyAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                          placeholder={`Enter ${q.key}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl sm:rounded-b-3xl flex justify-end gap-3">
              <button
                onClick={() => setIsAddCompanyModalOpen(false)}
                className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={savingCompany}
                onClick={handleSaveCompany}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {savingCompany ? 'Saving...' : 'Save Company'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default SOPBuilderView;
