"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { ChartFilterProps } from "@/app/lib/chart/definitions";

export default function ChartFilter({ searchParams }: ChartFilterProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const currentYear = new Date().getFullYear();

  const defaultYear = Number(searchParams?.year) || currentYear;
  const defaultMonth = searchParams?.month === undefined ? "all" : searchParams?.month === "all" ? "all" : Number(searchParams.month);
  const defaultDay = searchParams?.day === undefined ? "all" : searchParams?.day === "all" ? "all" : Number(searchParams.day);

  const [year, setYear] = useState<number>(defaultYear);
  const [month, setMonth] = useState<number | "all">(defaultMonth);
  const [day, setDay] = useState<number | "all">(defaultDay);

  // Sync state with URL params on mount
  useEffect(() => {
    const urlYear = sp.get("year");
    const urlMonth = sp.get("month");
    const urlDay = sp.get("day");

    if (urlYear) setYear(Number(urlYear));
    if (urlMonth === "all") setMonth("all");
    else if (urlMonth) setMonth(Number(urlMonth));
    if (urlDay === "all") setDay("all");
    else if (urlDay) setDay(Number(urlDay));
  }, [sp]);

  // Update URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (year !== currentYear) params.set("year", String(year));
    if (month !== "all") params.set("month", String(month));
    if (day !== "all") params.set("day", String(day));

    router.replace(`${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }, [year, month, day, router, currentYear]);

  const handleChange = (type: "year" | "month" | "day", value: number | "all") => {
    if (type === "year") {
      setYear(value as number);
      setMonth("all");
      setDay("all");
    } else if (type === "month") {
      setMonth(value);
      setDay("all");
    } else if (type === "day") {
      setDay(value);
    }
  };

  const monthNames = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // محاسبه تعداد روزهای ماه برای سلکتور، با در نظر گرفتن سال کبیسه
  const daysInMonth = month !== "all" ? new Date(year, Number(month), 0).getDate() : 31;

  return (
    <div className="flex px-3 items-center rounded-md border border-gray-200 overflow-x-auto text-gray-500">
      <CalendarDaysIcon className="h-[18px] w-[18px]" />

      {/* Year Selector */}
      <SelectorWrapper>
        <SelectInput value={year} onChange={(e) => handleChange("year", Number(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </SelectInput>
      </SelectorWrapper>

      {/* Month Selector */}
      <SelectorWrapper>
        <span>/</span>
        <SelectInput
          value={month}
          onChange={(e) => handleChange("month", e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          <option value="all">Full Year</option>
          {months.map((m, i) => (
            <option key={m} value={m}>{monthNames[i]}</option>
          ))}
        </SelectInput>
      </SelectorWrapper>

      {/* Day Selector */}
      {month !== "all" && (
        <SelectorWrapper>
          <span>/</span>
          <SelectInput
            value={day}
            onChange={(e) => handleChange("day", e.target.value === "all" ? "all" : Number(e.target.value))}
          >
            <option value="all">Full Month</option>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </SelectInput>
        </SelectorWrapper>
      )}
    </div>
  );
}

function SelectInput({ value, onChange, children }: { value: any; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }) {
  return (
    <select
      className="select-no-arrow appearance-none border-none outline-none focus:outline-none focus:ring-0 h-10 text-sm text-center px-3 bg-white cursor-pointer"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
}

function SelectorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-center bg-white rounded-md shadow-sm ml-3 last:mr-3 text-gray-700">
      {children}
    </div>
  );
}
