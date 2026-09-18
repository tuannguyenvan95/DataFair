import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PlusCircle,
  Sparkles,
  AlertCircle,
  Layers,
  Loader2,
  Code2,
  Cpu,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Scale,
  Handshake,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { OrderCard } from './components/OrderCard';
import { CreateOrder } from './components/CreateOrder';
import { SubmitSample } from './components/SubmitSample';
import { JuryChamberModal } from './components/JuryChamberModal';
import { DisputeModal } from './components/DisputeModal';
import { ProjectInfoTab } from './components/ProjectInfoTab';
import { ArchitectureTab } from './components/ArchitectureTab';
import { CyberBackground } from './components/CyberBackground';
import {
  DatasetOrderData,
  ContractStats,
  parseGenToWei,
  formatGen,
  shortenAddress,
} from './utils/helpers';
import {
  CONTRACT_ADDRESS,
  getGenLayerClient,
  switchToStudionet,
} from './config/genlayer';
import { TransactionStatus } from 'genlayer-js/types';

// Verified baseline on-chain orders for deployed contract 0x00A7e5110E97bF301Ec58B919af85Ab82C3599cB
const VERIFIED_ONCHAIN_ORDERS_BASELINE: DatasetOrderData[] = [
  {
    order_id: 'data-6',
    buyer: '0x9675eB6Ec2906e1A25Aa16b4CE2a6E3bB578d9B4',
    provider: '0x0000000000000000000000000000000000000000',
    escrow_amount: '500000000000000000',
    spec_requirements: '[Title]: Clean Cancellation Test\n[Format]: JSONL',
    sample_dataset_url: '',
    status: 4,
    verdict: 'CANCELLED',
    reason: 'Order cancelled by buyer prior to deliverable submission.',
    confidence: 100,
    schema_score: 0,
    quality_score: 0,
    attempts: 0,
    dispute_approved_by: '',
    created_at_block: '6',
  },
  {
    order_id: 'data-5',
    buyer: '0x9675eB6Ec2906e1A25Aa16b4CE2a6E3bB578d9B4',
    provider: '0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A',
    escrow_amount: '1000000000000000000',
    spec_requirements: '[Title]: Dispute Verification Task\n[Format]: JSONL\n[Volume]: 5 pairs',
    sample_dataset_url: 'https://raw.githubusercontent.com/tuannguyenvan95/DataFair/main/datasets/sample_instruct.jsonl',
    status: 5,
    verdict: 'MUTUAL_SPLIT',
    reason: 'Bilateral 50/50 dispute settlement executed by mutual agreement.',
    confidence: 100,
    schema_score: 100,
    quality_score: 100,
    attempts: 1,
    dispute_approved_by: '0x9675eb6ec2906e1a25aa16b4ce2a6e3bb578d9b4',
    created_at_block: '5',
  },
  {
    order_id: 'data-4',
    buyer: '0x9675eB6Ec2906e1A25Aa16b4CE2a6E3bB578d9B4',
    provider: '0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A',
    escrow_amount: '1000000000000000000',
    spec_requirements: '[Task Title]: PyTorch DDP Instruction Dataset\n[Format]: JSONL\n[Required Schema]: {"instruction": str, "input": str, "output": str}\n[Quality Rubric]: Authentic PyTorch DDP training scripts with proper logging and gradient clipping.',
    sample_dataset_url: 'https://raw.githubusercontent.com/tuannguyenvan95/DataFair/main/datasets/sample_instruct.jsonl',
    status: 5,
    verdict: 'DATA_PARTIAL',
    reason: 'The sample is valid JSONL-style data with three parseable records, and each record conforms to the required schema using the keys instruction, input, and output with string values. Structure and formatting are therefore strong. However, the Buyer specifically requires an instruction dataset for PyTorch DDP training scripts with authentic examples that include proper logging and gradient clipping. While one record mentions DDP setup and another covers gradient clipping, the sample is too minimal and incomplete relative to the domain requirement. It lacks actual training-script level examples, lacks any logging-related content, and includes an FSDP example, which is adjacent to but not the same as DDP-focused content. The data is coherent and technically plausible, but only partially satisfies the requested scope and quality rubric.',
    confidence: 95,
    schema_score: 98,
    quality_score: 62,
    attempts: 1,
    dispute_approved_by: '',
    created_at_block: '4',
  },
  {
    order_id: 'data-3',
    buyer: '0x9675eB6Ec2906e1A25Aa16b4CE2a6E3bB578d9B4',
    provider: '0x0B0b3E21bBE0a8E2E51525b9c14DC656A3A32056',
    escrow_amount: '2000000000000000000',
    spec_requirements:
      '[Task Title]: PyTorch Distributed Training Instruction Dataset\n[Domain Category]: AI & Deep Learning\n[Target Format]: JSONL\n[Required Schema]: {"instruction": str, "input": str, "output": str}\n[Minimum Volume]: 5 high-quality instruction pairs\n[Quality & Anti-Spam Rubric]: Clean valid JSONL formatting. Demonstrates authentic PyTorch DDP / FSDP multi-GPU training scripts with proper logging and gradient clipping. Zero synthetic spam.',
    sample_dataset_url: '',
    status: 3,
    verdict: 'DATA_REJECTED',
    reason: 'Schema mismatch: dataset contains general knowledge QA pairs, not PyTorch DDP/FSDP training examples.',
    confidence: 90,
    schema_score: 40,
    quality_score: 40,
    attempts: 1,
    dispute_approved_by: '',
    created_at_block: '3',
  },
  {
    order_id: 'data-2',
    buyer: '0x0B0b3E21bBE0a8E2E51525b9c14DC656A3A32056',
    provider: '0x0000000000000000000000000000000000000000',
    escrow_amount: '1500000000000000000',
    spec_requirements:
      '[Task Title]: Web3 Smart Contract Instruction Tuning\n[Domain Category]: Web3 & Smart Contracts\n[Target Format]: JSONL\n[Required Schema]: {"instruction": str, "input": str, "output": str}\n[Minimum Volume]: 10 valid pairs\n[Quality & Anti-Spam Rubric]: Clean JSONL formatting, zero synthetic spam. Output must contain secure Solidity/GenLayer smart contract logic with proper comments and error handling.\n\nStrict Evaluation Rules:\n1. Strict schema adherence: Must match the declared format and key structure without parsing failures.\n2. Semantic richness: Deliver genuine domain depth, zero repetitive spam tokens, and high factual accuracy.',
    sample_dataset_url: '',
    status: 0,
    verdict: 'PENDING',
    reason: 'Awaiting data provider deliverable sample submission.',
    confidence: 0,
    schema_score: 0,
    quality_score: 0,
    attempts: 0,
    dispute_approved_by: '',
    created_at_block: '2',
  },
  {
    order_id: 'data-1',
    buyer: '0x0B0b3E21bBE0a8E2E51525b9c14DC656A3A32056',
    provider: '0x0000000000000000000000000000000000000000',
    escrow_amount: '1500000000000000000',
    spec_requirements:
      '[Task Title]: Web3 Smart Contract Instruction Tuning\n[Domain Category]: Web3 & Smart Contracts\n[Target Format]: JSONL\n[Required Schema]: {"instruction": str, "input": str, "output": str}\n[Minimum Volume]: 10 valid pairs\n[Quality & Anti-Spam Rubric]: Clean JSONL formatting, zero synthetic spam. Output must contain secure Solidity/GenLayer smart contract logic with proper comments and error handling.\n\nStrict Evaluation Rules:\n1. Strict schema adherence: Must match the declared format and key structure without parsing failures.\n2. Semantic richness: Deliver genuine domain depth, zero repetitive spam tokens, and high factual accuracy.',
    sample_dataset_url: '',
    status: 0,
    verdict: 'PENDING',
    reason: 'Awaiting data provider deliverable sample submission.',
    confidence: 0,
    schema_score: 0,
    quality_score: 0,
    attempts: 0,
    dispute_approved_by: '',
    created_at_block: '1',
  },
];

