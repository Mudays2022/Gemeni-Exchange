import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Header from './Header';
import Markets from './Markets';
import AssetInfo from './AssetInfo';
import Chart from './Chart';
import OrderBook from './OrderBook';
import TradeHistory from './TradeHistory';
import OrderForm from './OrderForm';
import Portfolio, { type AssetBalance, type Transaction } from './Portfolio';
import { OrderType, type Market } from '../types';
import type { Order, Trade, ChartDataPoint } from '../types';
import { MockWebSocketService, type MarketUpdate } from '../services/cryptoService';
import { getAIChatResponse, ChatMessage } from '../services/geminiService';

interface ExchangeDashboardProps {
  onLogout: () => void;
}

// --- START: Inlined Icon Components ---
const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.017h-.008v-.017Z" />
    </svg>
);

const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 19.5v-8.25a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 11.25Zm-18 0h18M12 15.75a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v5.714m0 0a2.25 2.25 0 0 1-2.25 2.25H9.75a2.25 2.25 0 0 0-2.25 2.25v.429M12 8.714a2.25 2.25 0 0 0 2.25 2.25h.008a2.25 2.25 0 0 1 2.25 2.25v.429" />
    </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const MetaMaskIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path fill="#F6851B" d="M991.22 454.34L625.33 91.91a34.13 34.13 0 0 0-48.29 0l-91.5 91.5-91.52-91.5a34.13 34.13 0 0 0-48.29 0L32 454.34a34.13 34.13 0 0 0 0 48.29l163.88 163.88-41.13 41.13a34.13 34.13 0 0 0 0 48.29l115.65 115.65c13.25 13.25 35.04 13.25 48.29 0l115.65-115.65-115.65-115.65a34.13 34.13 0 0 0-48.29 0L248.11 720.25l-25.86 25.86 284.15-164.04-124-124 107.22-107.22 73.64 73.64 48.29-48.29-73.64-73.64 124-124-213.37 213.37L512 489.07l41.13-41.14 163.88-163.88a34.13 34.13 0 0 0 0-48.29L601.36 120.1l115.65 115.65-73.64 73.64 48.29 48.29 73.64-73.64 115.65 115.65a34.13 34.13 0 0 0 .02 48.28z"/>
    </svg>
);
// --- END: Inlined Icon Components ---

// --- START: Inlined Data Types ---
interface UserProfile {
    name: string;
    email: string;
    nickname: string;
    avatar: string;
}

interface UserOrder {
    id: string;
    pair: string;
    type: 'Limit' | 'Market';
    side: 'Buy' | 'Sell';
    price: number;
    amount: number;
    filled: number;
    status: 'Open' | 'Filled' | 'Canceled';
    date: number;
}

interface Notification {
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
}
// --- END: Inlined Data Types ---


