import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function DatePicker({ state }) {
  const [date, setDate] = state;
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    setDate("");
  };

  return (
    <div className="flex gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-fit">
          <Button
            variant="outline"
            className={cn(
              "w-auto justify-start text-left font-normal grow",
              !date && "text-muted-foreground"
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "d MMMM, yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 z-50 pointer-events-auto"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            initialFocus
            fromYear={1900}
            toYear={new Date().getFullYear()}
            captionLayout="dropdown-buttons"
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleClear}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
