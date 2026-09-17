import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { OrderCard } from './components/OrderCard';
import { CreateOrder } from './components/CreateOrder';
import { SubmitSample } from './components/SubmitSample';
import { JuryChamberModal } from './components/JuryChamberModal';
import { DatasetPlayground } from './components/DatasetPlayground';
import { ArchitectureTab } from './components/ArchitectureTab';
import { CyberBackground } from './components/CyberBackground';
import {
  DatasetOrderData,
  ContractStats,
  parseGenToWei,
} from './utils/helpers';
import {
  CONTRACT_ADDRESS,
  getGenLayerClient,
  switchToStudionet,
} from './config/genlayer';

// Initial rich sample bounties for immediate interactive testing
const SAMPLE_INITIAL_ORDERS: DatasetOrderData[] = [
  {
    order_id: 'data-1',
    buyer: '0x32A4F2e2764a7812586a111a8B8E2A74d0811eE5',
    provider: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
    escrow_amount: '3000000000000000000', // 3 GEN
    spec_requirements: 'Format: JSONL. Medical question-answering dataset. Each entry must have "question", "context", and "evidence_based_answer". Zero hallucinations, strict PubMed guideline citations.',
    sample_dataset_url: 'https://raw.githubusercontent.com/datasets/medical-qa/main/sample.jsonl',
    status: 2, // RESOLVED_PAID
    verdict: 'DATA_QUALIFIED',
    reason: 'Verified 50 sample clinical QA pairs. 100% compliant with JSONL syntax. References established PubMed guidelines without repetitive hallucinated tokens.',
    confidence: 96,
    schema_score: 95,
    quality_score: 92,
    created_at_block: '124',
  },
  {
    order_id: 'data-2',
    buyer: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    provider: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    escrow_amount: '1500000000000000000', // 1.5 GEN
    spec_requirements: 'Python smart contract auditing benchmark. JSONL with code snippets and labeled vulnerability tags (reentrancy, access control). Must follow PEP8 formatting.',
    sample_dataset_url: 'https://raw.githubusercontent.com/tatsu-lab/stanford_alpaca/main/alpaca_data.json',
    status: 1, // IN_REVIEW
    verdict: 'PENDING',
    reason: 'Dataset sample submitted. Ready for on-chain AI quality adjudication.',
    confidence: 0,
    schema_score: 0,
    quality_score: 0,
    created_at_block: '128',
  },
  {
    order_id: 'data-3',
    buyer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    provider: '0x0000000000000000000000000000000000000000',
    escrow_amount: '2000000000000000000', // 2 GEN
    spec_requirements: 'Financial time-series sentiment analysis. JSONL format with stock ticker, date, news headline, and sentiment score (-1 to 1). At least 5 non-trivial market events.',
    sample_dataset_url: '',
    status: 0, // OPEN
    verdict: 'PENDING',
    reason: 'Awaiting data provider deliverable sample submission.',
    confidence: 0,
    schema_score: 0,
    quality_score: 0,
    created_at_block: '135',
  },
];

