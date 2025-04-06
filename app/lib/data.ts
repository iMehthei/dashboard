import postgres from 'postgres';
import {
  Customer,
  CustomerField,
  CustomersTableType,
  Invoice,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  // LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    const response = await fetch('http://localhost:3000/revenue'); // ارسال درخواست به endpoint محلی

    if (!response.ok) {
      throw new Error('Failed to fetch revenue data.');
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data: Revenue[] = await response.json(); // تبدیل داده‌ها به فرمت JSON

    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  try {
    const invoicesResponse = await fetch('http://localhost:3000/invoices'); // واکشی داده‌های فاکتورها از JSON
    if (!invoicesResponse.ok) {
      throw new Error('Failed to fetch invoices from the server.');
    }
    const invoicesData: Invoice[] = await invoicesResponse.json();

    const customersResponse = await fetch('http://localhost:3000/customers'); // واکشی داده‌های مشتریان از JSON
    if (!customersResponse.ok) {
      throw new Error('Failed to fetch customers from the server.');
    }
    const customersData: Customer[] = await customersResponse.json();

    const latestInvoices = invoicesData // ترکیب داده‌ها: ارتباط دادن فاکتور با اطلاعات مشتری مرتبط
      .map((invoice) => {
        const relatedCustomer = customersData.find( // جستجو برای یافتن مشتری مرتبط با customer_id
          (customer) => customer.id === invoice.customer_id
        );

        if (!relatedCustomer) { // اگر مشتری مرتبط پیدا نشود، یک خطا پرتاب کن
          throw new Error(`Customer not found for invoice ID: ${invoice.id}`);
        }

        return { // بازسازی ساختار داده مشابه کوئری SQL
          id: invoice.id, // شناسه فاکتور
          name: relatedCustomer.name, // نام مشتری
          email: relatedCustomer.email, // ایمیل مشتری
          image_url: relatedCustomer.image_url, // آدرس تصویر مشتری
          amount: formatCurrency(invoice.amount), // فرمت مقدار مالی
          date: invoice.date, // تاریخ فاکتور
        };
      })
      .sort((invoiceA, invoiceB) => new Date(invoiceB.date).getTime() - new Date(invoiceA.date).getTime()) // مرتب‌سازی نزولی بر اساس تاریخ
      .slice(0, 5); // دریافت فقط پنج فاکتور آخر

    // بازگرداندن داده‌های فاکتورهای نهایی
    return latestInvoices;
  } catch (error) {
    // ثبت خطا در صورت رخ دادن مشکلی در فرایند واکشی یا پردازش داده‌ها
    console.error('Error occurred while fetching latest invoices:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}



export async function fetchCardData() {
  try {
    // واکشی داده‌های فاکتورها از JSON
    const invoicesResponse = await fetch('http://localhost:3000/invoices');
    if (!invoicesResponse.ok) {
      throw new Error('Failed to fetch invoices from the server.');
    }
    const invoicesData: Invoice[] = await invoicesResponse.json();

    // واکشی داده‌های مشتریان از JSON
    const customersResponse = await fetch('http://localhost:3000/customers');
    if (!customersResponse.ok) {
      throw new Error('Failed to fetch customers from the server.');
    }
    const customersData: Customer[] = await customersResponse.json();

    // محاسبه تعداد فاکتورها
    const numberOfInvoices = invoicesData.length;

    // محاسبه تعداد مشتریان
    const numberOfCustomers = customersData.length;

    // محاسبه مجموع وضعیت‌های `paid` و `pending`
    const totalPaidInvoices = invoicesData
      .filter((invoice) => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    const totalPendingInvoices = invoicesData
      .filter((invoice) => invoice.status === 'pending')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    // بازگرداندن داده‌ها با فرمت مورد نظر
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices: formatCurrency(totalPaidInvoices), // فرمت مقدار `paid`
      totalPendingInvoices: formatCurrency(totalPendingInvoices), // فرمت مقدار `pending`
    };
  } catch (error) {
    // ثبت خطا در صورت رخ دادن مشکلی در واکشی یا پردازش داده‌ها
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}


const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
