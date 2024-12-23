"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import { format } from "date-fns";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";

// Import server actions
import { getDetailedBookings } from "@/lib/booking-management-actions";

// Define types
interface BookingDetails {
  id: string;
  date: Date;
  time: string;
  consultant: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  user: {
    name: string;
    email: string;
    company: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Configure localizer for React Big Calendar
const localizer = momentLocalizer(moment);

const CalendarPanel: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // Manage current date
  const [view, setView] = useState<View>("month"); // Use `View` type from react-big-calendar

  // Fetch bookings dynamically based on the current date range
  const fetchBookings = async (start: Date, end: Date) => {
    try {
      const dateRange = { start, end };
      const fetchedBookings = await getDetailedBookings(undefined, undefined, dateRange);
      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings. Please try again.");
    }
  };

  // Calculate start and end dates for the current view
  const calculateDateRange = () => {
    // Map react-big-calendar views to moment-compatible ranges
    const viewToMomentMapping: Record<View, moment.unitOfTime.StartOf> = {
      month: "month",
      week: "week",
      work_week: "isoWeek", // For "work_week" use ISO week
      day: "day",
      agenda: "day", // Use "day" for agenda view
    };
  
    // Get the corresponding moment unit or default to "month"
    const momentUnit = viewToMomentMapping[view] || "month";
    
    const start = moment(currentDate).startOf(momentUnit).toDate();
    const end = moment(currentDate).endOf(momentUnit).toDate();
  
    return { start, end };
  };
  

  // Fetch bookings on initial load and whenever the date or view changes
  useEffect(() => {
    const { start, end } = calculateDateRange();
    fetchBookings(start, end);
  }, [currentDate, view]);

  // Transform bookings to calendar events
  const events = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.consultant} - ${booking.user.name}`,
    start: new Date(booking.date),
    end: new Date(booking.date),
    allDay: false,
  }));

  // Handle event click
  const handleSelectEvent = (event: any) => {
    const booking = bookings.find((b) => b.id === event.id);
    if (booking) {
      setSelectedBooking(booking);
      setIsDetailsModalOpen(true);
    }
  };

  // Handle navigation
  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  // Handle view change
  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-8">Booking Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day", "agenda"]}
        date={currentDate} // Controlled date
        onNavigate={handleNavigate} // Handle navigation
        view={view} // Controlled view
        onView={handleViewChange} // Handle view changes
        toolbar
      />

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected booking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <strong>Date:</strong>{" "}
                {format(selectedBooking.date, "MMMM dd, yyyy")}
              </div>
              <div>
                <strong>Time:</strong> {selectedBooking.time}
              </div>
              <div>
                <strong>Consultant:</strong> {selectedBooking.consultant}
              </div>
              <div>
                <strong>Status:</strong> {selectedBooking.status}
              </div>
              <div>
                <strong>User Name:</strong> {selectedBooking.user.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedBooking.user.email}
              </div>
              <div>
                <strong>Company:</strong> {selectedBooking.user.company}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Toaster />
    </div>
  );
};

export default CalendarPanel;
