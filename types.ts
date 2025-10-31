export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface Order {
  price: number;
  size: number;
  total: number;
}

export interface Trade {
  price: number;
  size: number;
  time: string;
  type: OrderType;
}

export interface ChartDataPoint {
  time: string;
  price: number;
}

export interface Market {
    pair: string;
    price: string;
    change: string;
    isPositive: boolean;
    openingPrice: number;
}