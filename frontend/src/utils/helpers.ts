import { formatEther, parseEther } from 'viem';

export interface DatasetOrderData {
  order_id: string;
  buyer: string;
  provider: string;
  escrow_amount: string;
  spec_requirements: string;
  sample_dataset_url: string;
  status: number; // 0: OPEN, 1: IN_REVIEW, 2: RESOLVED_PAID, 3: RESOLVED_REJECTED, 4: CANCELLED, 5: RESOLVED_PARTIAL, 6: RETRY, 7: DISPUTED
  verdict: string; // "PENDING", "DATA_QUALIFIED", "DATA_PARTIAL", "DATA_RETRY", "DATA_REJECTED", "CANCELLED", "DISPUTED"
  reason: string;
  confidence: number;
  schema_score: number;
  quality_score: number;
  attempts?: number;
  dispute_approved_by?: string;
  created_at_block: string;
}

export interface ContractStats {
  total_orders: number;
  total_escrow_locked: string;
  total_orders_settled: number;
}

export function formatGen(weiString: string | bigint | number): string {
  try {
    const val = typeof weiString === 'string' ? BigInt(weiString) : BigInt(weiString);
    const etherStr = formatEther(val);
    const num = parseFloat(etherStr);
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  } catch (e) {
    return '0';
  }
}

export function parseGenToWei(genAmount: string): bigint {
  try {
    return parseEther(genAmount);
  } catch (e) {
    return 0n;
  }
}

export function shortenAddress(address?: string): string {
  if (!address) return '';
  if (address === '0x0000000000000000000000000000000000000000') return 'Unassigned';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getStatusInfo(status: number) {
  switch (status) {
    case 0:
      return {
        label: 'OPEN',
        desc: 'Awaiting sample deliverable',
        badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]',
      };
    case 1:
      return {
        label: 'IN REVIEW',
        desc: 'Sample submitted, ready for AI jury',
        badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
      };
    case 2:
      return {
        label: 'QUALIFIED',
        desc: '100% Escrow released to provider',
        badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
      };
    case 3:
      return {
        label: 'REJECTED',
        desc: 'Failed rubric, 100% refunded to buyer',
        badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
      };
    case 4:
      return {
        label: 'CANCELLED',
        desc: 'Cancelled by buyer, escrow returned',
        badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
      };
    case 5:
      return {
        label: 'PARTIAL SPLIT',
        desc: 'Fair quality split (65% provider / 35% buyer)',
        badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
      };
    case 6:
      return {
        label: 'RETRY GRANTED',
        desc: 'Curator allowed 2nd attempt to fix formatting',
        badgeClass: 'bg-yellow-500/10 text-yellow-300 border-yellow-400/40 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
      };
    case 7:
      return {
        label: 'DISPUTED',
        desc: 'Bilateral appeal chamber open',
        badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse',
      };
    default:
      return {
        label: 'UNKNOWN',
        desc: 'Unknown state',
        badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
      };
  }
}

export function getExplorerUrl(type: 'tx' | 'address', hashOrAddr: string): string {
  return `https://genlayer-explorer.vercel.app/${type}/${hashOrAddr}`;
}
