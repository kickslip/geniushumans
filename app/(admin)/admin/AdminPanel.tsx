"use client";

import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { db } from '@/lib/db'; // Import your Prisma client
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toaster } from 'sonner';
import Sidebar from '../_components/Sidebar';

interface BookingDetails {
  id: string;
  date: Date;
  time: string;
  consultant: string;
  user: {
    name: string;
    email: string;
    company: string;
  };
  status: string;
  message?: string;
}

const AdminPanel: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingDetails[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedConsultant, setSelectedConsultant] = useState<string>('all');

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const allBookings = await db.booking.findMany({
          include: {
            user: true
          },
          orderBy: {
            date: 'desc'
          }
        });

        const formattedBookings = allBookings.map(booking => ({
          id: booking.id,
          date: booking.date,
          time: booking.time,
          consultant: booking.consultant,
          user: {
            name: booking.user.username,
            email: booking.user.email,
            company: 'N/A' // You might want to add company to your user model
          },
          status: booking.status,
          message: '' // Add message if you have it in your model
        }));

        setBookings(formattedBookings);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings
  useEffect(() => {
    let result = bookings;

    // Filter by month
    if (selectedMonth) {
      result = result.filter(booking => 
        format(booking.date, 'yyyy-MM') === selectedMonth
      );
    }

    // Filter by consultant
    if (selectedConsultant !== 'all') {
      result = result.filter(booking => 
        booking.consultant === selectedConsultant
      );
    }

    setFilteredBookings(result);
  }, [bookings, selectedMonth, selectedConsultant]);

  // Generate month options
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    // Generate past 12 months and future 12 months
    for (let i = -12; i <= 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push(format(date, 'yyyy-MM'));
    }

    return [...new Set(months)].sort();
  };

  // Get unique consultants
  const consultants = Array.from(
    new Set(bookings.map(booking => booking.consultant))
  );

  // Booking summary
  const bookingSummary = {
    totalBookings: filteredBookings.length,
    pendingBookings: filteredBookings.filter(b => b.status === 'PENDING').length,
    confirmedBookings: filteredBookings.filter(b => b.status === 'CONFIRMED').length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-8">Booking Management</h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div>
          <label className="block mb-2 font-medium">Select Month</label>
          <Select 
            value={selectedMonth} 
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {generateMonthOptions().map(month => (
                <SelectItem key={month} value={month}>
                  {format(parseISO(`${month}-01`), 'MMMM yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Select Consultant</label>
          <Select 
            value={selectedConsultant} 
            onValueChange={setSelectedConsultant}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Consultants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Consultants</SelectItem>
              {consultants.map(consultant => (
                <SelectItem key={consultant} value={consultant}>
                  {consultant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Booking Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bookingSummary.totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {bookingSummary.pendingBookings}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Confirmed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {bookingSummary.confirmedBookings}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Consultant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>
                    {format(booking.date, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>{booking.user.email}</TableCell>
                  <TableCell>{booking.consultant}</TableCell>
                  <TableCell>
                    <span className={
                      booking.status === 'CONFIRMED' 
                        ? 'text-green-600' 
                        : booking.status === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
};

export default AdminPanel;