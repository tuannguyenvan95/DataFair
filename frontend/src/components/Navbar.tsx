import React from 'react';
import { ShieldCheck, Wallet, ExternalLink, AlertCircle, RefreshCw, Cpu, Activity } from 'lucide-react';
import { shortenAddress, formatGen } from '../utils/helpers';
import { CONTRACT_ADDRESS } from '../config/genlayer';

interface NavbarProps {
  account: string | null;
  balance: string;
  isConnecting: boolean;
  onConnect: () => void;
  onRefresh: () => void;
  activeView: 'TERMINAL' | 'PLAYGROUND' | 'ARCHITECTURE';
  onSelectView: (view: 'TERMINAL' | 'PLAYGROUND' | 'ARCHITECTURE') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  account,
  balance,
  isConnecting,
  onConnect,
  onRefresh,
  activeView,
  onSelectView,
}) => {
  return (
    <header className="border-b border-dark-750 bg-dark-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & HUD Pulse */}
        <div className="flex items-center space-x-4">
          <div className="relative group cursor-pointer" onClick={() => onSelectView('TERMINAL')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 via-cyber-blue to-accent-cyan flex items-center justify-center shadow-lg shadow-cyber-blue/20 neon-border-cyan">
              <ShieldCheck className="w-6 h-6 text-dark-950" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-emerald border-2 border-dark-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-emerald border-2 border-dark-950"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-cyber-blue bg-clip-text text-transparent">
                DataFair
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded-md bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30">
                studionet • 61999
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Autonomous AI Dataset Escrow & Quality Adjudication
            </p>
          </div>
        </div>

        {/* Center High-Tech View Switcher */}
        <div className="hidden lg:flex items-center space-x-1 p-1.5 rounded-2xl bg-dark-900 border border-dark-750">
          <button
            onClick={() => onSelectView('TERMINAL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeView === 'TERMINAL'
                ? 'bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Escrow Terminal
          </button>
          <button
            onClick={() => onSelectView('PLAYGROUND')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeView === 'PLAYGROUND'
                ? 'bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Pre-Flight Inspector
          </button>
          <button
            onClick={() => onSelectView('ARCHITECTURE')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeView === 'ARCHITECTURE'
                ? 'bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Court Protocol Architecture
          </button>
        </div>

        {/* Contract & Account Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            title="Refresh On-Chain State"
            className="p-2.5 rounded-xl border border-dark-700 bg-dark-850 hover:bg-dark-750 text-slate-300 hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Explorer link */}
          {CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && (
            <a
              href={`https://genlayer-explorer.vercel.app/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="hidden xl:flex items-center space-x-1.5 px-3 py-2 text-xs rounded-xl border border-dark-700 bg-dark-850 text-slate-300 hover:border-cyber-blue/40 hover:text-cyber-blue transition font-mono"
            >
              <span>Contract:</span>
              <span className="text-white">{shortenAddress(CONTRACT_ADDRESS)}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {/* Wallet Section */}
          {account ? (
            <div className="flex items-center space-x-2 bg-dark-850 border border-dark-700 rounded-xl p-1.5 pr-3 shadow-inner">
              <div className="px-3 py-1 bg-dark-950 rounded-lg text-xs font-mono font-medium text-slate-200 flex items-center space-x-1 border border-dark-750">
                <span className="text-cyber-blue font-bold">{formatGen(balance)}</span>
                <span className="text-slate-400">GEN</span>
              </div>

              <div className="flex items-center space-x-2 pl-1.5 text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
                <span>{shortenAddress(account)}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-cyber-blue hover:from-primary-500 hover:to-cyan-400 text-dark-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Studionet GEN Notice banner if balance is zero */}
      {account && balance === '0' && (
        <div className="bg-accent-amber/10 border-t border-accent-amber/20 py-2 px-4 text-center text-xs text-accent-amber flex items-center justify-center space-x-2 font-mono">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            Connected address has <strong>0 GEN</strong> on studionet. Transfer GEN from the{' '}
            <a
              href="https://studio.genlayer.com"
              target="_blank"
              rel="noreferrer"
              className="underline font-bold text-white hover:text-cyber-blue"
            >
              GenLayer Studio Accounts panel
            </a>{' '}
            to transact on-chain.
          </span>
        </div>
      )}
    </header>
  );
};
