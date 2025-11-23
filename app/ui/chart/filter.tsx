'use client';

import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface IChartFilter {
  year: number;
  month: number | 'all';
  day: number | 'all';
  years: number[];
  yearData: any;
  setYear: (y: number) => void;
  setMonth: (m: number | 'all') => void;
  setDay: (d: number | 'all') => void;
  monthNames: string[];
}

export default function ChartFilter({
  year,
  month,
  day,
  years,
  yearData,
  setYear,
  setMonth,
  setDay,
  monthNames,
}: IChartFilter) {

  return (
    <div className="flex px-3 items-center rounded-md border border-gray-200 overflow-x-auto overflow-y-hidden text-gray-500">
      <CalendarDaysIcon className="h-[18px] w-[18px] text-gray-500" />
      <SelectorWrapper>
        <SelectInput
          value={year}
          onChange={(e) => {
            setYear(Number(e.target.value));
            setMonth('all');
            setDay('all');
          }}
        >
          {years.map((y) => (
            <Option key={y} value={y}>
              {y}
            </Option>
          ))}
        </SelectInput>
      </SelectorWrapper>

      <SelectorWrapper>
        <span className="cursor-default">/</span>
        <SelectInput
          value={month}
          onChange={(e) => {
            const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
            setMonth(val);
            setDay('all');
          }}
        >
          <Option value="all">Full Year</Option>
          {Object.keys(yearData).map((m) => (
            <Option key={m} value={m}>
              {monthNames[Number(m)]}
            </Option>
          ))}
        </SelectInput>
      </SelectorWrapper>

      {month !== 'all' && (
        <SelectorWrapper>
          <span className="cursor-default">/</span>
          <SelectInput
            value={day}
            onChange={(e) =>
              setDay(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
          >
            <Option value="all">Full Month</Option>
            {Array.from({ length: Math.max(yearData[month]?.length || 30, 30) }, (_, i) => (
              <Option key={i} value={i}>
                Day {i + 1}
              </Option>
            ))}
          </SelectInput>
        </SelectorWrapper>
      )}
    </div>
  );
}

function Option({ value, children }: { value: any; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      className="select-no-arrow h-10 text-sm text-center px-3 h-full outline-none focus:outline-none focus:ring-0 first:text-center outline-none bg-white border-none cursor-pointer transition focus:text-gray-900"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
}

function SelectorWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3 items-center bg-white rounded-md shadow-sm ml-3 last:mr-3 text-gray-700">{children}</div>;
}