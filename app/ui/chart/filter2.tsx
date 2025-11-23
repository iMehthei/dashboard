"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
// import { monthNames } from "@/app/lib/chart/utils";

interface ChartFilterProps {
  searchParams?: {
    year?: number;
    month?: string | number;
    day?: string | number;
  };
}

export default function ChartFilterWithParams({ searchParams }: ChartFilterProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const currentYear = new Date().getFullYear();
  const defaultYear = Number(searchParams?.year) || currentYear;

  const [year, setYear] = useState<number>(defaultYear);
  const [month, setMonth] = useState<number | "all">(searchParams?.month === undefined ? "all" : Number(searchParams.month));
  const [day, setDay] = useState<number | "all">(searchParams?.day === undefined ? "all" : Number(searchParams.day));

  useEffect(() => {
    const urlYear = sp.get("year");
    const urlMonth = sp.get("month");
    const urlDay = sp.get("day");

    if (urlYear) setYear(Number(urlYear));
    if (urlMonth === "all") setMonth("all");
    else if (urlMonth) setMonth(Number(urlMonth));
    if (urlDay === "all") setDay("all");
    else if (urlDay) setDay(Number(urlDay));
  }, []);

  useEffect(() => {
    const defaultYear = currentYear;
    const defaultMonth = "all";
    const defaultDay = "all";

    const params = new URLSearchParams();

    // فقط زمانی پارامترها را اضافه کن که با دیفالت تفاوت داشته باشند
    if (year !== defaultYear) params.set("year", String(year));
    if (month !== defaultMonth) params.set("month", String(month));
    if (day !== defaultDay) params.set("day", String(day));

    const search = params.toString();
    router.replace(`${window.location.pathname}${search ? `?${search}` : ""}`);
  }, [year, month, day, router]);


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
    'Jan', // 1
    'Feb', // 2
    'Mar', // 3
    'Apr', // 4
    'May', // 5
    'Jun', // 6
    'Jul', // 7
    'Aug', // 8
    'Sep', // 9
    'Oct', // 10
    'Nov', // 11
    'Dec', // 12
  ];

  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex px-3 items-center rounded-md border border-gray-200 overflow-x-auto text-gray-500">
      <CalendarDaysIcon className="h-[18px] w-[18px]" />

      <SelectorWrapper>
        <SelectInput value={year} onChange={(e) => handleChange("year", Number(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </SelectInput>
      </SelectorWrapper>

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

      {month !== "all" && (
        <SelectorWrapper>
          <span>/</span>
          <SelectInput
            value={day}
            onChange={(e) => handleChange("day", e.target.value === "all" ? "all" : Number(e.target.value))}
          >
            <option value="all">Full Month</option>
            {Array.from({ length: 31 }, (_, i) => (
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
