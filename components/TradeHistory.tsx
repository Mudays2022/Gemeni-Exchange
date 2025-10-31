
import React from 'react';
import { Trade, OrderType } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <div className="bg-gray-800/50 p-2 flex flex-col h-full text-xs">
      <h2 className="text-sm font-bold text-white mb-2">Trade History</h2>
      <div className="flex-grow overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-800/50">
            <tr className="text-gray-400">
              <th className="text-left font-normal p-1">Price(USDT)</th>
              <th className="text-right font-normal p-1">Size(BTC)</th>
              <th className="text-right font-normal p-1">Time</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className={`p-1 ${trade.type === OrderType.BUY ? 'text-green-500' : 'text-red-500'}`}>
                  {trade.price.toFixed(2)}
                </td>
                <td className="text-right p-1 text-white">{trade.size.toFixed(4)}</td>
                <td className="text-right p-1 text-gray-400">{trade.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;
