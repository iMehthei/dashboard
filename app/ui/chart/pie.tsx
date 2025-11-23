"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const chartRef = useRef<ChartJS<"pie", number[], string> | null>(null);

  const data = {
    labels: ["Paid", "Pending"],
    datasets: [
      {
        label: "Invoices",
        data: [0, 0], // شروع از صفر برای دیدن انیمیشن
        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: true, position: "bottom" },
    },
  };

  useEffect(() => {
    // بعد از mount داده واقعی را ست می‌کنیم تا animation اجرا شود
    setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.data.datasets[0].data = [350, 120];
        chartRef.current.update();
      }
    }, 100); // 100ms تا mount کامل شود
  }, []);

  return (
    <div className="w-full h-[50%] flex items-center justify-center">
      <Pie ref={chartRef} data={data} options={options} />
    </div>
  );
}
