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
  deleteBooking,
  getDetailedBookings,
  updateBookingStatus,
} from "@/lib/booking-management-actions";
import { EyeIcon, PenIcon, Trash2 } from "lucide-react";

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

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<BookingDetails | null>(
    null
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    consultant: "",
    name: "",
    status: "PENDING",
  });

  const openUpdateDialog = (booking: BookingDetails) => {
    setUpdateForm({
      consultant: booking.consultant,
      name: booking.user.name,
      status: booking.status,
    });
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    try {
      const formData = new FormData();
      formData.append("id", selectedBooking.id);
      formData.append("consultant", updateForm.consultant);
      formData.append("name", updateForm.name);
      formData.append("status", updateForm.status);

      const result = await updateBookingStatus(formData);

      if (result.success) {
        toast.success("Booking updated successfully");
        setIsUpdateDialogOpen(false);

        // Refresh bookings and summaries
        const updatedBookings = await getDetailedBookings(
          selectedMonth,
          selectedConsultant
        );
        setBookings(updatedBookings);
        const summary = await getBookingSummary(selectedMonth);
        setBookingSummary(summary);
      } else {
        toast.error(result.message || "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

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

  const openDeleteDialog = (booking: BookingDetails) => {
    setBookingToDelete(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
  
    try {
      const result = await deleteBooking(bookingToDelete.id);
  
      if (result.success) {
        toast.success(result.message);
        
        // Refresh the bookings data
        const updatedBookings = await getDetailedBookings(selectedMonth, selectedConsultant);
        setBookings(updatedBookings);
        
        // Refresh the summary data
        const summary = await getBookingSummary(selectedMonth);
        setBookingSummary(summary);
        
        const consultantSummaryData = await getBookingSummaryByConsultant(selectedMonth);
        setConsultantSummary(consultantSummaryData);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    } finally {
      setIsDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
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
                        <EyeIcon/>
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(booking)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking</DialogTitle>
            <DialogDescription>
              Modify the details of the booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Consultant</label>
              <input
                type="text"
                value={updateForm.consultant}
                onChange={(e) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    consultant: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">User Name</label>
              <input
                type="text"
                value={updateForm.name}
                onChange={(e) =>
                  setUpdateForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Status</label>
              <Select
                value={updateForm.status}
                onValueChange={(value) =>
                  setUpdateForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={() => setIsUpdateDialogOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateBooking} variant="default">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Detailed information about the selected booking.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  <strong>Date:</strong>{" "}
                  {format(selectedBooking.date, "MMM dd, yyyy")}
                </p>
                <p>
                  <strong>Time:</strong> {selectedBooking.time}
                </p>
                <p>
                  <strong>Consultant:</strong> {selectedBooking.consultant}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      {
                        PENDING: "text-yellow-600",
                        CONFIRMED: "text-green-600",
                        CANCELLED: "text-red-600",
                      }[selectedBooking.status]
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </p>
                <p>
                  <strong>User Name:</strong> {selectedBooking.user.name}
                </p>
                <p>
                  <strong>User Email:</strong> {selectedBooking.user.email}
                </p>
                <p>
                  <strong>Company:</strong> {selectedBooking.user.company}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {format(selectedBooking.createdAt, "MMM dd, yyyy HH:mm")}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {format(selectedBooking.updatedAt, "MMM dd, yyyy HH:mm")}
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => setIsDetailsModalOpen(false)}
                  variant="secondary"
                >
                  Close
                </Button>
                {selectedBooking.status !== "CONFIRMED" && (
                  <Button
                    onClick={() => handleUpdateStatus("CONFIRMED")}
                    variant="default"
                  >
                    Confirm
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteBooking} variant="destructive">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default AdminPanel;
