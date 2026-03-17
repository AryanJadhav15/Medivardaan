"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

export default function AllAppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [view, setView] = useState("month"); // month, week, day
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Sample data
  const doctors = [
    { id: "all", name: "All Doctors" },
    { id: "1", name: "Dr.Kinnari Lade" },
    { id: "2", name: "Dr. Rajesh Kumar" },
    { id: "3", name: "Dr. Priya Singh" },
  ];

  const locations = [
    { id: "all", name: "All Locations" },
    { id: "1", name: "Panvel" },
    { id: "2", name: "Pune" },
    { id: "3", name: "Mumbai" },
  ];

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      date: new Date(2025, 11, 1),
      time: "10:00 AM",
      patient: "John Doe",
      doctor: "Dr.Kinnari Lade",
      type: "Consultation",
      status: "confirmed",
    },
    {
      id: 2,
      date: new Date(2025, 11, 3),
      time: "2:00 PM",
      patient: "Jane Smith",
      doctor: "Dr. Rajesh Kumar",
      type: "Follow-up",
      status: "pending",
    },
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForDate = (day) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return appointments.filter(
      (apt) =>
        apt.date.getDate() === targetDate.getDate() &&
        apt.date.getMonth() === targetDate.getMonth() &&
        apt.date.getFullYear() === targetDate.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 rows x 7 days

    // Previous month's days
    const prevMonthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="min-h-[120px] p-2 border border-gray-200 dark:border-[#443C68]/50 bg-gray-50/50 dark:bg-[#393053]/50 text-gray-400"
        >
          <div className="text-sm font-medium">{prevMonthDays - i}</div>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDate(day);
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className="min-h-[120px] p-2 border border-gray-200 dark:border-[#443C68]/50 bg-white dark:bg-[#18122B] hover:bg-gray-50 dark:hover:bg-[#393053] transition-colors cursor-pointer group"
        >
          <div
            className={`text-sm font-semibold mb-1 ${
              isToday
                ? "bg-gradient-to-r from-medivardaan-blue to-medivardaan-teal-light text-white w-6 h-6 rounded-full flex items-center justify-center"
                : "text-gray-700 dark:text-white/75"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.map((apt) => (
              <div
                key={apt.id}
                className={`text-xs p-1.5 rounded-md ${
                  apt.status === "confirmed"
                    ? "bg-gradient-to-r from-medivardaan-blue/10 to-medivardaan-teal-light/10 border-l-2 border-medivardaan-blue"
                    : "bg-amber-50 dark:bg-amber-900/20 border-l-2 border-amber-500"
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {apt.time}
                </div>
                <div className="text-gray-600 dark:text-white/60 truncate">
                  {apt.patient}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Next month's days
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="min-h-[120px] p-2 border border-gray-200 dark:border-[#443C68]/50 bg-gray-50/50 dark:bg-[#393053]/50 text-gray-400"
        >
          <div className="text-sm font-medium">{i}</div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-medivardaan-blue to-medivardaan-teal-light bg-clip-text text-transparent">
            APPOINTMENTS
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
            Manage and view all appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-medivardaan-blue/20 hover:bg-[#1E6B8C]/10"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-medivardaan-blue to-medivardaan-teal-light hover:from-medivardaan-blue/90 hover:to-medivardaan-teal-light/90">
            <Clock className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 dark:border-[#443C68]/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full border-gray-300 dark:border-[#443C68]/50">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full border-gray-300 dark:border-[#443C68]/50">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Navigation */}
      <Card className="border-gray-200 dark:border-[#443C68]/50 shadow-sm">
        <CardHeader className="p-4 border-b border-gray-200 dark:border-[#443C68]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
                className="h-9 w-9 border-gray-300 dark:border-[#443C68]/50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                className="h-9 w-9 border-gray-300 dark:border-[#443C68]/50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="border-gray-300 dark:border-[#443C68]/50"
              >
                today
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#393053] rounded-lg p-1">
              <Button
                size="sm"
                variant={view === "month" ? "default" : "ghost"}
                onClick={() => setView("month")}
                className={
                  view === "month"
                    ? "bg-white dark:bg-[#443C68] shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-[#443C68]/50"
                }
              >
                month
              </Button>
              <Button
                size="sm"
                variant={view === "week" ? "default" : "ghost"}
                onClick={() => setView("week")}
                className={
                  view === "week"
                    ? "bg-white dark:bg-[#443C68] shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-[#443C68]/50"
                }
              >
                week
              </Button>
              <Button
                size="sm"
                variant={view === "day" ? "default" : "ghost"}
                onClick={() => setView("day")}
                className={
                  view === "day"
                    ? "bg-white dark:bg-[#443C68] shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-[#443C68]/50"
                }
              >
                day
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-[#E8F4F8] via-[#F0FAF9] to-[#E8F4F8] dark:from-[#18122B] dark:via-[#393053] dark:to-[#18122B]">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-3 text-center font-semibold text-gray-700 dark:text-white/75 border-b border-gray-200 dark:border-[#443C68]/50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">{renderCalendarDays()}</div>
        </CardContent>
      </Card>

      {/* Appointment Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#1E6B8C] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-white/60">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {appointments.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medivardaan-blue/20 to-medivardaan-teal-light/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-medivardaan-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-white/60">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {appointments.filter((a) => a.status === "confirmed").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-white/60">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {appointments.filter((a) => a.status === "pending").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
