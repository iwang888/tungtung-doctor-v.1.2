/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Doctor, Medication, QueueItem } from './types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-001',
    name: 'Prof. Dr. Somchai Prasertwanich',
    specialty: 'Cardiologist (Heart Specialist)',
    specialtyTh: 'อายุรแพทย์โรคหัวใจ (ผู้เชี่ยวชาญด้านหัวใจ)',
    hospitalBranch: 'mydoctor Sukhumvit (Headquarters)',
    rating: 4.9,
    availability: ['Mon', 'Wed', 'Fri'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'DOC-002',
    name: 'Assoc. Prof. Dr. Sarah Johnson',
    specialty: 'Neurologist (Brain & Nervous System)',
    specialtyTh: 'ประสาทแพทย์ (ผู้เชี่ยวชาญระบบสมองและประสาท)',
    hospitalBranch: 'mydoctor Silom',
    rating: 4.8,
    availability: ['Tue', 'Thu'],
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'DOC-003',
    name: 'Dr. Pitchaya Akkaraseth',
    specialty: 'Orthopedist (Bone & Joint Specialist)',
    specialtyTh: 'ศัลยแพทย์กระดูกและข้อ (ผู้เชี่ยวชาญด้านกระดูก)',
    hospitalBranch: 'mydoctor Thonglor',
    rating: 4.7,
    availability: ['Wed', 'Thu', 'Sat'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'DOC-004',
    name: 'Dr. Emily Watson',
    specialty: 'Pediatrician (Child Specialist)',
    specialtyTh: 'กุมารแพทย์ (ผู้เชี่ยวชาญโรคเด็ก)',
    hospitalBranch: 'mydoctor Sukhumvit (Headquarters)',
    rating: 4.9,
    availability: ['Mon', 'Tue', 'Fri', 'Sun'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'DOC-005',
    name: 'Asst. Prof. Dr. Kittinan Thanasarn',
    specialty: 'Gastroenterologist (Digestive System)',
    specialtyTh: 'แพทย์โรคระบบทางเดินอาหารและตับ',
    hospitalBranch: 'mydoctor Silom',
    rating: 4.6,
    availability: ['Mon', 'Tue', 'Thu'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'MED-101',
    name: 'Atorvastatin (LIPITOR) 20mg',
    nameTh: 'อะทอร์วาสแตติน (ลิปิเตอร์) 20 มิลลิกรัม',
    dosage: '1 tablet once daily',
    frequency: 'At bedtime',
    frequencyTh: 'ก่อนนอน',
    prescribedBy: 'Prof. Dr. Somchai Prasertwanich',
    date: '2026-06-15',
    refillsRemaining: 2,
    instructions: 'Take daily at bedtime to control bad cholesterol and protect blood vessels.',
    instructionsTh: 'รับประทานวันละ 1 เม็ดก่อนนอนเพื่อควบคุมคอเลสเตอรอลชนิดไม่ดีและป้องกันหลอดเลือดอุดตัน',
    status: 'active',
  },
  {
    id: 'MED-102',
    name: 'Metformin HCl (GLUCOPHAGE) 500mg',
    nameTh: 'เมทฟอร์มิน (กลูโคฟาจ) 500 มิลลิกรัม',
    dosage: '1 tablet twice daily',
    frequency: 'With breakfast and dinner',
    frequencyTh: 'พร้อมอาหารเช้าและเย็น',
    prescribedBy: 'Prof. Dr. Somchai Prasertwanich',
    date: '2026-06-15',
    refillsRemaining: 3,
    instructions: 'Take immediately after or with meals to lower blood glucose and avoid stomach upset.',
    instructionsTh: 'รับประทานพร้อมหรือหลังอาหารทันทีเพื่อควบคุมระดับน้ำตาลในเลือดและป้องกันอาการระคายเคืองกระเพาะ',
    status: 'active',
  },
  {
    id: 'MED-103',
    name: 'Amlodipine Besylate (NORVASC) 5mg',
    nameTh: 'แอมโลดิปีน (นอร์วาสค์) 5 มิลลิกรัม',
    dosage: '1 tablet once daily',
    frequency: 'In the morning',
    frequencyTh: 'ตอนเช้า',
    prescribedBy: 'Assoc. Prof. Dr. Sarah Johnson',
    date: '2026-05-10',
    refillsRemaining: 0,
    instructions: 'Take every morning to maintain stable blood pressure below 130/80 mmHg.',
    instructionsTh: 'รับประทานทุกเช้าเพื่อควบคุมระดับความดันโลหิตให้คงที่ต่ำกว่า 130/80 มม.ปรอท',
    status: 'completed',
  }
];

export const HOSPITAL_BRANCHES = [
  {
    name: 'mydoctor Sukhumvit (Headquarters)',
    nameTh: 'โรงพยาบาลมายด็อกเตอร์ สุขุมวิท (สำนักงานใหญ่)',
    address: '49 Sukhumvit Rd, Khlong Toei, Bangkok 10110',
    addressTh: '49 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    phone: '02-111-9999',
    latitude: 13.7303,
    longitude: 100.5701,
    image: 'https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'mydoctor Silom',
    nameTh: 'โรงพยาบาลมายด็อกเตอร์ สีลม',
    address: '120 Silom Rd, Suriyawong, Bang Rak, Bangkok 10500',
    addressTh: '120 ถนนสีลม แขวงสุริยวงศ์ เขตบางรัก กรุงเทพฯ 10500',
    phone: '02-222-8888',
    latitude: 13.7251,
    longitude: 100.5284,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'mydoctor Thonglor',
    nameTh: 'โรงพยาบาลมายด็อกเตอร์ ทองหล่อ',
    address: '255 Soi Thong Lo, Khlong Tan Nuea, Watthana, Bangkok 10110',
    addressTh: '255 ซอยทองหล่อ แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    phone: '02-333-7777',
    latitude: 13.7412,
    longitude: 100.5829,
    image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=400',
  }
];

export const DEPARTMENTS = [
  { id: 'cardio', name: 'Cardiology (Heart)', nameTh: 'ศูนย์หัวใจและหลอดเลือด', color: 'border-red-500 bg-red-50/50' },
  { id: 'neuro', name: 'Neurology (Brain)', nameTh: 'ศูนย์สมองและระบบประสาท', color: 'border-blue-500 bg-blue-50/50' },
  { id: 'ortho', name: 'Orthopedics (Bone & Joint)', nameTh: 'ศูนย์กระดูกและข้อ', color: 'border-amber-500 bg-amber-50/50' },
  { id: 'pediatric', name: 'Pediatrics (Children)', nameTh: 'ศูนย์กุมารเวชกรรม', color: 'border-emerald-500 bg-emerald-50/50' },
  { id: 'gastro', name: 'Gastroenterology (Digestive)', nameTh: 'ศูนย์โรคทางเดินอาหารและตับ', color: 'border-teal-500 bg-teal-50/50' }
];

export const INITIAL_QUEUES: QueueItem[] = [
  { department: 'Cardiology (Heart)', departmentTh: 'ศูนย์หัวใจและหลอดเลือด', currentNumber: 108, userNumber: 112, estimatedWaitMinutes: 18 },
  { department: 'Neurology (Brain)', departmentTh: 'ศูนย์สมองและระบบประสาท', currentNumber: 42, estimatedWaitMinutes: 0 },
  { department: 'Orthopedics (Bone & Joint)', departmentTh: 'ศูนย์กระดูกและข้อ', currentNumber: 64, estimatedWaitMinutes: 0 },
  { department: 'Pediatrics (Children)', departmentTh: 'ศูนย์กุมารเวชกรรม', currentNumber: 89, estimatedWaitMinutes: 0 }
];

export const SAMPLE_BANGKOK_LOCATIONS = [
  { name: 'Siam Paragon Area', address: '991 Rama I Rd, Pathum Wan, Bangkok 10330', lat: 13.7462, lng: 100.5348 },
  { name: 'EmQuartier Area', address: '693 Sukhumvit Rd, Khlong Toei, Bangkok 10110', lat: 13.7314, lng: 100.5698 },
  { name: 'Lumphini Park Area', address: 'Rama IV Rd, Pathum Wan, Bangkok 10330', lat: 13.7298, lng: 100.5372 },
  { name: 'Bang Rak Area', address: 'Charoen Krung Rd, Bang Rak, Bangkok 10500', lat: 13.7225, lng: 100.5147 }
];
