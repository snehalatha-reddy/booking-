// Types for the Badminton Court Booking System

export type CourtType = 'indoor' | 'outdoor';

export interface Court {
  id: string;
  name: string;
  type: CourtType;
  is_active: boolean;
  base_price_per_hour: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'racket' | 'shoes' | 'shuttlecock';
  quantity_total: number;
  quantity_available: number;
  price_per_hour: number;
  is_active: boolean;
}

export interface Coach {
  id: string;
  name: string;
  bio: string;
  hourly_rate: number;
  avatar_url?: string;
  is_active: boolean;
  specialization: string;
}

export interface CoachAvailability {
  id: string;
  coach_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // HH:MM format
  end_time: string;
}

export type PricingRuleType = 'peak_hours' | 'weekend' | 'indoor_premium' | 'holiday' | 'early_bird';

export interface PricingRule {
  id: string;
  name: string;
  type: PricingRuleType;
  multiplier: number; // e.g., 1.5 for 50% increase
  is_active: boolean;
  start_hour?: number; // For time-based rules
  end_hour?: number;
  days_of_week?: number[]; // For day-based rules
  description: string;
}

export interface TimeSlot {
  start: string; // HH:MM
  end: string;
  is_available: boolean;
  is_peak: boolean;
  price: number;
}

export interface BookingEquipment {
  equipment_id: string;
  quantity: number;
}

export interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  court?: Court;
  date: string; // YYYY-MM-DD
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  equipment: BookingEquipment[];
  coach_id?: string;
  coach?: Coach;
  price_breakdown: PriceBreakdown;
  created_at: string;
}

export interface PriceBreakdown {
  court_base: number;
  court_modifiers: { rule: string; amount: number }[];
  equipment_total: number;
  equipment_items: { name: string; price: number; quantity: number }[];
  coach_fee: number;
  subtotal: number;
  total: number;
}

export interface BookingFormData {
  date: Date;
  court_id: string;
  start_time: string;
  end_time: string;
  equipment: BookingEquipment[];
  coach_id?: string;
}

export interface WaitlistEntry {
  id: string;
  user_id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'waiting' | 'notified' | 'expired';
  created_at: string;
}
