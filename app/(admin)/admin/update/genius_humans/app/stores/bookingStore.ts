// stores/bookingStore.ts
import { fetchUserBookings } from '@/lib/booking-actions';
import { create } from 'zustand';

export interface Booking {
  id: string;
  date: Date;
  time: string;
  consultant: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  company?: string;
  message?: string;
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  updateBooking: (updatedBooking: Booking) => void;
  deleteBooking: (bookingId: string) => void;
  resetBookings: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const userBookings = await fetchUserBookings(); // Your existing fetch function
      set({ bookings: userBookings, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch bookings', 
        isLoading: false 
      });
    }
  },

  updateBooking: (updatedBooking) => {
    set((state) => ({
      bookings: state.bookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    }));
  },

  deleteBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.filter(booking => booking.id !== bookingId)
    }));
  },

  resetBookings: () => {
    set({ bookings: [], isLoading: false, error: null });
  }
}));