// components/BookingConfirmation.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchUserBookings } from "@/lib/booking-actions";
import { BookingStatus } from '@prisma/client';
import { format } from 'date-fns';

interface Booking {
  id: string;
  date: Date;
  time: string;
  consultant: string;
  status: BookingStatus;
  company?: string;
  message?: string;
}

export const BookingConfirmation: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const userBookings = await fetchUserBookings();
        setBookings(userBookings);
        setError(null);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Booking with {booking.consultant}
              </CardTitle>
              <Badge variant={getStatusVariant(booking.status)}>
                {booking.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Date:</strong> {format(new Date(booking.date), 'MMMM dd, yyyy')}
                </p>
                <p>
                  <strong>Time:</strong> {booking.time}
                </p>
                {booking.company && (
                  <p>
                    <strong>Company:</strong> {booking.company}
                  </p>
                )}
                {booking.message && (
                  <p>
                    <strong>Message:</strong> {booking.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};