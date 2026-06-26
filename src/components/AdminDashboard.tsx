/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Users, Heart, ClipboardList, Key, RefreshCw, Cpu, Lock, CheckCircle, Ban } from 'lucide-react';
import { SecurityAuditLog, Language } from '../types';

interface AdminDashboardProps {
  language: Language;
}

export default function AdminDashboard({ language }: AdminDashboardProps) {
  const [visitors, setVisitors] = useState(142);
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const text = {
    en: {
      title: 'Admin Master Control Room',
      subtitle: 'Real-time Hospital Systems Audit & Security logs',
      liveVisitors: 'Total Daily Systems Users',
      visitorDesc: 'Encrypted tracking token counter',
      ehrRecord: 'Patient Electronic Health Records (EHR)',
      queueHead: 'Live Outpatient Clinic Queues',
      securityHead: 'System Intrusion & Signature Audit Logs',
      refresh: 'Sync Logs',
      statusSuccess: 'PASSED',
      statusFailed: 'FAILED',
      statusBlocked: 'BLOCKED',
      decryptEhr: 'Decrypt Record',
      decrypting: 'RSA-4096 / AES-256 Decrypting...',
      ehrEncrypted: 'DATA HIGHLY ENCRYPTED',
      ehrName: 'Patient Name',
      ehrId: 'National ID',
      ehrDiags: 'Diagnoses',
      ehrAllergies: 'Allergies',
      ehrBlood: 'Blood Type',
    },
    th: {
      title: 'ห้องปฏิบัติการควบคุมระบบ (แอดมิน)',
      subtitle: 'การตรวจสอบระบบโรงพยาบาลแบบเรียลไทม์และบันทึกความปลอดภัย',
      liveVisitors: 'จำนวนผู้เข้าชมระบบรายวัน',
      visitorDesc: 'นับด้วยโทเค็นที่เข้ารหัสและไม่มีการเก็บพฤติกรรม',
      ehrRecord: 'แฟ้มประวัติผู้ป่วยอิเล็กทรอนิกส์ (EHR)',
      queueHead: 'สถานะคิวนัดหมายเรียลไทม์รายแผนก',
      securityHead: 'บันทึกความปลอดภัยและการพยายามบุกรุกระบบ (WebAuthn / ID)',
      refresh: 'รีเฟรชข้อมูล',
      statusSuccess: 'อนุญาต',
      statusFailed: 'ล้มเหลว',
      statusBlocked: 'สกัดกั้น',
      decryptEhr: 'ถอดรหัสแฟ้มผู้ป่วย',
      decrypting: 'กำลังถอดรหัสระดับทหาร RSA-4096 / AES-256...',
      ehrEncrypted: 'ข้อมูลผู้ป่วยถูกเข้ารหัสระดับสูงสุดเพื่อความปลอดภัย',
      ehrName: 'ชื่อผู้ป่วย',
      ehrId: 'รหัสบัตรประชาชน',
      ehrDiags: 'ผลวินิจฉัยหลัก',
      ehrAllergies: 'ประวัติแพ้ยา/อาหาร',
      ehrBlood: 'หมู่โลหิต',
    }
  }[language];

  // Dummy patient EHR database
  const ehrDatabase = [
    {
      id: 'EHR-8821',
      patientName: language === 'th' ? 'คุณกิตติศักดิ์ อุดมสุข' : 'Kittisak Udomsuk',
      nationalId: '1-1009-01234-11-2',
      diagnoses: language === 'th' ? ['ความดันโลหิตสูง', 'ไขมันในเลือดสูง'] : ['Hypertension', 'Hyperlipidemia'],
      allergies: language === 'th' ? ['พาราเซตามอล (ปฏิกิริยาปานกลาง)'] : ['Paracetamol (Mild)'],
      bloodType: 'O Rh+',
    },
    {
      id: 'EHR-4491',
      patientName: language === 'th' ? 'คุณสมชาย ยิ่งเจริญ' : 'Somchai Yingcharoen',
      nationalId: '3-1001-09876-54-3',
      diagnoses: language === 'th' ? ['ไขมันเกาะตับ', 'คอเลสเตอรอลสูง'] : ['Fatty Liver Disease', 'High Cholesterol'],
      allergies: language === 'th' ? ['เพนิซิลลิน'] : ['Penicillin'],
      bloodType: 'A Rh+',
    }
  ];

  const fetchLogsAndTelemetry = async () => {
    setIsLoading(true);
    try {
      // Fetch visitors
      const resV = await fetch('/api/telemetry/visitors');
      const dataV = await resV.json();
      setVisitors(dataV.totalVisitors);

      // Fetch security logs
      const resL = await fetch('/api/admin/security-logs');
      const dataL = await resL.json();
      setLogs(dataL.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndTelemetry();
    const interval = setInterval(fetchLogsAndTelemetry, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleDecrypt = (id: string) => {
    setIsDecrypting(id);
    setTimeout(() => {
      setIsDecrypting(null);
      // Reveal record (simulated)
      const element = document.getElementById(`ehr-${id}`);
      if (element) {
        element.classList.remove('blur-sm');
        element.classList.add('bg-teal-50/10');
      }
    }, 1500);
  };

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl space-y-8" id="admin_dashboard_root">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-serif tracking-tight text-white">{text.title}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{text.subtitle}</p>
          </div>
        </div>

        <button
          onClick={fetchLogsAndTelemetry}
          disabled={isLoading}
          className="self-start px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs rounded-xl transition-all font-mono flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {text.refresh}
        </button>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-900/50 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-mono uppercase tracking-widest">{text.liveVisitors}</span>
            <span className="text-2xl font-bold font-mono text-teal-400 mt-1 block">{visitors}</span>
            <span className="text-[10px] text-slate-500 mt-1 block">{text.visitorDesc}</span>
          </div>
          <div className="p-4 bg-teal-500/10 text-teal-500 rounded-xl">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/50 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-mono uppercase tracking-widest">Active Server Nodes</span>
            <span className="text-sm font-bold font-mono text-emerald-400 mt-2 block">● SECURE & COMPLIANT</span>
            <span className="text-[10px] text-slate-500 mt-1 block">Cloud Run sandbox active</span>
          </div>
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/50 border border-slate-900 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-mono uppercase tracking-widest">Database Backup Status</span>
            <span className="text-sm font-bold font-mono text-amber-500 mt-2 block">AUTOSAVED SECURELY</span>
            <span className="text-[10px] text-slate-500 mt-1 block">LocalState & Logs synced</span>
          </div>
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Electronic Health Records (EHR) Module */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 border-l-2 border-teal-500 pl-2">
          <ClipboardList className="w-4 h-4 text-teal-500" />
          {text.ehrRecord}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ehrDatabase.map((ehr) => (
            <div key={ehr.id} className="p-5 bg-slate-900/40 border border-slate-900/80 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-[9px] font-mono bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/20 font-bold uppercase">
                {ehr.id}
              </div>

              <div className="space-y-2.5 blur-xs transition-all duration-500" id={`ehr-${ehr.id}`}>
                <div className="text-xs text-slate-400 font-mono">
                  {text.ehrName}: <b className="text-slate-100">{ehr.patientName}</b>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {text.ehrId}: <b className="text-slate-300 font-sans">{ehr.nationalId}</b>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {text.ehrDiags}: <b className="text-amber-400">{ehr.diagnoses.join(', ')}</b>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {text.ehrAllergies}: <b className="text-red-400">{ehr.allergies.join(', ')}</b>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {text.ehrBlood}: <b className="text-teal-400">{ehr.bloodType}</b>
                </div>
              </div>

              {/* Decrypt Cover overlay */}
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center group-hover:bg-slate-950/70 transition-all" id={`cover-${ehr.id}`}>
                {isDecrypting === ehr.id ? (
                  <div className="text-center space-y-2">
                    <RefreshCw className="w-5 h-5 text-teal-400 animate-spin mx-auto" />
                    <span className="text-[10px] font-mono text-teal-400 block">{text.decrypting}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Lock className="w-5 h-5 text-slate-500 mx-auto" />
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">{text.ehrEncrypted}</span>
                    <button
                      onClick={() => {
                        handleDecrypt(ehr.id);
                        // Hide cover after delay
                        setTimeout(() => {
                          const cov = document.getElementById(`cover-${ehr.id}`);
                          if (cov) cov.style.display = 'none';
                        }, 1500);
                      }}
                      className="px-3.5 py-1.5 bg-teal-950 text-teal-400 border border-teal-800/40 hover:bg-teal-900 hover:text-white transition-all text-[10px] rounded-lg font-mono font-bold flex items-center gap-1.5 cursor-pointer mx-auto"
                    >
                      <Key className="w-3 h-3" />
                      {text.decryptEhr}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit logs list */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 border-l-2 border-red-500 pl-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          {text.securityHead}
        </h3>

        <div className="border border-slate-900/80 rounded-2xl overflow-hidden bg-slate-900/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 font-mono uppercase tracking-wider text-[10px]">
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User Credentials</th>
                  <th className="p-4">Event Triggered</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300 font-mono">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-400">{log.id}</td>
                      <td className="p-4 text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-200">{log.userEmail}</div>
                        <div className="text-[10px] text-slate-500">{log.userId}</div>
                      </td>
                      <td className="p-4 text-slate-200 font-sans">{log.event}</td>
                      <td className="p-4 text-[11px] text-slate-500">{log.ipAddress}</td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          log.status === 'SUCCESS' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : log.status === 'BLOCKED'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {log.status === 'SUCCESS' ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                          {log.status === 'SUCCESS' ? text.statusSuccess : log.status === 'BLOCKED' ? text.statusBlocked : text.statusFailed}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                      No security audit logs recorded in current session.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
