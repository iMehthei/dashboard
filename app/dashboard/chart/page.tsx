import { H1 } from '@/app/ui/heading';
import ChartFilter from '@/app/ui/chart/filter';
import AwaitChartBar from '@/app/ui/chart/awaitChartBar';
import { Suspense } from 'react';
import { PropagateLoader } from 'react-spinners';

export default async function Page(props: {
  searchParams?: Promise<{
    year?: number;
    month?: string | number;
    day?: string | number;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div>
      <H1>Chart</H1>
      <ChartFilter searchParams={searchParams} />
      <Suspense fallback={<ChartLoader />}>
        <AwaitChartBar searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function ChartLoader() {
  return (
    <div className='relative min-h-[50dvh]'>
      <div className='absolute inset-1/2 -translate-x-1/2 -translate-y-1/2'>
        <PropagateLoader color='#2f6fdb' />
      </div>
    </div>
  )
}

