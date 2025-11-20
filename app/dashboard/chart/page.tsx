'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
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

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

export default function Page() {
  const years = Object.keys(stats).map(Number);
  const [year, setYear] = useState<number>(years[0]);
  const [month, setMonth] = useState<number | 'all'>('all');
  const [day, setDay] = useState<number | 'all'>('all');

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [chartKey, setChartKey] = useState<number>(0);

  useEffect(() => {
    const checkSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setChartKey(prev => prev + 1); // کل Chart دوباره رندر شود
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);


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

  const handleClick = (event?: ChartEvent, elements?: ActiveElement[]) => {
    if (!elements?.length) return;

    const index = elements[0].index;

    if (month === 'all') {
      setMonth(index);
      setDay('all');
    } else if (day === 'all') {
      setDay(index);
    }
  };

  const pendingData = month === 'all'
    ? monthNames.map((_, i) => {
      const days = yearData[i] || [];
      return days.reduce((sumMonth, dayOrders) =>
        sumMonth + dayOrders.filter(o => o.status === 'pending').reduce((sumDay, o) => sumDay + o.amount, 0)
        , 0);
    })
    : day === 'all'
      ? Array.from({ length: Math.max(yearData[month]?.length || 30, 30) }, (_, i) => {
        const orders = yearData[month]?.[i] || [];
        return orders.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.amount, 0);
      })
      : Array.from({ length: 24 }, (_, i) => {
        const orders = yearData[month]?.[day] || [];
        const hourStr = String(i).padStart(2, '0');
        return orders.filter(o => o.status === 'pending' && o.time.startsWith(hourStr))
          .reduce((sum, o) => sum + o.amount, 0);
      });


  const paidData = month === 'all'
    ? monthNames.map((_, i) => {
      const days = yearData[i] || [];
      return days.reduce((sumMonth, dayOrders) =>
        sumMonth + dayOrders.filter(o => o.status === 'paid').reduce((sumDay, o) => sumDay + o.amount, 0)
        , 0);
    })
    : day === 'all'
      ? Array.from({ length: Math.max(yearData[month]?.length || 30, 30) }, (_, i) => {
        const orders = yearData[month]?.[i] || [];
        return orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);
      })
      : Array.from({ length: 24 }, (_, i) => {
        const orders = yearData[month]?.[day] || [];
        const hourStr = String(i).padStart(2, '0');
        return orders.filter(o => o.status === 'paid' && o.time.startsWith(hourStr))
          .reduce((sum, o) => sum + o.amount, 0);
      });


  const chartData = {
    labels,
    datasets: [
      {
        label: 'Paid',
        data: paidData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderRadius: 0,
        borderColor: 'white', // خط سفید بین Paid و Pending
        borderWidth: 2,
      },
      {
        label: 'Pending',
        data: pendingData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderRadius: 0,
        borderColor: 'white',
        borderWidth: 2,
      },
    ]
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

      <div className="w-full max-w-[1024px]" style={{ height: isMobile ? '600px' : '400px' }}>
        <Chart
          key={chartKey}
          type="bar"
          ref={chartRef}
          data={chartData}

          options={{
            responsive: true,
            indexAxis: isMobile ? 'y' : 'x',
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true },
              title: { display: true, text: 'Sales Chart' },
            },
            scales: {
              x: {
                stacked: true, // ← اضافه شد
              },
              y: {
                stacked: true, // ← اضافه شد
              },
            },
            onClick: handleClick,
            onHover: (event, elements) => {
              const target = event.native?.target as HTMLCanvasElement;
              target.style.cursor = elements.length ? 'pointer' : 'default';
            },
          }}

        />

      </div>
    </div>
  );
}
