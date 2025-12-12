import { useState } from 'react';
import { format } from 'date-fns';
import { useBookingStore } from '@/store/bookingStore';
import { Header } from '@/components/Header';
import { DatePicker } from '@/components/booking/DatePicker';
import { CourtSelector } from '@/components/booking/CourtSelector';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import { EquipmentSelector } from '@/components/booking/EquipmentSelector';
import { CoachSelector } from '@/components/booking/CoachSelector';
import { PriceBreakdownCard } from '@/components/booking/PriceBreakdownCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, CalendarCheck } from 'lucide-react';
import { isPeakHour } from '@/data/mockData';

const Index = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const {
    courts,
    equipment,
    coaches,
    selectedDate,
    selectedCourt,
    selectedTimeSlot,
    selectedEquipment,
    selectedCoach,
    setSelectedDate,
    setSelectedCourt,
    setSelectedTimeSlot,
    toggleEquipment,
    setSelectedCoach,
    calculatePrice,
    getAvailableSlots,
    isCoachAvailable,
    confirmBooking,
    resetBookingForm,
  } = useBookingStore();
  
  const priceBreakdown = calculatePrice();
  const availableSlots = selectedCourt 
    ? getAvailableSlots(selectedCourt.id, selectedDate) 
    : [];
  
  const checkCoachAvailability = (coachId: string) => {
    if (!selectedTimeSlot) return false;
    return isCoachAvailable(coachId, selectedDate, selectedTimeSlot.start, selectedTimeSlot.end);
  };
  
  const handleConfirmBooking = () => {
    const booking = confirmBooking();
    if (booking) {
      setShowConfirmation(true);
      toast({
        title: "Booking Confirmed! 🎉",
        description: `Your court is booked for ${format(selectedDate, 'MMM d')} at ${selectedTimeSlot?.start}`,
      });
    }
  };
  
  const handleNewBooking = () => {
    setShowConfirmation(false);
    resetBookingForm();
  };
  
  const canConfirm = selectedCourt && selectedTimeSlot;
  
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="mx-auto max-w-lg animate-scale-in">
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">Booking Confirmed!</h1>
              <p className="mt-2 text-muted-foreground">
                Your badminton court has been successfully booked.
              </p>
              
              <div className="my-6 rounded-xl bg-secondary/50 p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTimeSlot?.start} - {selectedTimeSlot?.end}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/bookings'}>
                  View My Bookings
                </Button>
                <Button variant="hero" className="flex-1" onClick={handleNewBooking}>
                  Book Another
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Hero Section */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Book Your Court
          </h1>
          <p className="mt-2 text-muted-foreground">
            Reserve a badminton court, rent equipment, and book a coach
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Booking Flow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm animate-slide-up">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Select Date</h2>
                </div>
                <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
              </div>
            </div>
            
            {/* Court Selection */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CourtSelector 
                courts={courts} 
                selectedCourt={selectedCourt} 
                onSelectCourt={setSelectedCourt} 
              />
            </div>
            
            {/* Time Slot Selection */}
            {selectedCourt && (
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm animate-slide-up">
                <TimeSlotPicker
                  availableSlots={availableSlots}
                  selectedSlot={selectedTimeSlot}
                  onSelectSlot={setSelectedTimeSlot}
                  isPeakHour={isPeakHour}
                />
              </div>
            )}
            
            {/* Equipment Selection */}
            {selectedTimeSlot && (
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm animate-slide-up">
                <EquipmentSelector
                  equipment={equipment}
                  selectedEquipment={selectedEquipment}
                  onToggleEquipment={toggleEquipment}
                />
              </div>
            )}
            
            {/* Coach Selection */}
            {selectedTimeSlot && (
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm animate-slide-up">
                <CoachSelector
                  coaches={coaches}
                  selectedCoach={selectedCoach}
                  onSelectCoach={setSelectedCoach}
                  isCoachAvailable={checkCoachAvailability}
                />
              </div>
            )}
          </div>
          
          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <PriceBreakdownCard breakdown={priceBreakdown} />
              
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                disabled={!canConfirm}
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </Button>
              
              {!canConfirm && (
                <p className="text-center text-sm text-muted-foreground">
                  Select a court and time slot to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
