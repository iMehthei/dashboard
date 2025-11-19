'use client';

import { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartEvent,
  ActiveElement,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { stats } from '@/app/lib/chart/data';
import { monthNames } from '@/app/lib/chart/utils';
import ChartSelector from '@/app/ui/chart/chart-selector';
import { H1 } from '@/app/ui/heading';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Page() {
  const years = Object.keys(stats).map(Number);
  const [year, setYear] = useState<number>(years[0]);
  const [month, setMonth] = useState<number | 'all'>('all');
  const [day, setDay] = useState<number | 'all'>('all');

  const chartRef = useRef<ChartJS<'bar', number[], string>>(null);

  const yearData = stats[year];

  let labels: string[] = [];
  let values: number[] = [];

  if (month === 'all') {
    // مجموع ماهانه
    labels = monthNames;
    values = monthNames.map((_, i) => {
      const days = yearData[i] || [];
      return days.reduce(
        (sumMonth, dayOrders) =>
          sumMonth + dayOrders.reduce((sumDay, o) => sumDay + o.amount, 0),
        0
      );
    });
  } else if (day === 'all') {
    // مجموع روزانه ماه انتخاب شده
    const days = yearData[month] || [];
    const maxDays = Math.max(days.length, 30);
    labels = Array.from({ length: maxDays }, (_, i) => `Day ${i + 1}`);
    values = Array.from({ length: maxDays }, (_, i) => {
      const orders = days[i] || [];
      return orders.reduce((sum, o) => sum + o.amount, 0);
    });
  } else {
    // مجموع ساعتی روز انتخاب شده
    const orders = yearData[month]?.[day] || [];
    const hourlyMap: Record<string, number> = {};
    orders.forEach((o) => {
      const hour = o.time.slice(0, 2);
      hourlyMap[hour] = (hourlyMap[hour] || 0) + o.amount;
    });
    labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    values = labels.map((h) => hourlyMap[h.slice(0, 2)] || 0);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total sales',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // تابع کلیک روی نمودار
  const handleClick = (event?: ChartEvent, elements?: ActiveElement[]) => {
    if (!elements?.length) return;

    const index = elements[0].index;

    if (month === 'all') {
      // اگر در نمودار سالانه هستیم، روی ماه کلیک شد
      setMonth(index);
      setDay('all');
    } else if (day === 'all') {
      // اگر در نمودار ماهانه هستیم، روی روز کلیک شد
      setDay(index);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <H1>Chart</H1>
      <ChartSelector
        year={year}
        month={month}
        day={day}
        years={years}
        yearData={yearData}
        setYear={(y) => {
          setYear(y);
          setMonth('all');
          setDay('all');
        }}
        setMonth={(m) => {
          setMonth(m);
          setDay('all');
        }}
        setDay={setDay}
        monthNames={monthNames}
      />

      <div className="w-full max-w-[1024px]">
        <Chart
          type="bar"
          ref={chartRef}
          data={chartData}
          className='cursor-pointer'
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Sales Chart' },
            },
            onClick: handleClick,
          }}
        />
      </div>
    </div>
  );
}
