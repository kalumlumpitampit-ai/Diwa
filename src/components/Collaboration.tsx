import React, { useState, useEffect, useRef } from 'react';
import { db, handleFirestoreError } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Send, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
}

export const Collaboration: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'), 
      where('channel', '==', 'academy'),
      orderBy('timestamp', 'asc'), 
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
    }, (err) => handleFirestoreError(err, 'list', 'messages'));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        text: newMessage,
        channel: 'academy',
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (err) {
      handleFirestoreError(err, 'create', 'messages');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-200px)] pb-12 md:pb-0 px-4 md:px-0">
      <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 italic">Academy Chat</h2>
          <p className="text-slate-500 text-[10px] md:text-sm italic">Discuss literature and share insights in real-time.</p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 text-[10px] flex items-center justify-center font-bold text-slate-400">
              <UserIcon size={14} />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-50 text-[10px] flex items-center justify-center font-bold text-brand-600">+12</div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-center space-x-2 mb-2 px-1">
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                    <span className="text-[9px] md:text-[10px] text-slate-300 italic">
                      {msg.timestamp?.seconds ? format(new Date(msg.timestamp.seconds * 1000), 'HH:mm') : '...'}
                    </span>
                  </div>
                  <div className={`px-4 py-2 md:px-5 md:py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-brand-900 text-white rounded-tr-none' 
                      : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100 italic'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex space-x-2 md:space-x-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Contribute..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 md:px-5 md:py-3 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="bg-brand-900 text-white p-3 md:p-4 rounded-xl hover:bg-slate-900 transition-all shadow-md active:scale-95 shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
