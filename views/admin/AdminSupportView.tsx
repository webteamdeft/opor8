
import React, { useState, useEffect } from 'react';
import { DB } from '../../services/db';
import { SupportTicket, ChatSession, ChatMessage, GlobalConfig } from '../../types';

export const AdminSupportView: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [mode, setMode] = useState<'tickets' | 'live'>('live');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [reply, setReply] = useState('');
  const [config, setConfig] = useState<GlobalConfig>({ supportEmail: 'support@opor8.ai', welcomeMessage: 'Welcome' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ticketsData, chatsData, configData] = await Promise.all([
          DB.tickets.getAll(),
          DB.chats.getAll(),
          DB.config.get()
        ]);
        setTickets(ticketsData);
        setChats(chatsData);
        setConfig(configData);
        if (ticketsData.length > 0) setSelectedTicket(ticketsData[0]);
      } catch (error) {
        console.error('Error loading support data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const chatsData = await DB.chats.getAll();
        setChats(chatsData);
        if (selectedChat) {
          const fresh = chatsData.find(c => c.id === selectedChat.id);
          if (fresh) setSelectedChat(fresh);
        }
      } catch (error) {
        console.error('Error refreshing chats:', error);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  const handleSendChatReply = () => {
    if (!reply || !selectedChat) return;
    const msg: ChatMessage = {
      id: 'msg_admin_' + Date.now(),
      senderId: 'admin_001',
      senderName: 'Platform Admin',
      text: reply,
      timestamp: new Date().toISOString(),
      isAdmin: true
    };
    DB.chats.sendMessage(selectedChat.id, msg);
    setReply('');
  };

  const updateConfig = async (key: keyof GlobalConfig, val: string) => {
    try {
      await DB.config.update({ [key]: val });
      const newConfig = await DB.config.get();
      setConfig(newConfig);
    } catch (e) {
      console.error('Failed to update config', e);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 font-sans animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support Command</h1>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setMode('live')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'live' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border text-slate-400'}`}
            >
              Live Dispatch {chats.filter(c => c.status === 'active').length}
            </button>
            <button
              onClick={() => setMode('tickets')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'tickets' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border text-slate-400'}`}
            >
              Resolved Index
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 w-full max-w-sm">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Global Support Node</label>
            <input
              type="text"
              value={config.supportEmail}
              onChange={(e) => updateConfig('supportEmail', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs font-bold focus:border-indigo-600 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        {/* List */}
        <div className="w-full md:w-96 border-r border-slate-100 bg-slate-50/30 overflow-y-auto custom-scrollbar shrink-0">
          <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-10">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{mode === 'live' ? 'Live Channels' : 'System Tickets'}</p>
          </div>

          {mode === 'live' ? (
            chats.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedChat(c)}
                className={`w-full text-left p-8 border-b border-slate-100 transition-all relative ${selectedChat?.id === c.id ? 'bg-white shadow-inner' : 'hover:bg-white'}`}
              >
                {selectedChat?.id === c.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-black text-slate-900">{c.userName}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold truncate">Last Active: {new Date(c.lastActivity).toLocaleTimeString()}</p>
              </button>
            ))
          ) : (
            tickets.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`w-full text-left p-8 border-b border-slate-100 transition-all relative ${selectedTicket?.id === t.id ? 'bg-white shadow-inner' : 'hover:bg-white'}`}
              >
                {selectedTicket?.id === t.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-black text-slate-900">{t.category}</span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase">{t.status}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold truncate">{t.userName}</p>
              </button>
            ))
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-12 bg-white flex flex-col min-w-0">
          {mode === 'live' && selectedChat ? (
            <div className="flex flex-col h-full animate-fadeIn">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Channel: {selectedChat.userName}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Procedural Sync</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">Live Uplink</div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-8 custom-scrollbar">
                {selectedChat.messages.map(m => (
                  <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-6 rounded-[2rem] shadow-sm text-sm font-bold ${m.isAdmin ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 border border-slate-100'
                      }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="relative">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendChatReply())}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-600 font-bold text-sm min-h-[120px] transition-all"
                    placeholder="Transmit response to client node..."
                  ></textarea>
                  <button
                    onClick={handleSendChatReply}
                    disabled={!reply}
                    className="absolute right-4 bottom-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl disabled:opacity-50"
                  >
                    Transmit Response
                  </button>
                </div>
              </div>
            </div>
          ) : mode === 'tickets' && selectedTicket ? (
            <div className="space-y-12 animate-fadeIn">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedTicket.category}</h3>
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-slate-700 leading-relaxed font-medium italic">
                "{selectedTicket.description}"
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Client: {selectedTicket.userName} • Resolved via Archive Process</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
              <div className="text-8xl mb-8">🛰️</div>
              <h3 className="text-2xl font-black">Select active channel</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupportView;
