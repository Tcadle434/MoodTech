// Common types used across the application

export enum MoodType {
  HAPPY = 'happy',
  NEUTRAL = 'neutral',
  SAD = 'sad',
}

export interface HealthData {
  steps?: number;
  distance?: number;
  calories?: number;
}

export interface MoodEntry {
  id: string;
  date: string; // ISO date string
  mood: MoodType;
  note?: string;
  healthData?: HealthData;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}