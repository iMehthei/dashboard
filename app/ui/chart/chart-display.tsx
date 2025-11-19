'use client';
import { forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';

interface ChartDisplayProps {
  labels: string[];
  values: number[];
}

const ChartDisplay = forwardRef<any, ChartDisplayProps>(({ labels, values }, ref) => {
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

  return (
    <div className='w-full max-w-[1024px]'>
      <Bar ref={ref} data={chartData} />
    </div>
  );
});

ChartDisplay.displayName = 'ChartDisplay';
export default ChartDisplay;
