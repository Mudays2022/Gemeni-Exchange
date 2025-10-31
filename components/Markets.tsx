import React, { useState, useEffect } from 'react';
import type { Market } from '../types';
import StarIcon from './icons/StarIcon';

interface MarketsProps {
    markets: Market[];
}

const Markets: React.FC<MarketsProps> = ({ markets }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem('favoriteMarkets');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Failed to parse favorites from localStorage", error);
            setFavorites([]);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('favoriteMarkets', JSON.stringify(favorites));
        } catch (error) {
            console.error("Failed to save favorites to localStorage", error);
        }
    }, [favorites]);

    const handleToggleFavorite = (pair: string) => {
        setFavorites(prevFavorites => {
            const newFavorites = prevFavorites.includes(pair)
                ? prevFavorites.filter(p => p !== pair)
                : [...prevFavorites, pair];
            return newFavorites;
        });
    };

    const marketsToList = activeTab === 'Favorites' 
        ? markets.filter(market => favorites.includes(market.pair)) 
        : markets;

    const filteredMarkets = marketsToList.filter(market => 
        market.pair.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-800/50 text-xs text-gray-400 p-2 flex flex-col h-full">
             <div className="flex text-sm mb-2 border-b border-gray-700">
                <button 
                    onClick={() => setActiveTab('Favorites')}
                    className={`px-3 py-1.5 flex items-center space-x-1 ${activeTab === 'Favorites' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                >
                    <StarIcon className="w-3 h-3" />
                    <span>Favorites</span>
                </button>
                <button 
                    onClick={() => setActiveTab('All')}
                    className={`px-3 py-1.5 ${activeTab === 'All' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                >
                    All
                </button>
            </div>
            <div className="mb-2">
                <input 
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
            </div>
            <div className="flex-grow overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-gray-800/50">
                        <tr className="text-left">
                            <th className="p-2 font-normal w-1/12"></th>
                            <th className="p-2 font-normal w-4/12">Pair</th>
                            <th className="p-2 font-normal w-4/12 text-right">Price</th>
                            <th className="p-2 font-normal w-3/12 text-right">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMarkets.map((market) => (
                            <tr key={market.pair} className="hover:bg-gray-700/50 cursor-pointer">
                                <td className="p-2 text-center">
                                    <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(market.pair); }} aria-label={`Toggle favorite for ${market.pair}`}>
                                        <StarIcon className={favorites.includes(market.pair) ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}/>
                                    </button>
                                </td>
                                <td className="p-2 font-semibold text-white">{market.pair}</td>
                                <td className={`p-2 text-right ${market.isPositive ? 'text-green-500' : 'text-red-500'}`}>{market.price}</td>
                                <td className={`p-2 text-right ${market.isPositive ? 'text-green-500' : 'text-red-500'}`}>{market.change}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Markets;