
import React, { useState, useEffect } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { getMarketAnalysis } from '../services/geminiService';

interface AssetInfoProps {
  pair: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
}

const AssetInfo: React.FC<AssetInfoProps> = ({ pair, price, change, high, low, volume }) => {
  const [priceColor, setPriceColor] = useState('text-white');
  const [isAnalysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');

  useEffect(() => {
    setPriceColor(change >= 0 ? 'text-green-500' : 'text-red-500');
    const timer = setTimeout(() => setPriceColor('text-white'), 300);
    return () => clearTimeout(timer);
  }, [price, change]);

  const handleGetAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysis('');
    const result = await getMarketAnalysis(pair, price, change);
    setAnalysis(result);
    setAnalysisLoading(false);
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-gray-900 border-b border-gray-700 p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <h1 className="text-xl font-bold text-white flex items-center">{pair} <ChevronDownIcon className="ml-2"/></h1>
        <div>
          <p className={`text-2xl font-semibold transition-colors duration-200 ${priceColor}`}>${price.toLocaleString()}</p>
          <p className="text-xs text-gray-400">${price.toLocaleString()}</p>
        </div>
        <div className="text-xs">
          <p className="text-gray-400">24h Change</p>
          <p className={isPositive ? 'text-green-500' : 'text-red-500'}>{isPositive ? '+' : ''}{change.toFixed(2)}%</p>
        </div>
        <div className="hidden lg:block text-xs">
          <p className="text-gray-400">24h High</p>
          <p className="text-white">{high.toLocaleString()}</p>
        </div>
        <div className="hidden lg:block text-xs">
          <p className="text-gray-400">24h Low</p>
          <p className="text-white">{low.toLocaleString()}</p>
        </div>
        <div className="hidden lg:block text-xs">
          <p className="text-gray-400">24h Volume(BTC)</p>
          <p className="text-white">{volume.toLocaleString()}</p>
        </div>
      </div>
      <div className="w-full md:w-auto">
        <button
          onClick={handleGetAnalysis}
          disabled={isAnalysisLoading}
          className="bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-md text-sm font-bold hover:bg-yellow-400/30 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isAnalysisLoading ? (
            <div className="w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v.516a8.862 8.862 0 0 1 7.155 4.315.75.75 0 0 1-1.28.765 7.362 7.362 0 0 0-12.75 0 .75.75 0 0 1-1.28-.765A8.862 8.862 0 0 1 11.25 3.516V3a.75.75 0 0 1 .75-.75Zm7.5 10.5a.75.75 0 0 1-.75.75h-.516a8.862 8.862 0 0 1-4.315 7.155.75.75 0 0 1-.765-1.28 7.362 7.362 0 0 0 0-12.75.75.75 0 0 1 .765-1.28A8.862 8.862 0 0 1 18.484 12h.516a.75.75 0 0 1 .75.75ZM4.5 12.75a.75.75 0 0 1 .75-.75h.516a8.862 8.862 0 0 1 4.315-7.155.75.75 0 0 1 .765 1.28 7.362 7.362 0 0 0 0 12.75.75.75 0 0 1-.765 1.28A8.862 8.862 0 0 1 5.766 12H5.25a.75.75 0 0 1-.75-.75Z" />
            </svg>
          )}
          <span>{isAnalysisLoading ? 'Analyzing...' : 'Get AI Analysis'}</span>
        </button>
        {analysis && !isAnalysisLoading && (
          <div className="mt-2 p-3 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">
            <p className="font-bold mb-1 text-yellow-400">Gemini Insights:</p>
            {analysis}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetInfo;
