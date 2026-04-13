import { useTradingPlatform } from './hooks/useTradingPlatform';
import Header from './components/Header';
import MarketTicker from './components/MarketTicker';
import PipelineFlow from './components/PipelineFlow';
import MarketCard from './components/MarketCard';
import SignalsPanel from './components/SignalsPanel';
import StreamProcessingPanel from './components/StreamProcessingPanel';
import StoragePanel from './components/StoragePanel';
import MonitoringPanel from './components/MonitoringPanel';
import AlertsPanel from './components/AlertsPanel';
import IngestionPanel from './components/IngestionPanel';

function App() {
  const {
    symbols,
    alerts,
    qualityMetrics,
    pipelineMetrics,
    ingestionStatus,
    processingStatus,
    totalTicks,
    dismissAlert,
  } = useTradingPlatform();

  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200">
      <Header
        ingestionStatus={ingestionStatus}
        processingStatus={processingStatus}
        totalTicks={totalTicks}
        alertCount={activeAlerts.length}
      />

      <MarketTicker symbols={symbols} />

      <main className="max-w-screen-2xl mx-auto px-4 py-5 space-y-5">
        <PipelineFlow
          ingestionStatus={ingestionStatus}
          processingStatus={processingStatus}
          messagesPerSec={pipelineMetrics.messages_per_second}
          latency={pipelineMetrics.avg_latency_ms}
        />

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-sm">Live Market Feed</h2>
            <span className="text-slate-500 text-xs flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
              </span>
              Live · updates every 1.5s
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {symbols.map(s => (
              <MarketCard key={s.symbol} data={s} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <IngestionPanel metrics={pipelineMetrics} />
          <StreamProcessingPanel metrics={pipelineMetrics} />
          <StoragePanel metrics={pipelineMetrics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SignalsPanel symbols={symbols} />
          <MonitoringPanel metrics={qualityMetrics} />
          <AlertsPanel alerts={activeAlerts} onDismiss={dismissAlert} />
        </div>

        <footer className="text-center py-4 border-t border-slate-800">
          <p className="text-slate-600 text-xs">
            Real-Time Trading Intelligence Platform · Kafka → Spark → PostgreSQL → FastAPI · Built with Supabase
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
