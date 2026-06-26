/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Trash2, Shield, HeartHandshake, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ChatMessage, UserProfile, Language } from '../types';

interface AIConsultantProps {
  language: Language;
  userProfile: UserProfile | null;
}

export default function AIConsultant({ language, userProfile }: AIConsultantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const text = {
    en: {
      header: 'AI Medical Consultant',
      subHeader: 'Preliminary Symptom Screening & Clinical Triage',
      welcome: 'Hello, I am your mydoctor AI Medical Consultant. Describe your symptoms in detail (e.g. chest pressure, fever, joint fatigue), and I will triage symptom severity, reference clinical guidelines, and direct you to the optimal clinical specialist.',
      placeholder: 'Type your symptoms or health queries here...',
      send: 'Send',
      clear: 'Clear Consultation',
      sourceDisclaimer: 'Powered by medical knowledge models. Citing WHO, Mayo Clinic, and Ministry of Public Health reference guidelines.',
      triageLabel: 'Triage Severity Evaluation:',
      departmentLabel: 'Clinical Routing Suggestion:',
      patientContext: 'Screening patient:',
      errorApi: 'Clinical network offline. Initializing local diagnostic rules.',
    },
    th: {
      header: 'แพทย์อัจฉริยะวิเคราะห์อาการ (AI)',
      subHeader: 'ประเมินความรุนแรง คัดกรองอาการเบื้องต้น และนำทางแผนก',
      welcome: 'สวัสดีครับ ผมคือระบบแพทย์ปัญญาประดิษฐ์ของเครือโรงพยาบาล mydoctor โปรดระบุอาการเจ็บป่วยหรือความต้องการทางการแพทย์ของคุณ (เช่น แน่นหน้าอก เจ็บท้อง ตัวร้อน) เพื่อให้ผมช่วยคัดกรองความรุนแรง ประเมินทิศทาง และแนะนำแผนกแพทย์ผู้เชี่ยวชาญเฉพาะทางที่เหมาะสมครับ',
      placeholder: 'ระบุอาการของคุณที่นี่ เช่น เจ็บหน้าอกร้าวไปที่ไหล่ หรือ ไข้สูงมาสามวัน...',
      send: 'ส่งข้อมูล',
      clear: 'ล้างประวัติการปรึกษา',
      sourceDisclaimer: 'ประมวลผลด้วยโมเดลทางการแพทย์ อ้างอิงแนวทางขององค์การอนามัยโลก (WHO) และกระทรวงสาธารณสุข',
      triageLabel: 'ระดับการคัดกรองความรุนแรง:',
      departmentLabel: 'แผนกที่แนะนำให้เข้าจองคิว:',
      patientContext: 'วิเคราะห์อาการสำหรับผู้ป่วย:',
      errorApi: 'การเชื่อมต่อศูนย์คัดกรองขัดข้อง กำลังใช้เกณฑ์วินิจฉัยภายในสำรอง',
    }
  }[language];

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          senderId: 'ai',
          senderName: language === 'th' ? 'แพทย์ AI อัจฉริยะ' : 'mydoctor AI Consultant',
          role: 'assistant',
          text: text.welcome,
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    }
  }, [language, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      senderId: userProfile?.id || 'visitor',
      senderName: userProfile?.fullName || (language === 'th' ? 'ผู้มาติดต่อ' : 'Visitor'),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userProfile: userProfile || {},
          language,
        }),
      });

      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        senderId: 'ai',
        senderName: language === 'th' ? 'แพทย์ AI อัจฉริยะ' : 'mydoctor AI Consultant',
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Offline fallback
      const fallbackText = language === 'th' 
        ? `### ผลการคัดกรองขัดข้องชั่วคราว\n* ขออภัยครับ ระบบเซิร์ฟเวอร์ Gemini กำลังทำงานหนัก โปรดตรวจสอบอาการเจ็บแน่นหน้าอก หรือไข้สูงฉุกเฉิน และกดยืนยันเบอร์โทรฉุกเฉิน 1669 ทันทีหากอาการวิกฤต`
        : `### Clinical Service Exception\n* The connection to the Gemini screening network timed out. If you have severe symptoms, please immediately trigger the 1669 emergency call.`;
      
      const aiMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        senderId: 'ai',
        senderName: language === 'th' ? 'แพทย์ AI อัจฉริยะ' : 'mydoctor AI Consultant',
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        senderId: 'ai',
        senderName: language === 'th' ? 'แพทย์ AI อัจฉริยะ' : 'mydoctor AI Consultant',
        role: 'assistant',
        text: text.welcome,
        timestamp: new Date().toLocaleTimeString(),
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl" id="ai_consultant_card">
      {/* Consultant Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-950 to-teal-950 border-b border-slate-800 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-2xl animate-pulse">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-teal-100">{text.header}</h3>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">{text.subHeader}</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          title={text.clear}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {userProfile && (
          <div className="p-2.5 bg-slate-800/40 border border-slate-800 rounded-xl text-[10px] text-slate-400 flex items-center justify-between">
            <span className="font-mono">
              {text.patientContext} <b className="text-teal-400">{userProfile.fullName}</b> ({userProfile.id})
            </span>
            <span className="bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90">
              {userProfile.role}
            </span>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isAi = m.role === 'assistant';
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-800/50 text-teal-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isAi
                      ? 'bg-slate-800/50 text-slate-200 border border-slate-800 prose prose-invert prose-xs'
                      : 'bg-teal-600 text-white rounded-tr-none font-medium'
                  }`}
                >
                  <div className="flex justify-between items-center gap-4 mb-1.5 opacity-60 text-[9px] font-mono">
                    <span className="font-bold">{m.senderName}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  {/* Formatting helper for AI's markdown format */}
                  {isAi ? (
                    <div className="space-y-2 whitespace-pre-wrap">
                      {m.text.split('\n').map((line, idx) => {
                        if (line.startsWith('###')) {
                          return <h4 key={idx} className="text-sm font-bold text-teal-400 font-serif border-b border-slate-800/60 pb-1 mt-3 mb-1">{line.replace('###', '')}</h4>;
                        }
                        if (line.startsWith('* **ระดับความรุนแรง:**') || line.startsWith('* **Severity Level:**')) {
                          const isSevere = line.includes('รุนแรงมาก') || line.includes('SEVERE');
                          const isMod = line.includes('ปานกลาง') || line.includes('MODERATE');
                          return (
                            <p key={idx} className={`font-semibold p-1.5 rounded-lg flex items-center gap-1.5 ${isSevere ? 'bg-red-500/10 text-red-400 border border-red-500/20' : isMod ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                              {line.replace('*', '')}
                            </p>
                          );
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={idx} className="font-bold text-slate-100">{line.replaceAll('**', '')}</p>;
                        }
                        if (line.startsWith('-') || line.startsWith('*')) {
                          return <li key={idx} className="ml-4 list-disc text-slate-300">{line.substring(1).trim()}</li>;
                        }
                        return <p key={idx} className="text-slate-300">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-800/50 text-teal-400 flex items-center justify-center shrink-0 animate-spin">
              <Loader2 className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/30 text-slate-400 rounded-2xl p-4 text-xs font-mono animate-pulse flex items-center gap-2 border border-slate-800/50">
              <span>Examining symptoms against WHO, CDC guidelines...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={text.placeholder}
            className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-slate-900/80"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 text-white p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-slate-500 text-center font-mono">
          <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>{text.sourceDisclaimer}</span>
        </div>
      </div>
    </div>
  );
}
