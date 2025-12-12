import { Court, Equipment, Coach, CoachAvailability, PricingRule, Booking } from '@/types/booking';

// Mock data for the booking system
export const mockCourts: Court[] = [
  { id: 'court-1', name: 'Court 1', type: 'indoor', is_active: true, base_price_per_hour: 40 },
  { id: 'court-2', name: 'Court 2', type: 'indoor', is_active: true, base_price_per_hour: 40 },
  { id: 'court-3', name: 'Court 3', type: 'outdoor', is_active: true, base_price_per_hour: 25 },
  { id: 'court-4', name: 'Court 4', type: 'outdoor', is_active: true, base_price_per_hour: 25 },
];

export const mockEquipment: Equipment[] = [
  { id: 'equip-1', name: 'Pro Racket', type: 'racket', quantity_total: 10, quantity_available: 8, price_per_hour: 5, is_active: true },
  { id: 'equip-2', name: 'Standard Racket', type: 'racket', quantity_total: 15, quantity_available: 12, price_per_hour: 3, is_active: true },
  { id: 'equip-3', name: 'Court Shoes', type: 'shoes', quantity_total: 8, quantity_available: 6, price_per_hour: 4, is_active: true },
  { id: 'equip-4', name: 'Feather Shuttlecocks (3 pack)', type: 'shuttlecock', quantity_total: 20, quantity_available: 15, price_per_hour: 6, is_active: true },
];

export const mockCoaches: Coach[] = [
  { 
    id: 'coach-1', 
    name: 'Sarah Chen', 
    bio: 'Former national team player with 15 years of coaching experience. Specializes in doubles strategy and footwork.',
    hourly_rate: 50,
    is_active: true,
    specialization: 'Doubles Strategy',
    avatar_url: undefined
  },
  { 
    id: 'coach-2', 
    name: 'Michael Torres', 
    bio: 'Certified BWF Level 2 coach. Expert in improving singles game technique and competitive play.',
    hourly_rate: 45,
    is_active: true,
    specialization: 'Singles Technique',
    avatar_url: undefined
  },
  { 
    id: 'coach-3', 
    name: 'Priya Sharma', 
    bio: 'Youth development specialist. Great with beginners and intermediate players looking to level up.',
    hourly_rate: 35,
    is_active: true,
    specialization: 'Beginner Training',
    avatar_url: undefined
  },
];

export const mockCoachAvailability: CoachAvailability[] = [
  // Sarah Chen - Available Mon-Fri mornings and evenings
  { id: 'avail-1', coach_id: 'coach-1', day_of_week: 1, start_time: '08:00', end_time: '12:00' },
  { id: 'avail-2', coach_id: 'coach-1', day_of_week: 1, start_time: '17:00', end_time: '21:00' },
  { id: 'avail-3', coach_id: 'coach-1', day_of_week: 2, start_time: '08:00', end_time: '12:00' },
  { id: 'avail-4', coach_id: 'coach-1', day_of_week: 2, start_time: '17:00', end_time: '21:00' },
  { id: 'avail-5', coach_id: 'coach-1', day_of_week: 3, start_time: '08:00', end_time: '12:00' },
  { id: 'avail-6', coach_id: 'coach-1', day_of_week: 4, start_time: '17:00', end_time: '21:00' },
  { id: 'avail-7', coach_id: 'coach-1', day_of_week: 5, start_time: '08:00', end_time: '12:00' },
  // Michael Torres - Available Tue-Sat afternoons
  { id: 'avail-8', coach_id: 'coach-2', day_of_week: 2, start_time: '14:00', end_time: '21:00' },
  { id: 'avail-9', coach_id: 'coach-2', day_of_week: 3, start_time: '14:00', end_time: '21:00' },
  { id: 'avail-10', coach_id: 'coach-2', day_of_week: 4, start_time: '14:00', end_time: '21:00' },
  { id: 'avail-11', coach_id: 'coach-2', day_of_week: 5, start_time: '14:00', end_time: '21:00' },
  { id: 'avail-12', coach_id: 'coach-2', day_of_week: 6, start_time: '10:00', end_time: '18:00' },
  // Priya Sharma - Available weekends and Wed evenings
  { id: 'avail-13', coach_id: 'coach-3', day_of_week: 0, start_time: '09:00', end_time: '17:00' },
  { id: 'avail-14', coach_id: 'coach-3', day_of_week: 3, start_time: '18:00', end_time: '21:00' },
  { id: 'avail-15', coach_id: 'coach-3', day_of_week: 6, start_time: '09:00', end_time: '17:00' },
];

export const mockPricingRules: PricingRule[] = [
  {
    id: 'rule-1',
    name: 'Peak Hours',
    type: 'peak_hours',
    multiplier: 1.5,
    is_active: true,
    start_hour: 18,
    end_hour: 21,
    description: '50% surcharge during evening peak hours (6-9 PM)',
  },
  {
    id: 'rule-2',
    name: 'Weekend Rate',
    type: 'weekend',
    multiplier: 1.25,
    is_active: true,
    days_of_week: [0, 6],
    description: '25% surcharge on weekends (Sat & Sun)',
  },
  {
    id: 'rule-3',
    name: 'Indoor Premium',
    type: 'indoor_premium',
    multiplier: 1.2,
    is_active: true,
    description: '20% premium for indoor courts (climate controlled)',
  },
  {
    id: 'rule-4',
    name: 'Early Bird',
    type: 'early_bird',
    multiplier: 0.85,
    is_active: true,
    start_hour: 6,
    end_hour: 9,
    description: '15% discount for early morning sessions (6-9 AM)',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    user_id: 'user-1',
    court_id: 'court-1',
    court: mockCourts[0],
    date: '2024-12-15',
    start_time: '18:00',
    end_time: '19:00',
    status: 'confirmed',
    total_price: 78,
    equipment: [{ equipment_id: 'equip-1', quantity: 2 }],
    coach_id: undefined,
    price_breakdown: {
      court_base: 40,
      court_modifiers: [{ rule: 'Peak Hours', amount: 20 }, { rule: 'Indoor Premium', amount: 8 }],
      equipment_total: 10,
      equipment_items: [{ name: 'Pro Racket', price: 5, quantity: 2 }],
      coach_fee: 0,
      subtotal: 78,
      total: 78,
    },
    created_at: '2024-12-10T10:00:00Z',
  },
];

// Generate time slots for a day
export function generateTimeSlots(startHour = 6, endHour = 22): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

// Check if a time is during peak hours
export function isPeakHour(hour: number): boolean {
  const peakRule = mockPricingRules.find(r => r.type === 'peak_hours' && r.is_active);
  if (!peakRule) return false;
  return hour >= (peakRule.start_hour || 0) && hour < (peakRule.end_hour || 24);
}

// Check if a date is a weekend
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
