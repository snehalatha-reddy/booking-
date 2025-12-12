import { create } from 'zustand';
import { 
  Court, 
  Equipment, 
  Coach, 
  PricingRule, 
  Booking, 
  BookingFormData, 
  PriceBreakdown,
  BookingEquipment 
} from '@/types/booking';
import { 
  mockCourts, 
  mockEquipment, 
  mockCoaches, 
  mockCoachAvailability,
  mockPricingRules, 
  mockBookings 
} from '@/data/mockData';

interface BookingStore {
  // Data
  courts: Court[];
  equipment: Equipment[];
  coaches: Coach[];
  pricingRules: PricingRule[];
  bookings: Booking[];
  
  // Current booking state
  selectedDate: Date;
  selectedCourt: Court | null;
  selectedTimeSlot: { start: string; end: string } | null;
  selectedEquipment: BookingEquipment[];
  selectedCoach: Coach | null;
  
  // Actions
  setSelectedDate: (date: Date) => void;
  setSelectedCourt: (court: Court | null) => void;
  setSelectedTimeSlot: (slot: { start: string; end: string } | null) => void;
  toggleEquipment: (equipmentId: string, quantity: number) => void;
  setSelectedCoach: (coach: Coach | null) => void;
  resetBookingForm: () => void;
  
  // Calculated
  calculatePrice: () => PriceBreakdown;
  getAvailableSlots: (courtId: string, date: Date) => string[];
  isCoachAvailable: (coachId: string, date: Date, startTime: string, endTime: string) => boolean;
  
  // Booking actions
  confirmBooking: () => Booking | null;
  cancelBooking: (bookingId: string) => void;
  
  // Admin actions
  updateCourt: (court: Court) => void;
  updateEquipment: (equipment: Equipment) => void;
  updateCoach: (coach: Coach) => void;
  updatePricingRule: (rule: PricingRule) => void;
  addPricingRule: (rule: Omit<PricingRule, 'id'>) => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  // Initial data
  courts: mockCourts,
  equipment: mockEquipment,
  coaches: mockCoaches,
  pricingRules: mockPricingRules,
  bookings: mockBookings,
  
  // Initial booking state
  selectedDate: new Date(),
  selectedCourt: null,
  selectedTimeSlot: null,
  selectedEquipment: [],
  selectedCoach: null,
  
  // Actions
  setSelectedDate: (date) => set({ selectedDate: date, selectedTimeSlot: null }),
  setSelectedCourt: (court) => set({ selectedCourt: court, selectedTimeSlot: null }),
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  
  toggleEquipment: (equipmentId, quantity) => set((state) => {
    const existing = state.selectedEquipment.find(e => e.equipment_id === equipmentId);
    if (existing) {
      if (quantity <= 0) {
        return { selectedEquipment: state.selectedEquipment.filter(e => e.equipment_id !== equipmentId) };
      }
      return {
        selectedEquipment: state.selectedEquipment.map(e =>
          e.equipment_id === equipmentId ? { ...e, quantity } : e
        ),
      };
    }
    if (quantity > 0) {
      return { selectedEquipment: [...state.selectedEquipment, { equipment_id: equipmentId, quantity }] };
    }
    return state;
  }),
  
  setSelectedCoach: (coach) => set({ selectedCoach: coach }),
  
  resetBookingForm: () => set({
    selectedCourt: null,
    selectedTimeSlot: null,
    selectedEquipment: [],
    selectedCoach: null,
  }),
  
