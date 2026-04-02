import React, { useState, useEffect, useRef } from "react";
import { DB } from "../services/db";
import {
  User,
  HelpArticle,
  ChatSession,
  ChatMessage,
  GlobalConfig,
} from "../types";

export const SupportView: React.FC<{ user: User }> = ({ user }) => {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [session, setSession] = useState<ChatSession | null>(null);
  const [config, setConfig] = useState<GlobalConfig>({
    supportEmail: "support@opor8.ai",
    welcomeMessage: "Welcome",
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const arts = await DB.articles.getAll();
        setArticles(arts);
        const sess = await DB.chats.getOrCreate(user.id, user.name);
        setSession(sess);
        const cfg = await DB.config.get();
        setConfig(cfg);
      } catch (error) {
        console.error("Error loading support data:", error);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [session, isChatOpen]);

  useEffect(() => {
    if (!isChatOpen) return;
    const interval = setInterval(async () => {
      try {
        const sess = await DB.chats.getOrCreate(user.id, user.name);
        setSession(sess);
      } catch (error) {
        console.error("Error refreshing chat:", error);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [user, isChatOpen]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !session) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: user.id,
      senderName: user.name,
      text: chatMessage,
      timestamp: new Date().toISOString(),
      isAdmin: false,
    };
    try {
      await DB.chats.sendMessage(session.id, msg);
      setChatMessage("");
      const sess = await DB.chats.getOrCreate(user.id, user.name);
      setSession(sess);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const categories = ["All", ...new Set(articles.map((a) => a.category))];
  const filteredArticles = articles.filter(
    (a) =>
      search === "" || a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-auto mx-auto space-y-8 sm:space-y-10 lg:space-y-12 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2 sm:mb-3">
            Support Center
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 font-medium">
            Search our documentation or open an encrypted live channel.
          </p>
        </div>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none bg-white font-bold shadow-sm placeholder:text-slate-300 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 lg:gap-4">
        {/* Sidebar Categories */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-4">
            Resources
          </h3>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 custom-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                className={`flex-shrink-0 lg:flex-shrink-1 text-left px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm ${search === c || (!search && c === "All") ? "bg-indigo-600 text-white shadow-lg" : "bg-white lg:bg-transparent text-slate-600 hover:bg-white hover:shadow-sm hover:text-indigo-600"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-6 sm:mt-10 p-6 sm:p-8 bg-slate-900 rounded-2xl sm:rounded-[2.5rem] text-white shadow-2xl shadow-slate-200">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 mb-3">
              Enterprise Bridge
            </p>
            <p className="text-xs sm:text-sm md:text-xl font-bold mb-4 sm:mb-6 leading-relaxed">
              Direct intervention needed? Reach our mission control team.
            </p>
            {user.isPaid || user.isPro ? (
              <div className="space-y-2">
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Official Support Email
                </p>
                <a
                  href={`mailto:${config.supportEmail}`}
                  className="text-base sm:text-lg font-black text-white hover:text-indigo-400 transition-colors block underline-offset-4 underline decoration-indigo-500/50 break-all"
                >
                  {config.supportEmail}
                </a>
              </div>
            ) : (
              <button
                onClick={() => (window.location.href = "/billing")}
                className="
    w-full 
    py-3 sm:py-4 
    md:px-5
    flex sm:flex-row items-center justify-center gap-2 
    bg-indigo-600 text-white 
    rounded-lg sm:rounded-xl 
    font-bold text-xs sm:text-xs 
    uppercase tracking-wide sm:tracking-widest 
    hover:bg-indigo-500 
    transition-all duration-200
  "
              >
                <svg
                  className="w-4 h-4 sm:w-8 sm:h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>

                <span className="text-center leading-tight">
                  Unlock Priority Support
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Article Area */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-slate-100 shadow-xl animate-fadeIn">
              <button
                onClick={() => setSelectedArticle(null)}
                className="mb-8 text-xs font-black uppercase tracking-widest text-indigo-600 hover:translate-x-[-4px] transition-transform flex items-center gap-2 group"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Knowledge Base
              </button>
              <div className="mb-6 sm:mb-10">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4 inline-block">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                {selectedArticle.content}
              </div>
              <div className="mt-16 pt-8 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Doc Verifed • v2.1
                </span>
                <span>Last Sync: {selectedArticle.lastUpdated}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedArticle(a)}
                  className="p-6 sm:p-8 md:p-10 bg-white rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left group flex flex-col justify-between min-h-[220px] sm:min-h-[240px] md:h-[280px]"
                >
                  <div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.25em] mb-2">
                      {a.category}
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                      {a.title}
                    </h3>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase text-slate-300 tracking-widest group-hover:text-indigo-400 transition-colors">
                    Explore Module
                    <svg
                      className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </button>
              ))}
              {articles.length === 0 && (
                <div className="col-span-full py-20 sm:py-32 md:py-40 bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-2xl sm:rounded-[3rem] lg:rounded-[4rem] text-center flex flex-col items-center justify-center">
                  <div className="text-5xl sm:text-7xl mb-6 sm:mb-8 opacity-20">
                    📚
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs sm:text-sm">
                    Knowledge Base Synchronizing...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Widget (Tawk.to Style) */}
      {(user.isPaid || user.isPro) && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isChatOpen ? "w-[calc(100vw-32px)] sm:w-[420px] h-[500px] sm:h-[640px]" : "w-16 h-16 sm:w-20 sm:h-20"}`}
        >
          {!isChatOpen ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full h-full bg-indigo-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white shadow-[0_32px_64px_rgba(79,70,229,0.3)] hover:scale-110 transition-transform animate-bounce-in relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg
                className="w-7 h-7 sm:w-9 sm:h-9 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="absolute top-1 sm:top-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse shadow-sm"></span>
            </button>
          ) : (
            <div className="w-full h-full bg-white rounded-2xl sm:rounded-[3.5rem] shadow-[0_48px_128px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden flex flex-col animate-fadeIn relative">
              <div className="p-5 sm:p-8 bg-slate-900 text-white flex justify-between items-center shrink-0 shadow-xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-lg sm:text-xl shadow-lg">
                    O
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-black tracking-tight leading-none mb-1">
                      Live Help
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Admin Uplink Stable
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 space-y-6 custom-scrollbar">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm text-xs font-bold text-slate-500 border border-slate-100 italic leading-relaxed">
                  {config.welcomeMessage}
                </div>
                {session?.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.isAdmin ? "justify-start" : "justify-end"} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[85%] p-4 sm:p-5 rounded-2xl sm:rounded-[2.5rem] shadow-md text-xs sm:text-sm font-bold leading-relaxed ${
                        m.isAdmin
                          ? "bg-white text-slate-900 border border-slate-200"
                          : "bg-indigo-600 text-white shadow-indigo-100"
                      }`}
                    >
                      {m.text}
                      <p
                        className={`text-[8px] mt-2 uppercase tracking-[0.2em] font-black ${m.isAdmin ? "text-slate-300" : "text-indigo-200"}`}
                      >
                        {m.isAdmin ? "Official Dispatch" : "Message Sent"} •{" "}
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 bg-white">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="w-full px-5 py-3.5 sm:px-8 sm:py-5 pr-14 sm:pr-20 rounded-xl sm:rounded-[2rem] bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white outline-none font-bold text-xs sm:text-sm transition-all shadow-inner"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="absolute right-1.5 top-1.5 sm:right-2.5 sm:top-2.5 w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-lg sm:rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:shadow-none active:scale-90"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-center text-[8px] sm:text-[9px] font-black uppercase text-slate-300 tracking-widest mt-3 sm:mt-4">
                  Secured by OPOR8 Encryption
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportView;
