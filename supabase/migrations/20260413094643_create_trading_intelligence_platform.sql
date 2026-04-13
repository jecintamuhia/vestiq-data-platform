/*
  # Real-Time Trading Intelligence Platform Schema

  ## Overview
  Creates all tables required for the trading intelligence platform including
  market data feeds, trading signals, anomaly alerts, data quality metrics,
  and pipeline performance metrics.

  ## Tables

  ### market_data
  - Stores live price ticks for each trading symbol
  - Columns: symbol, price, volume, bid, ask, change_24h, change_pct_24h, timestamp

  ### trading_signals
  - Computed buy/sell/hold signals from stream processing layer
  - Columns: symbol, signal_type, strength, ema_20, ema_50, rsi, macd, timestamp

  ### anomaly_alerts
  - Detected price/volume anomalies from monitoring layer
  - Columns: symbol, alert_type, description, severity, resolved, timestamp

  ### data_quality_metrics
  - Data pipeline quality measurements
  - Columns: metric_name, metric_value, status, timestamp

  ### pipeline_metrics
  - Performance metrics for ingestion and processing layers
  - Columns: messages_per_second, avg_latency_ms, error_rate, processed_count, storage_gb, timestamp

  ## Security
  - RLS enabled on all tables
  - Anon role can read recent data (last 24 hours) and insert new data
  - Policies restrict data to recent timeframes to prevent excessive data exposure
*/

CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  price numeric(20, 8) NOT NULL,
  volume numeric(20, 2) NOT NULL DEFAULT 0,
  bid numeric(20, 8),
  ask numeric(20, 8),
  change_24h numeric(12, 4) DEFAULT 0,
  change_pct_24h numeric(8, 4) DEFAULT 0,
  high_24h numeric(20, 8),
  low_24h numeric(20, 8),
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data(symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_timestamp ON market_data(timestamp DESC);

ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read recent market data"
  ON market_data FOR SELECT
  TO anon, authenticated
  USING (timestamp > now() - interval '48 hours');

CREATE POLICY "Allow insert market data"
  ON market_data FOR INSERT
  TO anon, authenticated
  WITH CHECK (timestamp > now() - interval '5 minutes');

CREATE TABLE IF NOT EXISTS trading_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('BUY', 'SELL', 'HOLD')),
  strength numeric(5, 2) DEFAULT 50,
  ema_20 numeric(20, 8),
  ema_50 numeric(20, 8),
  rsi numeric(5, 2),
  macd numeric(20, 8),
  signal_reason text,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trading_signals_symbol ON trading_signals(symbol);
CREATE INDEX IF NOT EXISTS idx_trading_signals_timestamp ON trading_signals(timestamp DESC);

ALTER TABLE trading_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read recent trading signals"
  ON trading_signals FOR SELECT
  TO anon, authenticated
  USING (timestamp > now() - interval '48 hours');

CREATE POLICY "Allow insert trading signals"
  ON trading_signals FOR INSERT
  TO anon, authenticated
  WITH CHECK (timestamp > now() - interval '5 minutes');

CREATE TABLE IF NOT EXISTS anomaly_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text,
  alert_type text NOT NULL,
  description text,
  severity text NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  resolved boolean DEFAULT false,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_anomaly_alerts_timestamp ON anomaly_alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_anomaly_alerts_resolved ON anomaly_alerts(resolved);

ALTER TABLE anomaly_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read recent anomaly alerts"
  ON anomaly_alerts FOR SELECT
  TO anon, authenticated
  USING (timestamp > now() - interval '48 hours');

CREATE POLICY "Allow insert anomaly alerts"
  ON anomaly_alerts FOR INSERT
  TO anon, authenticated
  WITH CHECK (timestamp > now() - interval '5 minutes');

CREATE POLICY "Allow update anomaly alerts"
  ON anomaly_alerts FOR UPDATE
  TO anon, authenticated
  USING (timestamp > now() - interval '48 hours')
  WITH CHECK (timestamp > now() - interval '48 hours');

CREATE TABLE IF NOT EXISTS data_quality_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric(10, 4) NOT NULL,
  status text NOT NULL CHECK (status IN ('OK', 'WARNING', 'ERROR')),
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dq_metrics_timestamp ON data_quality_metrics(timestamp DESC);

ALTER TABLE data_quality_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read recent quality metrics"
  ON data_quality_metrics FOR SELECT
  TO anon, authenticated
  USING (timestamp > now() - interval '48 hours');

CREATE POLICY "Allow insert quality metrics"
  ON data_quality_metrics FOR INSERT
  TO anon, authenticated
  WITH CHECK (timestamp > now() - interval '5 minutes');

CREATE TABLE IF NOT EXISTS pipeline_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  messages_per_second numeric(10, 2) DEFAULT 0,
  avg_latency_ms numeric(10, 2) DEFAULT 0,
  error_rate numeric(6, 4) DEFAULT 0,
  processed_count bigint DEFAULT 0,
  storage_gb numeric(10, 4) DEFAULT 0,
  active_partitions integer DEFAULT 0,
  warehouse_records bigint DEFAULT 0,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pipeline_metrics_timestamp ON pipeline_metrics(timestamp DESC);

ALTER TABLE pipeline_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read recent pipeline metrics"
  ON pipeline_metrics FOR SELECT
  TO anon, authenticated
  USING (timestamp > now() - interval '48 hours');

CREATE POLICY "Allow insert pipeline metrics"
  ON pipeline_metrics FOR INSERT
  TO anon, authenticated
  WITH CHECK (timestamp > now() - interval '5 minutes');
