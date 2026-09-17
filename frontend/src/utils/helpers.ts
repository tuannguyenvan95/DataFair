import { formatEther, parseEther } from 'viem';

export interface DatasetOrderData {
  order_id: string;
  buyer: string;
  provider: string;
  escrow_amount: string;
  spec_requirements: string;
  sample_dataset_url: string;
  status: number; // 0: OPEN, 1: IN_REVIEW, 2: RESOLVED_PAID, 3: RESOLVED_REJECTED, 4: CANCELLED
  verdict: string; // "PENDING", "DATA_QUALIFIED", "DATA_REJECTED", "CANCELLED"
  reason: string;
  confidence: number;
  schema_score: number;
  quality_score: number;
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
        badgeClass: 'bg-primary-500/10 text-primary-400 border-primary-500/30',
      };
    case 1:
      return {
        label: 'IN REVIEW',
        desc: 'Sample submitted, awaiting AI jury',
        badgeClass: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
      };
    case 2:
      return {
        label: 'QUALIFIED',
        desc: 'Escrow released to provider',
        badgeClass: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30',
      };
    case 3:
      return {
        label: 'REJECTED',
        desc: 'Failed rubric, escrow refunded',
        badgeClass: 'bg-accent-rose/10 text-accent-rose border-accent-rose/30',
      };
    case 4:
      return {
        label: 'CANCELLED',
        desc: 'Cancelled by buyer, escrow returned',
        badgeClass: 'bg-slate-700/30 text-slate-400 border-slate-700',
      };
    default:
      return {
        label: 'UNKNOWN',
        desc: 'Unknown state',
        badgeClass: 'bg-slate-700 text-slate-300 border-slate-600',
      };
  }
}

export function getExplorerUrl(type: 'tx' | 'address', hashOrAddr: string): string {
  return `https://genlayer-explorer.vercel.app/${type}/${hashOrAddr}`;
}
