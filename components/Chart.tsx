
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../types';

interface ChartProps {
  data: ChartDataPoint[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-full w-full bg-gray-900 p-2 flex flex-col">
        <div className="flex space-x-4 border-b border-gray-700 mb-2 text-sm">
            <button className="text-white py-2 px-3 border-b-2 border-yellow-400">Chart</button>
            <button className="text-gray-400 py-2 px-3 hover:text-white">Depth</button>
        </div>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" vertical={false} />
                <XAxis 
                    dataKey="time" 
                    tick={{ fill: '#a0aec0', fontSize: 12 }} 
                    stroke="#4a5568"
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis 
                    orientation="right"
                    domain={['dataMin - 100', 'dataMax + 100']}
                    tick={{ fill: '#a0aec0', fontSize: 12 }} 
                    stroke="#4a5568"
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1a202c',
                        borderColor: '#4a5568',
                        color: '#e2e8f0',
                    }}
                    labelStyle={{ color: '#a0aec0' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#facc15" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );
};

export default Chart;
