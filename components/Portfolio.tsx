import React, { useState, useEffect } from 'react';
import type { Market } from '../types';
import SearchIcon from './icons/SearchIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import WithdrawModal from './WithdrawModal';
import XMarkIcon from './icons/XMarkIcon';
import ArrowDownTrayIcon from './icons/ArrowDownTrayIcon';

// --- START: Inlined Icon Components ---

const ClipboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
);

const QrCodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A.75.75 0 0 1 4.5 3.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm0 9A.75.75 0 0 1 4.5 12.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm0 4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V18Zm5.25-13.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM12 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm-3 9a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm4.5 4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V18Zm-4.5 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V18Zm0-4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm5.25-4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm0 9a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM18 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Zm.75 9.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75h-1.5Z" />
    </svg>
);

const BankBuildingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);

// --- END: Inlined Icon Components ---

// --- START: Inlined Modals ---
interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetBalance | null;
}

const MOCK_ADDRESSES: { [key: string]: { address: string; networks: string[] } } = {
  BTC: { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', networks: ['Bitcoin', 'Lightning'] },
  ETH: { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', networks: ['Ethereum (ERC20)', 'Arbitrum', 'Optimism'] },
  USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', networks: ['Ethereum (ERC20)', 'Tron (TRC20)', 'Solana'] },
  SOL: { address: 'So11111111111111111111111111111111111111112', networks: ['Solana'] },
  BNB: { address: 'bnb136ns6lfw4s5g6ayda8gcls7rf9m0yqcrw0gs4s', networks: ['BNB Beacon Chain (BEP2)', 'BNB Smart Chain (BEP20)'] },
  XRP: { address: 'rEb8TK3gBgk5oZkwcGY1bn4H2yE2gpEFo3', networks: ['Ripple'] },
  DEFAULT: { address: 'Please select a valid asset to see the address', networks: [] },
};

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, asset }) => {
  const [copied, setCopied] = useState(false);
  const assetData = asset ? (MOCK_ADDRESSES[asset.symbol] || MOCK_ADDRESSES.ETH) : MOCK_ADDRESSES.DEFAULT;
  const [selectedNetwork, setSelectedNetwork] = useState(assetData.networks[0]);

  useEffect(() => {
    if (asset) {
        const data = MOCK_ADDRESSES[asset.symbol] || MOCK_ADDRESSES.ETH;
        setSelectedNetwork(data.networks[0]);
    }
  }, [asset]);

  if (!isOpen || !asset) return null;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(assetData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Deposit {asset.asset} ({asset.symbol})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <label htmlFor="network-select" className="text-gray-400 block mb-1">Network</label>
            <select id="network-select" value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-400">
              {assetData.networks.map(network => <option key={network} value={network}>{network}</option>)}
            </select>
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-900 p-4 rounded-md"><QrCodeIcon className="text-white" /><p className="text-xs text-gray-400 mt-2">Scan to get address</p></div>
          <div>
            <label className="text-gray-400 block mb-1">Deposit Address</label>
            <div className="relative">
              <input type="text" readOnly value={assetData.address} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 pr-12 text-gray-300 select-all"/>
              <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"><ClipboardIcon /></button>
            </div>
             {copied && <p className="text-xs text-green-400 mt-1 text-right">Copied!</p>}
          </div>
           <div className="bg-yellow-500/10 text-yellow-300 text-xs p-3 rounded-md"><p className="font-bold mb-1">Important</p><p>Send only {asset.symbol} to this deposit address. Sending any other coin may result in the loss of your deposit.</p></div>
          <button onClick={onClose} className="w-full bg-yellow-400 text-gray-900 py-2.5 rounded-md font-bold hover:bg-yellow-500 transition-colors mt-2">Done</button>
        </div>
      </div>
    </div>
  );
};

