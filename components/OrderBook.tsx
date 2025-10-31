
import React from 'react';
import type { Order } from '../types';

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
}

const OrderBook: React.FC<OrderBookProps> = ({ bids, asks }) => {

  const maxCumulative = Math.max(
    bids.reduce((acc, curr) => acc + curr.total, 0),
    asks.reduce((acc, curr) => acc + curr.total, 0)
  );

  const renderOrders = (orders: Order[], isBid: boolean) => {
    let cumulativeTotal = 0;
    return orders.map((order, index) => {
      cumulativeTotal += order.total;
      const depth = (cumulativeTotal / maxCumulative) * 100;
      const bgClass = isBid ? 'bg-green-500/20' : 'bg-red-500/20';
      
      return (
        <tr key={index} className="relative h-6 text-xs hover:bg-gray-700">
          <td className={`text-left p-1 ${isBid ? 'text-green-500' : 'text-red-500'}`}>{order.price.toFixed(2)}</td>
          <td className="text-right p-1 text-white">{order.size.toFixed(4)}</td>
          <td className="text-right p-1 text-white">{order.total.toFixed(2)}</td>
          <td style={{ width: `${depth}%`, right: 0 }} className={`absolute top-0 h-full ${bgClass} z-0`}></td>
        </tr>
      );
    });
  };

  return (
    <div className="bg-gray-800/50 p-2 flex flex-col h-full text-xs">
      <h2 className="text-sm font-bold text-white mb-2">Order Book</h2>
      <div className="flex-grow overflow-y-auto">
        <table className="w-full border-separate border-spacing-y-0.5">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left font-normal p-1">Price(USDT)</th>
              <th className="text-right font-normal p-1">Size(BTC)</th>
              <th className="text-right font-normal p-1">Total(USDT)</th>
            </tr>
          </thead>
        </table>
        {/* Asks */}
        <table className="w-full border-separate border-spacing-y-0.5">
          <tbody className="relative">
            {renderOrders(asks.slice().reverse(), false)}
          </tbody>
        </table>

        {/* Current Price */}
        <div className="py-2 text-lg text-green-500 font-bold text-center border-t border-b border-gray-700 my-1">
          {bids[0]?.price.toFixed(2)}
        </div>

        {/* Bids */}
        <table className="w-full border-separate border-spacing-y-0.5">
          <tbody className="relative">
            {renderOrders(bids, true)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;
