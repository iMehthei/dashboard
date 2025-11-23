import { H1 } from '@/app/ui/heading';
import ChartFilterWithParams from '@/app/ui/chart/filter2';
import ChartBarWithParams from '@/app/ui/chart/bar';
import { fetchChartDataForChartJS } from '@/app/lib/chart/data';

export default async function Page(props: {
  searchParams?: Promise<{
    year?: number;
    month?: string | number;
    day?: string | number;
  }>;
}) {
  const searchParams = await props.searchParams;

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
  console.log(data)
  return (
    <div>
      <H1>Chart</H1>
      <ChartFilterWithParams searchParams={searchParams} />
      <ChartBarWithParams data={data} />
    </div>
  );
}
