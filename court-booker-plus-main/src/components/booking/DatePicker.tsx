import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const goToPreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    if (newDate >= today) {
      onDateChange(newDate);
    }
  };
  
  const goToNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };
  
  const isPreviousDisabled = date <= today;
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousDay}
        disabled={isPreviousDisabled}
        className="h-10 w-10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-medium",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, "EEE, MMM d, yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onDateChange(d)}
            disabled={(d) => d < today}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextDay}
        className="h-10 w-10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
