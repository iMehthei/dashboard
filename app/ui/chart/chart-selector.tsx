'use client';

interface ChartSelectorProps {
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

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-gray-700 font-medium mr-2">{children}</span>;
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
      className="border border-gray-300 rounded-md pr-9 pl-3 h-10 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
}

function SelectorWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center bg-white rounded-md shadow-sm">{children}</div>;
}

export default function ChartSelector({
  year,
  month,
  day,
  years,
  yearData,
  setYear,
  setMonth,
  setDay,
  monthNames,
}: ChartSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <SelectorWrapper>
        <Label>Year:</Label>
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
        <Label>Month:</Label>
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
          <Label>Day:</Label>
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
