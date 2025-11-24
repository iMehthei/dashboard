import { fetchChartDataForChartJS } from "@/app/lib/chart/data";
import ChartBar from "./bar";
import { ChartFilterProps } from "@/app/lib/chart/definitions";

export default async function AwaitChartBar({ searchParams }: ChartFilterProps) {
  const year =
    searchParams?.year && !isNaN(Number(searchParams.year))
      ? Number(searchParams.year)
      : undefined;

  const month =
    searchParams?.month === "all"
      ? "all"
      : searchParams?.month && !isNaN(Number(searchParams.month))
        ? Number(searchParams.month)
        : "all";

  const day =
    searchParams?.day === "all"
      ? "all"
      : searchParams?.day && !isNaN(Number(searchParams.day))
        ? Number(searchParams.day)
        : "all";
  ;
  const data = await fetchChartDataForChartJS(year, month, day);
  
  return <ChartBar data={data} />
}
