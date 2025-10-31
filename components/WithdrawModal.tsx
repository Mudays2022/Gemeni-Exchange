import React, { useState, useEffect } from 'react';
import XMarkIcon from './icons/XMarkIcon';

interface AssetBalance {
  asset: string;
  symbol: string;
  total: number;
  available: number;
  inOrders: number;
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetBalance | null;
  onWithdraw: (asset: AssetBalance, amount: number) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, asset, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setAddress('');
      setError('');
    }
  }, [isOpen, asset]);

  if (!isOpen || !asset) return null;

  const handleConfirmWithdrawal = () => {
    const withdrawAmount = parseFloat(amount);
    
    setError('');

    if (!amount || !address) {
      setError('Please fill in all fields.');
      return;
    }
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (withdrawAmount > asset.available) {
      setError('Withdrawal amount cannot exceed available balance.');
      return;
    }
    if (address.length < 26) {
        setError('Please enter a valid wallet address.');
        return;
    }

    onWithdraw(asset, withdrawAmount);
    onClose();
  };
  
  const handleMaxAmount = () => {
    setAmount(asset.available.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Withdraw {asset.asset} ({asset.symbol})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon />
          </button>
        </div>
        
        {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4">{error}</p>}
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Amount</label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.000000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-400 pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <span className="text-gray-400 text-sm mr-2">{asset.symbol}</span>
                <button onClick={handleMaxAmount} className="text-yellow-400 text-sm font-semibold">MAX</button>
              </div>
            </div>
             <p className="text-xs text-gray-500 mt-1">Available: {asset.available.toFixed(6)} {asset.symbol}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Address</label>
            <input
              type="text"
              placeholder={`Enter ${asset.symbol} destination address`}
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
          </div>
          
           <div className="bg-yellow-500/10 text-yellow-300 text-xs p-3 rounded-md">
            <p className="font-bold mb-1">Security Warning</p>
            <p>Ensure the address is correct and on the correct network. Withdrawals are irreversible.</p>
          </div>

          <button
            onClick={handleConfirmWithdrawal}
            className="w-full bg-yellow-400 text-gray-900 py-2.5 rounded-md font-bold hover:bg-yellow-500 transition-colors mt-2"
          >
            Confirm Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
