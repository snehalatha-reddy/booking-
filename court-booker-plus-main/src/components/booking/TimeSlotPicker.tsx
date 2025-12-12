import { cn } from '@/lib/utils';
import { Clock, Sun, Moon } from 'lucide-react';

interface TimeSlotPickerProps {
  availableSlots: string[];
  selectedSlot: { start: string; end: string } | null;
  onSelectSlot: (slot: { start: string; end: string }) => void;
  isPeakHour: (hour: number) => boolean;
}

export function TimeSlotPicker({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  isPeakHour
}: TimeSlotPickerProps) {
  const getEndTime = (startTime: string) => {
    const hour = parseInt(startTime.split(':')[0]);
    return `${(hour + 1).toString().padStart(2, '0')}:00`;
  };

  const formatTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const getTimeIcon = (hour: number) => {
    if (hour >= 6 && hour < 12) return Sun;
    if (hour >= 12 && hour < 18) return Sun;
    return Moon;
  };

  // Group slots by time of day
  const morningSlots = availableSlots.filter(s => parseInt(s.split(':')[0]) < 12);
  const afternoonSlots = availableSlots.filter(s => {
    const hour = parseInt(s.split(':')[0]);
    return hour >= 12 && hour < 18;
  });
  const eveningSlots = availableSlots.filter(s => parseInt(s.split(':')[0]) >= 18);

  const renderSlotGroup = (slots: string[], label: string) => {
    if (slots.length === 0) return null;

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => {
            const hour = parseInt(slot.split(':')[0]);
            const isPeak = isPeakHour(hour);
            const isSelected = selectedSlot?.start === slot;
            const Icon = getTimeIcon(hour);

            return (
              <button
                key={slot}
                onClick={() => onSelectSlot({ start: slot, end: getEndTime(slot) })}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : isPeak
                      ? "border-badge-peak/50 bg-badge-peak/10 text-foreground hover:border-badge-peak hover:bg-badge-peak/20"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {formatTime(slot)}
                {isPeak && !isSelected && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-badge-peak text-[10px] font-bold text-accent-foreground">
                    ₹
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">Select Time</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-badge-peak" />
            Peak hours
          </span>
        </div>
      </div>

      {availableSlots.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No available slots for this court on this date.</p>
      ) : (
        <div className="space-y-4">
          {renderSlotGroup(morningSlots, 'Morning')}
          {renderSlotGroup(afternoonSlots, 'Afternoon')}
          {renderSlotGroup(eveningSlots, 'Evening')}
        </div>
      )}
    </div>
  );
}
