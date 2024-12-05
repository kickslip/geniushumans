"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
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
import {
  getDetailedBookings,
  updateBookingStatus,
  deleteBooking,
} from "@/lib/booking-management-actions";

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
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const fetchedBookings = await getDetailedBookings();
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        toast.error("Failed to load bookings. Please try again.");
      }
    };
    fetchBookings();
  }, []);

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
                <strong>Date:</strong> {format(selectedBooking.date, "MMMM dd, yyyy")}
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
