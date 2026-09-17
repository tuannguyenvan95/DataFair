import React from 'react';
import { ShieldCheck, Wallet, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { shortenAddress, formatGen } from '../utils/helpers';
import { CONTRACT_ADDRESS } from '../config/genlayer';

interface NavbarProps {
  account: string | null;
  balance: string;
  isConnecting: boolean;
  onConnect: () => void;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  account,
  balance,
  isConnecting,
  onConnect,
  onRefresh,
}) => {
  return (
    <header className="border-b border-dark-700 bg-dark-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center shadow-lg shadow-primary-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DataFair
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-primary-500/10 text-primary-400 border border-primary-500/30">
                studionet
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous AI Training Dataset Escrow & Quality Adjudication
            </p>
          </div>
        </div>

        {/* Contract & Account Controls */}
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="p-2.5 rounded-xl border border-dark-600 bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Contract Address info */}
          {CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && (
            <a
              href={`https://genlayer-explorer.vercel.app/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-xs rounded-xl border border-dark-600 bg-dark-800/80 text-slate-300 hover:border-primary-500/40 hover:text-primary-400 transition"
            >
              <span className="text-slate-400">Contract:</span>
              <span className="font-mono text-slate-200">{shortenAddress(CONTRACT_ADDRESS)}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {/* Wallet Section */}
          {account ? (
            <div className="flex items-center space-x-2 bg-dark-800 border border-dark-600 rounded-xl p-1.5 pr-3">
              {/* Balance */}
              <div className="px-3 py-1 bg-dark-900 rounded-lg text-xs font-mono font-medium text-slate-200 flex items-center space-x-1">
                <span className="text-primary-400">{formatGen(balance)}</span>
                <span className="text-slate-400">GEN</span>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-2 pl-2 text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
                <span>{shortenAddress(account)}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium text-sm shadow-lg shadow-primary-600/25 transition disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Studionet GEN Notice if balance is zero or un-funded */}
      {account && balance === '0' && (
        <div className="bg-accent-amber/10 border-t border-accent-amber/20 py-1.5 px-4 text-center text-xs text-accent-amber flex items-center justify-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            Your wallet has <strong>0 GEN</strong> on studionet (Chain ID 61999). Fund your address via the{' '}
            <a
              href="https://studio.genlayer.com"
              target="_blank"
              rel="noreferrer"
              className="underline font-semibold hover:text-white"
            >
              GenLayer Studio Accounts panel
            </a>{' '}
            to transact.
          </span>
        </div>
      )}
    </header>
  );
};
