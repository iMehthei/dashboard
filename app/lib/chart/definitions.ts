export interface Order {
  id: number;
  amount: number;
  time: string;
}

export interface SalesData {
  [year: number]: {
    [month: number]: Order[][];
  };
}