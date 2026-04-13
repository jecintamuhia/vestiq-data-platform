import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { SYMBOLS, initSymbolState, tickSymbol } from '../lib/marketSimulator';
import { SymbolState, AnomalyAlert, DataQualityMetric, PipelineMetrics } from '../types';

const TICK_INTERVAL = 1500;
const DB_SYNC_INTERVAL = 5000;
const PIPELINE_UPDATE_INTERVAL = 3000;

export function useTradingPlatform() {
  const [symbols, setSymbols] = useState<Record<string, SymbolState>>(() => {
    const init: Record<string, SymbolState> = {};
    SYMBOLS.forEach(s => { init[s.symbol] = initSymbolState(s.symbol, s.basePrice); });
    return init;
  });

  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<DataQualityMetric[]>([]);
  const [pipelineMetrics, setPipelineMetrics] = useState<PipelineMetrics>({
    messages_per_second: 0,
    avg_latency_ms: 0,
    error_rate: 0,
    processed_count: 0,
    storage_gb: 0,
    active_partitions: 0,
    warehouse_records: 0,
  });
  const [ingestionStatus, setIngestionStatus] = useState<'active' | 'idle'>('active');
  const [processingStatus, setProcessingStatus] = useState<'active' | 'idle'>('active');
  const [totalTicks, setTotalTicks] = useState(0);

  const symbolsRef = useRef(symbols);
  symbolsRef.current = symbols;

  const anomalyCounterRef = useRef<Record<string, number>>({});
  const totalTicksRef = useRef(0);
  const storageRef = useRef(0.42);
  const warehouseRef = useRef(124000);

  const addAlert = useCallback(async (alert: Omit<AnomalyAlert, 'id' | 'resolved'>) => {
    const newAlert: AnomalyAlert = { ...alert, resolved: false, timestamp: new Date().toISOString() };
    setAlerts(prev => [newAlert, ...prev].slice(0, 50));

    try {
      await supabase.from('anomaly_alerts').insert(newAlert);
    } catch (_) {}
  }, []);

  const dismissAlert = useCallback((index: number) => {
    setAlerts(prev => prev.map((a, i) => i === index ? { ...a, resolved: true } : a));
  }, []);

  useEffect(() => {
    supabase.from('anomaly_alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) setAlerts(data);
      });

    supabase.from('data_quality_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data && data.length > 0) setQualityMetrics(data);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentSymbols = symbolsRef.current;
      const updated: Record<string, SymbolState> = {};

      SYMBOLS.forEach(({ symbol, volatility, volumeBase }) => {
        const counter = anomalyCounterRef.current[symbol] || 0;
        const isAnomaly = counter <= 0 && Math.random() < 0.03;

        if (isAnomaly) {
          anomalyCounterRef.current[symbol] = 10;
          const sym = currentSymbols[symbol];
          const priceDiff = Math.abs(sym.price * volatility * 8);
          const pctMove = (priceDiff / sym.price * 100).toFixed(2);

          addAlert({
            symbol,
            alert_type: Math.random() > 0.5 ? 'PRICE_SPIKE' : 'VOLUME_ANOMALY',
            description: `Unusual ${Math.random() > 0.5 ? 'price movement' : 'volume spike'} detected: ${pctMove}% move`,
            severity: parseFloat(pctMove) > 3 ? 'HIGH' : 'MEDIUM',
          });
        } else {
          anomalyCounterRef.current[symbol] = Math.max(0, counter - 1);
        }

        updated[symbol] = tickSymbol(currentSymbols[symbol], volatility, volumeBase, isAnomaly);
      });

      totalTicksRef.current += SYMBOLS.length;
      setTotalTicks(t => t + SYMBOLS.length);
      setSymbols(updated);

      setIngestionStatus('active');
      setProcessingStatus('active');
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [addAlert]);

  useEffect(() => {
    const interval = setInterval(() => {
      const mps = (SYMBOLS.length / (TICK_INTERVAL / 1000)) * (0.9 + Math.random() * 0.2);
      const latency = 12 + Math.random() * 18;
      const errorRate = Math.random() * 0.002;

      storageRef.current += 0.0001 * Math.random();
      warehouseRef.current += Math.floor(SYMBOLS.length * 2);

      const metrics: PipelineMetrics = {
        messages_per_second: parseFloat(mps.toFixed(2)),
        avg_latency_ms: parseFloat(latency.toFixed(2)),
        error_rate: parseFloat(errorRate.toFixed(4)),
        processed_count: totalTicksRef.current,
        storage_gb: parseFloat(storageRef.current.toFixed(4)),
        active_partitions: 12 + Math.floor(Math.random() * 4),
        warehouse_records: warehouseRef.current,
      };

      setPipelineMetrics(metrics);

      const qm: DataQualityMetric[] = [
        { metric_name: 'Data Completeness', metric_value: 99.2 + Math.random() * 0.7, status: 'OK' },
        { metric_name: 'Schema Validity', metric_value: 100, status: 'OK' },
        { metric_name: 'Latency SLA', metric_value: latency, status: latency > 25 ? 'WARNING' : 'OK' },
        { metric_name: 'Duplicate Rate', metric_value: 0.01 + Math.random() * 0.05, status: 'OK' },
        { metric_name: 'Null Rate', metric_value: Math.random() * 0.3, status: 'OK' },
        { metric_name: 'Error Rate', metric_value: errorRate * 100, status: errorRate > 0.001 ? 'WARNING' : 'OK' },
      ];
      setQualityMetrics(qm);
    }, PIPELINE_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentSymbols = symbolsRef.current;

      const marketRows = SYMBOLS.map(({ symbol }) => {
        const s = currentSymbols[symbol];
        return {
          symbol: s.symbol,
          price: s.price,
          volume: s.volume,
          bid: s.price * 0.9999,
          ask: s.price * 1.0001,
          change_24h: s.change24h,
          change_pct_24h: s.changePct24h,
          high_24h: s.high24h,
          low_24h: s.low24h,
        };
      });

      const signalRows = SYMBOLS.map(({ symbol }) => {
        const s = currentSymbols[symbol];
        return {
          symbol: s.symbol,
          signal_type: s.signal,
          strength: s.signalStrength,
          ema_20: s.ema20,
          ema_50: s.ema50,
          rsi: s.rsi,
          macd: s.macd,
        };
      });

      try {
        await Promise.all([
          supabase.from('market_data').insert(marketRows),
          supabase.from('trading_signals').insert(signalRows),
          supabase.from('pipeline_metrics').insert([pipelineMetrics]),
        ]);
      } catch (_) {}
    }, DB_SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [pipelineMetrics]);

  const symbolList = SYMBOLS.map(s => symbols[s.symbol]).filter(Boolean);

  return {
    symbols: symbolList,
    alerts,
    qualityMetrics,
    pipelineMetrics,
    ingestionStatus,
    processingStatus,
    totalTicks,
    dismissAlert,
  };
}
