/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Send, HeartPulse, UserCheck, Calendar, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { Language, UserProfile, HomecareRequest, ChatMessage } from '../types';

interface HomecareChatProps {
  language: Language;
  userProfile: UserProfile | null;
}

export default function HomecareChat({ language, userProfile }: HomecareChatProps) {
  const [requests, setRequests] = useState<HomecareRequest[]>([]);
  const [condition, setCondition] = useState('');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [activeChatReq, setActiveChatReq] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const text = {
    en: {
      title: 'Homecare Clinical Dispatch',
      subtitle: 'On-site Doctor & Nurse Visits for Bedridden Patients',
      requestBtn: 'Submit Dispatch Request',
      conditionPl: 'e.g., Patient is bedridden, requiring monthly decubitus ulcer dressing & vital signs check.',
      addressPl: 'Specify precise clinical dispatch coordinates...',
      historyHead: 'Active Homecare Dispatches',
      nurseAssigned: 'Assigned Mobile Medical Team:',
      statusPending: 'Awaiting Medical Triage...',
      statusAssigned: 'Team Dispatched / Live Chat Open',
      statusCompleted: 'Visit Successfully Finished',
      chatPlaceholder: 'Send secure telemetry or coordinate with medical squad...',
      noRequests: 'No clinical dispatches requested for this profile yet.',
      dispatchedMsg: 'Your mydoctor Homecare dispatch request is verified. Nurse Siriwan and Dr. Kittinan are assigned to your home location. Use the live chat below for instant instructions.',
    },
    th: {
      title: 'หน่วยแพทย์กู้ชีพและพยาบาลเคลื่อนที่ (Homecare)',
      subtitle: 'บริการตรวจรักษาและพยาบาลถึงบ้าน สำหรับผู้ป่วยติดเตียง',
      requestBtn: 'ยื่นคำร้องส่งหน่วยแพทย์เคลื่อนที่',
      conditionPl: 'ระบุสภาพผู้ป่วย เช่น ผู้ป่วยติดเตียงต้องการทำแผลกดทับพรีเมียมและเปลี่ยนสายยางอาหาร...',
      addressPl: 'ระบุที่อยู่จัดส่งหน่วยแพทย์โดยละเอียด...',
      historyHead: 'ประวัติหน่วยแพทย์เคลื่อนที่ของคุณ',
      nurseAssigned: 'ทีมแพทย์สนามที่ได้รับมอบหมาย:',
      statusPending: 'กำลังคัดกรองเคสโดยทีมแพทย์พยาบาลอายุรกรรม...',
      statusAssigned: 'จัดตั้งทีมแพทย์เรียบร้อย / เปิดห้องแชทสื่อสารร่วม',
      statusCompleted: 'การตรวจรักษาเสร็จสิ้นสมบูรณ์',
      chatPlaceholder: 'พิมพ์ข้อความติดต่อกับทีมแพทย์และพยาบาลเคลื่อนที่ที่นี่...',
      noRequests: 'ยังไม่มีประวัติการขอหน่วยพยาบาลถึงบ้านสำหรับบัญชีนี้',
      dispatchedMsg: 'ระบบโรงพยาบาลได้รับการอนุมัติส่งตัวแล้ว ได้มอบหมายพยาบาลศิริวรรณ และ นพ.กิตตินันท์ กำลังเดินทางไปหาคุณ โปรดแจ้งรหัสผ่านหมู่บ้านหรือข้อมูลนำทางเพิ่มเติมในกล่องแชทด้านล่าง',
    }
  }[language];

  // Initialize initial mock request for high fidelity preview
  useEffect(() => {
    if (requests.length === 0 && userProfile) {
      const initialReq: HomecareRequest = {
        id: 'HC-902',
        patientId: userProfile.id,
        patientName: userProfile.fullName,
        address: userProfile.address,
        phone: userProfile.phone,
        condition: language === 'th' ? 'ผู้ป่วยติดเตียง ต้องการเปลี่ยนสายอาหารและดูแลแผลกดทับระดับ 2' : 'Bedridden patient, needs gastric tube replacement & grade-2 ulcer dressing.',
        requestedDate: new Date().toLocaleDateString(),
        scheduledDate: new Date(Date.now() + 3600000 * 24).toLocaleDateString(),
        assignedTeam: language === 'th' ? 'ทีมพยาบาล ศิริวรรณ & นพ. กิตตินันท์ (สาขาสุขุมวิท)' : 'Nurse Siriwan & Dr. Kittinan (Sukhumvit)',
        status: 'assigned',
      };

      setRequests([initialReq]);
      setActiveChatReq('HC-902');
      
      // Initialize chat messages
      setChatMessages({
        'HC-902': [
          {
            id: 'm1',
            senderId: 'staff',
            senderName: language === 'th' ? 'พยาบาล ศิริวรรณ (พยาบาลชำนาญการ)' : 'Nurse Siriwan (RN)',
            role: 'staff',
            text: language === 'th' 
              ? 'สวัสดีค่ะ ดิฉันพยาบาลศิริวรรณและนพ.กิตตินันท์ กำลังตรวจสอบเส้นทางไปบ้านของคุณเพื่อดำเนินการล้างแผลและตรวจสัญญาณชีพนะคะ มีอาการอื่นร่วมด้วยไหมคะ?' 
              : 'Hello, I am Nurse Siriwan. Dr. Kittinan and I are preparing the clinical travel kit to your address for dressing & tube replacement. Are there any other vital symptoms?',
            timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
          }
        ]
      });
    }
  }, [userProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatReq]);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition || !address || !phone) return;

    const newId = `HC-${Math.floor(Math.random() * 900) + 100}`;
    const newReq: HomecareRequest = {
      id: newId,
      patientId: userProfile?.id || 'visitor',
      patientName: userProfile?.fullName || 'Anonymous Patient',
      address,
      phone,
      condition,
      requestedDate: new Date().toLocaleDateString(),
      status: 'pending',
    };

    setRequests((prev) => [newReq, ...prev]);
    setCondition('');

    // Trigger simulation transition to Assigned status in 4 seconds
    setTimeout(() => {
      setRequests((current) =>
        current.map((r) =>
          r.id === newId
            ? {
                ...r,
                status: 'assigned',
                assignedTeam: language === 'th' ? 'พยาบาลรุ่งนภา & นพ.วิทยา' : 'Nurse Rungnapa & Dr. Wittaya',
                scheduledDate: new Date().toLocaleDateString(),
              }
            : r
        )
      );

      // Add auto welcome chat
      setChatMessages((prev) => ({
        ...prev,
        [newId]: [
          {
            id: `hc-w-${newId}`,
            senderId: 'staff',
            senderName: language === 'th' ? 'พยาบาล รุ่งนภา' : 'Nurse Rungnapa',
            role: 'staff',
            text: language === 'th' ? text.dispatchedMsg : text.dispatchedMsg,
            timestamp: new Date().toLocaleTimeString(),
          }
        ]
      }));

      setActiveChatReq(newId);
    }, 4000);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatReq) return;

    const userMsg: ChatMessage = {
      id: `hc-msg-${Date.now()}`,
      senderId: userProfile?.id || 'visitor',
      senderName: userProfile?.fullName || 'Patient Family',
      role: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeChatReq]: [...(prev[activeChatReq] || []), userMsg],
    }));

    setChatInput('');
    setIsSendingMsg(true);

    // Simulated doctor/nurse squad smart answer
    setTimeout(() => {
      const activeReq = requests.find(r => r.id === activeChatReq);
      const teamName = activeReq?.assignedTeam || 'Medical Dispatcher';
      const responseText = language === 'th'
        ? `รับทราบค่ะ ทีมพยาบาลกำลังเดินทางถึงบริเวณปากซอยของท่านในอีกประมาณ 15 นาที ขอแนะนำให้จัดเตรียมพื้นที่รอบเตียงผู้ป่วย พัดลมระบายอากาศ และเปิดไฟส่องสว่างให้ชัดเจนล่วงหน้านะคะ`
        : `Understood completely. The dispatch crew is about 15 minutes away from your gateway coordinates. Please prepare the bed space, clean towels, and ensure bright lighting in the room.`;

      const botMsg: ChatMessage = {
        id: `hc-msg-reply-${Date.now()}`,
        senderId: 'staff',
        senderName: teamName,
        role: 'staff',
        text: responseText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => ({
        ...prev,
        [activeChatReq]: [...(prev[activeChatReq] || []), botMsg],
      }));
      setIsSendingMsg(false);
    }, 1800);
  };

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xl space-y-6" id="homecare_module_root">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{text.title}</h3>
          <span className="text-[10px] text-slate-400 font-mono block uppercase">Grid Module 06</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Request submission form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmitRequest} className="space-y-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{language === 'th' ? 'ระบุสภาพผู้ป่วยและเครื่องมือที่ต้องการ' : 'Clinical Condition Description'}</label>
              <textarea
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder={text.conditionPl}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 h-24 resize-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{language === 'th' ? 'ที่อยู่สำหรับจัดส่งพยาบาลกู้ชีพ' : 'Precise Dispatch Address'}</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={text.addressPl}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{language === 'th' ? 'เบอร์โทรศัพท์ฉุกเฉินผู้ดูแล' : 'Caregiver Contact Number'}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-950 text-rose-100 hover:bg-rose-900 py-3 rounded-xl text-xs font-semibold transition-all border border-rose-800 cursor-pointer flex items-center justify-center gap-2"
            >
              <HeartPulse className="w-4 h-4" />
              {text.requestBtn}
            </button>
          </form>
        </div>

        {/* Right column: Dispatches list & Live medical chat */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-bold text-slate-700">{text.historyHead}</h4>

          {requests.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center border border-dashed border-slate-200 rounded-2xl">
              {text.noRequests}
            </p>
          ) : (
            <div className="space-y-4">
              {/* Requests horizontal stack */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {requests.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => r.status === 'assigned' && setActiveChatReq(r.id)}
                    className={`p-3.5 border rounded-xl shrink-0 text-left min-w-[200px] transition-all cursor-pointer ${
                      activeChatReq === r.id
                        ? 'border-rose-500 bg-rose-50/10 shadow-sm'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{r.id}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        r.status === 'assigned'
                          ? 'bg-emerald-100 text-emerald-700'
                          : r.status === 'completed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status === 'assigned' ? 'Dispatched' : r.status === 'completed' ? 'Completed' : 'Triage...'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{r.condition}</p>
                    <span className="text-[9px] text-slate-400 block font-mono mt-1">{r.requestedDate}</span>
                  </button>
                ))}
              </div>

              {/* Stateful Live Squad Chat Panel */}
              {activeChatReq && (
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner bg-slate-50 flex flex-col h-[280px]">
                  {/* Chat header */}
                  <div className="bg-slate-100 border-b border-slate-200/60 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">CONNECTING TO MED SQUAD {activeChatReq}</span>
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">
                          {requests.find(r => r.id === activeChatReq)?.assignedTeam || 'Clinical Coordinator'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                    {chatMessages[activeChatReq]?.map((m) => {
                      const isUser = m.role === 'user';
                      return (
                        <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-normal ${
                            isUser 
                              ? 'bg-rose-950 text-rose-100 rounded-tr-none font-medium' 
                              : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/50'
                          }`}>
                            <div className="flex justify-between items-center gap-4 mb-1 text-[8px] font-mono opacity-60">
                              <span>{m.senderName}</span>
                              <span>{m.timestamp}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{m.text}</p>
                          </div>
                        </div>
                      );
                    })}
                    {isSendingMsg && (
                      <div className="flex justify-start">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-mono animate-pulse flex items-center gap-1 text-slate-400">
                          <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                          <span>Medical squad typing...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendChatMessage} className="p-2 border-t border-slate-100 bg-slate-50 flex gap-1.5">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={text.chatPlaceholder}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isSendingMsg}
                      className="bg-rose-900 hover:bg-rose-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
