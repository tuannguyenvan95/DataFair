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
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { OrderCard } from './components/OrderCard';
import { CreateOrder } from './components/CreateOrder';
import { SubmitSample } from './components/SubmitSample';
import { JuryChamberModal } from './components/JuryChamberModal';
import { DatasetPlayground } from './components/DatasetPlayground';
import { ArchitectureTab } from './components/ArchitectureTab';
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
    <div className="min-h-screen flex flex-col bg-cyber-grid">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Consensus Banner */}
        {isProcessing && consensusMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 border border-cyber-blue/50 shadow-2xl flex items-center space-x-3.5 animate-pulse neon-border-cyan">
            <Loader2 className="w-5 h-5 text-cyber-blue animate-spin flex-shrink-0" />
            <div className="flex-1 text-xs sm:text-sm text-slate-200 font-mono">
              <span className="font-bold text-cyber-blue">GENLAYER JURY ACTIVE: </span>
              {consensusMessage}
            </div>
          </div>
        )}

        {/* Error Banner */}
        {txError && (
          <div className="mb-6 p-4 rounded-2xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs flex items-center justify-between font-mono">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
            <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-xs font-mono font-bold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SYNTHETIC JURISDICTION FOR AI AGENT DATASETS</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
                    Autonomous Training Dataset Escrow & Quality Court
                  </h1>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    AI Trainer Agents lock GEN bounties. Data Curators submit live deliverables. GenLayer's multi-validator AI bồi thẩm đoàn directly fetches files on-chain, audits JSONL schema & semantic depth, and executes instant escrow settlement.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveView('PLAYGROUND')}
                    className="px-5 py-3 rounded-2xl bg-dark-800 hover:bg-dark-750 text-slate-200 border border-dark-700 text-xs font-mono font-bold transition flex items-center space-x-2"
                  >
                    <Code2 className="w-4 h-4 text-cyber-blue" />
                    <span>Pre-Flight Inspector</span>
                  </button>

                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-600 via-cyber-blue to-accent-cyan hover:opacity-90 text-dark-950 font-black text-xs shadow-xl shadow-cyan-500/20 transition flex items-center space-x-2 font-mono tracking-wide"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Dataset Bounty</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics HUD */}
            <StatsBar stats={stats} loading={loading} />

            {/* Filter Tabs */}
            <div className="flex items-center justify-between border-b border-dark-750 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                {(['ALL', 'OPEN', 'IN_REVIEW', 'SETTLED'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                      filter === f
                        ? 'bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono text-slate-500">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'bounty' : 'bounties'} listed
              </span>
            </div>

            {/* Bounties Grid */}
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
              <div className="py-20 text-center border border-dashed border-dark-750 rounded-3xl glass-panel">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-bold text-sm font-mono">No bounties in this category</p>
                <p className="text-slate-500 text-xs mt-1 font-mono">
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
      <footer className="border-t border-dark-800 py-6 mt-16 bg-dark-950/80 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse"></span>
            <span>DataFair Autonomous Court Protocol • Powered by GenLayer Optimistic Democracy</span>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/tuannguyenvan95/DataFair"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyber-blue transition"
            >
              GitHub Source
            </a>
            <a
              href="https://studio.genlayer.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyber-blue transition"
            >
              GenLayer Studio
            </a>
            <a
              href="https://genlayer-explorer.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyber-blue transition"
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