interface FiatModalProps {
    isOpen: boolean;
    onClose: () => void;
    priceMap: Map<string, number>;
    onConfirm: (type: 'Buy'|'Sell', crypto: string, cryptoAmount: number, fiat: string, fiatAmount: number) => void;
}
const FiatModal: React.FC<FiatModalProps> = ({ isOpen, onClose, priceMap, onConfirm }) => {
    const [activeView, setActiveView] = useState<'buy' | 'sell'>('buy');
    const [fiatAmount, setFiatAmount] = useState('100.00');
    const [cryptoAmount, setCryptoAmount] = useState('');
    const [fiatCurrency] = useState('USDT');
    const [cryptoCurrency, setCryptoCurrency] = useState('BTC');
    const [lastEdited, setLastEdited] = useState<'fiat' | 'crypto'>('fiat');

    const availableCryptos = Array.from(priceMap.keys()).filter(c => c !== 'USDT');

    useEffect(() => {
        const price = priceMap.get(cryptoCurrency) || 0;
        if (price > 0) {
            setCryptoAmount((100 / price).toFixed(8));
        }
    }, [cryptoCurrency, priceMap]);

    useEffect(() => {
        const fiat = parseFloat(fiatAmount);
        const crypto = parseFloat(cryptoAmount);
        const price = priceMap.get(cryptoCurrency) || 0;

        if (price === 0) return;

        if (lastEdited === 'fiat' && !isNaN(fiat)) setCryptoAmount((fiat / price).toFixed(8));
        else if (lastEdited === 'crypto' && !isNaN(crypto)) setFiatAmount((crypto * price).toFixed(2));
        
    }, [fiatAmount, cryptoAmount, cryptoCurrency, priceMap, lastEdited]);

    if (!isOpen) return null;

    const handleTransaction = () => {
        onConfirm(
            activeView === 'buy' ? 'Buy' : 'Sell',
            cryptoCurrency,
            parseFloat(cryptoAmount),
            fiatCurrency,
            parseFloat(fiatAmount)
        );
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Buy & Sell Crypto</h2><button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button></div>
                <div className="flex space-x-2 mb-4 bg-gray-900 p-1 rounded-md">
                    <button onClick={() => setActiveView('buy')} className={`w-1/2 py-2 text-sm font-semibold rounded-md ${activeView === 'buy' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>Buy</button>
                    <button onClick={() => setActiveView('sell')} className={`w-1/2 py-2 text-sm font-semibold rounded-md ${activeView === 'sell' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>Sell</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">You {activeView === 'buy' ? 'spend' : 'receive'}</label>
                        <div className="relative"><input type="number" value={fiatAmount} onChange={(e)=>{setFiatAmount(e.target.value); setLastEdited('fiat');}} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 pr-28"/><span className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white font-semibold rounded-md p-1.5">{fiatCurrency}</span></div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400 block mb-1">You {activeView === 'buy' ? 'receive' : 'sell'}</label>
                        <div className="relative"><input type="number" value={cryptoAmount} onChange={(e)=>{setCryptoAmount(e.target.value); setLastEdited('crypto');}} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 pr-28"/>
                         <select value={cryptoCurrency} onChange={e => setCryptoCurrency(e.target.value)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white font-semibold rounded-md p-1.5 focus:outline-none">{availableCryptos.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                </div>
                <div className="text-xs text-gray-400 text-center my-4">1 {cryptoCurrency} ≈ {priceMap.get(cryptoCurrency)?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                <button onClick={handleTransaction} className="w-full mt-6 bg-yellow-400 text-gray-900 py-3 rounded-md font-bold hover:bg-yellow-500 transition-colors capitalize">{activeView} {cryptoCurrency}</button>
            </div>
        </div>
    );
};

const MOCK_FIAT_DETAILS: Record<string, Record<string, string>> = { USD: { 'Beneficiary': 'Gemini Exchange LLC', 'Account Number': '1234567890', 'Routing Number': '0987654321', 'Bank Name': 'Global Crypto Bank', 'Reference Code': 'GEM-XYZ-123' }, EUR: { 'Beneficiary': 'Gemini Exchange Europe', 'IBAN': 'DE89 3704 0044 0532 0130 00', 'BIC/SWIFT': 'COBADEFFXXX', 'Bank Name': 'Euro Crypto Bank AG', 'Reference Code': 'GEM-XYZ-123' }, GBP: { 'Beneficiary': 'Gemini Exchange UK', 'Account Number': '11223344', 'Sort Code': '55-66-77', 'Bank Name': 'UK Crypto Bank PLC', 'Reference Code': 'GEM-XYZ-123' }};
const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (<div className="flex justify-between items-center text-sm py-2 border-b border-gray-700/50"><span className="text-gray-400">{label}</span><div className="flex items-center space-x-2"><span className="text-white font-mono">{value}</span><button onClick={handleCopy} title={`Copy ${label}`}><ClipboardIcon className={`w-4 h-4 ${copied ? 'text-green-400' : 'text-gray-500 hover:text-white'}`} /></button></div></div>);
};
const DepositFiatModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: (currency: string) => void;}> = ({ isOpen, onClose, onConfirm }) => {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Deposit Fiat</h2><button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button></div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="currency-select" className="text-sm text-gray-400 block mb-1">Select Currency</label>
                        <select id="currency-select" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-400">
                            <option value="USD">USD - US Dollar</option><option value="EUR">EUR - Euro</option><option value="GBP">GBP - British Pound</option>
                        </select>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-md"><h3 className="font-semibold mb-2">Bank Transfer Details</h3>{Object.entries(MOCK_FIAT_DETAILS[selectedCurrency]).map(([key, value]) => (<DetailRow key={key} label={key} value={value} />))}</div>
                    <div className="bg-yellow-500/10 text-yellow-300 text-xs p-3 rounded-md"><p className="font-bold mb-1">Crucial Information</p><p>You must include the <span className="font-bold">Reference Code</span> in your transfer to avoid delays. Only deposit {selectedCurrency} via this method.</p></div>
                    <button onClick={() => onConfirm(selectedCurrency)} className="w-full bg-yellow-400 text-gray-900 py-2.5 rounded-md font-bold hover:bg-yellow-500 transition-colors mt-2">I have made the transfer</button>
                </div>
            </div>
        </div>
    );
};
// --- END: Inlined Modals ---

export interface AssetBalance { asset: string; symbol: string; total: number; available: number; inOrders: number; }
export interface Transaction { id: string; date: string; type: string; status: string; asset: string; amount: number; details: string; }

interface PortfolioProps {
    portfolioData: { [key: string]: AssetBalance };
    priceMap: Map<string, number>;
    totalBalanceUsd: number;
    totalBalanceBtc: number;
    transactions: Transaction[];
    onNewTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
}


const Portfolio: React.FC<PortfolioProps> = ({ portfolioData, priceMap, totalBalanceUsd, totalBalanceBtc, transactions, onNewTransaction }) => {
    const [activeTab, setActiveTab] = useState('assets');
    const [searchTerm, setSearchTerm] = useState('');
    const [erroredIcons, setErroredIcons] = useState<string[]>([]);
    
    const [isDepositModalOpen, setDepositModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<AssetBalance | null>(null);
    const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [isFiatModalOpen, setFiatModalOpen] = useState(false);
    const [isFiatDepositModalOpen, setFiatDepositModalOpen] = useState(false);

    const handleOpenDepositModal = (asset: AssetBalance) => { setSelectedAsset(asset); setDepositModalOpen(true); };
    const handleOpenWithdrawModal = (asset: AssetBalance) => { setSelectedAsset(asset); setWithdrawModalOpen(true); };
    
    const handleWithdrawConfirm = (asset: AssetBalance, amount: number) => {
        onNewTransaction({
            type: 'Withdrawal',
            status: 'Processing',
            asset: asset.symbol,
            amount: amount,
            details: `To address: [REDACTED]`
        });
        setWithdrawModalOpen(false);
    };

    const handleFiatDepositConfirm = (currency: string) => {
        onNewTransaction({
            type: 'Deposit',
            status: 'Pending',
            asset: currency,
            amount: 0, // Amount unknown until transfer is received
            details: 'Fiat bank transfer'
        });
        setFiatDepositModalOpen(false);
    };
    
     const handleFiatTransaction = (type: 'Buy'|'Sell', crypto: string, cryptoAmount: number, fiat: string, fiatAmount: number) => {
        onNewTransaction({
            type: 'Fiat',
            status: 'Completed',
            asset: crypto,
            amount: type === 'Buy' ? cryptoAmount : -cryptoAmount,
            details: `${type} with ${fiatAmount.toFixed(2)} ${fiat}`
        });
    };
    
    // FIX: Cast the result of Object.values to AssetBalance[] to ensure proper type inference.
    // This resolves multiple errors where asset properties were being accessed on an 'unknown' type.
    const assetsList = Object.values(portfolioData) as AssetBalance[];
    const filteredAssets = assetsList.filter(asset =>
        asset.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="flex-grow p-4 md:p-6 bg-gray-900 text-white min-h-0 flex flex-col">
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold">Wallet Overview</h1>
                    <div className="mt-2 text-gray-400">
                        <p>Estimated Balance</p>
                        <p className="text-2xl text-white font-semibold">{totalBalanceUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            <span className="text-base text-gray-500 ml-2">≈ {totalBalanceBtc.toFixed(6)} BTC</span>
                        </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3 md:gap-4 text-sm">
                         <button onClick={() => setFiatDepositModalOpen(true)} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"><ArrowDownTrayIcon /><span>Deposit Fiat</span></button>
                        <button onClick={() => setFiatModalOpen(true)} className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-md transition-colors"><CreditCardIcon /><span>Buy/Sell with Fiat</span></button>
                         <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"><ArrowPathIcon /><span>Transfer</span></button>
                    </div>
                </header>

                <div className="bg-gray-800/50 rounded-lg p-2 md:p-4 flex-grow flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2 md:space-x-4 border-b border-gray-700">
                            {['Assets', 'Transaction History'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))} className={`capitalize pb-2 px-2 md:px-4 text-sm md:text-base transition-colors duration-200 ${activeTab === tab.toLowerCase().replace(' ', '') ? 'text-white border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}>{tab}</button>
                            ))}
                        </div>
                        {activeTab === 'assets' && <div className="relative"><input type="text" placeholder="Search Asset" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-48 md:w-64 bg-gray-900 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"/><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><SearchIcon className="text-gray-500" /></div></div>}
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        {activeTab === 'assets' ? (
                             <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-gray-800/50"><tr className="text-left text-gray-400">{['Asset', 'Total', 'Available Balance', 'In Orders', 'USD Value', 'Actions'].map(h=><th key={h} className={`p-3 font-normal ${['Total', 'Available Balance', 'In Orders', 'USD Value', 'Actions'].includes(h) ? 'text-right' : ''} ${h === 'In Orders' ? 'hidden md:table-cell' : ''}`}>{h}</th>)}</tr></thead>
                                <tbody>
                                    {filteredAssets.map((asset) => (
                                        <tr key={asset.symbol} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                            <td className="p-3"><div className="flex items-center">
                                                <img src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${asset.symbol.toLowerCase()}.png`} alt={`${asset.asset} icon`} className="w-8 h-8 mr-4" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                <div><div className="font-bold text-base">{asset.symbol}</div><div className="text-gray-400 text-xs">{asset.asset}</div></div>
                                            </div></td>
                                            <td className="p-3 text-right font-mono">{asset.total.toFixed(6)}</td><td className="p-3 text-right font-mono">{asset.available.toFixed(6)}</td>
                                            <td className="p-3 text-right font-mono hidden md:table-cell">{asset.inOrders.toFixed(6)}</td><td className="p-3 text-right font-mono">${(asset.total * (priceMap.get(asset.symbol) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="p-3 text-right"><div className="flex items-center justify-end space-x-4"><button onClick={() => handleOpenDepositModal(asset)} className="font-semibold text-yellow-400 hover:text-yellow-300">Deposit</button><button onClick={() => handleOpenWithdrawModal(asset)} className="font-semibold text-yellow-400 hover:text-yellow-300">Withdraw</button></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                             <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-gray-800/50"><tr className="text-left text-gray-400">{['Date', 'Type', 'Asset', 'Amount', 'Status', 'Details'].map(h=><th key={h} className="p-3 font-normal">{h}</th>)}</tr></thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                            <td className="p-3 text-gray-400">{new Date(tx.date).toLocaleString()}</td><td className="p-3 font-semibold">{tx.type}</td>
                                            <td className="p-3">{tx.asset}</td><td className="p-3 font-mono">{tx.amount !== 0 ? tx.amount.toFixed(6) : '-'}</td>
                                            <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${tx.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{tx.status}</span></td>
                                            <td className="p-3 text-gray-400">{tx.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        )}
                        {(activeTab === 'assets' && filteredAssets.length === 0) && <div className="text-center py-10 text-gray-500"><p>No assets found.</p></div>}
                        {(activeTab === 'transactionhistory' && transactions.length === 0) && <div className="text-center py-10 text-gray-500"><p>No transaction history.</p></div>}
                    </div>
                </div>
            </div>
            <DepositModal isOpen={isDepositModalOpen} onClose={() => setDepositModalOpen(false)} asset={selectedAsset} />
            <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setWithdrawModalOpen(false)} asset={selectedAsset} onWithdraw={handleWithdrawConfirm} />
            <FiatModal isOpen={isFiatModalOpen} onClose={() => setFiatModalOpen(false)} priceMap={priceMap} onConfirm={handleFiatTransaction} />
            <DepositFiatModal isOpen={isFiatDepositModalOpen} onClose={() => setFiatDepositModalOpen(false)} onConfirm={handleFiatDepositConfirm} />
        </>
    );
};

export default Portfolio;