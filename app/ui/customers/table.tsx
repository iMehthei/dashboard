import { fetchFilteredCustomers } from '@/app/lib/data';
import { EditCell, MobileTable, MobileTableRow, MobileTableRowContainer, Table, TableContainer, TBody, TBodyRow, TD, THead, UserCell } from '@/app/ui/table';
import { DeleteCustomer, UpdateCustomer } from '@/app/ui/customers/buttons';

export default async function CustomersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const customers = await fetchFilteredCustomers(query, currentPage)
  const tableHeadTitles = ['Name', 'Email', 'Total Invoices', 'Total Pending', 'Total Paid', 'Edit']

  return (
    <TableContainer>
      <MobileTable>
        {customers?.map((customer) => (
          <MobileTableRowContainer key={customer.id}>
            <MobileTableRow>
              <UserCell image_url={customer.image_url} name={customer.name} email={customer.email} />
            </MobileTableRow>
            <MobileTableRow>
              <div className="flex w-1/2 flex-col">
                <p className="text-xs">Pending</p>
                <p className="font-medium">{customer.total_pending}</p>
              </div>
              <div className="flex w-1/2 flex-col">
                <p className="text-xs">Paid</p>
                <p className="font-medium">{customer.total_paid}</p>
              </div>
            </MobileTableRow>
            <MobileTableRow>
              <p>{customer.total_invoices} invoices</p>
            </MobileTableRow>
          </MobileTableRowContainer>
        ))}
      </MobileTable>

      <Table>
        <THead titles={tableHeadTitles} />
        <TBody>
          {customers.map((customer) => (
            <TBodyRow key={customer.id}>
              <TD>
                <UserCell image_url={customer.image_url} name={customer.name} email={null} />
              </TD>
              <TD>
                {customer.email}
              </TD>
              <TD>
                {customer.total_invoices}
              </TD>
              <TD>
                {customer.total_pending}
              </TD>
              <TD>
                {customer.total_paid}
              </TD>
              <TD>
                <EditCell>
                  <UpdateCustomer id={'invoice.id'} />
                  <DeleteCustomer id={customer.id} />
                </EditCell>
              </TD>
            </TBodyRow>
          ))}
        </TBody>
      </Table>
    </TableContainer>
  );
}
