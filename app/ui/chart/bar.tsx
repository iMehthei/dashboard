'use client';

import { useEffect } from "react";
import { Chart } from 'react-chartjs-2';
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
import { useRouter, useSearchParams } from "next/navigation";
import { ChartJsProps } from '@/app/lib/chart/definitions';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

export default function ChartBarWithParams({ data }: { data: ChartJsProps }) {
  const router = useRouter();
  const sp = useSearchParams();

  const handleClick = (event: ChartEvent, elements: ActiveElement[]) => {
    if (!elements.length) return;

    const element = elements[0];
    const index = element.index;
    const clickedLabel = data.labels[index];

    const newParams = new URLSearchParams(sp.toString());

    if (data.labels.length === 12) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(clickedLabel);
      if (monthIndex !== -1) {
        newParams.set('month', String(monthIndex + 1));
        newParams.delete('day');
      }
    } else if (data.labels[0].startsWith('Day')) {
      // حالت ماه → کلیک روی روز
      const dayNumber = clickedLabel.replace('Day ', '');
      newParams.set('day', dayNumber);
    }

    router.replace(`${window.location.pathname}?${newParams.toString()}`);
  };

  return (
    <div style={{ height: 'calc(100dvh - 202px)' }}>
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
          onHover: (event, elements) => {
            const target = event.native?.target as HTMLCanvasElement;
            target.style.cursor = elements.length ? 'pointer' : 'default';
          },
        }}
      />
    </div>
  );
}
