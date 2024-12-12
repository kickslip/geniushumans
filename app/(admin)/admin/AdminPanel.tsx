"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster, toast } from "sonner";

// Import server actions
import {
  getBookingSummary,
  getBookingSummaryByConsultant,
} from "@/lib/booking-actions";
import {
  getDetailedBookings,
  updateBookingStatus,
} from "@/lib/booking-management-actions";

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

const AdminPanel: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [selectedConsultant, setSelectedConsultant] = useState<string>("all");
  const [bookingSummary, setBookingSummary] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });
  const [consultantSummary, setConsultantSummary] = useState<
    Record<
      string,
      {
        total: number;
        pending: number;
        confirmed: number;
      }
    >
  >({});
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookingsAndSummary = async () => {
      try {
        const fetchedBookings = await getDetailedBookings(
          selectedMonth,
          selectedConsultant
        );
        setBookings(fetchedBookings);

        const summary = await getBookingSummary(selectedMonth);
        setBookingSummary(summary);

        const consultantSummaryData = await getBookingSummaryByConsultant(
          selectedMonth
        );
        setConsultantSummary(consultantSummaryData);
      } catch (error) {
        console.error("Failed to fetch bookings and summary", error);
        toast.error("Failed to load bookings. Please try again.");
      }
    };

    fetchBookingsAndSummary();
  }, [selectedMonth, selectedConsultant]);

  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = -12; i <= 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      months.push(format(date, "yyyy-MM"));
    }
    return [...new Set(months)].sort();
  };

  const consultants = Array.from(
    new Set(bookings.map((booking) => booking.consultant))
  );

  const handleUpdateStatus = async (
    status: "PENDING" | "CONFIRMED" | "CANCELLED"
  ) => {
    if (!selectedBooking) return;

    try {
      const formData = new FormData();
      formData.append("id", selectedBooking.id);
      formData.append("status", status);

      const result = await updateBookingStatus(formData);

      if (result.success) {
        toast.success("Booking status updated successfully");
        const updatedBookings = await getDetailedBookings(
          selectedMonth,
          selectedConsultant
        );
        setBookings(updatedBookings);
        setIsDetailsModalOpen(false);

        const summary = await getBookingSummary(selectedMonth);
        setBookingSummary(summary);

        const consultantSummaryData = await getBookingSummaryByConsultant(
          selectedMonth
        );
        setConsultantSummary(consultantSummaryData);
      } else {
        toast.error(result.message || "Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status", error);
      toast.error("Failed to update booking status");
    }
  };

  const openBookingDetails = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
        Booking Management
      </h1>

      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="mb-4 sm:mb-0 w-full">
          <label className="block mb-2 font-medium">Select Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {generateMonthOptions().map((month) => (
                <SelectItem key={month} value={month}>
                  {format(parseISO(`${month}-01`), "MMMM yyyy")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <label className="block mb-2 font-medium">Select Consultant</label>
          <Select
            value={selectedConsultant}
            onValueChange={setSelectedConsultant}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Consultants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Consultants</SelectItem>
              {consultants.map((consultant) => (
                <SelectItem key={consultant} value={consultant}>
                  {consultant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">
              {bookingSummary.totalBookings}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
              {bookingSummary.pendingBookings}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Confirmed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
              {bookingSummary.confirmedBookings}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {format(booking.date, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.user.name}</TableCell>
                    <TableCell>{booking.user.email}</TableCell>
                    <TableCell>{booking.consultant}</TableCell>
                    <TableCell
                      className={`font-semibold ${
                        {
                          PENDING: "text-yellow-600",
                          CONFIRMED: "text-green-600",
                          CANCELLED: "text-red-600",
                        }[booking.status]
                      }`}
                    >
                      {booking.status}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => openBookingDetails(booking)}
                        size="sm"
                        className="mr-2"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
};

export default AdminPanel;
