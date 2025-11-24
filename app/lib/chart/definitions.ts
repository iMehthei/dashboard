export interface Order {
  id: number;
  amount: number;
  time: string;
  status: 'paid' | 'pending';
}


export interface SalesData {
  [year: number]: {
    [month: number]: Order[][];
  };
}

export type InvoiceRow = {
  id: number;
  amount: number;
  date: string | Date;
  status: 'paid' | 'pending';
};

export interface ChartJsDataset {
  label: 'Paid' | 'Pending';
  data: number[];
  backgroundColor?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
}

export interface ChartJsProps {
  labels: string[];
  datasets: ChartJsDataset[];
}

export interface ChartFilterProps {
  searchParams?: {
    year?: number;
    month?: string | number;
    day?: string | number;
  };
}
