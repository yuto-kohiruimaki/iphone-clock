'use client';

import { useEffect, useState } from 'react';
import { getUsageData } from './actions';

interface Usage {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
}

interface Block {
  timestamp: string;
  usage: Usage;
  costUSD: number;
  model: string;
  version: string;
}

interface Session {
  id: string;
  startTime: string;
  endTime: string;
  entries: Block[];
  tokenCounts: Usage;
  costUSD: number;
  models: string[];
}

export default function CCUsagePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getUsageData();
      setSessions(data as Session[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading usage data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
          Claude Code Usage
        </h1>
        <p className="text-gray-400">Live monitoring of your recent sessions</p>
      </header>

      <div className="space-y-8">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <h2 className="text-xl font-semibold text-gray-200">
                    Session {session.id.slice(0, 8)}...
                  </h2>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(session.startTime).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Total Cost</div>
                  <div className="text-2xl font-mono font-bold text-green-400">
                    ${session.costUSD.toFixed(4)}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Models</div>
                  <div className="text-sm text-gray-300">
                    {session.models.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Input Tokens" value={session.tokenCounts.inputTokens.toLocaleString()} />
                <StatCard label="Output Tokens" value={session.tokenCounts.outputTokens.toLocaleString()} />
                <StatCard label="Cache Write" value={session.tokenCounts.cacheCreationInputTokens.toLocaleString()} />
                <StatCard label="Cache Read" value={session.tokenCounts.cacheReadInputTokens.toLocaleString()} />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Recent Blocks</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {session.entries.slice().reverse().map((block, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/30 rounded-lg p-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 font-mono">
                          {new Date(block.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {block.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-400">
                          <span className="mr-2">In: {block.usage.inputTokens}</span>
                          <span className="mr-2">Out: {block.usage.outputTokens}</span>
                        </div>
                        <div className="font-mono text-sm text-green-400 w-20 text-right">
                          ${block.costUSD.toFixed(5)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-lg font-mono font-semibold text-gray-200">{value}</div>
    </div>
  );
}
