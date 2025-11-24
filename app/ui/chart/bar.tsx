'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
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

interface ChartBarProps {
  data: ChartJsProps;
}

export default function ChartBar({ data }: ChartBarProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const [indexAxis, setIndexAxis] = useState<'x' | 'y'>('x');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIndexAxis(width < 1024 ? 'y' : 'x')
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = useCallback(
    (event: ChartEvent, elements: ActiveElement[]) => {
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
        const dayNumber = clickedLabel.replace('Day ', '');
        newParams.set('day', dayNumber);
      }

      router.replace(`${window.location.pathname}?${newParams.toString()}`);
    },
    [data.labels, router, sp]
  );

  const memoizedOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: indexAxis,
    scales: { x: { stacked: true }, y: { stacked: true } },
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Sales Chart' },
    },
    onClick: handleClick,
    onHover: (event: any, elements: any) => {
      const target = event.native?.target as HTMLCanvasElement;
      target.style.cursor = elements.length ? 'pointer' : 'default';
    },
  }), [indexAxis, handleClick]);

  const wrapperStyle = useMemo(() => ({
    height: indexAxis === 'x' ? 'calc(100dvh - 202px)' : '100dvh',
  }), [indexAxis]);

  return (
    <div style={wrapperStyle}>
      <Chart
        type="bar"
        data={data}
        options={memoizedOptions}
      />
    </div>
  );
}
