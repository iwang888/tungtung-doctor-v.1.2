/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Fingerprint, Eye, User, MapPin, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface BiometricLoginProps {
  language: Language;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function BiometricLogin({ language, onLoginSuccess }: BiometricLoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nationalId, setNationalId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Siam Paragon Area, Bangkok');
  const [biometricType, setBiometricType] = useState<'face' | 'finger' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const text = {
    en: {
      title: 'Security Access Control',
      subtitle: 'mydoctor Premium Clinical Portal',
      nationalId: 'Thai National ID Card Number',
      nationalIdPl: '1-XXXX-XXXXX-XX-X',
      loginId: 'Sign In via National ID',
      loginBio: 'Secure Biometric Verification',
      or: 'OR ACCESS VIA BIOMETRIC ENCRYPTION',
      registerBtn: 'New Patient Enrollment',
      backToLogin: 'Back to Sign In',
      submitRegister: 'Verify & Enroll Profile',
      scanning: 'Cryptographic Scan in Progress...',
      verified: 'Credential Signature Verified',
      fullName: 'Full Name (as in Passport/ID)',
      email: 'Email Address',
      phone: 'Mobile Phone Number',
      address: 'Residential Address (for nearest clinic routing)',
      addressDesc: 'Required to automatically pinpoint closest mydoctor branches and dispatch medical teams.',
      biometricTitle: 'Select Biometric Key',
      biometricDesc: 'Utilizes local hardware WebAuthn credentials to generate unique client cryptographic signatures.',
      emergencyWarn: 'For critical health emergencies, press the Red 1669 button at any time without logging in.',
    },
    th: {
      title: 'ระบบควบคุมความปลอดภัยสูงสุด',
      subtitle: 'พอร์ทัลการรักษาพยาบาลระดับพรีเมียม mydoctor',
      nationalId: 'หมายเลขบัตรประจำตัวประชาชน',
      nationalIdPl: '1-XXXX-XXXXX-XX-X',
      loginId: 'เข้าสู่ระบบด้วยรหัสบัตรประชาชน',
      loginBio: 'ยืนยันตัวตนด้วยอัตลักษณ์บุคคล',
      or: 'หรือเข้าใช้งานด้วยระบบเข้ารหัสชีวมิติ',
      registerBtn: 'ลงทะเบียนผู้ป่วยใหม่',
      backToLogin: 'กลับไปหน้าเข้าสู่ระบบ',
      submitRegister: 'ตรวจสอบและลงทะเบียนข้อมูล',
      scanning: 'กำลังสแกนอัตลักษณ์และตรวจสอบกุญแจเข้ารหัส...',
      verified: 'ตรวจสอบลายเซ็นดิจิทัลเสร็จสิ้น',
      fullName: 'ชื่อ-นามสกุลจริง (ตรงตามบัตรประชาชน)',
      email: 'ที่อยู่อีเมล',
      phone: 'เบอร์โทรศัพท์มือถือ',
      address: 'ที่อยู่ปัจจุบัน (สำหรับการคำนวณสาขาและหน่วยเคลื่อนที่)',
      addressDesc: 'จำเป็นสำหรับการค้นหาสาขาโรงพยาบาลที่ใกล้ที่สุดและนำทางหน่วยรถแพทย์เคลื่อนที่ช่วยชีวิต',
      biometricTitle: 'เลือกประเภทการยืนยันตัวตน',
      biometricDesc: 'ใช้มาตรฐานเทคโนโลยี WebAuthn ของอุปกรณ์เพื่อสร้างกุญแจถอดรหัสที่ไม่ผ่านระบบเซิร์ฟเวอร์',
      emergencyWarn: 'หากมีเหตุฉุกเฉินวิกฤต สามารถกดปุ่มฉุกเฉิน 1669 ได้ทันทีโดยไม่ต้องเข้าสู่ระบบ',
    }
  }[language];

  // Pinpoint address coordinates based on name
  const getCoordinates = (addr: string) => {
    const a = addr.toLowerCase();
    if (a.includes('siam')) return { lat: 13.7462, lng: 100.5348 };
    if (a.includes('emquartier')) return { lat: 13.7314, lng: 100.5698 };
    if (a.includes('lumphini')) return { lat: 13.7298, lng: 100.5372 };
    if (a.includes('bang rak')) return { lat: 13.7225, lng: 100.5147 };
    if (a.includes('sukhumvit')) return { lat: 13.7303, lng: 100.5701 };
    if (a.includes('silom')) return { lat: 13.7251, lng: 100.5284 };
    if (a.includes('thonglor')) return { lat: 13.7412, lng: 100.5829 };
    return { lat: 13.7563, lng: 100.5018 }; // Bangkok general
  };

  const handleNationalIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (nationalId.length < 5) {
      setError(language === 'th' ? 'กรุณาระบุหมายเลขบัตรประชาชนให้ถูกต้อง' : 'Please provide a valid National ID number.');
      return;
    }

    // Simulate login
    const user: UserProfile = {
      id: 'UID-' + nationalId.substring(nationalId.length - 4),
      nationalId,
      fullName: language === 'th' ? 'คุณสมชาย ยิ่งเจริญ' : 'Somchai Yingcharoen',
      email: 'somchai.y@gmail.com',
      phone: '081-234-5678',
      address: 'Siam Paragon Area, Pathum Wan, Bangkok',
      role: 'patient',
      isBiometricRegistered: true,
      weight: 74,
      height: 175,
      bmi: 24.2,
      latitude: 13.7462,
      longitude: 100.5348
    };

    // Log security audit to backend
    await fetch('/api/admin/security-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        userEmail: user.email,
        event: `National ID Authenticated (${user.id})`,
        status: 'SUCCESS'
      })
    });

    onLoginSuccess(user);
  };

  const startBiometricScan = async (type: 'face' | 'finger') => {
    setBiometricType(type);
    setIsScanning(true);
    setScanProgress(0);
    setError('');

    // Animate scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Call authentication backend verify
    setTimeout(async () => {
      try {
        const res = await fetch('/api/biometric/authenticate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nationalId: '1-1009-01234-11-2',
            email: 'premium.patient@mydoctor.com',
            assertion: { signature: 'crypto_key_sig_v2' }
          })
        });
        const data = await res.json();

        if (data.success) {
          setSuccessMsg(text.verified);
          setTimeout(() => {
            const user: UserProfile = {
              id: 'UID-BIO-8821',
              nationalId: '1-1009-01234-11-2',
              fullName: language === 'th' ? 'คุณกิตติศักดิ์ อุดมสุข' : 'Kittisak Udomsuk',
              email: 'premium.patient@mydoctor.com',
              phone: '089-999-8888',
              address: 'EmQuartier Area, Sukhumvit Rd, Bangkok',
              role: 'patient',
              isBiometricRegistered: true,
              weight: 68,
              height: 172,
              bmi: 23.0,
              latitude: 13.7314,
              longitude: 100.5698
            };
            onLoginSuccess(user);
          }, 800);
        } else {
          setError('Cryptographic biometric mismatch');
          setIsScanning(false);
        }
      } catch (err) {
        setError('Biometric hardware communication failure.');
        setIsScanning(false);
      }
    }, 1800);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nationalId || !fullName || !email || !phone || !address) {
      setError(language === 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง' : 'Please fill out all enrollment fields.');
      return;
    }

    const coords = getCoordinates(address);
    const user: UserProfile = {
      id: 'UID-' + nationalId.substring(nationalId.length - 4),
      nationalId,
      fullName,
      email,
      phone,
      address,
      role: 'patient',
      isBiometricRegistered: true,
      weight: 70,
      height: 170,
      bmi: 24.2,
      latitude: coords.lat,
      longitude: coords.lng
    };

    await fetch('/api/admin/security-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        userEmail: user.email,
        event: `EHR Patient Enrolled (${user.id})`,
        status: 'SUCCESS'
      })
    });

    setSuccessMsg(language === 'th' ? 'ลงทะเบียนประวัติผู้ป่วยสำเร็จ!' : 'EHR Patient Profile Created!');
    setTimeout(() => {
      onLoginSuccess(user);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden" id="login_card_module">
      {/* Brand Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 text-center relative">
        <div className="absolute top-4 right-4 text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-mono tracking-wider">
          PDPA COMPLIANT
        </div>
        <div className="inline-flex p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-teal-400" />
        </div>
        <h2 className="text-2xl font-serif tracking-tight text-teal-100">{text.title}</h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">{text.subtitle}</p>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {!isScanning ? (
            <motion.div
              key={isRegistering ? 'register' : 'login'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-teal-50 text-teal-600 rounded-xl text-xs border border-teal-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {!isRegistering ? (
                /* Login Form */
                <form onSubmit={handleNationalIdLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                      {text.nationalId}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder={text.nationalIdPl}
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-950 text-teal-100 hover:bg-teal-900 py-3 rounded-xl text-sm font-semibold transition-all border border-teal-800 shadow-md"
                  >
                    {text.loginId}
                  </button>

                  <div className="relative my-6 text-center">
                    <hr className="border-slate-100" />
                    <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest absolute -top-2 left-1/2 -translate-x-1/2">
                      {text.or}
                    </span>
                  </div>

                  {/* WebAuthn simulator buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => startBiometricScan('face')}
                      className="flex flex-col items-center justify-center p-4 border border-slate-200 hover:border-teal-600/50 hover:bg-teal-50/20 rounded-2xl transition-all group"
                    >
                      <Eye className="w-6 h-6 text-slate-500 group-hover:text-teal-600 transition-colors mb-2" />
                      <span className="text-xs font-medium text-slate-600 group-hover:text-teal-950">Face Scan ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startBiometricScan('finger')}
                      className="flex flex-col items-center justify-center p-4 border border-slate-200 hover:border-teal-600/50 hover:bg-teal-50/20 rounded-2xl transition-all group"
                    >
                      <Fingerprint className="w-6 h-6 text-slate-500 group-hover:text-teal-600 transition-colors mb-2" />
                      <span className="text-xs font-medium text-slate-600 group-hover:text-teal-950">Fingerprint ID</span>
                    </button>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(true)}
                      className="text-xs text-teal-700 hover:text-teal-900 hover:underline font-semibold"
                    >
                      {text.registerBtn}
                    </button>
                  </div>
                </form>
              ) : (
                /* Registration Enrollment Form */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">{text.fullName}</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">{text.nationalId}</label>
                      <input
                        type="text"
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                        placeholder="1-1009-XXXXX-XX-X"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">{text.email}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                        placeholder="john.doe@gmail.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">{text.phone}</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                        placeholder="081-234-5678"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{text.address}</label>
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <select
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                      >
                        <option value="Siam Paragon Area, Pathum Wan, Bangkok">Siam Paragon Area, Pathum Wan (Centermost)</option>
                        <option value="EmQuartier Area, Sukhumvit Rd, Bangkok">EmQuartier Area, Sukhumvit Rd (Eastside)</option>
                        <option value="Lumphini Park Area, Rama IV Rd, Bangkok">Lumphini Park Area, Rama IV Rd (Central South)</option>
                        <option value="Bang Rak Area, Charoen Krung Rd, Bangkok">Bang Rak Area, Charoen Krung Rd (Westside)</option>
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">{text.addressDesc}</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-950 text-teal-100 hover:bg-teal-900 py-3 rounded-xl text-xs font-semibold transition-all border border-teal-800 shadow-md mt-4"
                  >
                    {text.submitRegister}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
                    >
                      {text.backToLogin}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            /* Scanning biometric animation */
            <div className="py-12 text-center" key="scanning">
              <div className="relative w-36 h-36 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                
                {/* Simulated scan radar bar */}
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-teal-400 blur-[2px] shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />

                <div className="absolute inset-4 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center">
                  {biometricType === 'face' ? (
                    <Eye className="w-16 h-16 text-teal-700 animate-pulse" />
                  ) : (
                    <Fingerprint className="w-16 h-16 text-teal-700 animate-pulse" />
                  )}
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-800 mb-1.5">{text.scanning}</p>
              <p className="text-xs font-mono text-teal-600 font-semibold">{scanProgress}%</p>

              <div className="w-48 bg-slate-100 h-1.5 mx-auto rounded-full overflow-hidden mt-3 border border-slate-200">
                <motion.div 
                  className="bg-teal-500 h-full"
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-[10px] text-slate-400 leading-normal flex items-start gap-2">
        <Cpu className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>{text.emergencyWarn}</span>
      </div>
    </div>
  );
}