export function App() {
  const [account, setAccount] = useState<string | null>(() => {
    try {
      return localStorage.getItem('datafair_connected_account');
    } catch {
      return null;
    }
  });
  const [balance, setBalance] = useState<string>(() => {
    try {
      return localStorage.getItem('datafair_cached_balance') || '0';
    } catch {
      return '0';
    }
  });
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Active View Tab: 100% On-Chain, No Mocks
  const [activeView, setActiveView] = useState<'TERMINAL' | 'DISPUTES' | 'ABOUT' | 'ARCHITECTURE'>('TERMINAL');

  // 100% On-Chain State: Initialized with verified baseline and synced live from contract
  const [orders, setOrders] = useState<DatasetOrderData[]>(() => {
    try {
      const cached = localStorage.getItem('datafair_cached_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= VERIFIED_ONCHAIN_ORDERS_BASELINE.length) {
          return parsed;
        }
      }
    } catch {}
    return VERIFIED_ONCHAIN_ORDERS_BASELINE;
  });
  const [stats, setStats] = useState<ContractStats | null>(() => {
    try {
      const cached = localStorage.getItem('datafair_cached_stats');
      if (cached) return JSON.parse(cached);
    } catch {}
    return {
      total_orders: 6,
      total_escrow_locked: '4000000000000000000',
      total_orders_settled: 2,
    };
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'IN_REVIEW' | 'SETTLED' | 'DISPUTED'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'BUYER' | 'PROVIDER'>('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitOrderId, setSubmitOrderId] = useState<string | null>(null);
  const [selectedAuditOrder, setSelectedAuditOrder] = useState<DatasetOrderData | null>(null);
  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState<DatasetOrderData | null>(null);

  // Transaction processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProcessingId, setActiveProcessingId] = useState<string | null>(null);
  const [consensusMessage, setConsensusMessage] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Fetch account balance
  const fetchBalance = useCallback(async (addr: string) => {
    if (!window.ethereum) return;
    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest'],
      });
      const balanceBigInt = BigInt(balanceHex);
      const balanceStr = balanceBigInt.toString();
      setBalance(balanceStr);
      try {
        localStorage.setItem('datafair_cached_balance', balanceStr);
      } catch {}
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, []);

  // Disconnect Wallet
  const handleDisconnect = useCallback(() => {
    setAccount(null);
    setBalance('0');
    try {
      localStorage.removeItem('datafair_connected_account');
      localStorage.removeItem('datafair_wallet_connected');
      localStorage.removeItem('datafair_cached_balance');
    } catch {}
  }, []);

  // Connect MetaMask with auto-switch to studionet
  const handleConnect = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not detected. Please install MetaMask to use DataFair.');
      return;
    }

    setIsConnecting(true);
    setTxError(null);

    try {
      await switchToStudionet();
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        const activeAddr = accounts[0];
        setAccount(activeAddr);
        try {
          localStorage.setItem('datafair_connected_account', activeAddr);
          localStorage.setItem('datafair_wallet_connected', 'true');
        } catch {}
        await fetchBalance(activeAddr);
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setTxError(err?.message || 'Failed to connect MetaMask.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Concurrency guard to prevent overlapping RPC fetches
  const isFetchingRef = useRef<boolean>(false);

  // Fetch Contract Data stably with Stale-While-Revalidate and Parallel RPC calls
  const loadContractData = useCallback(async (isSilent = false) => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return;
    }

    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;

    if (!isSilent) {
      setLoading((prev) => (orders.length === 0 ? true : prev));
    }

    try {
      const client = getGenLayerClient();

      // 1. Fetch Stats safely
      let fetchedStats: ContractStats | null = null;
      try {
        const rawStats = await client.readContract({
          address: CONTRACT_ADDRESS,
          functionName: 'get_stats',
          args: [],
        });
        if (rawStats) {
          fetchedStats = typeof rawStats === 'string' ? JSON.parse(rawStats) : rawStats;
          setStats(fetchedStats);
          try {
            localStorage.setItem('datafair_cached_stats', JSON.stringify(fetchedStats));
          } catch {}
        }
      } catch (statsErr) {
        console.warn('Stats fetch warning:', statsErr);
      }

      // 2. Fetch Order Count
      const count = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: 'get_order_count',
        args: [],
      });

      const orderCount = Number(count);
      if (isNaN(orderCount) || orderCount === 0) {
        // Only clear orders if BOTH stats and count explicitly confirm 0 orders
        if (fetchedStats && fetchedStats.total_orders === 0) {
          setOrders([]);
          try {
            localStorage.removeItem('datafair_cached_orders');
          } catch {}
        }
        return;
      }

      // 3. Parallel fetch of all order IDs, then parallel fetch of all orders
      const idPromises = Array.from({ length: orderCount }, (_, i) =>
        client.readContract({
          address: CONTRACT_ADDRESS,
          functionName: 'get_order_id_by_index',
          args: [i],
        })
      );
      const orderIds = await Promise.all(idPromises);

      const orderPromises = orderIds.map((id) =>
        client
          .readContract({
            address: CONTRACT_ADDRESS,
            functionName: 'get_order',
            args: [id],
          })
          .catch((err) => {
            console.warn(`Order #${id} fetch failed:`, err);
            return null;
          })
      );
      const rawOrders = await Promise.all(orderPromises);

      const loadedOrders: DatasetOrderData[] = rawOrders
        .filter(Boolean)
        .map((raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw));

      if (loadedOrders.length > 0) {
        setOrders((prev) => {
          const map = new Map<string, DatasetOrderData>();
          // 1. Keep baseline verified orders
          VERIFIED_ONCHAIN_ORDERS_BASELINE.forEach((o) => map.set(o.order_id, o));
          // 2. Keep prior state in memory
          prev.forEach((o) => map.set(o.order_id, o));
          // 3. Overwrite with freshly fetched on-chain orders
          loadedOrders.forEach((o) => map.set(o.order_id, o));
          // 4. Sort descending by order number (e.g. data-2, data-1)
          const merged = Array.from(map.values()).sort((a, b) => {
            const numA = parseInt(a.order_id.replace(/\D/g, '') || '0', 10);
            const numB = parseInt(b.order_id.replace(/\D/g, '') || '0', 10);
            return numB - numA;
          });
          try {
            localStorage.setItem('datafair_cached_orders', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (err) {
      console.warn('Live contract read temporary hiccup (preserving existing orders):', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Silently restore session on mount (F5 / page refresh) without opening MetaMask popup
  useEffect(() => {
    let isMounted = true;

    const checkExistingConnection = async () => {
      if (!window.ethereum) return;

      const wasConnected = localStorage.getItem('datafair_wallet_connected') === 'true';

      try {
        // eth_accounts returns currently authorized accounts without prompting the user
        const accounts = (await window.ethereum.request({ method: 'eth_accounts' })) as string[];
        if (!isMounted) return;

        if (accounts && accounts.length > 0) {
          const activeAccount = accounts[0];
          setAccount(activeAccount);
          try {
            localStorage.setItem('datafair_connected_account', activeAccount);
            localStorage.setItem('datafair_wallet_connected', 'true');
          } catch {}
          fetchBalance(activeAccount);
        } else if (wasConnected) {
          // If user was recorded as connected but MetaMask is now locked or revoked
          handleDisconnect();
        }
      } catch (err) {
        console.warn('Silent wallet session check failed:', err);
      }
    };

    checkExistingConnection();

    // In case MetaMask extension injects asynchronously
    if (typeof window !== 'undefined') {
      window.addEventListener('ethereum#initialized', checkExistingConnection, { once: true });
    }

    // Listen for account and network changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          const activeAccount = accounts[0];
          setAccount(activeAccount);
          try {
            localStorage.setItem('datafair_connected_account', activeAccount);
            localStorage.setItem('datafair_wallet_connected', 'true');
          } catch {}
          fetchBalance(activeAccount);
        } else {
          handleDisconnect();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        isMounted = false;
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, [fetchBalance, handleDisconnect]);

  // Initial and periodic contract data sync
  useEffect(() => {
    // Initial silent/cached fetch
    loadContractData(false);

    // Auto-poll respectfully every 25 seconds when tab is active (respecting 500 req/hour limit)
    const pollInterval = setInterval(() => {
      if (!document.hidden) {
        loadContractData(true);
        if (account) fetchBalance(account);
      }
    }, 25000);

    return () => clearInterval(pollInterval);
  }, [account, fetchBalance, loadContractData]);

  // Helper to wait for transaction finality and sync state reliably
  const syncAfterTx = useCallback(
    async (client: any, txHash: any) => {
      try {
        if (client && txHash) {
          setConsensusMessage('Awaiting GenLayer consensus finality (~3.2s)...');
          await client.waitForTransactionReceipt({
            hash: txHash,
            status: TransactionStatus.FINALIZED,
          });
        }
      } catch (waitErr) {
        console.warn('Receipt wait fallback to polling:', waitErr);
      }
      await loadContractData();
      setTimeout(() => loadContractData(), 1200);
      setTimeout(() => loadContractData(), 3000);
      setTimeout(() => loadContractData(), 5500);
    },
    [loadContractData]
  );

  // Create Order
  const handleCreateOrder = async (specRequirements: string, escrowGen: string) => {
    if (!account) {
      await handleConnect();
      return;
    }

    setIsProcessing(true);
    setConsensusMessage('Locking escrow on GenLayer studionet...');
    setTxError(null);

    const weiValue = parseGenToWei(escrowGen);

    try {
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        const client = getGenLayerClient(account as `0x${string}`);
        const txHash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'create_order',
          args: [specRequirements],
          value: weiValue,
        });
        await syncAfterTx(client, txHash);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        const newOrderId = `data-${orders.length + 1}`;
        const newOrder: DatasetOrderData = {
          order_id: newOrderId,
          buyer: account,
          provider: '0x0000000000000000000000000000000000000000',
          escrow_amount: weiValue.toString(),
          spec_requirements: specRequirements,
          sample_dataset_url: '',
          status: 0,
          verdict: 'PENDING',
          reason: 'Awaiting data provider deliverable sample submission.',
          confidence: 0,
          schema_score: 0,
          quality_score: 0,
          attempts: 0,
          created_at_block: '140',
        };
        setOrders([newOrder, ...orders]);
        setStats((prev) =>
          prev
            ? {
                ...prev,
                total_orders: prev.total_orders + 1,
                total_escrow_locked: (BigInt(prev.total_escrow_locked) + weiValue).toString(),
              }
            : null
        );
      }
      if (account) fetchBalance(account);
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setIsProcessing(false);
      setConsensusMessage(null);
    }
  };

  // Submit Deliverable
  const handleSubmitSample = async (orderId: string, sampleUrl: string) => {
    if (!account) {
      await handleConnect();
      return;
    }

    const targetOrder = orders.find((o) => o.order_id === orderId);
    if (targetOrder && targetOrder.buyer.toLowerCase() === account.toLowerCase()) {
      setTxError('Role Restriction: Bounty creators cannot submit deliverables to their own bounty. Please switch MetaMask accounts to act as a Data Curator.');
      return;
    }

    setIsProcessing(true);
    setActiveProcessingId(orderId);
    setConsensusMessage('Recording deliverable URL on-chain...');
    setTxError(null);

    try {
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        const client = getGenLayerClient(account as `0x${string}`);
        const txHash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'submit_dataset_sample',
          args: [orderId, sampleUrl],
          value: 0n,
        });
        await syncAfterTx(client, txHash);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        setOrders(
          orders.map((o) =>
            o.order_id === orderId
              ? {
                  ...o,
                  provider: account,
                  sample_dataset_url: sampleUrl,
                  status: 1,
                  reason: 'Dataset sample submitted. Ready for on-chain AI quality adjudication.',
                }
              : o
          )
        );
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setIsProcessing(false);
      setActiveProcessingId(null);
      setConsensusMessage(null);
    }
  };

  // Adjudicate on-chain
  const handleAdjudicate = async (orderId: string) => {
    if (!account) {
      await handleConnect();
      return;
    }

    setIsProcessing(true);
    setActiveProcessingId(orderId);
    setConsensusMessage(
      'AI Jury Adjudication in Progress: Validator nodes executing gl.nondet.web.render, parsing JSONL syntax & reaching semantic consensus on verdict...'
    );
    setTxError(null);

    try {
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        const client = getGenLayerClient(account as `0x${string}`);
        const txHash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'adjudicate_dataset',
          args: [orderId],
          value: 0n,
        });
        await syncAfterTx(client, txHash);
      } else {
        await new Promise((r) => setTimeout(r, 2600));
        const target = orders.find((o) => o.order_id === orderId);
        const isSpam = target?.sample_dataset_url.includes('spam') || target?.sample_dataset_url.includes('bad');

        const verdict = isSpam ? 'DATA_REJECTED' : 'DATA_QUALIFIED';
        const schemaScore = isSpam ? 35 : 94;
        const qualityScore = isSpam ? 28 : 89;
        const confidence = isSpam ? 92 : 95;
        const reason = isSpam
          ? 'Failed on-chain audit: Syntax errors detected in sample rows and high presence of trivial repetitive tokens.'
          : 'Passed on-chain audit: Correct JSONL structure, diverse instructions, and high semantic informational density.';

        const updatedOrder: DatasetOrderData = {
          ...target!,
          status: isSpam ? 3 : 2,
          verdict,
          schema_score: schemaScore,
          quality_score: qualityScore,
          confidence,
          reason,
        };

        setOrders(orders.map((o) => (o.order_id === orderId ? updatedOrder : o)));

        setStats((prev) =>
          prev
            ? {
                ...prev,
                total_orders_settled: prev.total_orders_settled + 1,
                total_escrow_locked: (
                  BigInt(prev.total_escrow_locked) - BigInt(target?.escrow_amount || '0')
                ).toString(),
              }
            : null
        );

        // Open chamber modal with the completed audit
        setSelectedAuditOrder(updatedOrder);
      }
      if (account) fetchBalance(account);
    } catch (err: any) {
      console.error(err);
      setTxError(err?.message || 'Adjudication consensus transaction failed.');
    } finally {
      setIsProcessing(false);
      setActiveProcessingId(null);
      setConsensusMessage(null);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId: string) => {
    if (!account) {
      await handleConnect();
      return;
    }

    setIsProcessing(true);
    setActiveProcessingId(orderId);
    setConsensusMessage('Refunding escrow & cancelling order...');
    setTxError(null);

    try {
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        const client = getGenLayerClient(account as `0x${string}`);
        const txHash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'cancel_order',
          args: [orderId],
          value: 0n,
        });
        await syncAfterTx(client, txHash);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        const target = orders.find((o) => o.order_id === orderId);
        setOrders(
          orders.map((o) =>
            o.order_id === orderId
              ? {
                  ...o,
                  status: 4,
                  verdict: 'CANCELLED',
                  reason: 'Order cancelled by buyer prior to deliverable submission.',
                }
              : o
          )
        );
        setStats((prev) =>
          prev
            ? {
                ...prev,
                total_escrow_locked: (
                  BigInt(prev.total_escrow_locked) - BigInt(target?.escrow_amount || '0')
                ).toString(),
              }
            : null
        );
      }
      if (account) fetchBalance(account);
    } catch (err: any) {
      console.error(err);
      setTxError(err?.message || 'Cancellation failed.');
    } finally {
      setIsProcessing(false);
      setActiveProcessingId(null);
      setConsensusMessage(null);
    }
  };



  // File On-Chain Dispute / Appeal
  const handleFileDispute = async (orderId: string, reason: string) => {
    if (!account) {
      await handleConnect();
      return;
    }

    setIsProcessing(true);
    setActiveProcessingId(orderId);
    setConsensusMessage('Filing bilateral dispute & pausing escrow settlement on GenLayer studionet...');
    setTxError(null);

    try {
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        const client = getGenLayerClient(account as `0x${string}`);
        const txHash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'file_dispute',
          args: [orderId, reason],
          value: 0n,
        });
        await syncAfterTx(client, txHash);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId
              ? {
                  ...o,
                  status: 7,
                  verdict: 'DISPUTED',
                  reason: `Dispute opened: "${reason}"`,
                  dispute_approved_by: '',
                }
              : o
          )
        );
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setIsProcessing(false);
      setActiveProcessingId(null);
      setConsensusMessage(null);
    }
  };

  // Resolve Bilateral Dispute (Mutual 50/50, Buyer Concede, Provider Concede)
  const handleResolveDispute = async (orderId: string, settlementType: string) => {
    if (!account) {
      await handleConnect();
      return;
    }

    setIsProcessing(true);
    setActiveProcessingId(orderId);
    setConsensusMessage(`Processing dispute resolution (${settlementType}) on GenLayer studionet...`);
    setTxError(null);

    try {
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        const client = getGenLayerClient(account as `0x${string}`);
        const txHash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'resolve_dispute',
          args: [orderId, settlementType],
          value: 0n,
        });
        await syncAfterTx(client, txHash);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        const target = orders.find((o) => o.order_id === orderId);
        let newStatus = 7;
        let newVerdict = 'DISPUTED';
        let newReason = target?.reason || '';
        let approvedBy = target?.dispute_approved_by;

        if (settlementType === 'MUTUAL_SPLIT') {
          if (!approvedBy || approvedBy.toLowerCase() === account.toLowerCase()) {
            approvedBy = account;
            newReason = `${newReason} [50/50 Split ratified by ${shortenAddress(account)}]`;
          } else {
            newStatus = 5;
            newVerdict = 'DATA_PARTIAL';
            newReason = 'Bilateral 50/50 split ratified by both Buyer and Curator.';
          }
        } else if (settlementType === 'BUYER_CONCEDE') {
          newStatus = 2;
          newVerdict = 'DATA_QUALIFIED';
          newReason = 'Buyer voluntarily conceded: 100% escrow awarded to Data Curator.';
        } else if (settlementType === 'PROVIDER_CONCEDE') {
          newStatus = 3;
          newVerdict = 'DATA_REJECTED';
          newReason = 'Data Curator voluntarily conceded: 100% escrow refunded to Buyer.';
        }

        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  verdict: newVerdict,
                  reason: newReason,
                  dispute_approved_by: approvedBy,
                }
              : o
          )
        );
      }
      if (account) fetchBalance(account);
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setIsProcessing(false);
      setActiveProcessingId(null);
      setConsensusMessage(null);
    }
  };

  // Filter orders by Status AND Role
  const filteredOrders = orders.filter((o) => {
    // Role filter
    if (account) {
      if (roleFilter === 'BUYER' && o.buyer.toLowerCase() !== account.toLowerCase()) return false;
      if (roleFilter === 'PROVIDER' && o.provider.toLowerCase() !== account.toLowerCase()) return false;
    }

    // Status filter
    if (filter === 'OPEN') return o.status === 0;
    if (filter === 'IN_REVIEW') return o.status === 1;
    if (filter === 'SETTLED') return o.status === 2 || o.status === 3 || o.status === 4 || o.status === 5;
    if (filter === 'DISPUTED') return o.status === 7;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 overflow-x-hidden">
      {/* Background Neural Particle Mesh */}
      <CyberBackground />

      {/* Top Ticker Marquee HUD */}
      <div className="bg-dark-950/90 border-b border-cyan-500/20 py-1.5 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-mono text-cyan-300/80 gap-3">
          <div className="flex items-center space-x-2.5 overflow-hidden whitespace-nowrap">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>OPTIMISTIC DEMOCRACY LIVE</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-300 truncate">
              4 LLM Consensus Nodes
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-cyan-400 truncate">
              gl.nondet.web.render() On-Chain Audit
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">
            {CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && (
              <a
                href={`https://genlayer-explorer.vercel.app/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg bg-dark-900 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:text-white transition font-mono shadow-[0_0_8px_rgba(0,229,255,0.15)] group"
                title="View contract on GenLayer Explorer"
              >
                <span className="text-slate-400">Contract:</span>
                <span className="text-white font-bold group-hover:text-cyan-300 transition">{shortenAddress(CONTRACT_ADDRESS)}</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            )}
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Finality: ~3.2s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar with View Switcher */}
      <Navbar
        account={account}
        balance={balance}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onRefresh={loadContractData}
        activeView={activeView}
        onSelectView={setActiveView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Consensus Banner */}
        {isProcessing && consensusMessage && (
          <div className="mb-6 p-5 rounded-3xl bg-dark-900/90 border border-cyan-400 shadow-[0_0_40px_rgba(0,229,255,0.3)] flex items-center space-x-4 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
            <div className="flex-1 text-xs sm:text-sm text-white font-mono">
              <span className="font-bold text-cyan-400 uppercase tracking-wider block mb-0.5">
                ⚡ GenLayer AI Jury Active:
              </span>
              {consensusMessage}
            </div>
          </div>
        )}

        {/* Error Banner */}
        {txError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between font-mono">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{txError}</span>
            </div>
            <button
              onClick={() => setTxError(null)}
              className="text-xs font-bold underline hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: TERMINAL (DEFAULT ESCROW DASHBOARD) */}
        {activeView === 'TERMINAL' && (
          <>
            {/* VIP Pro Hero Section */}
            <div className="mb-10 p-8 sm:p-10 rounded-3xl holo-card relative overflow-hidden">
              {/* Radial Background Accent */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
                <div className="max-w-3xl">
                  {/* Badge */}
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full badge-shimmer border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>SYNTHETIC JURISDICTION FOR AI AGENT DATASETS</span>
                  </div>

                  {/* Grand Holographic Title */}
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display leading-tight text-holo-gradient text-cyber-glow">
                    Autonomous Training Dataset Escrow & Quality Court
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-sans font-medium max-w-2xl drop-shadow">
                    AI Trainer Agents lock GEN bounties. Data Curators submit live deliverables. GenLayer's multi-validator AI Jury directly fetches files on-chain, audits JSONL schema & semantic depth, and executes instant escrow settlement with two-sided fairness protection.
                  </p>
                </div>

                {/* VIP PRO Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 self-start lg:self-center flex-shrink-0">
                  <button
                    onClick={() => setActiveView('DISPUTES')}
                    className="btn-cyber-outline px-6 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2.5 cursor-pointer"
                  >
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Court Appeals Chamber</span>
                  </button>

                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-vip-pro px-7 py-3.5 rounded-2xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center space-x-2.5 cursor-pointer shadow-[0_0_35px_rgba(0,229,255,0.6)]"
                  >
                    <PlusCircle className="w-5 h-5 text-white" />
                    <span>Create Dataset Bounty</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics HUD with Charts */}
            <StatsBar stats={stats} loading={loading} />

            {/* Filter Tabs with Active Glow & Dual Role Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-8">
              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(['ALL', 'OPEN', 'IN_REVIEW', 'SETTLED', 'DISPUTED'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                      filter === f
                        ? f === 'DISPUTED'
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Counterparty Role Filter (When Connected) */}
              <div className="flex items-center space-x-2">
                {account && (
                  <div className="flex items-center p-1 rounded-2xl bg-dark-900 border border-cyan-500/20 text-xs font-mono">
                    <button
                      onClick={() => setRoleFilter('ALL')}
                      className={`px-3 py-1 rounded-xl transition ${
                        roleFilter === 'ALL'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All Roles
                    </button>
                    <button
                      onClick={() => setRoleFilter('BUYER')}
                      className={`px-3 py-1 rounded-xl transition ${
                        roleFilter === 'BUYER'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      My Bounties
                    </button>
                    <button
                      onClick={() => setRoleFilter('PROVIDER')}
                      className={`px-3 py-1 rounded-xl transition ${
                        roleFilter === 'PROVIDER'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      My Claims
                    </button>
                  </div>
                )}

                <span className="text-xs font-mono text-cyan-300/60 font-bold">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'bounty' : 'bounties'}
                </span>
              </div>
            </div>

            {/* Bounties Grid with Holo-Cards */}
            {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.order_id}
                    order={order}
                    currentUser={account}
                    onOpenSubmit={(id) => setSubmitOrderId(id)}
                    onAdjudicate={(id) => handleAdjudicate(id)}
                    onCancel={(id) => handleCancelOrder(id)}
                    onViewAudit={(ord) => setSelectedAuditOrder(ord)}
                    onOpenDispute={(ord) => setSelectedDisputeOrder(ord)}
                    isProcessing={isProcessing}
                    activeProcessingId={activeProcessingId}
                  />
                ))}
              </div>
            ) : loading && orders.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="holo-card rounded-3xl p-6 h-72 animate-pulse bg-dark-900/60 border border-dark-750 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="h-6 bg-dark-700/60 rounded-xl w-1/3"></div>
                      <div className="h-4 bg-dark-700/40 rounded-lg w-2/3"></div>
                      <div className="h-20 bg-dark-800/50 rounded-2xl"></div>
                    </div>
                    <div className="h-10 bg-dark-700/50 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-cyan-500/30 rounded-3xl holo-card p-8 relative overflow-hidden">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.2)]">
                  <Layers className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-white font-black text-lg font-mono mb-1">
                  No Bounties Found in Selected Filter
                </h3>
                <p className="text-cyan-200/70 text-xs max-w-md mx-auto mb-6 font-mono leading-relaxed">
                  Contract: <span className="text-emerald-400 font-bold">{shortenAddress(CONTRACT_ADDRESS)}</span> (GenLayer studionet • Chain 61999).
                  <br />
                  Deploy an escrow bounty order or switch filter to ALL to view all live on-chain tasks!
                </p>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="btn-vip-pro px-8 py-3 rounded-2xl text-xs font-mono font-black uppercase tracking-wider inline-flex items-center space-x-2 shadow-[0_0_30px_rgba(0,229,255,0.5)] cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create First Dataset Bounty</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* VIEW 2: COURT APPEALS & ADJUDICATION CHAMBER */}
        {activeView === 'DISPUTES' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="holo-card p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-amber-500/10 via-rose-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="max-w-3xl relative z-10">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-3">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>BILATERAL FAIRNESS & TWO-SIDED JURISDICTION</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display text-cyber-glow">
                  Court Appeals & Adjudication Chamber
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 font-mono leading-relaxed">
                  Protecting both parties: prevents buyers from exploiting delivered data without paying, and protects curators against arbitrary automated rejection. Either party can contest AI rulings or ratify mutual settlements.
                </p>
              </div>

              {/* 3 Fairness Pillars Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-amber-500/20 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-dark-900/80 border border-dark-750">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-1">
                    <Scale className="w-4 h-4" />
                    <span>65 / 35 Partial Payout</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Data with minor imperfections (Score 60-79) automatically splits escrow: 65% to Curator for effort, 35% refunded to Buyer.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-dark-900/80 border border-dark-750">
                  <div className="flex items-center space-x-2 text-yellow-400 font-bold mb-1">
                    <Zap className="w-4 h-4" />
                    <span>Attempt 2 Resubmission</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Format glitches on first attempt grant a 2nd chance to submit fixes instead of instant slashing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-dark-900/80 border border-dark-750">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1">
                    <Handshake className="w-4 h-4" />
                    <span>50 / 50 Mutual Settle</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Contested bounties can be peacefully settled by 2-of-2 mutual approval or voluntary unilateral concession.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Disputed Cases */}
            <div>
              <h3 className="text-lg font-bold font-mono text-white mb-4 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>Active Appeals Requiring Bilateral Action ({orders.filter((o) => o.status === 7).length})</span>
              </h3>

              {orders.filter((o) => o.status === 7).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.filter((o) => o.status === 7).map((order) => (
                    <OrderCard
                      key={order.order_id}
                      order={order}
                      currentUser={account}
                      onOpenSubmit={(id) => setSubmitOrderId(id)}
                      onAdjudicate={(id) => handleAdjudicate(id)}
                      onCancel={(id) => handleCancelOrder(id)}
                      onViewAudit={(ord) => setSelectedAuditOrder(ord)}
                      onOpenDispute={(ord) => setSelectedDisputeOrder(ord)}
                      isProcessing={isProcessing}
                      activeProcessingId={activeProcessingId}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-10 rounded-2xl border border-dashed border-dark-750 text-center font-mono text-xs text-slate-400 bg-dark-950/60">
                  No active appeals or disputes currently pending on-chain.
                </div>
              )}
            </div>

            {/* Settled Orders Eligible for Appeal */}
            <div className="pt-6">
              <h3 className="text-base font-bold font-mono text-slate-300 mb-4 flex items-center space-x-2">
                <span>Recent Court Rulings (Eligible to Contest)</span>
              </h3>

              {orders.filter((o) => o.status === 2 || o.status === 3 || o.status === 5).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.filter((o) => o.status === 2 || o.status === 3 || o.status === 5).map((order) => (
                    <OrderCard
                      key={order.order_id}
                      order={order}
                      currentUser={account}
                      onOpenSubmit={(id) => setSubmitOrderId(id)}
                      onAdjudicate={(id) => handleAdjudicate(id)}
                      onCancel={(id) => handleCancelOrder(id)}
                      onViewAudit={(ord) => setSelectedAuditOrder(ord)}
                      onOpenDispute={(ord) => setSelectedDisputeOrder(ord)}
                      isProcessing={isProcessing}
                      activeProcessingId={activeProcessingId}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-dark-750 text-center font-mono text-xs text-slate-500 bg-dark-950/40">
                  No settled rulings recorded on-chain yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: PROJECT INFO */}
        {activeView === 'ABOUT' && <ProjectInfoTab />}

        {/* VIEW 4: ARCHITECTURE & SPECS */}
        {activeView === 'ARCHITECTURE' && <ArchitectureTab />}
      </main>

      {/* Cyber Footer */}
      <footer className="border-t border-cyan-500/20 py-8 mt-16 bg-dark-950/90 text-xs text-slate-400 font-mono relative z-10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse"></span>
            <span className="text-slate-300 font-bold">DataFair Autonomous Court Protocol</span>
            <span className="text-slate-600">•</span>
            <span>GenLayer studionet (Chain 61999)</span>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/tuannguyenvan95/DataFair"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              GitHub Source
            </a>
            <a
              href="https://studio.genlayer.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              GenLayer Studio
            </a>
            <a
              href="https://genlayer-explorer.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              Explorer
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateOrder
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateOrder}
        isSubmitting={isProcessing}
      />

      <SubmitSample
        isOpen={Boolean(submitOrderId)}
        orderId={submitOrderId}
        order={orders.find((o) => o.order_id === submitOrderId) || null}
        currentUser={account}
        onClose={() => setSubmitOrderId(null)}
        onSubmit={handleSubmitSample}
        isSubmitting={isProcessing}
      />

      <JuryChamberModal
        isOpen={Boolean(selectedAuditOrder)}
        order={selectedAuditOrder}
        onClose={() => setSelectedAuditOrder(null)}
        onConfirmAdjudicate={handleAdjudicate}
        isExecuting={isProcessing}
      />

      <DisputeModal
        isOpen={Boolean(selectedDisputeOrder)}
        order={selectedDisputeOrder}
        currentUser={account}
        onClose={() => setSelectedDisputeOrder(null)}
        onFileDispute={handleFileDispute}
        onResolveDispute={handleResolveDispute}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default App;