export function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Active View Tab
  const [activeView, setActiveView] = useState<'TERMINAL' | 'PLAYGROUND' | 'ARCHITECTURE'>('TERMINAL');

  const [orders, setOrders] = useState<DatasetOrderData[]>(SAMPLE_INITIAL_ORDERS);
  const [stats, setStats] = useState<ContractStats | null>({
    total_orders: 3,
    total_escrow_locked: '3500000000000000000',
    total_orders_settled: 1,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'IN_REVIEW' | 'SETTLED'>('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitOrderId, setSubmitOrderId] = useState<string | null>(null);
  const [selectedAuditOrder, setSelectedAuditOrder] = useState<DatasetOrderData | null>(null);

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
      setBalance(balanceBigInt.toString());
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
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
        setAccount(accounts[0]);
        await fetchBalance(accounts[0]);
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setTxError(err?.message || 'Failed to connect MetaMask.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Fetch Contract Data
  const loadContractData = useCallback(async () => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return;
    }

    setLoading(true);
    try {
      const client = getGenLayerClient();

      const rawStats = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: 'get_stats',
        args: [],
      });
      if (rawStats) {
        setStats(JSON.parse(rawStats as string));
      }

      const count = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: 'get_order_count',
        args: [],
      });

      const orderCount = Number(count);
      const loadedOrders: DatasetOrderData[] = [];

      for (let i = 0; i < orderCount; i++) {
        const orderId = await client.readContract({
          address: CONTRACT_ADDRESS,
          functionName: 'get_order_id_by_index',
          args: [i],
        });

        const rawOrder = await client.readContract({
          address: CONTRACT_ADDRESS,
          functionName: 'get_order',
          args: [orderId],
        });

        if (rawOrder) {
          loadedOrders.push(JSON.parse(rawOrder as string));
        }
      }

      if (loadedOrders.length > 0) {
        setOrders(loadedOrders.reverse());
      }
    } catch (err) {
      console.warn('Could not read from deployed contract, using demo records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
        } else {
          setAccount(null);
          setBalance('0');
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    loadContractData();
  }, [fetchBalance, loadContractData]);

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
        await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'create_order',
          args: [specRequirements],
          value: weiValue,
        });
        await loadContractData();
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

    setIsProcessing(true);
    setActiveProcessingId(orderId);
    setConsensusMessage('Recording deliverable URL on-chain...');
    setTxError(null);

    try {
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        const client = getGenLayerClient(account as `0x${string}`);
        await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'submit_dataset_sample',
          args: [orderId, sampleUrl],
          value: 0n,
        });
        await loadContractData();
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
        await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'adjudicate_dataset',
          args: [orderId],
          value: 0n,
        });
        await loadContractData();
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
        await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'cancel_order',
          args: [orderId],
          value: 0n,
        });
        await loadContractData();
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

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (filter === 'OPEN') return o.status === 0;
    if (filter === 'IN_REVIEW') return o.status === 1;
    if (filter === 'SETTLED') return o.status === 2 || o.status === 3 || o.status === 4;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 overflow-x-hidden">
      {/* Background Neural Particle Mesh */}
      <CyberBackground />

      {/* Top Ticker Marquee HUD */}
      <div className="bg-dark-950/90 border-b border-cyan-500/20 py-1.5 px-4 text-[11px] font-mono text-cyan-300/80 flex items-center justify-between z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="flex items-center space-x-1 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>OPTIMISTIC DEMOCRACY LIVE</span>
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-300">
            4 LLM Nodes in Active Consensus Pool (Llama-3.3, Mistral, Claude, DeepSeek)
          </span>
          <span className="text-slate-600 hidden lg:inline">|</span>
          <span className="hidden lg:inline text-cyan-400">
            gl.nondet.web.render() Live Stream
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Finality: ~3.2s</span>
        </div>
      </div>

      {/* Navigation Bar with View Switcher */}
      <Navbar
        account={account}
        balance={balance}
        isConnecting={isConnecting}
        onConnect={handleConnect}
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

        {/* VIEW 1: TERMINAL (DEFAULT) */}
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
                    AI Trainer Agents lock GEN bounties. Data Curators submit live deliverables. GenLayer's multi-validator AI bồi thẩm đoàn directly fetches files on-chain, audits JSONL schema & semantic depth, and executes instant escrow settlement.
                  </p>
                </div>

                {/* VIP PRO Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 self-start lg:self-center flex-shrink-0">
                  <button
                    onClick={() => setActiveView('PLAYGROUND')}
                    className="btn-cyber-outline px-6 py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2.5 cursor-pointer"
                  >
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>Pre-Flight Inspector</span>
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

            {/* Filter Tabs with Active Glow */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-8">
              <div className="flex items-center space-x-2.5">
                {(['ALL', 'OPEN', 'IN_REVIEW', 'SETTLED'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                      filter === f
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono text-cyan-300/60 font-bold">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'bounty' : 'bounties'} listed
              </span>
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
                    isProcessing={isProcessing}
                    activeProcessingId={activeProcessingId}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-cyan-500/20 rounded-3xl holo-card">
                <Layers className="w-14 h-14 text-cyan-400/40 mx-auto mb-3 animate-pulse" />
                <p className="text-white font-bold text-base font-mono">No bounties in this category</p>
                <p className="text-slate-400 text-xs mt-1 font-mono">
                  Create a new bounty to initiate autonomous dataset escrow.
                </p>
              </div>
            )}
          </>
        )}

        {/* VIEW 2: PRE-FLIGHT PLAYGROUND */}
        {activeView === 'PLAYGROUND' && <DatasetPlayground />}

        {/* VIEW 3: ARCHITECTURE & SPECS */}
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
    </div>
  );
}

export default App;
