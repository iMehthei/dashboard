import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // حذف foreign key قدیمی (اگر وجود داره)
    await sql`
      ALTER TABLE invoices
      DROP CONSTRAINT IF EXISTS invoices_customer_id_fkey;
    `;

    // اضافه کردن foreign key جدید با ON DELETE CASCADE
    await sql`
      ALTER TABLE invoices
      ADD CONSTRAINT invoices_customer_id_fkey
      FOREIGN KEY (customer_id)
      REFERENCES customers(id)
      ON DELETE CASCADE;
    `;

    return Response.json({
      message: '✅ Cascade delete constraint applied successfully (no data affected).',
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
