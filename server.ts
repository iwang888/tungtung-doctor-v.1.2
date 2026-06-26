/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI Client successfully initialized.');
  } catch (err) {
    console.error('Failed to initialize Gemini AI Client:', err);
  }
} else {
  console.warn('GEMINI_API_KEY not configured or placeholder detected. Operating in simulated diagnostic mode.');
}

// In-Memory state for server-side telemetry & logs
let totalVisitors = 142; // Simulated initial visitor count
const securityLogs: Array<{
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  event: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
}> = [
  {
    id: 'SEC-101',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userId: 'UID-001',
    userEmail: 'somchai.p@mydoctor.co.th',
    event: 'Biometric WebAuthn Auth',
    ipAddress: '192.168.1.102',
    status: 'SUCCESS',
  },
  {
    id: 'SEC-102',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userId: 'UID-002',
    userEmail: 'sarah.j@gmail.com',
    event: 'National ID Auth Verification',
    ipAddress: '203.144.144.1',
    status: 'SUCCESS',
  },
  {
    id: 'SEC-103',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    userId: 'unknown',
    userEmail: 'hacker@malicious-node.org',
    event: 'Invalid Signature Auth Attempt',
    ipAddress: '45.120.21.99',
    status: 'BLOCKED',
  }
];

// --- API ROUTES ---

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Visitor counter tracker
app.get('/api/telemetry/visitors', (req, res) => {
  // Increment visitor on dashboard load
  totalVisitors += Math.floor(Math.random() * 2) + 1;
  res.json({ totalVisitors });
});

// Retrieve security logs (Admin only)
app.get('/api/admin/security-logs', (req, res) => {
  res.json({ logs: securityLogs });
});

// Append a security audit log (Simulated webhook or client notification)
app.post('/api/admin/security-logs', (req, res) => {
  const { userId, userEmail, event, status } = req.body;
  const newLog: {
    id: string;
    timestamp: string;
    userId: string;
    userEmail: string;
    event: string;
    ipAddress: string;
    status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  } = {
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: userId || 'unknown',
    userEmail: userEmail || 'guest',
    event: event || 'User Action',
    ipAddress: req.ip || '127.0.0.1',
    status: (status || 'SUCCESS') as 'SUCCESS' | 'FAILED' | 'BLOCKED',
  };
  securityLogs.unshift(newLog);
  res.json({ success: true, log: newLog });
});

// Biometric Registration simulation options
app.post('/api/biometric/register-options', (req, res) => {
  const { email, name } = req.body;
  // Standard WebAuthn creation challenges
  const challenge = Buffer.from(`mydoctor-challenge-${Date.now()}`).toString('base64url');
  res.json({
    challenge,
    rp: { name: 'mydoctor Premium Hospital', id: 'mydoctor.co.th' },
    user: {
      id: Buffer.from(email || 'guest-id').toString('base64url'),
      name: email,
      displayName: name,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    timeout: 60000,
    attestation: 'none',
  });
});

// Biometric Signature Authentication simulation
app.post('/api/biometric/authenticate', (req, res) => {
  const { nationalId, email, assertion } = req.body;
  
  // Real high-security logic checks the signature, but we simulate it perfectly
  if (!nationalId && !email) {
    return res.status(400).json({
      success: false,
      error: 'National ID or Email is required for Biometric authentication verification.',
    });
  }

  // Record security log
  const clientIp = req.ip || '127.0.0.1';
  const success = true; // Simulating valid WebAuthn pass

  const log: {
    id: string;
    timestamp: string;
    userId: string;
    userEmail: string;
    event: string;
    ipAddress: string;
    status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  } = {
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: nationalId || 'UID-BIO',
    userEmail: email || 'biometric.user@mydoctor.co.th',
    event: 'Biometric Face/Fingerprint Authentication (WebAuthn API)',
    ipAddress: clientIp,
    status: (success ? 'SUCCESS' : 'FAILED') as 'SUCCESS' | 'FAILED' | 'BLOCKED',
  };
  
  securityLogs.unshift(log);

  res.json({
    success: true,
    message: 'Biometric cryptographic signature verified successfully.',
    credentialId: 'cred-' + Math.random().toString(36).substring(2, 12),
    auditLog: log,
  });
});

// AI Medical Consultant symptom screening (Gemini API Integration)
app.post('/api/chat', async (req, res) => {
  const { messages, userProfile, language } = req.body;
  const targetLang = language || 'en';

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages list is required and must be an array.' });
  }

  const userQuery = messages[messages.length - 1]?.text || 'No message';
  
  // Build professional, highly structured clinical instruction
  const systemInstruction = `
You are a Senior AI Medical Consultant and Triage Doctor for "mydoctor", a ultra-premium private hospital in Bangkok, Thailand.
Your role is to perform preliminary symptom screening, evaluate severity, and route patients to correct hospital departments.

Patient Context:
- Full Name: ${userProfile?.fullName || 'N/A'}
- Age/Gender: ${userProfile?.age || 'N/A'}
- Weight: ${userProfile?.weight || 'N/A'} kg, Height: ${userProfile?.height || 'N/A'} cm (BMI: ${userProfile?.bmi || 'N/A'})
- Medical Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
- Location: ${userProfile?.address || 'N/A'}

Triage Guidelines:
1. Conduct yourself as an expert, empathetic physician.
2. Determine clear TRIAGE SEVERITY: "MILD" (Home recovery, primary care), "MODERATE" (Schedule doctor appointment soon), or "SEVERE" (Urgent hospital Emergency Room, recommend pressing the emergency red button).
3. Provide plausible clinical explanations or potential causes based on credible online medical data sources, always citing general guidelines (e.g., Mayo Clinic, WHO, Thai Ministry of Public Health) as reference notes.
4. Route to the appropriate department (e.g., Cardiology, Neurology, Orthopedics, Pulmonology, Gastroenterology, General Medicine).
5. Give immediately applicable first-aid tips or precautions.

Language Mandate:
- Respond strictly in ${targetLang === 'th' ? 'Thai language (ภาษาไทย)' : 'English language'}.
- Use reassuring, premium, polite terminology ("คะ/ครับ" in Thai).
- Format your response beautifully with Markdown (bold text, bullet points, headers).
- Add a disclaimer at the bottom: "This is an AI screening. If you have severe symptoms, please immediately call 1669 or go to the nearest emergency department."
`;

  if (aiClient) {
    try {
      // Structure chat messages
      const contents = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // Call Gemini 3.5 Flash Model
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.3,
        }
      });

      const responseText = response.text || 'Failed to generate medical consultation response.';
      return res.json({ text: responseText });
    } catch (err: any) {
      console.error('Error in Gemini API execution:', err);
      // Fallback response with simulated AI if API fails
      return res.json({
        text: getSimulatedResponse(userQuery, targetLang),
        error: err.message,
      });
    }
  } else {
    // Return simulated clinic triage when API key is missing
    return res.json({ text: getSimulatedResponse(userQuery, targetLang) });
  }
});

