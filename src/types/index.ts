export interface MarketData {
  id?: string;
  symbol: string;
  price: number;
  volume: number;
  bid?: number;
  ask?: number;
  change_24h?: number;
  change_pct_24h?: number;
  high_24h?: number;
  low_24h?: number;
  timestamp?: string;
}

export interface TradingSignal {
  id?: string;
  symbol: string;
  signal_type: 'BUY' | 'SELL' | 'HOLD';
  strength: number;
  ema_20?: number;
  ema_50?: number;
  rsi?: number;
  macd?: number;
  signal_reason?: string;
  timestamp?: string;
}

export interface AnomalyAlert {
  id?: string;
  symbol?: string;
  alert_type: string;
  description?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolved: boolean;
  timestamp?: string;
}

export interface DataQualityMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  status: 'OK' | 'WARNING' | 'ERROR';
  timestamp?: string;
}

export interface PipelineMetrics {
  id?: string;
  messages_per_second: number;
  avg_latency_ms: number;
  error_rate: number;
  processed_count: number;
  storage_gb: number;
  active_partitions: number;
  warehouse_records: number;
  timestamp?: string;
}

export interface SymbolState {
  symbol: string;
  price: number;
  prevPrice: number;
  volume: number;
  change24h: number;
  changePct24h: number;
  high24h: number;
  low24h: number;
  priceHistory: number[];
  ema20: number;
  ema50: number;
  rsi: number;
  macd: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  signalStrength: number;
  prices: number[];
}

export interface PipelineStage {
  name: string;
  status: 'active' | 'idle' | 'error';
  throughput: number;
  latency: number;
}
