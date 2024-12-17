"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";

// Import the Zustand store
import { fetchUserBookings } from '@/lib/booking-actions';
import { useBookingStore } from "@/app/stores/bookingStore";

const UserBookings: React.FC = () => {
  const { bookings, isLoading, error, fetchBookings } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const getStatusVariant = (status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') => {
    switch (status) {
      case 'PENDING':
        return 'default';
      case 'CONFIRMED':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-gray-500">No bookings found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Booking with {booking.consultant}
                </CardTitle>
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {format(booking.date, 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">{booking.time}</p>
                  </div>
                  {booking.company && (
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-semibold">{booking.company}</p>
                    </div>
                  )}
                  {booking.message && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Message</p>
                      <p className="italic">{booking.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default UserBookings;