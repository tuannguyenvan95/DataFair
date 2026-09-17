import React from 'react';
import { Layers, Lock, CheckCircle2, Cpu, TrendingUp } from 'lucide-react';
import { ContractStats, formatGen } from '../utils/helpers';

interface StatsBarProps {
  stats: ContractStats | null;
  loading: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* 1. Total Bounties */}
      <div className="holo-card rounded-3xl p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-cyan-300/80 uppercase tracking-widest flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Total Bounties</span>
          </span>
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)] group-hover:scale-110 transition duration-300">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <p className="text-4xl font-black font-mono text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {loading ? '...' : stats ? stats.total_orders : '0'}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">Dataset procurement orders</p>
          </div>
          {/* Mini Sparkline Chart */}
          <div className="w-16 h-8 opacity-60 group-hover:opacity-100 transition">
            <svg viewBox="0 0 60 25" className="w-full h-full stroke-cyan-400 fill-none" strokeWidth="2.5">
              <path d="M0 20 Q 15 5, 30 15 T 60 4" />
            </svg>
          </div>
        </div>

        {/* Ambient base glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 group-hover:opacity-100 transition duration-500"></div>
      </div>

      {/* 2. Escrow Locked */}
      <div className="holo-card rounded-3xl p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-blue-300/80 uppercase tracking-widest flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Escrow Locked</span>
          </span>
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] group-hover:scale-110 transition duration-300">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <p className="text-4xl font-black font-mono text-white tracking-tight flex items-baseline space-x-1.5 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              <span>{loading ? '...' : stats ? formatGen(stats.total_escrow_locked) : '0'}</span>
              <span className="text-sm font-mono text-cyan-400 font-bold">GEN</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">Protected in smart escrow</p>
          </div>
          {/* Mini Sparkline Chart */}
          <div className="w-16 h-8 opacity-60 group-hover:opacity-100 transition">
            <svg viewBox="0 0 60 25" className="w-full h-full stroke-blue-400 fill-none" strokeWidth="2.5">
              <path d="M0 18 Q 20 22, 35 10 T 60 2" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 group-hover:opacity-100 transition duration-500"></div>
      </div>

      {/* 3. Settled by Jury */}
      <div className="holo-card rounded-3xl p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-emerald-300/80 uppercase tracking-widest flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Settled by Jury</span>
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:scale-110 transition duration-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <p className="text-4xl font-black font-mono text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {loading ? '...' : stats ? stats.total_orders_settled : '0'}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">Zero counterparty fraud</p>
          </div>
          {/* Mini Sparkline Chart */}
          <div className="w-16 h-8 opacity-60 group-hover:opacity-100 transition">
            <svg viewBox="0 0 60 25" className="w-full h-full stroke-emerald-400 fill-none" strokeWidth="2.5">
              <path d="M0 22 Q 15 15, 30 18 T 60 5" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50 group-hover:opacity-100 transition duration-500"></div>
      </div>

      {/* 4. GenLayer AI Consensus */}
      <div className="holo-card rounded-3xl p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-purple-300/80 uppercase tracking-widest flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
            <span>Jury Engine</span>
          </span>
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] group-hover:scale-110 transition duration-300">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <p className="text-2xl font-black font-mono text-white tracking-tight">
              Optimistic AI
            </p>
          </div>
          <p className="text-xs text-purple-200/60 mt-1 font-mono">
            Multi-LLM Semantic Equivalence
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50 group-hover:opacity-100 transition duration-500"></div>
      </div>
    </div>
  );
};
