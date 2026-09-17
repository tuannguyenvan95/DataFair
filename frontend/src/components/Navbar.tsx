import React from 'react';
import { ShieldCheck, Wallet, ExternalLink, RefreshCw, LogOut, Scale, Terminal, FileCode2, Info } from 'lucide-react';
import { shortenAddress, formatGen } from '../utils/helpers';
import { CONTRACT_ADDRESS } from '../config/genlayer';

interface NavbarProps {
  account: string | null;
  balance: string;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
  activeView: 'TERMINAL' | 'DISPUTES' | 'ABOUT' | 'ARCHITECTURE';
  onSelectView: (view: 'TERMINAL' | 'DISPUTES' | 'ABOUT' | 'ARCHITECTURE') => void;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer flex-shrink-0"
          onClick={() => onSelectView('TERMINAL')}
        >
          <div className="relative group">
            {/* Rotating Ambient Ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-80 blur-sm group-hover:opacity-100 transition duration-500"></div>

            <div className="relative w-11 h-11 rounded-2xl bg-dark-900 border border-cyan-400/50 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.5)]">
              <img
                src="/logo.jpg"
                alt="DataFair Holographic Emblem"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-dark-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-dark-950 shadow-[0_0_8px_#10b981]"></span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-holo-gradient text-cyber-glow">
              DataFair
            </span>
            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              studionet • 61999
            </span>
          </div>
        </div>

        {/* Center: Clean Proportional Navigation Tabs (No Overlapping) */}
        <nav className="hidden md:flex items-center space-x-1 p-1 rounded-2xl bg-dark-900/90 border border-cyan-500/20 shadow-inner flex-shrink-0">
          <button
            onClick={() => onSelectView('TERMINAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all duration-300 ${
              activeView === 'TERMINAL'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Escrow</span>
          </button>
          <button
            onClick={() => onSelectView('DISPUTES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all duration-300 ${
              activeView === 'DISPUTES'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Court Appeals</span>
          </button>
          <button
            onClick={() => onSelectView('ABOUT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all duration-300 ${
              activeView === 'ABOUT'
                ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Project Info</span>
          </button>
          <button
            onClick={() => onSelectView('ARCHITECTURE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all duration-300 ${
              activeView === 'ARCHITECTURE'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Specs</span>
          </button>
        </nav>

        {/* Right Section: Refresh & Connect / Disconnect Wallet */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={onRefresh}
            title="Refresh On-Chain State"
            className="p-2 rounded-xl border border-cyan-500/30 bg-dark-900 hover:bg-dark-800 text-cyan-300 hover:text-white transition shadow-[0_0_10px_rgba(0,229,255,0.1)]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Wallet Section */}
          {account ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-dark-900/90 border border-cyan-500/30 rounded-2xl p-1 pr-2.5 shadow-[0_0_15px_rgba(0,229,255,0.12)]">
                <div className="px-2.5 py-1 bg-dark-950 rounded-xl text-xs font-mono font-bold text-white flex items-center space-x-1 border border-cyan-500/20">
                  <span className="text-cyan-400">{formatGen(balance)}</span>
                  <span className="text-slate-400 text-[10px]">GEN</span>
                </div>

                <div className="flex items-center space-x-1.5 pl-1 text-xs font-mono text-cyan-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                  <span className="font-bold">{shortenAddress(account)}</span>
                </div>
              </div>

              {/* Explicit Disconnect Button */}
              <button
                onClick={onDisconnect}
                title="Disconnect Wallet"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-dark-900/90 border border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-500/20 transition shadow-[0_0_10px_rgba(244,63,94,0.15)] flex items-center space-x-1.5 text-xs font-mono font-bold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="btn-vip-pro px-4 sm:px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Horizontal View Switcher */}
      <div className="lg:hidden border-t border-cyan-500/15 bg-dark-950/80 px-4 py-2 flex items-center justify-center overflow-x-auto">
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-dark-900/90 border border-cyan-500/20">
          <button
            onClick={() => onSelectView('TERMINAL')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 transition ${
              activeView === 'TERMINAL'
                ? 'bg-cyan-500 text-dark-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Escrow</span>
          </button>
          <button
            onClick={() => onSelectView('DISPUTES')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 transition ${
              activeView === 'DISPUTES'
                ? 'bg-amber-500 text-dark-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3 h-3" />
            <span>Appeals</span>
          </button>
          <button
            onClick={() => onSelectView('ABOUT')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 transition ${
              activeView === 'ABOUT'
                ? 'bg-purple-500 text-white shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>Info</span>
          </button>
          <button
            onClick={() => onSelectView('ARCHITECTURE')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 transition ${
              activeView === 'ARCHITECTURE'
                ? 'bg-cyan-500 text-dark-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode2 className="w-3 h-3" />
            <span>Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
