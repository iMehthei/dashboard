import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import { Doughnut } from "react-chartjs-2";

export default function DonutChart() {
  const data = {
    labels: ["known", "anonymous"],
    datasets: [
      {
        label: "Invoices",
        data: [350, 120],
        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    cutout: "60%",
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
    },
  };


  return (
    <div className="w-full h-[50%] flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}