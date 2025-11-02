// My Calendar Screen

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import CalendarStyle from "../styles/CalendarStyle";

const Calendar = () => {
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'month'
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfWeek = (date) => {
    const day = date.getDay(); // 0 = Sunday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const startOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const prevPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const renderWeekDays = () => {
    const start = startOfWeek(new Date(currentDate));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days.map((d) => (
      <div key={d.toDateString()} style={CalendarStyle.dayHeader}>
        {d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </div>
    ));
  };

  const renderMonthDays = () => {
    const start = startOfMonth(new Date(currentDate));
    const month = start.getMonth();
    const days = [];

    while (start.getMonth() === month) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    return days.map((d) => (
      <div key={d.toDateString()} style={CalendarStyle.monthDay}>
        <div style={CalendarStyle.dateNumber}>{d.getDate()}</div>
        {/* Future: appointments here */}
      </div>
    ));
  };

  return (
    <div style={CalendarStyle.container}>
      <TopNavBar />

      <div style={CalendarStyle.layout}>
        <Sidebar />

        <main style={CalendarStyle.main}>
          <div style={CalendarStyle.header}>
            <h2 style={CalendarStyle.title}>
              {viewMode === "week"
                ? `Week of ${startOfWeek(
                    new Date(currentDate)
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}`
                : `${currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}`}
            </h2>
            <div style={CalendarStyle.controls}>
              <button style={CalendarStyle.navButton} onClick={prevPeriod}>
                ←
              </button>
              <button style={CalendarStyle.navButton} onClick={nextPeriod}>
                →
              </button>
              <button
                style={{
                  ...CalendarStyle.toggleButton,
                  backgroundColor: viewMode === "week" ? "#1e3a8a" : "#e5e7eb",
                  color: viewMode === "week" ? "white" : "#1e3a8a",
                }}
                onClick={() => setViewMode("week")}
              >
                Week
              </button>
              <button
                style={{
                  ...CalendarStyle.toggleButton,
                  backgroundColor: viewMode === "month" ? "#1e3a8a" : "#e5e7eb",
                  color: viewMode === "month" ? "white" : "#1e3a8a",
                }}
                onClick={() => setViewMode("month")}
              >
                Month
              </button>
            </div>
          </div>

          <div style={CalendarStyle.calendarPanel}>
            {viewMode === "week" ? (
              <>
                <div style={CalendarStyle.weekGrid}>{renderWeekDays()}</div>
                <div style={CalendarStyle.weekBody}>
                  {[...Array(12)].map((_, hour) => (
                    <div key={hour} style={CalendarStyle.timeRow}>
                      <div style={CalendarStyle.timeLabel}>{`${
                        hour + 8
                      }:00`}</div>
                      <div style={CalendarStyle.timeCells}>
                        {[...Array(7)].map((_, day) => (
                          <div key={day} style={CalendarStyle.timeCell}></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={CalendarStyle.monthGrid}>{renderMonthDays()}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
