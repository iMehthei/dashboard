import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import { EditCell, MobileTable, MobileTableRow, MobileTableRowContainer, Table, TableContainer, TBody, TBodyRow, TD, THead, UserCell } from '@/app/ui/table';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  
  const invoices = await fetchFilteredInvoices(query, currentPage);
  const tableHeadTitles = ['Customer', 'Email', 'Amount', 'Date', 'Status', 'Edit']

  return (
    <TableContainer>
      <MobileTable>
        {invoices?.map((invoice) => (
          <MobileTableRowContainer key={invoice.id}>
            <MobileTableRow>
              <UserCell image_url={invoice.image_url} name={invoice.name} email={invoice.email} />
              <InvoiceStatus status={invoice.status} />
            </MobileTableRow>
            <MobileTableRow>
              <div>
                <p className="text-xl font-medium">
                  {formatCurrency(invoice.amount)}
                </p>
                <p>{formatDateToLocal(invoice.date)}</p>
              </div>
              <EditCell>
                <UpdateInvoice id={invoice.id} />
                <DeleteInvoice id={invoice.id} />
              </EditCell>
            </MobileTableRow>
          </MobileTableRowContainer>
        ))}
      </MobileTable>
      <Table>
        <THead titles={tableHeadTitles} />
        <TBody>
          {invoices?.map(invoice =>
            <TBodyRow key={invoice.id}>
              <TD>
                <UserCell image_url={invoice.image_url} name={invoice.name} email={null} />
              </TD>
              <TD>
                {invoice.email}
              </TD>
              <TD>
                {formatCurrency(invoice.amount)}
              </TD>
              <TD>
                {formatDateToLocal(invoice.date)}
              </TD>
              <TD>
                <InvoiceStatus status={invoice.status} />
              </TD>
              <TD>
                <EditCell>
                  <UpdateInvoice id={invoice.id} />
                  <DeleteInvoice id={invoice.id} />
                </EditCell>
              </TD>
            </TBodyRow>
          )}
        </TBody>
      </Table>
    </TableContainer>
  );
}

