"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { monthNames } from "@/app/lib/chart/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart() {

  const data = {
    labels: monthNames,
    datasets: [
      {
        label: "Active Known Customers",
        data: [1, 2, 3, 6, 9, 10, 15, 11, 30, 20, 25, 40],
        borderColor: 'rgba(54, 162, 235, 0.5)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.4,
      }
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: true, position: "top" },
    },
  };

  return (
    <div className="h-60 w-full pt-5">
      <Line data={data} options={options} width={"100%"} />
    </div>
  );
}
