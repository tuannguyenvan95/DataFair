import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Scale,
  Sparkles,
  ExternalLink,
  Code2,
  Lock,
  FileCheck,
  CheckCircle,
  Layers,
  ArrowRight,
  Zap,
  Globe,
  Handshake,
  AlertTriangle,
} from 'lucide-react';
import { CONTRACT_ADDRESS } from '../config/genlayer';

export const ProjectInfoTab: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn font-sans pb-12">
      {/* Hero Brand Identity Banner */}
      <div className="holo-card p-8 sm:p-10 rounded-3xl border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="flex items-start sm:items-center space-x-5">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-80 blur-sm group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-dark-900 border border-cyan-400/50 overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                <img
                  src="/logo.jpg"
                  alt="DataFair Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold mb-2 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>GENLAYER STUDIONET DAPP</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display text-cyber-glow">
                DataFair Protocol
              </h2>
              <p className="text-xs sm:text-sm text-cyan-200/80 font-mono mt-1">
                Autonomous AI Training Dataset Escrow & Quality Adjudication Court
              </p>
            </div>
          </div>

          {/* Quick On-Chain Metadata Pill */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <a
              href={`https://genlayer-explorer.vercel.app/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="btn-cyber-outline px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center space-x-2"
            >
              <span>On-Chain Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <a
              href="https://github.com/tuannguyenvan95/DataFair"
              target="_blank"
              rel="noreferrer"
              className="btn-vip-pro px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              <span>GitHub Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Live Contract Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-dark-900/90 border border-cyan-500/20 p-4 rounded-2xl shadow-inner">
          <span className="text-slate-400 text-[11px] block mb-1 uppercase font-bold">Network & Chain ID</span>
          <span className="text-white font-bold text-sm block">GenLayer studionet</span>
          <span className="text-cyan-400 text-[11px] mt-0.5 block">Chain 61999 (0xF1EF)</span>
        </div>

        <div className="bg-dark-900/90 border border-cyan-500/20 p-4 rounded-2xl shadow-inner">
          <span className="text-slate-400 text-[11px] block mb-1 uppercase font-bold">Contract Address</span>
          <span className="text-emerald-400 font-bold text-xs truncate block" title={CONTRACT_ADDRESS}>
            {CONTRACT_ADDRESS}
          </span>
          <span className="text-slate-500 text-[10px] mt-0.5 block">Status: Verified & Live</span>
        </div>

        <div className="bg-dark-900/90 border border-cyan-500/20 p-4 rounded-2xl shadow-inner">
          <span className="text-slate-400 text-[11px] block mb-1 uppercase font-bold">Settlement Currency</span>
          <span className="text-amber-400 font-bold text-sm block">Native GEN Token</span>
          <span className="text-slate-500 text-[11px] mt-0.5 block">Zero Oracle Slippage</span>
        </div>

        <div className="bg-dark-900/90 border border-cyan-500/20 p-4 rounded-2xl shadow-inner">
          <span className="text-slate-400 text-[11px] block mb-1 uppercase font-bold">Hackathon Track</span>
          <span className="text-purple-300 font-bold text-xs block">Agentic Economy</span>
          <span className="text-slate-400 text-[11px] mt-0.5 block">Subjective Consensus</span>
        </div>
      </div>

      {/* Section 1: The Problem & Unique Hook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="holo-card p-6 sm:p-8 rounded-3xl border border-rose-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Vấn Đề Thực Tế (The Real Dilemma)</h3>
              <p className="text-xs text-slate-400 font-mono">Bế tắc trong giao dịch dữ liệu AI giữa 2 bên</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-dark-750">
              <span className="text-rose-400 font-bold block mb-1">1. Nỗi sợ của Bên Mua (Model Trainer):</span>
              Sợ trả tiền trước nhưng nhận về file rác, dữ liệu hallucination, copy-paste trùng lặp, hoặc format sai cấu trúc JSONL cam kết.
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-dark-750">
              <span className="text-amber-400 font-bold block mb-1">2. Nỗi sợ của Bên Bán (Data Curator):</span>
              Sợ gửi link dataset trước thì bên mua sẽ clone về huấn luyện xong rồi quỵt tiền, từ chối thanh toán.
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-dark-750">
              <span className="text-slate-400 font-bold block mb-1">3. Sự bất lực của Solidity & Oracle cũ:</span>
              Smart contract truyền thống chỉ so sánh được mã băm (hash keccak256/IPFS CID), hoàn toàn mù tịt không thể mở đọc file JSONL/CSV để kiểm tra nội dung.
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="holo-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Giải Pháp DataFair Trên GenLayer</h3>
              <p className="text-xs text-cyan-300 font-mono">Autonomous AI Court & Subjective Escrow</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-200 leading-relaxed font-mono">
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-cyan-500/20">
              <span className="text-cyan-300 font-bold block mb-1">✓ Live Web Fetching On-Chain:</span>
              Contract dùng <code>gl.nondet.web.render</code> trực tiếp kéo raw dataset mẫu từ URL về trên máy ảo GenVM mà không cần oracle trung gian.
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-emerald-500/20">
              <span className="text-emerald-400 font-bold block mb-1">✓ Multi-Validator AI Jury Consensus:</span>
              Bồi thẩm đoàn AI validators chạy multi-LLMs đồng thuận thẩm định cả cú pháp cấu trúc lẫn chiều sâu tri thức ngữ nghĩa.
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-purple-500/20">
              <span className="text-purple-300 font-bold block mb-1">✓ Two-Sided Fairness Protection:</span>
              Cơ chế thanh toán chia phần (65/35), cơ hội Retry sửa lỗi cú pháp lần 2, và phòng kháng cáo song phương giải quyết tranh chấp hòa bình.
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Two-Sided Protection Rules (Bảo vệ quyền lợi 2 bên) */}
      <div className="holo-card p-8 rounded-3xl border border-cyan-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <Handshake className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-xl font-bold text-white font-display">
              Cơ Chế Phán Xử Bảo Vệ Quyền Lợi Song Phương (Two-Sided Protection)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Học hỏi từ các mô hình Tòa án phi tập trung (DeliverableCourt, GrantAuditor)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer Rights */}
          <div className="p-5 rounded-2xl bg-dark-900/90 border border-dark-750">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm mb-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Quyền Lợi & Bảo Vệ Của Bên Mua (Trainer)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Kiểm định Schema bắt buộc:</strong> Đảm bảo dataset đủ các cột, tags, và đúng định dạng JSONL cam kết.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Quét sạch Spam & Hallucination:</strong> AI chấm điểm độ đa dạng tri thức (Semantic Diversity Score &ge; 80).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Hoàn tiền 100% khi vi phạm:</strong> Nếu dataset là rác hoặc score &lt; 60, hợp đồng hoàn trả 100% tiền đặt cọc.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Hủy đơn tự do:</strong> Khi chưa có Curator nào nhận việc nộp bài, Buyer có thể Cancel và rút tiền về ngay lập tức.</span>
              </li>
            </ul>
          </div>

          {/* Curator Rights */}
          <div className="p-5 rounded-2xl bg-dark-900/90 border border-dark-750">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm mb-3">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Quyền Lợi & Bảo Vệ Của Bên Bán (Curator)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Bảo đảm Tiền Khóa Sẵn (Escrow):</strong> Tiền thưởng được khóa trong contract trước khi giao hàng, không sợ Buyer quỵt tiền.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Chia phần 65/35 khi lỗi nhỏ:</strong> Dữ liệu đạt 60–79 điểm vẫn nhận 65% tiền công, không bị mất trắng.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Cơ hội Retry lần 2:</strong> Lỗi cú pháp dòng JSONL ở lần nộp 1 được cấp quyền nộp bản sửa thay vì bị slash phạt ngay.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Kháng Cáo Phán Quyết:</strong> Được quyền mở phiên tòa song phương (Dispute Chamber) để phân xử hòa giải 50/50.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Quy trình hoạt động (Execution Workflow) */}
      <div className="bg-dark-900/80 border border-dark-750 p-8 rounded-3xl">
        <h3 className="text-lg font-bold text-white font-display mb-6 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Quy Trình Hoạt Động Của DataFair (4 Bước Tự Động)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-750">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-2">
              01
            </div>
            <h4 className="font-bold text-white mb-1">Tạo Bounty Escrow</h4>
            <p className="text-slate-400 leading-relaxed">
              Trainer đặt cọc GEN qua hàm <code>create_order()</code>, nhập đặc tả tiêu chuẩn và rubrics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-750">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-2">
              02
            </div>
            <h4 className="font-bold text-white mb-1">Nộp Sample Dữ Liệu</h4>
            <p className="text-slate-400 leading-relaxed">
              Curator nộp link dataset mẫu qua hàm <code>submit_dataset_sample()</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-750">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-2">
              03
            </div>
            <h4 className="font-bold text-white mb-1">AI Phán Quyết On-Chain</h4>
            <p className="text-slate-400 leading-relaxed">
              Validators crawl data qua <code>gl.nondet.web.render</code> và chạy LLM consensus bằng <code>gl.vm.run_nondet</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-750">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">
              04
            </div>
            <h4 className="font-bold text-white mb-1">Thanh Toán / Phân Xử</h4>
            <p className="text-slate-400 leading-relaxed">
              GEN tự động giải ngân cho Curator, hoàn trả cho Buyer, hoặc mở phòng hòa giải song phương.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};