import { SalesData } from "./definitions";

let nextId = 1;

function randomAmount(base: number, variance = 5) {
  return Math.max(1, Math.floor(base + Math.random() * variance));
}

function randomTime() {
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return `${hour}:${minute}`;
}

// تولید داده یک ماه با روند صعودی روزانه
function generateMonthData(monthIndex: number) {
  const days = 30;
  let baseSales = 3 + monthIndex * 0.5; // ماه‌های بعد پایه فروش بیشتر
  let baseAmount = 5 + monthIndex; // ماه‌های بعد میانگین amount بیشتر
  const monthData = [];

  for (let i = 0; i < days; i++) {
    const salesCount = Math.floor(baseSales + Math.random() * 3); // 3 تا 6 فروش در روز
    const daySales = [];
    for (let j = 0; j < salesCount; j++) {
      daySales.push({
        id: nextId++,
        amount: randomAmount(baseAmount, 5),
        time: randomTime(),
      });
    }
    monthData.push(daySales);
    baseSales += 0.1 + Math.random() * 0.3; // رشد تدریجی فروش روزانه
    baseAmount += 0.2; // رشد تدریجی amount روزانه
  }

  return monthData;
}

// تولید داده کل سال با روند صعودی ماهانه
function generateYearData() {
  const yearData: Record<number, any> = {};
  for (let m = 0; m < 12; m++) {
    yearData[m] = generateMonthData(m);
  }
  return yearData;
}

export const stats: SalesData = {
  2025: generateYearData(),
  2024: generateYearData(),
};
