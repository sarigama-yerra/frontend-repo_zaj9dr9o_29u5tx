import React from "react";

export default function Header() {
  return (
    <header className="px-6 py-8 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
        Room Booking
      </h1>
      <p className="text-blue-200/80 mt-2">
        Choose dates, rooms, and manage your bookings
      </p>
    </header>
  );
}
