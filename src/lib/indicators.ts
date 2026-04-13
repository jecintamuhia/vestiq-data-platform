export function calcEMA(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  if (prices.length < period) return prices[prices.length - 1];
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

export function calcRSI(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50;
  const changes = prices.slice(-period - 1).map((p, i, arr) =>
    i === 0 ? 0 : p - arr[i - 1]
  ).slice(1);
  const gains = changes.filter(c => c > 0);
  const losses = changes.filter(c => c < 0).map(c => Math.abs(c));
  const avgGain = gains.reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export function calcMACD(prices: number[]): number {
  const ema12 = calcEMA(prices, 12);
  const ema26 = calcEMA(prices, 26);
  return ema12 - ema26;
}

export function computeSignal(
  ema20: number,
  ema50: number,
  rsi: number,
  macd: number
): { signal: 'BUY' | 'SELL' | 'HOLD'; strength: number; reason: string } {
  let bullScore = 0;
  let bearScore = 0;
  const reasons: string[] = [];

  if (ema20 > ema50) { bullScore += 30; reasons.push('EMA20>EMA50'); }
  else { bearScore += 30; reasons.push('EMA20<EMA50'); }

  if (rsi < 30) { bullScore += 40; reasons.push('RSI oversold'); }
  else if (rsi > 70) { bearScore += 40; reasons.push('RSI overbought'); }
  else if (rsi < 50) { bullScore += 10; }
  else { bearScore += 10; }

  if (macd > 0) { bullScore += 30; reasons.push('MACD positive'); }
  else { bearScore += 30; reasons.push('MACD negative'); }

  const total = bullScore + bearScore;
  const bullPct = total > 0 ? (bullScore / total) * 100 : 50;

  if (bullPct >= 60) {
    return { signal: 'BUY', strength: bullPct, reason: reasons.slice(0, 2).join(', ') };
  } else if (bullPct <= 40) {
    return { signal: 'SELL', strength: 100 - bullPct, reason: reasons.slice(0, 2).join(', ') };
  }
  return { signal: 'HOLD', strength: 50, reason: 'Neutral indicators' };
}
