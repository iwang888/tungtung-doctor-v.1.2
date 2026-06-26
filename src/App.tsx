/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone, Shield, Activity, MapPin, Calendar, Pill,
  Apple, HeartPulse, Bot, User, Stethoscope, Bell,
  LogOut, Clock, ArrowRight, Search, Star, Compass,
  Truck, Lock, AlertTriangle, ShieldAlert, CheckCircle,
  Menu, X
} from 'lucide-react';

import { UserProfile, Language, Doctor, Appointment, Medication, QueueItem } from './types';
import {
  INITIAL_DOCTORS, INITIAL_MEDICATIONS, HOSPITAL_BRANCHES,
  DEPARTMENTS, INITIAL_QUEUES, SAMPLE_BANGKOK_LOCATIONS
} from './data';

// Sub-components
import BiometricLogin from './components/BiometricLogin';
import AIConsultant from './components/AIConsultant';
import AdminDashboard from './components/AdminDashboard';
import HealthAnalytics from './components/HealthAnalytics';
import HomecareChat from './components/HomecareChat';

export default function App() {
  const [language, setLanguage] = useState<Language>('th');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeGridModule, setActiveGridModule] = useState<number | null>(null);

  // App data states (dynamic persistence in session/memory)
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [queues, setQueues] = useState<QueueItem[]>(INITIAL_QUEUES);

  // Grid specific state machines
  const [selectedDept, setSelectedDept] = useState<string>('cardio');
  const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [addressEditor, setAddressEditor] = useState('');

  // Prescription delivery track state
  const [deliveryMed, setDeliveryMed] = useState<string | null>(null);
  const [deliveryStep, setDeliveryStep] = useState(0); // 0=none, 1=approved, 2=packing, 3=transit, 4=delivered

  // Emergency Red Trigger Countdown
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyCount, setEmergencyCount] = useState(5);
  const [emergencyFinished, setEmergencyFinished] = useState(false);

  // Navigation mobile drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Global clinical translation dictionary
  const t = {
    en: {
      appName: 'mydoctor',
      appSub: 'ROYAL PHNOM HOSPITAL NETWORK',
      emergencyButton: 'EMERGENCY 1669',
      logIn: 'Staff/Patient Portal',
      logOut: 'Secure Sign Out',
      langToggle: 'ภาษาไทย',
      welcomeBack: 'Welcome, Guest',
      healthToken: 'EHR Secure Hash Token',
      secLevel: 'Zero-Trust Protocol Active',
      oneClickAlert: 'One-Click Emergency Dispatch',
      oneClickDesc: 'Instantly broadcasts GPS coordinates to central hospital trauma units and registered next of kin.',
      broadcastActive: 'Emergency Dispatch Active',
      countdown: 'Broadcasting in',
      cancel: 'Abort Dispatch',
      dispatched: 'AMBULANCE DISPATCHED',
      dispatchedDesc: 'Trauma Team 03 Sukhumvit dispatched. GPS coordinates successfully locked via Web-GSM beacon.',
      rolesTitle: 'Role Management Portal',
      patientRole: 'Access Patient Dashboard',
      doctorRole: 'Enter Doctor Portal',
      adminRole: 'Launch Security Console',
      mainMenu: 'Core Grid Systems',
      selectGrid: 'Click a clinical grid module to launch dynamic sub-system:',
      grid1: 'Location & Address Tokens',
      grid1Desc: 'View and update registered coordinates and medical dispatches.',
      grid2: 'Departments & Appointments',
      grid2Desc: 'Secure appointments with premium clinical specialists & professors.',
      grid3: 'Hospitals Near Me',
      grid3Desc: 'Calculate closest premium branches using Haversine Geolocation formula.',
      grid4: 'Pharmacy & Deliveries',
      grid4Desc: 'Audit active prescriptions and track high-priority delivery.',
      grid5: 'Nutrition & Health Analytics',
      grid5Desc: 'Calculate BMI, view medical nutrition regimes, and track macros.',
      grid6: 'Homecare & Bedridden care',
      grid6Desc: 'Request nurse home visits with stateful live medical squad chat.',
      searchDoc: 'Find a specialized professor...',
      bookBtn: 'Schedule Visit',
      bookingSuccess: 'Clinical appointment successfully secured!',
      refillReq: 'Order Home Delivery',
      refillTransit: 'Prescription in transit',
      refillFinished: 'Delivered to home address',
    },
    th: {
      appName: 'mydoctor',
      appSub: 'เครือโรงพยาบาลพนมรักษ์ระดับพรีเมียม',
      emergencyButton: 'สายด่วนกู้ชีพ 1669',
      logIn: 'เข้าสู่ระบบแพทย์/ผู้ป่วย',
      logOut: 'ออกจากระบบ',
      langToggle: 'English',
      welcomeBack: 'ยินดีต้อนรับผู้มาติดต่อ',
      healthToken: 'โทเค็นตรวจสอบสิทธิ์ประวัติสุขภาพ',
      secLevel: 'เปิดใช้งานการเข้ารหัสความปลอดภัยระดับสูงสุด',
      oneClickAlert: 'ปุ่มแจ้งเหตุฉุกเฉินกู้ชีพทันที',
      oneClickDesc: 'ส่งพิกัดดาวเทียม GPS แบบเรียลไทม์ไปยังศูนย์กู้ชีพพนมรักษ์และญาติสนิททันทีภายใน 5 วินาที',
      broadcastActive: 'กำลังส่งสัญญาณฉุกเฉินและเชื่อมต่อดาวเทียม',
      countdown: 'จะเริ่มส่งพิกัดช่วยชีวิตใน',
      cancel: 'ยกเลิกคำสั่งกู้ชีพ',
      dispatched: 'รถพยาบาลเคลื่อนที่กำลังเดินทางช่วยชีวิต',
      dispatchedDesc: 'ทีมกู้ชีพย่อยที่ 03 สุขุมวิท ออกเดินทางแล้ว ล็อคเป้าหมายพิกัด GPS ของท่านผ่านดาวเทียมเรียบร้อย',
      rolesTitle: 'สลับสิทธิ์การใช้งานพอร์ทัล',
      patientRole: 'หน้าแดชบอร์ดผู้ป่วย',
      doctorRole: 'สิทธิ์ระบบนายแพทย์ผู้ตรวจ',
      adminRole: 'เปิดระบบแอดมินรักษาความปลอดภัย',
      mainMenu: 'โครงข่ายระบบหลัก 6 มิติ',
      selectGrid: 'เลือกโมดูลระบบเพื่อเริ่มดำเนินการควบคุมหรือตรวจรักษา:',
      grid1: 'ข้อมูลพิกัดและที่อยู่ถาวร',
      grid1Desc: 'ตรวจสอบและแก้ไขข้อมูลพิกัดนำทางผู้ป่วยและจุดจัดส่งยา',
      grid2: 'ติดต่อแผนกและนัดหมายแพทย์',
      grid2Desc: 'เลือกจองคิวนัดหมายกับอาจารย์แพทย์ระดับศาสตราจารย์และแพทย์ผู้เชี่ยวชาญ',
      grid3: 'โรงพยาบาลในเครือใกล้ฉัน',
      grid3Desc: 'คำนวณระยะทางสาขาที่ใกล้ที่สุดโดยอิงจากตำแหน่งดาวเทียม Haversine',
      grid4: 'เภสัชกรรมและการติดตามยา',
      grid4Desc: 'ตรวจสอบรายการยาที่กำลังรับประทานและติดตามการจัดส่งยาถึงบ้าน',
      grid5: 'การวิเคราะห์โภชนาการและตัวบ่งชี้',
      grid5Desc: 'คำนวณดัชนีมวลกาย BMI และคำนวณพลังงานโภชนาการแพทย์รายวัน',
      grid6: 'บริการโฮมแคร์ผู้ป่วยติดเตียง',
      grid6Desc: 'ขอหน่วยพยาบาลถึงบ้าน พร้อมระบบแชทสดสื่อสารกับทีมแพทย์ฉุกเฉินเคลื่อนที่',
      searchDoc: 'พิมพ์ค้นหาอาจารย์แพทย์หรือโรค...',
      bookBtn: 'จองคิวนัดหมายพบแพทย์',
      bookingSuccess: 'จองคิวนัดหมายอายุรกรรมพรีเมียมเสร็จสิ้น!',
      refillReq: 'ขอจัดส่งยาถึงบ้าน',
      refillTransit: 'ยากำลังถูกจัดส่งโดยหน่วยเคลื่อนที่เร็ว',
      refillFinished: 'ยาจัดส่งถึงที่อยู่เรียบร้อย',
    }
  }[language];

  // distance calculation between user coordinates and branches
  const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Add customized notifications
  const pushNotification = (msg: string) => {
    setNotifications((prev) => [msg, ...prev]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(0, -1));
    }, 5000);
  };

  // Address modifier
  const handleSaveAddress = () => {
    if (!addressEditor.trim() || !user) return;
    setUser({ ...user, address: addressEditor });
    pushNotification(language === 'th' ? 'ปรับปรุงพิกัดที่อยู่ใหม่สำเร็จ!' : 'Dispatch coordinates updated!');
  };

  // Initial user setup
  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setAddressEditor(profile.address);
    pushNotification(language === 'th' ? `ยินดีต้อนรับคุณ ${profile.fullName} เข้าสู่ระบบความปลอดภัย` : `Welcome back, ${profile.fullName}`);
  };

  // Refill prescription drug and simulate dispatch
  const handleRefillRequest = (medId: string) => {
    setDeliveryMed(medId);
    setDeliveryStep(1);
    pushNotification(language === 'th' ? 'คำร้องส่งยาสำเร็จ! เภสัชกรกำลังคัดแยกตัวยา' : 'Refill order received! Clinical pharmacist checking prescription.');

    // Animate progress of delivery
    const interval = setInterval(() => {
      setDeliveryStep((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          return 4;
        }
        return prev + 1;
      });
    }, 4000);
  };

  // Booking system helper
  const handleConfirmBooking = () => {
    if (!bookingDoc || !bookingDate || !bookingTime || !user) return;

    const newAppointment: Appointment = {
      id: 'APT-' + Math.floor(Math.random() * 9000 + 1000),
      patientId: user.id,
      patientName: user.fullName,
      doctorId: bookingDoc.id,
      doctorName: bookingDoc.name,
      specialty: language === 'th' ? bookingDoc.specialtyTh : bookingDoc.specialty,
      date: bookingDate,
      time: bookingTime,
      status: 'confirmed',
    };

    setAppointments([newAppointment, ...appointments]);
    setBookingDoc(null);
    setBookingDate('');
    setBookingTime('');
    pushNotification(t.bookingSuccess);

    // Sync appointment with medications simulation: Add a notification
    setTimeout(() => {
      pushNotification(language === 'th' ? `แจ้งเตือนสิทธิ์: การนัดพบแพทย์ที่จองได้รับการยืนยันโดยสาขา ${newAppointment.specialty}` : `EHR Sync: Appointment confirmed by ${newAppointment.doctorName}`);
    }, 3000);
  };

  // Emergency countdown machine
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emergencyActive && emergencyCount > 0) {
      timer = setTimeout(() => setEmergencyCount(emergencyCount - 1), 1000);
    } else if (emergencyActive && emergencyCount === 0) {
      setEmergencyFinished(true);
      // Log emergency alert on admin backend
      fetch('/api/admin/security-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'GUEST-EMERGENCY',
          userEmail: user?.email || 'unregistered.citizen@emergency.co.th',
          event: `🔴 CRITICAL: Emergency Call 1669 GPS Broadcast (Lat: ${user?.latitude || 13.75}, Lng: ${user?.longitude || 100.5})`,
          status: 'SUCCESS'
        })
      });
    }
    return () => clearTimeout(timer);
  }, [emergencyActive, emergencyCount]);

  const handleTriggerEmergency = () => {
    setEmergencyActive(true);
    setEmergencyCount(5);
    setEmergencyFinished(false);
  };

  const handleAbortEmergency = () => {
    setEmergencyActive(false);
    setEmergencyCount(5);
    setEmergencyFinished(false);
    pushNotification(language === 'th' ? 'ยกเลิกการส่งตัวทีมแพทย์กู้ชีพแล้ว' : 'Emergency clinical dispatch aborted.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-teal-600 selection:text-white" id="app_frame">
      {/* Premium Bilingual Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 shadow-xs" id="header_container">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Royal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 flex items-center justify-center border border-amber-500/30">
              <span className="font-serif font-black text-xl text-amber-500 tracking-tighter">m</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-teal-950 flex items-center gap-1">
                {t.appName}
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </h1>
              <span className="text-[9px] font-mono font-bold text-amber-600 tracking-widest block uppercase mt-0.5">
                {t.appSub}
              </span>
            </div>
          </div>

          {/* Desktop Right Navigation Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Prominent Red 1669 Button */}
            <button
              onClick={handleTriggerEmergency}
              className="bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl border-b-2 border-red-800 shadow-md transition-all flex items-center gap-2 cursor-pointer"
              id="emergency_1669_button"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              {t.emergencyButton}
            </button>

            {/* Language Selection */}
            <button
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
              className="px-3.5 py-2 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition-colors cursor-pointer border border-slate-200"
            >
              {t.langToggle}
            </button>

            {/* Logout control */}
            {user && (
              <button
                onClick={() => {
                  setUser(null);
                  setActiveGridModule(null);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 hover:text-red-600 text-xs font-semibold text-slate-600 rounded-xl transition-all cursor-pointer border border-slate-200"
              >
                <LogOut className="w-4 h-4" />
                {t.logOut}
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
              className="px-2.5 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-700"
            >
              {language === 'th' ? 'EN' : 'TH'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-3 shadow-lg">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleTriggerEmergency();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4" />
              {t.emergencyButton}
            </button>

            {user && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setUser(null);
                  setActiveGridModule(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                {t.logOut}
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content Space */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main_container">
        <AnimatePresence>
          {/* Emergency Fullscreen Overlay Alert */}
          {emergencyActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              {!emergencyFinished ? (
                <div className="space-y-6 max-w-md">
                  <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500 text-red-500 flex items-center justify-center mx-auto animate-ping">
                    <Phone className="w-12 h-12" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-400 font-serif tracking-tight">{t.broadcastActive}</h2>
                  <p className="text-slate-400 text-xs leading-relaxed">{t.oneClickDesc}</p>
                  
                  <div className="py-4">
                    <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">{t.countdown}</span>
                    <span className="text-6xl font-extrabold text-white block mt-1 font-mono tracking-tighter">{emergencyCount}</span>
                  </div>

                  <button
                    onClick={handleAbortEmergency}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl cursor-pointer transition-all"
                  >
                    {t.cancel}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 max-w-md">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <h2 className="text-3xl font-serif text-white tracking-tight">{t.dispatched}</h2>
                  <p className="text-slate-300 text-xs leading-relaxed">{t.dispatchedDesc}</p>
                  
                  {user && (
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left font-mono text-[10px] text-teal-400 space-y-1">
                      <div>PATIENT: {user.fullName}</div>
                      <div>NATIONAL ID: {user.nationalId}</div>
                      <div>GPS COORDS: {user.latitude || 13.75}, {user.longitude || 100.5}</div>
                      <div>CONTACT: {user.phone}</div>
                    </div>
                  )}

                  <button
                    onClick={() => setEmergencyActive(false)}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition-all"
                  >
                    Close Emergency Mode
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Floating Notifications Bar */}
        <div className="fixed bottom-6 right-6 z-40 space-y-2 pointer-events-none">
          {notifications.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900 text-teal-300 border border-slate-800 p-4 rounded-xl shadow-lg max-w-sm text-xs font-medium flex items-center gap-2"
            >
              <Bell className="w-4.5 h-4.5 shrink-0 text-teal-400 animate-swing" />
              <span>{n}</span>
            </motion.div>
          ))}
        </div>

        {/* Security / Decryptor Sign In Barrier */}
        {!user ? (
          <div className="py-12 flex flex-col items-center">
            <BiometricLogin language={language} onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : (
          /* Main Hospital Dashboard space */
          <div className="space-y-8" id="dashboard_panel">
            
            {/* User welcome & security hash segment */}
            <div className="bg-gradient-to-r from-teal-950 via-slate-950 to-teal-950 p-6 rounded-3xl text-white flex flex-col md:flex-row justify-between md:items-center gap-4 border border-teal-900/40 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white font-serif">{user.fullName}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-xs mt-1 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-teal-400" />
                      {user.role === 'admin' ? 'Admin Controller' : user.role === 'doctor' ? 'Clinical Faculty' : 'Registered Patient'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {user.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure EHR hash */}
              <div className="text-left md:text-right font-mono text-[10px] text-slate-400 space-y-0.5">
                <div>{t.healthToken}:</div>
                <div className="text-teal-400 font-bold break-all">sha256:7c99e1a1b...f{user.id}</div>
                <div className="text-slate-500">{t.secLevel}</div>
              </div>
            </div>

            {/* Admin & Doctor Role Access controls */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-md space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.rolesTitle}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setUser({ ...user, role: 'patient' })}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    user.role === 'patient' 
                      ? 'bg-teal-950 text-white border border-teal-800 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {t.patientRole}
                </button>
                <button
                  onClick={() => setUser({ ...user, role: 'doctor' })}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    user.role === 'doctor' 
                      ? 'bg-teal-950 text-white border border-teal-800 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {t.doctorRole}
                </button>
                <button
                  onClick={() => setUser({ ...user, role: 'admin' })}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    user.role === 'admin' 
                      ? 'bg-teal-950 text-white border border-teal-800 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {t.adminRole}
                </button>
              </div>
            </div>

            {/* Main view router */}
            {user.role === 'admin' ? (
              <AdminDashboard language={language} />
            ) : (
              /* Patient / Doctor View */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left panel: General Hospital menu and 6 grids */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-xl font-serif text-teal-950 font-bold">{t.mainMenu}</h2>
                      <p className="text-xs text-slate-400 mt-1">{t.selectGrid}</p>
                    </div>
                  </div>

                  {/* 6 Grids container layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    
                    {/* Grid 1: Location token display */}
                    <div
                      onClick={() => setActiveGridModule(1)}
                      className={`p-5 bg-white border rounded-2xl shadow-xs hover:shadow-md cursor-pointer hover:border-teal-500 transition-all ${activeGridModule === 1 ? 'ring-2 ring-teal-600 border-teal-500 bg-teal-50/5' : 'border-slate-100'}`}
                      id="grid_1_card"
                    >
                      <div className="p-3 bg-teal-50 border border-teal-100 text-teal-600 rounded-xl w-fit mb-4">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{t.grid1}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{t.grid1Desc}</p>
                    </div>

                    {/* Grid 2: Specialties Appointment */}
                    <div
                      onClick={() => setActiveGridModule(2)}
                      className={`p-5 bg-white border rounded-2xl shadow-xs hover:shadow-md cursor-pointer hover:border-teal-500 transition-all ${activeGridModule === 2 ? 'ring-2 ring-teal-600 border-teal-500 bg-teal-50/5' : 'border-slate-100'}`}
                      id="grid_2_card"
                    >
                      <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl w-fit mb-4">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{t.grid2}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{t.grid2Desc}</p>
                    </div>

                    {/* Grid 3: Geolocation closest hospital */}
                    <div
                      onClick={() => setActiveGridModule(3)}
                      className={`p-5 bg-white border rounded-2xl shadow-xs hover:shadow-md cursor-pointer hover:border-teal-500 transition-all ${activeGridModule === 3 ? 'ring-2 ring-teal-600 border-teal-500 bg-teal-50/5' : 'border-slate-100'}`}
                      id="grid_3_card"
                    >
                      <div className="p-3 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl w-fit mb-4">
                        <Compass className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{t.grid3}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{t.grid3Desc}</p>
                    </div>

                    {/* Grid 4: Pharmacy tracker */}
                    <div
                      onClick={() => setActiveGridModule(4)}
                      className={`p-5 bg-white border rounded-2xl shadow-xs hover:shadow-md cursor-pointer hover:border-teal-500 transition-all ${activeGridModule === 4 ? 'ring-2 ring-teal-600 border-teal-500 bg-teal-50/5' : 'border-slate-100'}`}
                      id="grid_4_card"
                    >
                      <div className="p-3 bg-sky-50 border border-sky-100 text-sky-600 rounded-xl w-fit mb-4">
                        <Pill className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{t.grid4}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{t.grid4Desc}</p>
                    </div>

                    {/* Grid 5: BMI Nutrition */}
                    <div
                      onClick={() => setActiveGridModule(5)}
                      className={`p-5 bg-white border rounded-2xl shadow-xs hover:shadow-md cursor-pointer hover:border-teal-500 transition-all ${activeGridModule === 5 ? 'ring-2 ring-teal-600 border-teal-500 bg-teal-50/5' : 'border-slate-100'}`}
                      id="grid_5_card"
                    >
                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl w-fit mb-4">
                        <Apple className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{t.grid5}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{t.grid5Desc}</p>
                    </div>

                    {/* Grid 6: Bedridden Homecare */}
                    <div
                      onClick={() => setActiveGridModule(6)}
                      className={`p-5 bg-white border rounded-2xl shadow-xs hover:shadow-md cursor-pointer hover:border-teal-500 transition-all ${activeGridModule === 6 ? 'ring-2 ring-teal-600 border-teal-500 bg-teal-50/5' : 'border-slate-100'}`}
                      id="grid_6_card"
                    >
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl w-fit mb-4">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{t.grid6}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{t.grid6Desc}</p>
                    </div>
                  </div>

                  {/* Dynamic render of active grids */}
                  <div className="pt-2">
                    {activeGridModule === 1 && (
                      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-800 text-sm">{t.grid1}</h3>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-mono">Module 01</span>
                        </div>
                        <div className="space-y-3.5">
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {language === 'th' ? 'ที่อยู่ปัจจุบันของท่านใช้ระบุพิกัดสากลแบบเข้ารหัสเพื่อประโยชน์ในการวิเคราะห์ตำแหน่งจุดบริการใกล้เคียงที่สุดและการคำนวณนำทางแบบเรียลไทม์' : 'Your current coordinate tokens are highly isolated. They serve to measure clinic proximity and medical team path calculations.'}
                          </p>
                          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono uppercase">GPS LAT/LNG TOKENS</label>
                              <span className="text-xs font-mono text-teal-700 font-semibold">{user.latitude || 13.7462}, {user.longitude || 100.5348}</span>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono uppercase">REGISTERED DISPATCH ADDRESS</label>
                              <span className="text-xs font-semibold text-slate-700 block">{user.address}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-600">{language === 'th' ? 'ปรับเปลี่ยนที่อยู่จัดส่งหน่วยแพทย์' : 'Update dispatch address'}</label>
                            <div className="flex gap-2">
                              <select
                                value={addressEditor}
                                onChange={(e) => setAddressEditor(e.target.value)}
                                className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-600"
                              >
                                <option value="Siam Paragon Area, Pathum Wan, Bangkok">Siam Paragon Area, Pathum Wan (Centermost)</option>
                                <option value="EmQuartier Area, Sukhumvit Rd, Bangkok">EmQuartier Area, Sukhumvit Rd (Eastside)</option>
                                <option value="Lumphini Park Area, Rama IV Rd, Bangkok">Lumphini Park Area, Rama IV Rd (Central South)</option>
                                <option value="Bang Rak Area, Charoen Krung Rd, Bangkok">Bang Rak Area, Charoen Krung Rd (Westside)</option>
                              </select>
                              <button
                                onClick={handleSaveAddress}
                                className="bg-teal-950 text-white hover:bg-teal-900 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border border-teal-800"
                              >
                                {language === 'th' ? 'บันทึก' : 'Apply'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeGridModule === 2 && (
                      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-800 text-sm">{t.grid2}</h3>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-mono">Module 02</span>
                        </div>

                        {/* Department selector */}
                        <div className="space-y-3">
                          <label className="block text-xs font-semibold text-slate-600">Select Clinical Department:</label>
                          <div className="flex flex-wrap gap-2">
                            {DEPARTMENTS.map((dept) => (
                              <button
                                key={dept.id}
                                onClick={() => setSelectedDept(dept.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                                  selectedDept === dept.id
                                    ? 'bg-indigo-950 text-white border-indigo-900 shadow-sm'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                                }`}
                              >
                                {language === 'th' ? dept.nameTh : dept.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Doctors filter */}
                        <div className="space-y-4">
                          <label className="block text-xs font-semibold text-slate-600">Available Faculty Doctors:</label>
                          <div className="space-y-3.5">
                            {doctors
                              .filter((doc) => {
                                if (selectedDept === 'cardio') return doc.specialty.includes('Cardio');
                                if (selectedDept === 'neuro') return doc.specialty.includes('Neuro');
                                if (selectedDept === 'ortho') return doc.specialty.includes('Ortho');
                                if (selectedDept === 'pediatric') return doc.specialty.includes('Pediatric');
                                return doc.specialty.includes('Gastro');
                              })
                              .map((doc) => (
                                <div key={doc.id} className="p-4 border border-slate-100 hover:border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                  <div className="flex items-center gap-3.5">
                                    <img
                                      src={doc.image}
                                      alt={doc.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                                      <span className="text-[10px] text-teal-700 font-semibold block">{language === 'th' ? doc.specialtyTh : doc.specialty}</span>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-[10px] text-slate-400 block font-mono">{doc.hospitalBranch}</span>
                                        <span className="text-slate-200">|</span>
                                        <span className="text-[10px] text-amber-500 font-bold font-mono flex items-center gap-0.5">
                                          ★ {doc.rating}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => setBookingDoc(doc)}
                                    className="self-start sm:self-auto px-4 py-2 bg-indigo-950 text-indigo-100 hover:bg-indigo-900 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                                  >
                                    {t.bookBtn}
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Booking form details */}
                        <AnimatePresence>
                          {bookingDoc && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-5 bg-indigo-50/40 border border-indigo-150 rounded-2xl space-y-4"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="text-xs font-bold text-indigo-950">
                                  Configure appointment with <b className="text-indigo-600">{bookingDoc.name}</b>
                                </h4>
                                <button onClick={() => setBookingDoc(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Select Appointment Date</label>
                                  <input
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Select Time Slot</label>
                                  <select
                                    value={bookingTime}
                                    onChange={(e) => setBookingTime(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                  >
                                    <option value="">Choose slot...</option>
                                    <option value="09:00 - 09:30 AM">09:00 - 09:30 AM</option>
                                    <option value="10:30 - 11:00 AM">10:30 - 11:00 AM</option>
                                    <option value="01:30 - 02:00 PM">01:30 - 02:00 PM</option>
                                    <option value="03:00 - 03:30 PM">03:00 - 03:30 PM</option>
                                  </select>
                                </div>
                              </div>

                              <button
                                onClick={handleConfirmBooking}
                                disabled={!bookingDate || !bookingTime}
                                className="w-full bg-indigo-950 hover:bg-indigo-900 disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded-xl cursor-pointer"
                              >
                                Confirm Clinical Slot Booking
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Scheduled Appointments logs */}
                        {appointments.length > 0 && (
                          <div className="space-y-3.5 border-t border-slate-100 pt-5">
                            <h4 className="text-xs font-bold text-slate-800">Your Secured Appointments:</h4>
                            <div className="space-y-2.5">
                              {appointments.map((apt) => (
                                <div key={apt.id} className="p-4 bg-emerald-50/30 border border-emerald-150 rounded-2xl flex justify-between items-center">
                                  <div>
                                    <span className="text-[10px] font-mono text-emerald-700 font-bold block">{apt.id}</span>
                                    <p className="text-xs font-bold text-slate-900 mt-0.5">{apt.doctorName}</p>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">{apt.specialty}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="inline-block px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full">
                                      CONFIRMED
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono block mt-1.5">{apt.date} @ {apt.time}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeGridModule === 3 && (
                      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-800 text-sm">{t.grid3}</h3>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-mono">Module 03</span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {language === 'th' ? 'พิกัด GPS ของท่านจะถูกนำไปเปรียบเทียบคำนวณระยะทางกับพิกัดโรงพยาบาลในเครือเพื่อชี้วัดสาขาที่ใกล้ที่สุดในกรณีฉุกเฉินและจัดส่งยาเคลื่อนที่เร็ว' : 'We compute direct distances using the Haversine equation to find the closest clinical center relative to your position.'}
                        </p>

                        <div className="space-y-4">
                          {HOSPITAL_BRANCHES.map((b, idx) => {
                            const userLat = user.latitude || 13.7563;
                            const userLng = user.longitude || 100.5018;
                            const dist = getHaversineDistance(userLat, userLng, b.latitude, b.longitude);

                            return (
                              <div key={idx} className="p-4 border border-slate-100 bg-slate-50/40 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={b.image}
                                    alt={b.name}
                                    className="w-16 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-900">{language === 'th' ? b.nameTh : b.name}</h4>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">{language === 'th' ? b.addressTh : b.address}</span>
                                    <span className="text-[10px] text-slate-500 font-mono block mt-1">Tel: {b.phone}</span>
                                  </div>
                                </div>

                                <div className="text-left sm:text-right shrink-0">
                                  <span className="text-xs text-slate-400 block font-mono">DISTANCE</span>
                                  <span className="text-lg font-bold font-mono text-teal-700 block">{dist} km</span>
                                  
                                  {/* Distance scale helper bar */}
                                  <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden mt-1 mx-auto">
                                    <div 
                                      className="bg-teal-500 h-full"
                                      style={{ width: `${Math.max(10, Math.min(100, (1 / (dist + 0.1)) * 100))}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeGridModule === 4 && (
                      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-800 text-sm">{t.grid4}</h3>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-mono">Module 04</span>
                        </div>

                        {/* Medications listing */}
                        <div className="space-y-4">
                          <label className="block text-xs font-semibold text-slate-600">Active Prescriptions in EHR Profile:</label>
                          <div className="space-y-3.5">
                            {medications.map((m) => (
                              <div key={m.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-teal-600">{m.id}</span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${m.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                      {m.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-900">{language === 'th' ? m.nameTh : m.name}</h4>
                                  <p className="text-[11px] text-slate-500 font-semibold">{language === 'th' ? m.instructionsTh : m.instructions}</p>
                                  <div className="text-[10px] text-slate-400 font-mono pt-1">
                                    Dosage: {m.dosage} | Frequency: {language === 'th' ? m.frequencyTh : m.frequency}
                                  </div>
                                </div>

                                {m.status === 'active' && (
                                  <button
                                    onClick={() => handleRefillRequest(m.id)}
                                    className="px-4 py-2 bg-teal-950 text-teal-100 hover:bg-teal-900 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0"
                                  >
                                    {t.refillReq}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery tracking panel */}
                        <AnimatePresence>
                          {deliveryMed && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="p-5 bg-teal-950 text-teal-100 border border-teal-900 rounded-2xl space-y-4"
                            >
                              <div className="flex justify-between items-center border-b border-teal-900 pb-2">
                                <h4 className="text-xs font-bold text-teal-200">
                                  Delivery Tracking for <b className="text-white">{deliveryMed}</b>
                                </h4>
                                <span className="text-[10px] font-mono text-teal-400 font-bold">Priority Medical Dispatch</span>
                              </div>

                              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                                <div className={deliveryStep >= 1 ? 'text-teal-400 font-bold' : 'text-slate-500'}>
                                  <div className="text-xs">Pharmacist</div>
                                  <div className="mt-1">● Approved</div>
                                </div>
                                <div className={deliveryStep >= 2 ? 'text-teal-400 font-bold' : 'text-slate-500'}>
                                  <div className="text-xs">Secure Pack</div>
                                  <div className="mt-1">● Locked</div>
                                </div>
                                <div className={deliveryStep >= 3 ? 'text-teal-400 font-bold' : 'text-slate-500'}>
                                  <div className="text-xs">Ambulatory</div>
                                  <div className="mt-1">● Transit</div>
                                </div>
                                <div className={deliveryStep >= 4 ? 'text-teal-400 font-bold' : 'text-slate-500'}>
                                  <div className="text-xs">Patient Home</div>
                                  <div className="mt-1">● Delivered</div>
                                </div>
                              </div>

                              <div className="bg-teal-900/60 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-teal-400 h-full transition-all duration-500"
                                  style={{ width: `${(deliveryStep / 4) * 100}%` }}
                                />
                              </div>

                              <div className="text-center">
                                <span className="text-[10px] bg-teal-900 text-teal-300 py-1 px-3 rounded-full font-bold">
                                  {deliveryStep === 4 ? t.refillFinished : t.refillTransit}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {activeGridModule === 5 && (
                      <HealthAnalytics
                        language={language}
                        userProfile={user}
                        onUpdateBmi={(w, h, b) => {
                          setUser({ ...user, weight: w, height: h, bmi: b });
                          pushNotification(language === 'th' ? 'เกณฑ์ตัวชี้วัดได้รับการอัพเดทในพอร์ทัลแพทย์แล้ว' : 'EHR clinical health metrics updated.');
                        }}
                      />
                    )}

                    {activeGridModule === 6 && (
                      <HomecareChat language={language} userProfile={user} />
                    )}
                  </div>
                </div>

                {/* Right panel: AI Medical Consultant & Support chat */}
                <div className="lg:col-span-4 space-y-6">
                  <AIConsultant language={language} userProfile={user} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Grand Royal Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-12 text-center" id="footer_container">
        <div className="w-full max-w-7xl mx-auto px-4 text-xs space-y-3 font-mono">
          <p className="text-slate-500">
            © 2026 mydoctor Premium Clinical Hospital Network. All Rights Reserved. Complies strictly with Thai PDPA, HIPAA, and medical data secrecy protocols.
          </p>
          <div className="flex justify-center gap-4 text-slate-600 text-[10px]">
            <span>Secure Connection: TLS 1.3 / AES-256-GCM Encryption Active</span>
            <span>•</span>
            <span>WebAuthn FIDO2 Credential Signatures Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
