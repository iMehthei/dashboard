import { sql } from '../data';
import { ChartJsProps, ChartJsDataset, InvoiceRow } from './definitions';

export async function fetchChartRawData(
  year?: number,
  month?: 'all' | number,
  day?: 'all' | number
): Promise<InvoiceRow[]> {
  try {
    const now = new Date();
    const queryYear = year ?? now.getFullYear();

    let query = sql`
      SELECT id, amount, date, status
      FROM invoices
      WHERE EXTRACT(YEAR FROM date) = ${queryYear}
    `;

    if (typeof month === 'number') {
      query = sql`${query} AND EXTRACT(MONTH FROM date) = ${month}`;
    }

    if (typeof day === 'number') {
      query = sql`${query} AND EXTRACT(DAY FROM date) = ${day}`;
    }

    const result = await query;
    return result as unknown as InvoiceRow[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch chart data.');
  }
}

export async function fetchChartDataForChartJS(
  year?: number,
  month?: 'all' | number,
  day?: 'all' | number
): Promise<ChartJsProps> {
  const raw = await fetchChartRawData(year, month, day);
  const now = new Date();
  const y = year ?? now.getFullYear();

  const statuses: ('paid' | 'pending')[] = ['paid', 'pending'];
  const colors: Record<'paid' | 'pending', string> = {
    paid: 'rgba(54, 162, 235, 0.5)',
    pending: 'rgba(255, 99, 132, 0.5)',
  };

  let labels: string[] = [];
  const map: Record<'paid' | 'pending', Record<number, number>> = {
    paid: {},
    pending: {},
  };

  if (month === undefined || month === 'all') {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    raw.forEach(r => {
      const dt = new Date(r.date);
      const m = dt.getMonth() + 1;
      map[r.status][m] = (map[r.status][m] || 0) + Number(r.amount);
    });

    const datasets: ChartJsDataset[] = statuses.map(status => ({
      label: status === 'paid' ? 'Paid' : 'Pending',
      data: labels.map((_, idx) => map[status][idx + 1] || 0),
      backgroundColor: colors[status],
      borderRadius: 0,
      borderColor: 'white',
      borderWidth: 2,
    }));

    return { labels, datasets };
  }

  if (typeof month === 'number' && (day === undefined || day === 'all')) {
    const daysInMonth = new Date(y, month, 0).getDate();
    labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);

    raw.forEach(r => {
      const dt = new Date(r.date);
      const d = dt.getDate();
      if (dt.getMonth() + 1 === month) {
        map[r.status][d] = (map[r.status][d] || 0) + Number(r.amount);
      }
    });

    const datasets: ChartJsDataset[] = statuses.map(status => ({
      label: status === 'paid' ? 'Paid' : 'Pending',
      data: labels.map((_, idx) => map[status][idx + 1] || 0),
      backgroundColor: colors[status],
      borderRadius: 0,
      borderColor: 'white',
      borderWidth: 2,
    }));

    return { labels, datasets };
  }

  if (typeof month === 'number' && typeof day === 'number') {
    labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    raw.forEach(r => {
      const dt = new Date(r.date);
      const h = dt.getHours();
      if (dt.getMonth() + 1 === month && dt.getDate() === day) {
        map[r.status][h] = (map[r.status][h] || 0) + Number(r.amount);
      }
    });

    const datasets: ChartJsDataset[] = statuses.map(status => ({
      label: status === 'paid' ? 'Paid' : 'Pending',
      data: labels.map((_, idx) => map[status][idx] || 0),
      backgroundColor: colors[status],
      borderRadius: 0,
      borderColor: 'white',
      borderWidth: 2,
    }));

    return { labels, datasets };
  }

  return { labels: [], datasets: [] };
}






