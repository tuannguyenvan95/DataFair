import React from 'react';
import { ShieldCheck, Wallet, ExternalLink, RefreshCw, LogOut, Scale, Terminal, FileCode2 } from 'lucide-react';
import { shortenAddress, formatGen } from '../utils/helpers';
import { CONTRACT_ADDRESS } from '../config/genlayer';

interface NavbarProps {
  account: string | null;
  balance: string;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
  activeView: 'TERMINAL' | 'DISPUTES' | 'ARCHITECTURE';
  onSelectView: (view: 'TERMINAL' | 'DISPUTES' | 'ARCHITECTURE') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  account,
  balance,
  isConnecting,
  onConnect,
  onDisconnect,
  onRefresh,
  activeView,
  onSelectView,
}) => {
  return (
    <header className="border-b border-cyan-500/20 bg-dark-950/90 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & Glowing Hologram */}
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onSelectView('TERMINAL')}>
          <div className="relative group">
            {/* Rotating Ambient Ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-80 blur-sm group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative w-12 h-12 rounded-2xl bg-dark-900 border border-cyan-400/50 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.5)]">
              <img
                src="/logo.jpg"
                alt="DataFair Holographic Emblem"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-dark-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-dark-950 shadow-[0_0_8px_#10b981]"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl font-black tracking-tight font-display text-holo-gradient text-cyber-glow">
                DataFair
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                studionet • 61999
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/60 font-mono hidden sm:block">
              Autonomous AI Dataset Escrow & Quality Court
            </p>
          </div>
        </div>

        {/* Center High-Tech View Switcher (100% On-Chain, No Mocks) */}
        <div className="hidden lg:flex items-center space-x-1.5 p-1.5 rounded-2xl bg-dark-900/90 border border-cyan-500/20 shadow-inner">
          <button
            onClick={() => onSelectView('TERMINAL')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 ${
              activeView === 'TERMINAL'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Escrow Terminal</span>
          </button>
          <button
            onClick={() => onSelectView('DISPUTES')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 ${
              activeView === 'DISPUTES'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Court Appeals & Phán Xử</span>
          </button>
          <button
            onClick={() => onSelectView('ARCHITECTURE')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 ${
              activeView === 'ARCHITECTURE'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Protocol Architecture</span>
          </button>
        </div>

        {/* Right Section: Refresh & Connect / Disconnect Wallet */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            title="Refresh On-Chain State"
            className="p-2.5 rounded-xl border border-cyan-500/30 bg-dark-900 hover:bg-dark-800 text-cyan-300 hover:text-white transition shadow-[0_0_10px_rgba(0,229,255,0.1)] hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Contract Explorer pill */}
          {CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && (
            <a
              href={`https://genlayer-explorer.vercel.app/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="hidden xl:flex items-center space-x-1.5 px-3 py-2 text-xs rounded-xl border border-cyan-500/30 bg-dark-900/80 text-cyan-200 hover:border-cyan-400 hover:text-white transition font-mono"
            >
              <span className="text-slate-400">Contract:</span>
              <span className="text-white font-bold">{shortenAddress(CONTRACT_ADDRESS)}</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          )}

          {/* Wallet Section */}
          {account ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-dark-900 border border-cyan-500/30 rounded-2xl p-1.5 pr-3 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                <div className="px-3 py-1 bg-dark-950 rounded-xl text-xs font-mono font-bold text-white flex items-center space-x-1 border border-cyan-500/20">
                  <span className="text-cyan-400">{formatGen(balance)}</span>
                  <span className="text-slate-400 text-[10px]">GEN</span>
                </div>

                <div className="flex items-center space-x-2 pl-1.5 text-xs font-mono text-cyan-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                  <span className="font-bold">{shortenAddress(account)}</span>
                </div>
              </div>

              {/* Explicit Disconnect Button */}
              <button
                onClick={onDisconnect}
                title="Disconnect Wallet"
                className="p-2 rounded-xl bg-dark-900 border border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-500/20 transition shadow-[0_0_10px_rgba(244,63,94,0.15)] flex items-center space-x-1.5 text-xs font-mono font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="btn-vip-pro px-6 py-2.5 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
