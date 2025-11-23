'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, ActiveElement, ChartEvent } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartJsProps } from '@/app/lib/chart/definitions';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

export default function ChartBarWithParams({ data }: { data: ChartJsProps }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (event: ChartEvent, elements: ActiveElement[]) => {
    if (!elements.length) return;

    // عنصر کلیک شده
    const element = elements[0];
    const datasetIndex = element.datasetIndex;
    const index = element.index;

    // بر اساس لیبل (labels[index]) یا datasetIndex می‌توان تصمیم گرفت
    const clickedLabel = data.labels[index];

    // مثلا اگر در حالت سالانه هستیم، لیبل ماه را به searchParams اضافه کنیم
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (data.labels.length === 12) {
      // حالت سالانه → لیبل ماه
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const monthIndex = monthNames.indexOf(clickedLabel);
      if (monthIndex !== -1) {
        newSearchParams.set('month', String(monthIndex + 1));
      }
    } else if (data.labels[0].startsWith('Day')) {
      // حالت ماهانه → روز
      const dayNumber = clickedLabel.replace('Day ', '');
      newSearchParams.set('day', dayNumber);
    }

    // بروزرسانی URL
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <div style={{ height: 'calc(100dvh - 202px)' }} className='h-60'>
      <Chart
        type="bar"
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'x',
          scales: { x: { stacked: true }, y: { stacked: true } },
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Sales Chart' },
          },
          onClick: handleClick,
        }}
      />
    </div>
  );
}
