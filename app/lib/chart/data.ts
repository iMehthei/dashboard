import { sql } from '../data';
import { ChartJsProps, ChartJsDataset, InvoiceRow } from './definitions';

function normalizeAmount(amount: any): number {
  return Number((Number(amount) / 100).toFixed(2));
}

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
      map[r.status][m] = (map[r.status][m] || 0) + normalizeAmount(r.amount);
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
        map[r.status][d] = (map[r.status][d] || 0) + normalizeAmount(r.amount);
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
        map[r.status][h] = (map[r.status][h] || 0) + normalizeAmount(r.amount);
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

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function fetchOverviewRevenue() {
  const now = new Date();
  const lastYear = new Date();
  lastYear.setMonth(now.getMonth() - 11);

  try {
    const result = await sql`
      SELECT amount, date
      FROM invoices
      WHERE date >= ${lastYear} AND date <= ${now}
      AND status = 'paid'
    `;

    const map: Record<number, number> = {};

    result.forEach((r: any) => {
      const dt = new Date(r.date);
      const monthIndex = dt.getMonth();
      const amount = normalizeAmount(r.amount);

      map[monthIndex] = (map[monthIndex] || 0) + amount;
    });

    const output = [];
    let cursor = new Date(lastYear);

    for (let i = 0; i < 12; i++) {
      const m = cursor.getMonth();
      output.push({
        month: MONTH_NAMES[m],
        revenue: Number((map[m] || 0).toFixed(2)),
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return output;

  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch overview revenue.");
  }
}
