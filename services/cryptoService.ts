import { OrderType, type Market, type Order, type Trade, type ChartDataPoint } from '../types';

const TRACKED_COINS = [
    { id: 'bitcoin', symbol: 'BTC', name: 'BTC/USDT', basePrice: 68000.50 },
    { id: 'ethereum', symbol: 'ETH', name: 'ETH/USDT', basePrice: 3500.20 },
    { id: 'solana', symbol: 'SOL', name: 'SOL/USDT', basePrice: 150.75 },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB/USDT', basePrice: 600.00 },
    { id: 'ripple', symbol: 'XRP', name: 'XRP/USDT', basePrice: 0.52 },
    { id: 'dogecoin', symbol: 'DOGE', name: 'DOGE/USDT', basePrice: 0.15 },
    { id: 'cardano', symbol: 'ADA', name: 'ADA/USDT', basePrice: 0.45 },
];
const ACTIVE_PAIR = 'BTC/USDT';

export interface MarketUpdate {
    markets: Market[];
    activeMarket: {
        pair: string;
        price: number;
        change: number;
        high: number;
        low: number;
        volume: number;
        chartData: ChartDataPoint[];
        bids: Order[];
        asks: Order[];
        trades: Trade[];
    } | null;
}

export class MockWebSocketService {
    private intervalId: number | null = null;
    private listener: ((data: MarketUpdate) => void) | null = null;
    private marketState: { [pair: string]: { price: number; openingPrice: number; chartData: ChartDataPoint[] } } = {};

    constructor() {
        this.initializeState();
    }

    private initializeState() {
        TRACKED_COINS.forEach(coin => {
            const initialChartData: ChartDataPoint[] = [];
            let price = coin.basePrice;
            for (let i = 0; i < 50; i++) {
                price += (Math.random() - 0.5) * (price * 0.001);
                initialChartData.push({ time: new Date(Date.now() - (50 - i) * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), price });
            }
            this.marketState[coin.name] = {
                price: price,
                openingPrice: coin.basePrice,
                chartData: initialChartData
            };
        });
    }

    private generateUpdate(): MarketUpdate {
        // Update prices for all markets
        Object.keys(this.marketState).forEach(pair => {
            const state = this.marketState[pair];
            const changeFactor = (Math.random() - 0.49) * 0.002; // Small random fluctuation
            const newPrice = state.price * (1 + changeFactor);
            
            const newChartData = [
                ...state.chartData.slice(1),
                { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), price: newPrice }
            ];

            this.marketState[pair] = { ...state, price: newPrice, chartData: newChartData };
        });

        const markets: Market[] = TRACKED_COINS.map(coin => {
            const state = this.marketState[coin.name];
            const change = ((state.price - state.openingPrice) / state.openingPrice) * 100;
            return {
                pair: coin.name,
                price: state.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: state.price < 1 ? 4 : 2 }),
                change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
                isPositive: change >= 0,
                openingPrice: state.openingPrice
            };
        });

        // Generate detailed data for the active market
        const activeState = this.marketState[ACTIVE_PAIR];
        const price = activeState.price;
        const change = ((price - activeState.openingPrice) / activeState.openingPrice) * 100;
        const high = Math.max(...activeState.chartData.map(p => p.price));
        const low = Math.min(...activeState.chartData.map(p => p.price));
        
        const createOrder = (p: number): Order => ({ price: p, size: Math.random() * 0.5, total: p * (Math.random() * 0.5) });
        const createTrade = (p: number): Trade => ({ price: p, size: Math.random() * 0.1, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), type: Math.random() > 0.5 ? OrderType.BUY : OrderType.SELL });

        const activeMarket = {
            pair: ACTIVE_PAIR,
            price: price,
            change: change,
            high: high,
            low: low,
            volume: 2345.67, // static for now
            chartData: activeState.chartData,
            bids: Array.from({ length: 20 }, (_, i) => createOrder(price - (i + 1) * Math.random() * 2)),
            asks: Array.from({ length: 20 }, (_, i) => createOrder(price + (i + 1) * Math.random() * 2)),
            trades: Array.from({ length: 30 }, () => createTrade(price + (Math.random() - 0.5) * 5)),
        };

        return { markets, activeMarket };
    }

    connect(listener: (data: MarketUpdate) => void) {
        this.listener = listener;
        this.intervalId = window.setInterval(() => {
            if (this.listener) {
                this.listener(this.generateUpdate());
            }
        }, 2000);
        // Send initial update immediately
        if (this.listener) {
             this.listener(this.generateUpdate());
        }
    }

    disconnect() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.listener = null;
    }
}
