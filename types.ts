export enum AppView {
  LANDING = 'LANDING',
  TRIAGE = 'TRIAGE',
  PAYMENT = 'PAYMENT',
  DASHBOARD = 'DASHBOARD',
  DOCTOR_DASHBOARD = 'DOCTOR_DASHBOARD',
  VERIFY = 'VERIFY',
}

export enum CertificateType {
  SICK_LEAVE = 'Sick Leave / Absence',
  GYM_CLEARANCE = 'Gym/Sports Clearance',
  HEALTH_CHECK = 'General Health Check',
  WORK_FITNESS = 'Fit for Work',
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export interface MedicalCase {
  id: string;
  patientName: string;
  certificateType: CertificateType;
  symptoms: string;
  summary: string; // AI Generated
  redFlags: string[]; // AI Generated
  status: 'PENDING_PAYMENT' | 'PENDING_DOCTOR' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  doctorName?: string;
  issuedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  role: 'PATIENT' | 'DOCTOR';
}
