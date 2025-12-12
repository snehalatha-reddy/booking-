import { format } from 'date-fns';
import { useBookingStore } from '@/store/bookingStore';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, User, Package, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const statusColors = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  confirmed: 'bg-primary/10 text-primary border-primary/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-success/10 text-success border-success/20',
};

const BookingsPage = () => {
  const { bookings, cancelBooking, equipment } = useBookingStore();

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully.",
    });
  };

  const getEquipmentNames = (booking: typeof bookings[0]) => {
    return booking.equipment.map(e => {
      const equip = equipment.find(eq => eq.id === e.equipment_id);
      return equip ? `${equip.name} (×${e.quantity})` : '';
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your court reservations
          </p>
        </div>

        {sortedBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-semibold text-foreground">No Bookings Yet</h2>
            <p className="mt-2 text-muted-foreground">Book your first court to get started!</p>
            <Button variant="hero" className="mt-6" onClick={() => window.location.href = '/'}>
              Book a Court
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBookings.map((booking, idx) => {
              const equipmentNames = getEquipmentNames(booking);
              const canCancel = booking.status === 'confirmed' || booking.status === 'pending';

              return (
                <div
                  key={booking.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className={cn("capitalize", statusColors[booking.status])}>
                          {booking.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Booked on {format(new Date(booking.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {booking.court?.name} ({booking.court?.type})
                          </span>
                        </div>

                        {booking.coach && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">Coach: {booking.coach.name}</span>
                          </div>
                        )}

                        {equipmentNames.length > 0 && (
                          <div className="flex items-center gap-2 text-sm sm:col-span-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{equipmentNames.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="font-display text-2xl font-bold text-primary">
                        ₹{booking.total_price.toFixed(2)}
                      </p>

                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingsPage;
