"use client";

import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toaster, toast } from 'sonner';

// Import server actions
import { 
  getDetailedBookings, 
  updateBookingStatus, 
  deleteBooking 
} from '@/lib/booking-management-actions';
import { getBookingSummary, getBookingSummaryByConsultant } from '@/lib/booking-actions';

// Define types
interface BookingDetails {
  id: string;
  date: Date;
  time: string;
  consultant: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  user: {
    name: string;
    email: string;
    company: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdminPanel: React.FC = () => {
  // State management
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedConsultant, setSelectedConsultant] = useState<string>('all');
  
  // Booking summary states
  const [bookingSummary, setBookingSummary] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  });
  const [consultantSummary, setConsultantSummary] = useState<Record<string, { 
    total: number; 
    pending: number; 
    confirmed: number 
  }>>({});

  // Selected booking for details modal
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch bookings and summaries
  useEffect(() => {
    const fetchBookingsAndSummary = async () => {
      try {
        // Fetch detailed bookings
        const fetchedBookings = await getDetailedBookings(selectedMonth, selectedConsultant);
        setBookings(fetchedBookings);

        // Fetch overall summary
        const summary = await getBookingSummary(selectedMonth);
        setBookingSummary(summary);

        // Fetch consultant summary
        const consultantSummaryData = await getBookingSummaryByConsultant(selectedMonth);
        setConsultantSummary(consultantSummaryData);
      } catch (error) {
        console.error('Failed to fetch bookings and summary', error);
        toast.error('Failed to load bookings. Please try again.');
      }
    };

    fetchBookingsAndSummary();
  }, [selectedMonth, selectedConsultant]);

  // Month options generation
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

  // Handle booking status update
  const handleUpdateStatus = async (status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') => {
    if (!selectedBooking) return;

    try {
      const formData = new FormData();
      formData.append('id', selectedBooking.id);
      formData.append('status', status);

      const result = await updateBookingStatus(formData);

      if (result.success) {
        toast.success('Booking status updated successfully');
        // Refresh bookings
        const updatedBookings = await getDetailedBookings(selectedMonth, selectedConsultant);
        setBookings(updatedBookings);
        // Close modal
        setIsDetailsModalOpen(false);
      } else {
        toast.error(result.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status', error);
      toast.error('Failed to update booking status');
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    try {
      const result = await deleteBooking(selectedBooking.id);

      if (result.success) {
        toast.success('Booking deleted successfully');
        // Refresh bookings
        const updatedBookings = await getDetailedBookings(selectedMonth, selectedConsultant);
        setBookings(updatedBookings);
        // Close modal
        setIsDetailsModalOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking', error);
      toast.error('Failed to delete booking');
    }
  };

  // Open booking details modal
  const openBookingDetails = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
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

      {/* Consultant Summary Section */}
      {Object.keys(consultantSummary).length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Consultant Booking Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(consultantSummary).map(([consultant, summary]) => (
              <Card key={consultant}>
                <CardHeader>
                  <CardTitle>{consultant}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Total Bookings: {summary.total}</p>
                  <p className="text-yellow-600">Pending: {summary.pending}</p>
                  <p className="text-green-600">Confirmed: {summary.confirmed}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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
              {bookings.map(booking => (
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openBookingDetails(booking)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog 
          open={isDetailsModalOpen} 
          onOpenChange={setIsDetailsModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected booking
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <strong>Date:</strong> {format(selectedBooking.date, 'MMMM dd, yyyy')}
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
              <div>
                <strong>Created At:</strong> {format(selectedBooking.createdAt, 'MMMM dd, yyyy HH:mm')}
              </div>
              <div>
                <strong>Last Updated:</strong> {format(selectedBooking.updatedAt, 'MMMM dd, yyyy HH:mm')}
              </div>

              <div className="flex space-x-2">
                {selectedBooking.status !== 'CONFIRMED' && (
                  <Button 
                    variant="secondary" 
                    onClick={() => handleUpdateStatus('CONFIRMED')}
                  >
                    Confirm Booking
                  </Button>
                )}
                {selectedBooking.status !== 'CANCELLED' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleUpdateStatus('CANCELLED')}
                  >
                    Cancel Booking
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleDeleteBooking}
                >
                  Delete Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Toaster />
    </div>
  );
};

export default AdminPanel;