// --- START: Inlined UI Components ---
const Profile: React.FC<{ user: UserProfile; onUpdate: (p: {name: string, nickname: string}) => void; totalBalanceUsd: number; totalBalanceBtc: number;}> = ({ user, onUpdate, totalBalanceUsd, totalBalanceBtc }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: user.name, nickname: user.nickname });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setFormData({ name: user.name, nickname: user.nickname });
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleCancel = () => {
        setFormData({ name: user.name, nickname: user.nickname });
        setIsEditing(false);
    };


    return (
    <div className="p-4 md:p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">User Profile</h1>
        {successMessage && (
            <div className="mb-4 bg-green-500/20 text-green-300 text-sm p-3 rounded-md transition-opacity duration-300">
                {successMessage}
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                    <img src={user.avatar} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-yellow-400" />
                    {isEditing ? (
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-xl font-bold bg-gray-700 text-white text-center rounded-md p-1 w-full mb-1" />
                    ) : (
                        <h2 className="text-xl font-bold">{user.name}</h2>
                    )}
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <div className="mt-4 flex items-center justify-center space-x-2 text-green-400 text-sm">
                       <ShieldCheckIcon /> <span>Verified User</span>
                    </div>
                </div>
                 <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-baseline"><span className="text-gray-400">Est. Portfolio Value</span><span className="font-mono text-white">{totalBalanceUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></div>
                        <div className="flex justify-between items-baseline"><span className="text-gray-400">Est. Portfolio Value (BTC)</span><span className="font-mono text-white">~ {totalBalanceBtc.toFixed(6)}</span></div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Profile Settings</h3>
                        {!isEditing && <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-yellow-400 hover:text-yellow-300">Edit Profile</button> }
                    </div>
                     <div className="space-y-4 text-sm">
                         <div>
                            <label className="text-gray-400 text-xs">Trading Nickname</label>
                            {isEditing ? (
                                <input id="nickname-input" type="text" name="nickname" value={formData.nickname} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-400" />
                            ) : (
                                <p className="text-white mt-1">{user.nickname}</p>
                            )}
                         </div>
                    </div>
                    {isEditing && (
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-500">Cancel</button>
                            <button onClick={handleSave} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-bold hover:bg-yellow-500">Save Changes</button>
                        </div>
                    )}
                </div>
                 <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Customization & Rewards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="font-bold mb-2">Theme</p>
                            <div className="flex space-x-2"><button className="px-4 py-2 bg-gray-700 rounded-md border-2 border-yellow-400 text-white font-semibold">Dark</button><button className="px-4 py-2 bg-gray-700 rounded-md text-gray-500 cursor-not-allowed font-semibold">Light</button></div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 font-bold mb-2"><GiftIcon className="text-yellow-400"/><span>Rewards Center</span></div>
                            <div className="space-y-2"><p className="text-gray-400">Referral Code: <span className="text-yellow-400 font-mono cursor-pointer hover:underline">GEM-REF-XYZ</span></p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

const MyOrders: React.FC<{orders: UserOrder[], onCancelOrder: (id: string) => void}> = ({ orders, onCancelOrder }) => {
    const [activeTab, setActiveTab] = useState('Open Orders');
    const openOrders = orders.filter(o => o.status === 'Open');
    const orderHistory = orders.filter(o => o.status !== 'Open');

    const renderOrderList = (list: UserOrder[]) => {
        if (list.length === 0) {
            return <div className="text-center text-gray-500 py-8 text-sm">No orders to display.</div>
        }
        return (
            <div className="overflow-y-auto">
                <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-900">
                        <tr className="text-left text-gray-400">
                           {['Date', 'Pair', 'Side', 'Price', 'Amount', 'Filled', 'Status', ''].map(h => <th key={h} className="p-2 font-normal">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(order => (
                             <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-2">{new Date(order.date).toLocaleTimeString()}</td>
                                <td className="p-2">{order.pair}</td>
                                <td className={`p-2 font-semibold ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{order.side}</td>
                                <td className="p-2 font-mono">{order.type === 'Market' ? 'Market' : order.price.toFixed(2)}</td>
                                <td className="p-2 font-mono">{order.amount.toFixed(6)}</td>
                                <td className="p-2 font-mono">{(order.amount * (order.filled / 100)).toFixed(6)}</td>
                                <td className="p-2">{order.status}</td>
                                <td className="p-2 text-right">
                                    {order.status === 'Open' && <button onClick={() => onCancelOrder(order.id)} className="text-red-500 hover:underline">Cancel</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="bg-gray-900 flex flex-col h-full">
            <div className="flex space-x-4 border-b border-gray-700 px-4 text-sm">
                {['Open Orders', 'Order History'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 ${activeTab === tab ? 'text-white border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}>
                        {tab} {tab === 'Open Orders' && `(${openOrders.length})`}
                    </button>
                ))}
            </div>
            <div className="flex-grow min-h-0">
                {activeTab === 'Open Orders' ? renderOrderList(openOrders) : renderOrderList(orderHistory)}
            </div>
        </div>
    )
};

const NotificationArea: React.FC<{notifications: Notification[], onDismiss: (id: number) => void}> = ({ notifications, onDismiss }) => (
    <div className="fixed bottom-4 right-4 z-50 w-80 space-y-2">
        {notifications.map(n => (
            <div key={n.id} className={`relative p-3 rounded-md text-sm text-white shadow-lg animate-fade-in-up
                ${n.type === 'success' ? 'bg-green-600/90' : 'bg-red-600/90'}`}>
                <p>{n.message}</p>
                <button onClick={() => onDismiss(n.id)} className="absolute top-1 right-1 text-white/70 hover:text-white"><XMarkIcon className="w-4 h-4" /></button>
            </div>
        ))}
    </div>
);

const AIAssistant: React.FC<{isOpen: boolean; onClose: () => void; history: ChatMessage[]; onSubmit: (q:string)=>void; isLoading: boolean; marketContext: {pair:string, price:string}}> = ({isOpen, onClose, history, onSubmit, isLoading, marketContext}) => {
    const [question, setQuestion] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim() && !isLoading) {
            onSubmit(question);
            setQuestion('');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400"><path d="M12 2.25a.75.75 0 0 1 .75.75v.516a8.862 8.862 0 0 1 7.155 4.315.75.75 0 0 1-1.28.765 7.362 7.362 0 0 0-12.75 0 .75.75 0 0 1-1.28-.765A8.862 8.862 0 0 1 11.25 3.516V3a.75.75 0 0 1 .75-.75Zm7.5 10.5a.75.75 0 0 1-.75.75h-.516a8.862 8.862 0 0 1-4.315 7.155.75.75 0 0 1-.765-1.28 7.362 7.362 0 0 0 0-12.75.75.75 0 0 1 .765-1.28A8.862 8.862 0 0 1 18.484 12h.516a.75.75 0 0 1 .75.75ZM4.5 12.75a.75.75 0 0 1 .75-.75h.516a8.862 8.862 0 0 1 4.315-7.155.75.75 0 0 1 .765 1.28 7.362 7.362 0 0 0 0 12.75.75.75 0 0 1-.765 1.28A8.862 8.862 0 0 1 5.766 12H5.25a.75.75 0 0 1-.75-.75Z" /></svg>
                        <span>AI Trading Assistant</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                </header>
                <main className="flex-grow p-4 overflow-y-auto space-y-4">
                    {history.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="flex justify-start"><div className="max-w-md p-3 rounded-lg bg-gray-700 text-white"><span className="animate-pulse">Gem is thinking...</span></div></div>}
                    <div ref={messagesEndRef} />
                </main>
                <footer className="p-4 border-t border-gray-700">
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about market trends, indicators, etc..." className="flex-grow bg-gray-900 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400" />
                        <button type="submit" disabled={isLoading} className="bg-yellow-400 text-gray-900 font-bold px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed">Send</button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

const Web3Wallet: React.FC<{
    connectWallet: () => void;
    disconnectWallet: () => void;
    connectedAccount: string | null;
    accountBalance: string | null;
    error: string | null;
}> = ({ connectWallet, disconnectWallet, connectedAccount, accountBalance, error }) => {

    const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
        <div className="p-4 md:p-6 text-white max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Web3 Wallet</h1>
            <p className="text-gray-400 mb-8">Connect your MetaMask wallet to interact with Web3 features.</p>
            
            <div className="bg-gray-800/50 rounded-lg p-6">
                {!connectedAccount ? (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Connect Wallet</h2>
                        <p className="text-sm text-gray-400 mb-6">To begin, please connect your MetaMask wallet. If you don't have MetaMask installed, you'll need to install the browser extension first.</p>
                        <button 
                            onClick={connectWallet}
                            className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-md hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                        >
                            <MetaMaskIcon />
                            <span>Connect with MetaMask</span>
                        </button>
                        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-green-400">Wallet Connected</h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="text-gray-400 text-xs">Wallet Address</label>
                                <p className="text-white font-mono text-base">{truncateAddress(connectedAccount)}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-xs">Balance</label>
                                <p className="text-white font-mono text-base">{accountBalance} ETH</p>
                            </div>
                        </div>
                        <button 
                            onClick={disconnectWallet}
                            className="bg-red-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-red-700 transition-colors mt-6 text-sm"
                        >
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
// --- END: Inlined UI Components ---

const ExchangeDashboard: React.FC<ExchangeDashboardProps> = ({ onLogout }) => {
    const [view, setView] = useState<'trade' | 'wallet' | 'profile' | 'web3'>('trade');
    
    // --- State Management ---
    const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'Demo User', email: 'user@example.com', nickname: 'CryptoTrader123', avatar: `https://i.pravatar.cc/150?u=demouser` });
    const [wallet, setWallet] = useState<{ [key: string]: AssetBalance }>({
        'BTC': { asset: 'Bitcoin', symbol: 'BTC', total: 0.75, available: 0.5, inOrders: 0.25 },
        'ETH': { asset: 'Ethereum', symbol: 'ETH', total: 10, available: 8, inOrders: 2 },
        'USDT': { asset: 'Tether', symbol: 'USDT', total: 15000, available: 10000, inOrders: 5000 },
        'SOL': { asset: 'Solana', symbol: 'SOL', total: 150, available: 150, inOrders: 0 },
        'BNB': { asset: 'BNB', symbol: 'BNB', total: 20, available: 20, inOrders: 0 },
        'XRP': { asset: 'Ripple', symbol: 'XRP', total: 10000, available: 8000, inOrders: 2000 },
    });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);
    const [aiChatHistory, setAiChatHistory] = useState<ChatMessage[]>([{role: 'model', text: 'Hello! I am Gem, your AI trading assistant. How can I help you understand the market today?'}]);
    const [isAIChatLoading, setAIChatLoading] = useState(false);

    // --- Web3 State ---
    const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
    const [accountBalance, setAccountBalance] = useState<string | null>(null);
    const [web3Error, setWeb3Error] = useState<string | null>(null);

    // --- Market Data State ---
    const [assetInfo, setAssetInfo] = useState({ pair: 'BTC/USDT', price: 0, change: 0, high: 0, low: 0, volume: 2345.67 });
    const [markets, setMarkets] = useState<Market[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const latestPriceRef = useRef(0);

    // --- Memoized Balance Calculations ---
    const priceMap = useMemo(() => {
        const map = new Map<string, number>();
        markets.forEach(market => {
            const symbol = market.pair.split('/')[0];
            const price = parseFloat(market.price.replace(/,/g, ''));
            map.set(symbol, price);
        });
        if (!map.has('USDT')) map.set('USDT', 1.0);
        return map;
    }, [markets]);
    
    // FIX: Cast Object.values(wallet) to AssetBalance[] to ensure proper type inference for the 'asset' parameter in reduce.
    // This prevents 'asset' from being inferred as 'unknown', which causes a type error on the '+' operator.
    const totalBalanceUsd = useMemo(() => (Object.values(wallet) as AssetBalance[]).reduce((acc, asset) => acc + asset.total * (priceMap.get(asset.symbol) || 0), 0), [wallet, priceMap]);
    const totalBalanceBtc = totalBalanceUsd / (priceMap.get('BTC') || 1);

    // --- Web3 Logic ---
    const handleAccountsChanged = useCallback(async (accounts: string[]) => {
        if (accounts.length === 0) {
            disconnectWallet();
        } else {
            const account = accounts[0];
            setConnectedAccount(account);
            try {
                const balanceHex = await (window as any).ethereum.request({
                    method: 'eth_getBalance',
                    params: [account, 'latest'],
                });
                const balance = (parseInt(balanceHex, 16) / 1e18).toFixed(4);
                setAccountBalance(balance);
            } catch (err) {
                console.error("Error fetching balance:", err);
                setWeb3Error("Failed to fetch account balance.");
            }
        }
    }, []);

    useEffect(() => {
        if ((window as any).ethereum) {
            (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
        }
        return () => {
            if ((window as any).ethereum) {
                (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [handleAccountsChanged]);

    const connectWallet = async () => {
        setWeb3Error(null);
        if (!(window as any).ethereum) {
            setWeb3Error("MetaMask is not installed. Please install the browser extension.");
            return;
        }
        try {
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            await handleAccountsChanged(accounts);
        } catch (err: any) {
            console.error("Error connecting to MetaMask:", err);
            setWeb3Error(err.message || "Failed to connect wallet. Please try again.");
        }
    };
    
    const disconnectWallet = () => {
        setConnectedAccount(null);
        setAccountBalance(null);
    };

    // --- Handlers & Logic ---
    const addNotification = useCallback((type: Notification['type'], message: string) => {
        const newNotif = { id: Date.now(), type, message };
        setNotifications(prev => [...prev, newNotif]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== newNotif.id)), 5000);
    }, []);
    
    const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction = { ...transaction, id: Date.now().toString(), date: new Date().toISOString() };
        setTransactions(prev => [newTransaction, ...prev]);
    }, []);

    const handleProfileUpdate = (updatedProfile: { name: string; nickname: string; }) => {
        setUserProfile(prev => ({ ...prev, ...updatedProfile }));
    };
    
    const handlePlaceOrder = useCallback(async (order: { type: 'Limit' | 'Market', side: 'Buy' | 'Sell', amount: number, price?: number }) => {
        const [baseAsset, quoteAsset] = assetInfo.pair.split('/');
        
        if (order.side === 'Buy') {
            const totalCost = (order.price || latestPriceRef.current) * order.amount;
            if ((wallet[quoteAsset]?.available || 0) < totalCost) {
                addNotification('error', `Insufficient ${quoteAsset} balance.`);
                return;
            }
        } else { // Sell
            if ((wallet[baseAsset]?.available || 0) < order.amount) {
                addNotification('error', `Insufficient ${baseAsset} balance.`);
                return;
            }
        }
        
        setWallet(prev => {
            const newWallet = {...prev};
            if (order.side === 'Buy') {
                const quote = {...newWallet[quoteAsset]};
                const totalCost = (order.price || latestPriceRef.current) * order.amount;
                quote.available -= totalCost;
                quote.inOrders += totalCost;
                newWallet[quoteAsset] = quote;
            } else {
                const base = {...newWallet[baseAsset]};
                base.available -= order.amount;
                base.inOrders += order.amount;
                newWallet[baseAsset] = base;
            }
            return newWallet;
        });

        const newOrder: UserOrder = {
            id: Date.now().toString(),
            pair: assetInfo.pair,
            type: order.type,
            side: order.side,
            price: order.price || latestPriceRef.current,
            amount: order.amount,
            filled: order.type === 'Market' ? 100 : 0,
            status: order.type === 'Market' ? 'Filled' : 'Open',
            date: Date.now(),
        };

        setUserOrders(prev => [newOrder, ...prev]);
        addNotification('success', `${order.type} ${order.side} order placed for ${order.amount} ${baseAsset}.`);
        
        if (newOrder.type === 'Market') {
            setWallet(prev => {
                const newWallet = {...prev};
                const base = {...newWallet[baseAsset]};
                const quote = {...newWallet[quoteAsset]};
                const totalCost = newOrder.price * newOrder.amount;

                if (order.side === 'Buy') {
                    quote.inOrders -= totalCost;
                    quote.total -= totalCost;
                    base.total = (base.total || 0) + newOrder.amount;
                    base.available = (base.available || 0) + newOrder.amount;
                } else { // Sell
                    base.inOrders -= newOrder.amount;
                    base.total -= newOrder.amount;
                    quote.total = (quote.total || 0) + totalCost;
                    quote.available = (quote.available || 0) + totalCost;
                }
                newWallet[baseAsset] = base;
                newWallet[quoteAsset] = quote;
                return newWallet;
            });
            addTransaction({
                type: 'Trade',
                status: 'Completed',
                asset: baseAsset,
                amount: order.amount,
                details: `Market ${order.side} @ ~$${newOrder.price.toFixed(2)}`
            });
        }
    }, [assetInfo.pair, wallet, addNotification, addTransaction]);

    const handleCancelOrder = useCallback((orderId: string) => {
        const order = userOrders.find(o => o.id === orderId);
        if (!order) return;

        setUserOrders(prev => prev.map(o => o.id === orderId ? {...o, status: 'Canceled'} : o));
        
        const [baseAsset, quoteAsset] = order.pair.split('/');
        setWallet(prev => {
             const newWallet = {...prev};
            if (order.side === 'Buy') {
                const quote = {...newWallet[quoteAsset]};
                const totalCost = order.price * order.amount;
                quote.inOrders -= totalCost;
                quote.available += totalCost;
                newWallet[quoteAsset] = quote;
            } else {
                const base = {...newWallet[baseAsset]};
                base.inOrders -= order.amount;
                base.available += order.amount;
                newWallet[baseAsset] = base;
            }
            return newWallet;
        });
        addNotification('info', `Order #${orderId.slice(-4)} canceled.`);
    }, [userOrders, addNotification]);
    
    const handleAiChatSubmit = async (question: string) => {
        const newHistory: ChatMessage[] = [...aiChatHistory, { role: 'user', text: question }];
        setAiChatHistory(newHistory);
        setAIChatLoading(true);

        const marketContext = { pair: assetInfo.pair, price: assetInfo.price.toFixed(2) };
        const responseText = await getAIChatResponse(aiChatHistory, question, marketContext);
        
        setAiChatHistory([...newHistory, { role: 'model', text: responseText }]);
        setAIChatLoading(false);
    };

    // --- WebSocket & Data Simulation Effect ---
    useEffect(() => {
        const ws = new MockWebSocketService();
        ws.connect( (update: MarketUpdate) => {
            setMarkets(update.markets);
            const mainAsset = update.activeMarket;
            if (mainAsset) {
                latestPriceRef.current = mainAsset.price;
                setAssetInfo(mainAsset);
                setChartData(mainAsset.chartData);
                setBids(mainAsset.bids);
                setAsks(mainAsset.asks);
                setTrades(mainAsset.trades);

                setUserOrders(prevOrders => {
                    const newOrders = [...prevOrders];
                    const openOrders = newOrders.filter(o => o.status === 'Open');
                    
                    for(const order of openOrders) {
                        const [baseAsset, quoteAsset] = order.pair.split('/');
                        let filled = false;
                        if (order.side === 'Buy' && mainAsset.price <= order.price) filled = true;
                        if (order.side === 'Sell' && mainAsset.price >= order.price) filled = true;

                        if (filled) {
                            const orderIndex = newOrders.findIndex(o => o.id === order.id);
                            newOrders[orderIndex] = {...order, status: 'Filled', filled: 100};

                            addNotification('success', `Limit ${order.side} order for ${order.amount} ${baseAsset} filled at $${order.price}.`);
                            addTransaction({
                                type: 'Trade',
                                status: 'Completed',
                                asset: baseAsset,
                                amount: order.amount,
                                details: `Limit ${order.side} @ $${order.price.toFixed(2)}`
                            });

                            setWallet(prev => {
                                const newWallet = {...prev};
                                const base = {...newWallet[baseAsset]};
                                const quote = {...newWallet[quoteAsset]};
                                const totalCost = order.price * order.amount;

                                if (order.side === 'Buy') {
                                    quote.inOrders -= totalCost;
                                    quote.total -= totalCost;
                                    base.total = (base.total || 0) + order.amount;
                                    base.available = (base.available || 0) + order.amount;
                                } else { // Sell
                                    base.inOrders -= order.amount;
                                    base.total -= order.amount;
                                    quote.total = (quote.total || 0) + totalCost;
                                    quote.available = (quote.available || 0) + totalCost;
                                }
                                newWallet[baseAsset] = base;
                                newWallet[quoteAsset] = quote;
                                return newWallet;
                            });
                        }
                    }
                    return newOrders;
                });
            }
            if(isLoading) setIsLoading(false);
        });

        return () => ws.disconnect();
    }, [isLoading, addNotification, addTransaction]);


    if (isLoading) {
      return (
        <div className="flex flex-col h-screen bg-gray-900 text-white items-center justify-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl">Initializing Live Environment...</p>
        </div>
      );
    }
    
    const [baseAsset, quoteAsset] = assetInfo.pair.split('/');
    const balances = {
        [baseAsset]: wallet[baseAsset]?.available || 0,
        [quoteAsset]: wallet[quoteAsset]?.available || 0,
    };

    const renderContent = () => {
        switch(view) {
            case 'trade':
                return (
                    <div className="flex-grow grid grid-cols-12 grid-rows-6 lg:grid-rows-12 gap-2 p-2 min-h-0">
                        <div className="col-span-12 lg:col-span-2 row-span-2 lg:row-span-12 min-h-0">
                            <Markets markets={markets} />
                        </div>
                        <div className="col-span-12 lg:col-span-7 row-span-1 lg:row-span-2 min-h-0 -ml-2 -mr-2 lg:mr-0">
                            <AssetInfo {...assetInfo} />
                        </div>
                        <div className="col-span-12 lg:col-span-7 row-span-3 lg:row-span-6 min-h-[300px] lg:min-h-0">
                            <Chart data={chartData} />
                        </div>
                        <div className="col-span-12 lg:col-span-7 row-span-2 lg:row-span-4 min-h-0">
                           <MyOrders orders={userOrders} onCancelOrder={handleCancelOrder} />
                        </div>
                        <div className="col-span-12 lg:col-span-3 row-span-6 lg:row-span-12 min-h-0 grid grid-rows-3 gap-2">
                            <div className="row-span-1 min-h-0"><OrderBook bids={bids} asks={asks} /></div>
                            <div className="row-span-1 min-h-0"><TradeHistory trades={trades} /></div>
                            <div className="row-span-1 min-h-0"><OrderForm baseAsset={baseAsset} quoteAsset={quoteAsset} balances={balances} onPlaceOrder={handlePlaceOrder} currentPrice={assetInfo.price} /></div>
                        </div>
                    </div>
                );
            case 'wallet':
                return <Portfolio portfolioData={wallet} priceMap={priceMap} totalBalanceUsd={totalBalanceUsd} totalBalanceBtc={totalBalanceBtc} transactions={transactions} onNewTransaction={addTransaction} />;
            case 'profile':
                 return <Profile user={userProfile} onUpdate={handleProfileUpdate} totalBalanceUsd={totalBalanceUsd} totalBalanceBtc={totalBalanceBtc} />;
            case 'web3':
                return <Web3Wallet connectWallet={connectWallet} disconnectWallet={disconnectWallet} connectedAccount={connectedAccount} accountBalance={accountBalance} error={web3Error} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <Header isLoggedIn={true} onLogout={onLogout} onLoginClick={() => {}} onSignupClick={() => {}} activeView={view} onNavigate={setView} />
            {renderContent()}
            <NotificationArea notifications={notifications} onDismiss={(id) => setNotifications(p => p.filter(n => n.id !== id))} />
            <AIAssistant isOpen={isAIAssistantOpen} onClose={()=>setAIAssistantOpen(false)} history={aiChatHistory} onSubmit={handleAiChatSubmit} isLoading={isAIChatLoading} marketContext={{ pair: assetInfo.pair, price: assetInfo.price.toFixed(2) }}/>
            {view === 'trade' && (
                <button onClick={() => setAIAssistantOpen(true)} className="fixed bottom-6 right-24 z-30 bg-yellow-400 text-gray-900 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-500 transition-transform transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2.25a.75.75 0 0 1 .75.75v.516a8.862 8.862 0 0 1 7.155 4.315.75.75 0 0 1-1.28.765 7.362 7.362 0 0 0-12.75 0 .75.75 0 0 1-1.28-.765A8.862 8.862 0 0 1 11.25 3.516V3a.75.75 0 0 1 .75-.75Zm7.5 10.5a.75.75 0 0 1-.75.75h-.516a8.862 8.862 0 0 1-4.315 7.155.75.75 0 0 1-.765-1.28 7.362 7.362 0 0 0 0-12.75.75.75 0 0 1 .765-1.28A8.862 8.862 0 0 1 18.484 12h.516a.75.75 0 0 1 .75.75ZM4.5 12.75a.75.75 0 0 1 .75-.75h.516a8.862 8.862 0 0 1 4.315-7.155.75.75 0 0 1 .765 1.28 7.362 7.362 0 0 0 0 12.75.75.75 0 0 1-.765 1.28A8.862 8.862 0 0 1 5.766 12H5.25a.75.75 0 0 1-.75-.75Z" /></svg>
                </button>
            )}
        </div>
    );
};

export default ExchangeDashboard;