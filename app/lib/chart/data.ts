import { sql } from '../data';
import { SalesData, Order, ChartJsProps, ChartJsDataset } from './definitions';

let nextId = 1;

function randomAmount(base: number, variance = 5) {
  return Math.max(1, Math.floor(base + Math.random() * variance));
}

function randomTime() {
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return `${hour}:${minute}`;
}

function generateMonthData(monthIndex: number): Order[][] {
  const days = 30;
  let baseSales = 3 + monthIndex * 0.5;
  let baseAmount = 5 + monthIndex;
  const monthData: Order[][] = [];

  for (let i = 0; i < days; i++) {
    const salesCount = Math.floor(baseSales + Math.random() * 3);
    const daySales: Order[] = [];
    for (let j = 0; j < salesCount; j++) {
      daySales.push({
        id: nextId++,
        amount: randomAmount(baseAmount, 5),
        time: randomTime(),
        status: Math.random() > 0.3 ? 'paid' : 'pending', // 70٪ paid و 30٪ pending
      });
    }
    monthData.push(daySales);
    baseSales += 0.1 + Math.random() * 0.3;
    baseAmount += 0.2;
  }

  return monthData;
}

function generateYearData(): { [month: number]: Order[][] } {
  const yearData: { [month: number]: Order[][] } = {};
  for (let m = 0; m < 12; m++) {
    yearData[m] = generateMonthData(m);
  }
  return yearData;
}

export const stats: SalesData = {
  2025: generateYearData(),
  2024: generateYearData(),
};

type InvoiceRow = {
  id: number;
  amount: number;
  date: string | Date;
  status: 'paid' | 'pending';
};

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

  // Map برای ذخیره مجموع amounts
  let labels: string[] = [];
  const map: Record<'paid' | 'pending', Record<number, number>> = {
    paid: {},
    pending: {},
  };

  // حالت سالانه (12 ماه)
  if (month === undefined || month === 'all') {
    labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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

  // حالت ماهانه (روزهای ماه)
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

  // حالت روزانه (24 ساعت)
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






