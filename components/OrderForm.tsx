import React, { useState, useEffect } from 'react';
import type { OrderType } from '../types';

interface OrderFormProps {
    baseAsset: string;
    quoteAsset: string;
    balances: { [key: string]: number };
    onPlaceOrder: (order: { type: 'Limit' | 'Market', side: 'Buy' | 'Sell', amount: number, price?: number }) => Promise<void>;
    currentPrice: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ baseAsset, quoteAsset, balances, onPlaceOrder, currentPrice }) => {
  const [activeTab, setActiveTab] = useState<'Limit' | 'Market'>('Limit');
  const [orderType, setOrderType] = useState<'Buy' | 'Sell'>('Buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPrice(currentPrice.toFixed(2));
  }, [currentPrice]);

  const total = parseFloat(price) * parseFloat(amount) || 0;
  
  const balance = orderType === 'Buy' ? balances[quoteAsset] || 0 : balances[baseAsset] || 0;
  const balanceSymbol = orderType === 'Buy' ? quoteAsset : baseAsset;

  const handlePercentClick = (percent: number) => {
    if (orderType === 'Buy') {
        const quoteBalance = balances[quoteAsset] || 0;
        const targetTotal = quoteBalance * (percent / 100);
        const effectivePrice = activeTab === 'Limit' ? parseFloat(price) : currentPrice;
        if (effectivePrice > 0) {
            setAmount((targetTotal / effectivePrice).toFixed(6));
        }
    } else { // Sell
        const baseBalance = balances[baseAsset] || 0;
        setAmount((baseBalance * (percent / 100)).toFixed(6));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onPlaceOrder({
      type: activeTab,
      side: orderType,
      amount: parseFloat(amount),
      price: activeTab === 'Limit' ? parseFloat(price) : undefined,
    });
    setAmount('');
    if (activeTab === 'Limit') {
        setPrice(currentPrice.toFixed(2));
    }
    setIsSubmitting(false);
  };
  
  const canSubmit = (parseFloat(amount) > 0) && (activeTab === 'Market' || parseFloat(price) > 0);
  const insufficientFunds = orderType === 'Buy' ? total > balance : parseFloat(amount) > balance;
  const isSubmitDisabled = !canSubmit || isSubmitting || insufficientFunds;
  
  const submitButtonText = () => {
    if (insufficientFunds) return 'Insufficient Funds';
    if (isSubmitting) return 'Placing Order...';
    return `${orderType} ${baseAsset}`;
  };


  return (
    <div className="bg-gray-900 text-sm p-4 h-full flex flex-col">
      <div className="flex space-x-4 mb-4">
        <button 
          onClick={() => setActiveTab('Limit')}
          className={`pb-2 ${activeTab === 'Limit' ? 'text-white border-b-2 border-yellow-400' : 'text-gray-400'}`}
        >
          Limit
        </button>
        <button 
          onClick={() => setActiveTab('Market')}
          className={`pb-2 ${activeTab === 'Market' ? 'text-white border-b-2 border-yellow-400' : 'text-gray-400'}`}
        >
          Market
        </button>
      </div>
      
      <div className="flex border border-gray-700 rounded-md mb-4">
        <button 
          onClick={() => setOrderType('Buy')}
          className={`w-1/2 py-2 rounded-l-md transition-colors duration-200 ${orderType === 'Buy' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          Buy
        </button>
        <button 
          onClick={() => setOrderType('Sell')}
          className={`w-1/2 py-2 rounded-r-md transition-colors duration-200 ${orderType === 'Sell' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 flex-grow flex flex-col">
        <div className="text-xs text-gray-400 flex justify-between">
          <span>Available</span>
          <span className="font-mono">{balance.toFixed(4)} {balanceSymbol}</span>
        </div>

        {activeTab === 'Limit' && (
          <div className="relative">
            <label className="text-xs text-gray-400">Price</label>
            <input 
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
            <span className="absolute right-3 top-8 text-gray-400 text-xs">{quoteAsset}</span>
          </div>
        )}
        
        {activeTab === 'Market' && (
            <div className="relative">
                <label className="text-xs text-gray-400">Price</label>
                <input 
                    type="text"
                    value="Market"
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 text-gray-500"
                />
                 <span className="absolute right-3 top-8 text-gray-400 text-xs">{quoteAsset}</span>
            </div>
        )}

        <div className="relative">
          <label className="text-xs text-gray-400">Amount</label>
          <input 
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
          <span className="absolute right-3 top-8 text-gray-400 text-xs">{baseAsset}</span>
        </div>

        <div className="flex justify-between">
          {[25, 50, 75, 100].map(p => (
            <button 
              key={p} 
              type="button"
              onClick={() => handlePercentClick(p)}
              className="text-xs bg-gray-700 text-gray-300 rounded-md px-3 py-1 hover:bg-gray-600"
            >
              {p}%
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400 flex justify-between">
          <span>Total</span>
          <span>≈ {total.toFixed(2)} {quoteAsset}</span>
        </div>
      
        <div className="mt-auto pt-2">
            <button 
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full py-2.5 rounded-md text-white font-bold transition-colors duration-200 
                ${isSubmitDisabled ? 'bg-gray-600 cursor-not-allowed' : (orderType === 'Buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')}`}
            >
            {submitButtonText()}
            </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
