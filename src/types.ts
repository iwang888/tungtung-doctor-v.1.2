/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'th' | 'en';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  nationalId: string;
  diagnoses: string[];
  allergies: string[];
  bloodType: string;
  createdAt: string;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  nationalId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  role: UserRole;
  isBiometricRegistered: boolean;
  weight?: number; // kg
  height?: number; // cm
  bmi?: number;
  specialty?: string; // for doctors
  hospitalBranch?: string; // for doctors
  availability?: string[]; // for doctors e.g. ["Mon", "Wed", "Fri"]
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialtyTh: string;
  hospitalBranch: string;
  rating: number;
  availability: string[];
  image: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  nameTh: string;
  dosage: string;
  frequency: string;
  frequencyTh: string;
  prescribedBy: string;
  date: string;
  refillsRemaining: number;
  instructions: string;
  instructionsTh: string;
  status: 'active' | 'completed';
}

export interface HomecareRequest {
  id: string;
  patientId: string;
  patientName: string;
  address: string;
  phone: string;
  condition: string;
  requestedDate: string;
  scheduledDate?: string;
  assignedTeam?: string;
  status: 'pending' | 'assigned' | 'completed';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  role: 'user' | 'assistant' | 'doctor' | 'staff';
  text: string;
  timestamp: string;
}

export interface QueueItem {
  department: string;
  departmentTh: string;
  currentNumber: number;
  userNumber?: number;
  estimatedWaitMinutes: number;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  event: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
}
