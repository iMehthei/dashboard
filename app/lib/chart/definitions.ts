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