  calculatePrice: () => {
    const state = get();
    const breakdown: PriceBreakdown = {
      court_base: 0,
      court_modifiers: [],
      equipment_total: 0,
      equipment_items: [],
      coach_fee: 0,
      subtotal: 0,
      total: 0,
    };
    
    if (!state.selectedCourt || !state.selectedTimeSlot) {
      return breakdown;
    }
    
    const court = state.selectedCourt;
    const date = state.selectedDate;
    const startHour = parseInt(state.selectedTimeSlot.start.split(':')[0]);
    
    // Base court price
    breakdown.court_base = court.base_price_per_hour;
    let courtTotal = court.base_price_per_hour;
    
    // Apply pricing rules
    state.pricingRules.filter(r => r.is_active).forEach((rule) => {
      let applies = false;
      let modifierAmount = 0;
      
      switch (rule.type) {
        case 'peak_hours':
          if (rule.start_hour !== undefined && rule.end_hour !== undefined) {
            applies = startHour >= rule.start_hour && startHour < rule.end_hour;
          }
          break;
        case 'weekend':
          const dayOfWeek = date.getDay();
          applies = rule.days_of_week?.includes(dayOfWeek) || false;
          break;
        case 'indoor_premium':
          applies = court.type === 'indoor';
          break;
        case 'early_bird':
          if (rule.start_hour !== undefined && rule.end_hour !== undefined) {
            applies = startHour >= rule.start_hour && startHour < rule.end_hour;
          }
          break;
      }
      
      if (applies) {
        modifierAmount = breakdown.court_base * (rule.multiplier - 1);
        breakdown.court_modifiers.push({ rule: rule.name, amount: Math.round(modifierAmount * 100) / 100 });
        courtTotal *= rule.multiplier;
      }
    });
    
    // Equipment costs
    state.selectedEquipment.forEach((item) => {
      const equip = state.equipment.find(e => e.id === item.equipment_id);
      if (equip) {
        const itemTotal = equip.price_per_hour * item.quantity;
        breakdown.equipment_items.push({ name: equip.name, price: equip.price_per_hour, quantity: item.quantity });
        breakdown.equipment_total += itemTotal;
      }
    });
    
    // Coach fee
    if (state.selectedCoach) {
      breakdown.coach_fee = state.selectedCoach.hourly_rate;
    }
    
    breakdown.subtotal = Math.round((courtTotal + breakdown.equipment_total + breakdown.coach_fee) * 100) / 100;
    breakdown.total = breakdown.subtotal;
    
    return breakdown;
  },
  
  getAvailableSlots: (courtId, date) => {
    const state = get();
    const allSlots = [];
    for (let hour = 6; hour < 22; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    // Filter out booked slots
    const dateStr = date.toISOString().split('T')[0];
    const bookedSlots = state.bookings
      .filter(b => b.court_id === courtId && b.date === dateStr && b.status !== 'cancelled')
      .map(b => b.start_time);
    
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  },
  
  isCoachAvailable: (coachId, date, startTime, endTime) => {
    const dayOfWeek = date.getDay();
    const availability = mockCoachAvailability.filter(a => a.coach_id === coachId && a.day_of_week === dayOfWeek);
    
    if (availability.length === 0) return false;
    
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    return availability.some(a => {
      const availStart = parseInt(a.start_time.split(':')[0]);
      const availEnd = parseInt(a.end_time.split(':')[0]);
      return startHour >= availStart && endHour <= availEnd;
    });
  },
  
  confirmBooking: () => {
    const state = get();
    if (!state.selectedCourt || !state.selectedTimeSlot) return null;
    
    const priceBreakdown = state.calculatePrice();
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      user_id: 'user-1',
      court_id: state.selectedCourt.id,
      court: state.selectedCourt,
      date: state.selectedDate.toISOString().split('T')[0],
      start_time: state.selectedTimeSlot.start,
      end_time: state.selectedTimeSlot.end,
      status: 'confirmed',
      total_price: priceBreakdown.total,
      equipment: state.selectedEquipment,
      coach_id: state.selectedCoach?.id,
      coach: state.selectedCoach || undefined,
      price_breakdown: priceBreakdown,
      created_at: new Date().toISOString(),
    };
    
    set((s) => ({
      bookings: [...s.bookings, newBooking],
      selectedCourt: null,
      selectedTimeSlot: null,
      selectedEquipment: [],
      selectedCoach: null,
    }));
    
    return newBooking;
  },
  
  cancelBooking: (bookingId) => set((state) => ({
    bookings: state.bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    ),
  })),
  
  // Admin actions
  updateCourt: (court) => set((state) => ({
    courts: state.courts.map(c => c.id === court.id ? court : c),
  })),
  
  updateEquipment: (equipment) => set((state) => ({
    equipment: state.equipment.map(e => e.id === equipment.id ? equipment : e),
  })),
  
  updateCoach: (coach) => set((state) => ({
    coaches: state.coaches.map(c => c.id === coach.id ? coach : c),
  })),
  
  updatePricingRule: (rule) => set((state) => ({
    pricingRules: state.pricingRules.map(r => r.id === rule.id ? rule : r),
  })),
  
  addPricingRule: (rule) => set((state) => ({
    pricingRules: [...state.pricingRules, { ...rule, id: `rule-${Date.now()}` }],
  })),
}));
