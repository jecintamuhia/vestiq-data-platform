import { SymbolState } from '../types';
import { calcEMA, calcRSI, calcMACD, computeSignal } from './indicators';

export const SYMBOLS = [
  { symbol: 'BTC/USD', basePrice: 67420.5, volatility: 0.003, volumeBase: 2840 },
  { symbol: 'ETH/USD', basePrice: 3512.8, volatility: 0.004, volumeBase: 18200 },
  { symbol: 'AAPL', basePrice: 189.45, volatility: 0.002, volumeBase: 54300 },
  { symbol: 'TSLA', basePrice: 248.2, volatility: 0.005, volumeBase: 32100 },
  { symbol: 'EUR/USD', basePrice: 1.0875, volatility: 0.0008, volumeBase: 890000 },
  { symbol: 'GOLD', basePrice: 2345.6, volatility: 0.0015, volumeBase: 4500 },
];

export function initSymbolState(symbol: string, basePrice: number): SymbolState {
  const prices: number[] = [];
  let p = basePrice;
  for (let i = 0; i < 60; i++) {
    p = p * (1 + (Math.random() - 0.5) * 0.002);
    prices.push(p);
  }
  const ema20 = calcEMA(prices, 20);
  const ema50 = calcEMA(prices, 50);
  const rsi = calcRSI(prices);
  const macd = calcMACD(prices);
  const { signal, strength } = computeSignal(ema20, ema50, rsi, macd);

  return {
    symbol,
    price: prices[prices.length - 1],
    prevPrice: prices[prices.length - 2],
    volume: 0,
    change24h: 0,
    changePct24h: 0,
    high24h: Math.max(...prices.slice(-24)),
    low24h: Math.min(...prices.slice(-24)),
    priceHistory: prices.slice(-30),
    ema20,
    ema50,
    rsi,
    macd,
    signal,
    signalStrength: strength,
    prices,
  };
}

export function tickSymbol(
  state: SymbolState,
  volatility: number,
  volumeBase: number,
  isAnomaly = false
): SymbolState {
  const drift = isAnomaly
    ? (Math.random() - 0.5) * volatility * 8
    : (Math.random() - 0.5) * volatility;

  const newPrice = state.price * (1 + drift);
  const volume = volumeBase * (0.5 + Math.random() * 1.5) * (isAnomaly ? 3 : 1);

  const newPrices = [...state.prices.slice(-99), newPrice];
  const ema20 = calcEMA(newPrices, 20);
  const ema50 = calcEMA(newPrices, 50);
  const rsi = calcRSI(newPrices);
  const macd = calcMACD(newPrices);
  const { signal, strength } = computeSignal(ema20, ema50, rsi, macd);

  const open24h = newPrices[Math.max(0, newPrices.length - 24)];
  const change24h = newPrice - open24h;
  const changePct24h = (change24h / open24h) * 100;

  return {
    ...state,
    prevPrice: state.price,
    price: newPrice,
    volume,
    change24h,
    changePct24h,
    high24h: Math.max(state.high24h, newPrice),
    low24h: Math.min(state.low24h, newPrice),
    priceHistory: [...state.priceHistory.slice(-29), newPrice],
    ema20,
    ema50,
    rsi,
    macd,
    signal,
    signalStrength: strength,
    prices: newPrices,
  };
}