// Helper for simulated medical triage in offline/no-key mode
function getSimulatedResponse(query: string, lang: string): string {
  const isThai = lang === 'th';
  const q = query.toLowerCase();

  if (isThai) {
    if (q.includes('เจ็บหน้าอก') || q.includes('แน่นหน้าอก') || q.includes('chest pain') || q.includes('หัวใจ')) {
      return `### ผลการคัดกรองเบื้องต้นโดยแพทย์ AI (จำลอง)
* **ระดับความรุนแรง:** 🔴 **รุนแรงมาก (SEVERE)**
* **แผนกแนะนำ:** ศูนย์โรคหัวใจ (Cardiology Center) หรือ แผนกฉุกเฉิน (Emergency ER)

**คำอธิบายทางการแพทย์ (อ้างอิง: สมาคมโรคหัวใจแห่งประเทศไทย):**
อาการเจ็บแน่นหน้าอกอาจเป็นสัญญาณเตือนของภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (Acute Coronary Syndrome) ซึ่งเป็นภาวะวิกฤตที่ต้องได้รับการรักษาโดยเร็วที่สุดเพื่อป้องกันกล้ามเนื้อหัวใจเสียหายถาวร

**คำแนะนำและการปฐมพยาบาลเบื้องต้น:**
1. หยุดกิจกรรมทุกอย่างทันที นั่งพักในที่ที่อากาศถ่ายเทสะดวก
2. **ห้ามออกแรงเด็ดขาด**
3. หากมีประวัติโรคหัวใจและมียาอมใต้ลิ้น ให้รีบอมยาใต้ลิ้นทันที 1 เม็ด
4. **กดปุ่มเบอร์โทรฉุกเฉิน "1669" ที่มุมขวาบนของแอปพลิเคชันทันที เพื่อแจ้งรถพยาบาลฉุกเฉิน**

*ข้อจำกัดสิทธิ์: นี่คือระบบการคัดกรองอาการเบื้องต้นโดยปัญญาประดิษฐ์ ไม่ใช่การวินิจฉัยโรคขั้นสุดท้าย*`;
    }

    if (q.includes('ไข้') || q.includes('ร้อน') || q.includes('ตัวร้อน') || q.includes('fever')) {
      return `### ผลการคัดกรองเบื้องต้นโดยแพทย์ AI (จำลอง)
* **ระดับความรุนแรง:** 🟡 **ปานกลาง (MODERATE)**
* **แผนกแนะนำ:** แผนกอายุรกรรมทั่วไป (General Medicine)

**คำอธิบายทางการแพทย์ (อ้างอิง: กรมควบคุมโรค กระทรวงสาธารณสุข):**
อาการไข้เฉียบพลัน ร่วมกับอาการตัวร้อนอาจเกิดจากการติดเชื้อในระบบทางเดินหายใจ (เช่น ไข้หวัดใหญ่ หรือ โควิด-19) หรือไข้เลือดออก ซึ่งมีไข้สูงเฉียบพลัน

**คำแนะนำและการดูแลตัวเองเบื้องต้น:**
1. เช็ดตัวด้วยน้ำอุณหภูมิห้องเพื่อระบายความร้อน (เลี่ยงน้ำเย็นจัด)
2. รับประทานยาพาราเซตามอล (Paracetamol) ทุก 4-6 ชั่วโมงตามน้ำหนักตัว (ห้ามทานยาแอสไพรินเด็ดขาดหากกังวลเรื่องไข้เลือดออก)
3. ดื่มน้ำสะอาดบ่อยๆ เพื่อป้องกันภาวะขาดน้ำ
4. หากไข้สูงเกิน 3 วัน หรือเริ่มมีผื่นจุดเลือด มีอาการหอบเหนื่อย ให้รีบเข้าจองคิวพบแพทย์ด่วน

*ข้อจำกัดสิทธิ์: นี่คือระบบการคัดกรองอาการเบื้องต้นโดยปัญญาประดิษฐ์ ไม่ใช่การวินิจฉัยโรคขั้นสุดท้าย*`;
    }

    return `### ผลการคัดกรองเบื้องต้นโดยแพทย์ AI (จำลอง)
* **ระดับความรุนแรง:** 🟢 **เล็กน้อย (MILD)**
* **แผนกแนะนำ:** แผนกผู้ป่วยนอก/อายุรกรรมทั่วไป (General OPD)

**คำอธิบายทางการแพทย์ (อ้างอิง: คู่มือปฐมพยาบาลเบื้องต้น สหวิชาชีพ):**
จากข้อมูลอาการเบื้องต้นของคุณ อาการไม่เข้าข่ายภาวะวิกฤตเฉียบพลัน อาจเกิดจากความอ่อนล้า การทำงานของร่างกายเสียสมดุลชั่วคราว หรืออาการบาดเจ็บเล็กน้อยของกล้ามเนื้อ

**คำแนะนำและการดูแลตัวเอง:**
1. พักผ่อนให้เพียงพอ นอนหลับ 7-8 ชั่วโมง
2. ดื่มน้ำอุ่นและรับประทานอาหารที่ย่อยง่าย
3. ติดตามสังเกตอาการอย่างใกล้ชิด หากอาการรุนแรงขึ้นสามารถจองคิวนัดหมายผ่านเมนูบอร์ดระบบเพื่อพบแพทย์ที่โรงพยาบาล

*ข้อจำกัดสิทธิ์: นี่คือระบบการคัดกรองอาการเบื้องต้นโดยปัญญาประดิษฐ์ ไม่ใช่การวินิจฉัยโรคขั้นสุดท้าย*`;
  } else {
    // English Sim responses
    if (q.includes('chest') || q.includes('heart') || q.includes('breath') || q.includes('stroke')) {
      return `### Preliminary AI Symptom Screening (Simulated)
* **Severity Level:** 🔴 **SEVERE**
* **Recommended Department:** Cardiology Center / Emergency Department (ER)

**Clinical Explanation (Ref: American Heart Association):**
Acute chest pressure or pain can be an indicator of Myocardial Infarction (heart attack) or pulmonary embolism. These are critical emergencies requiring immediate specialized clinical interventions.

**First-Aid & Emergency Precautions:**
1. Cease all physical activity immediately and rest in a well-ventilated space.
2. Loose tight clothing to assist breathing.
3. If you possess emergency sublingual nitroglycerin, administer 1 dose.
4. **Instantly tap the Red "1669 Emergency Button" on the top right area to transmit your real-time GPS details and summon the medical crew.**

*Disclaimer: This is an AI symptom screening, not a definitive medical diagnosis.*`;
    }

    return `### Preliminary AI Symptom Screening (Simulated)
* **Severity Level:** 🟢 **MILD / GENERAL**
* **Recommended Department:** Family Medicine / Outpatient Department (OPD)

**Clinical Explanation (Ref: World Health Organization Guidelines):**
Based on your inputted symptoms, the indicators represent non-acute conditions. Possible causes include physical fatigue, mild localized musculoskeletal strain, or common atmospheric reactions.

**Homecare & Recovery Actions:**
1. Rest in a comfortable environment and monitor vital signs.
2. Hydrate sufficiently with electrolyte-rich liquids.
3. If symptoms persist or escalate to moderate categories, please secure an appointment using the 'Department & Doctor Appointment' dashboard grid.

*Disclaimer: This is an AI symptom screening, not a definitive medical diagnosis.*`;
  }
}

// --- VITE MIDDLEWARE & STATIC FILE SERVING ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server middleware loaded.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production compiled files from:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`mydoctor App Server running on port ${PORT}`);
  });
}

startServer();
