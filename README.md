# 🛡️ DataFair: Autonomous AI Training Dataset Escrow & Quality Adjudication

> **Track:** Agentic Economy Infrastructure / Future of Work / Subjective Consensus  
> **Target Network:** GenLayer Studio Network (**studionet** — Chain ID `61999` / `0xF1EF`)  
> **Contract Address:** [`0x00A7e5110E97bF301Ec58B919af85Ab82C3599cB`](https://genlayer-explorer.vercel.app/address/0x00A7e5110E97bF301Ec58B919af85Ab82C3599cB)  
> **Deployment Platform:** [GenLayer Studio](https://studio.genlayer.com)  
> **GitHub Repository:** [https://github.com/tuannguyenvan95/DataFair](https://github.com/tuannguyenvan95/DataFair)  
> **Live App (Vercel):** [https://datafair-genlayer.vercel.app](https://datafair-genlayer.vercel.app)  
> **Explorer:** [GenLayer Explorer](https://genlayer-explorer.vercel.app/address/0x00A7e5110E97bF301Ec58B919af85Ab82C3599cB)

---

## 🎯 The One-Line Pitch

> **"DataFair CHẾT nếu không có GenLayer"**: Smart contract truyền thống (Solidity) hoàn toàn bất lực trong việc mở đọc file JSONL/CSV để thẩm định chất lượng ngữ nghĩa và lọc dữ liệu rác trước khi giải ngân. GenLayer cho phép hợp đồng thông minh trực tiếp fetch dataset on-chain qua `gl.nondet.web.render` và triệu tập Bồi thẩm đoàn AI validators đạt đồng thuận ngữ nghĩa (`gl.vm.run_nondet`) để phân xử tự động.

---

## 📖 Bối Cảnh & Vấn Đề Thực Tế (The Problem)

Trong nền kinh tế Agentic, các **AI Trainer Agent** và **Data Curator Agent** liên tục mua bán dữ liệu để huấn luyện và fine-tune mô hình (dataset đối thoại, dữ liệu y khoa gán nhãn, bộ code benchmark).

Thực trạng bế tắc:
1. **Bên mua (Model Trainer):** Sợ trả tiền trước nhưng nhận về dữ liệu rác, hallucination, copy-paste trùng lặp, hoặc format không đúng cam kết.
2. **Bên bán (Data Curator):** Sợ gửi link dataset công khai trước thì bên mua sẽ tải về dùng chùa rồi quỵt tiền.
3. **Solidity & Oracle truyền thống bó tay:** Chỉ lưu được file hash (keccak256/IPFS CID), không thể "đọc hiểu" nội dung, không thể kiểm tra tính hợp lệ của schema, và không thể đánh giá độ sâu tri thức.

---

## ⚡ Giải Pháp Của DataFair Trên GenLayer

DataFair biến GenLayer thành một **Tòa án Dữ liệu AI (Autonomous Data Court)** phi tập trung:

1. **Khóa Escrow Bounties:** Bên mua khởi tạo đơn hàng, khóa tiền đặt cọc (GEN) vào contract, đặc tả yêu cầu chất lượng (định dạng JSONL, số dòng tối thiểu, schema bắt buộc, chủ đề tri thức).
2. **Nộp Sample Deliverable:** Bên bán cung cấp liên kết công khai chứa dataset mẫu (GitHub Raw, Gist, hoặc Hugging Face dataset preview).
3. **Thẩm định Chất lượng On-Chain (On-Chain AI Quality Jury):**
   - Intelligent Contract gọi `gl.nondet.web.render` để tải trực tiếp nội dung dataset mẫu on-chain không cần qua trung gian.
   - LLM Juror thẩm định:
     - **Schema & Structure (0–100):** Cú pháp JSONL có hợp lệ? Đủ key cam kết không?
     - **Semantic Richness & Diversity (0–100):** Tri thức có chiều sâu không? Có bị lặp từ hoặc spam hallucination không?
   - Bồi thẩm đoàn AI đa node đạt đồng thuận qua `gl.vm.run_nondet` so sánh **Verdict** (`DATA_QUALIFIED` hoặc `DATA_REJECTED`).
4. **Tự động Giải ngân / Hoàn tiền:**
   - **DATA_QUALIFIED:** Tiền escrow tự động giải ngân thẳng về ví bên bán.
   - **DATA_REJECTED:** Tiền escrow tự động hoàn trả 100% về ví bên mua kèm lý do và bảng điểm minh bạch on-chain.

---

## 🏗️ Kiến Trúc Dự Án (Project Architecture)

```
DataFair/
├── contracts/
│   └── contract.py            # Intelligent Contract GenVM Python
├── tests/
│   ├── conftest.py            # Fixtures gltest với bare-dict sim_installMocks
│   └── test_datafair.py       # Unit tests: Qualified, Rejected, Cancelled
├── frontend/
│   ├── package.json           # React 18 + Vite + TS + TailwindCSS + genlayer-js
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── config/genlayer.ts # studionet client setup & network switcher
│   │   ├── components/
│   │   │   ├── Navbar.tsx     # MetaMask connect, GEN balance, studionet badge
│   │   │   ├── StatsBar.tsx   # Thống kê Escrow locked & settled on-chain
│   │   │   ├── CreateOrder.tsx# Form khóa GEN escrow và tạo rubric
│   │   │   ├── OrderCard.tsx  # Quản lý order, action buttons
│   │   │   ├── SubmitSample.tsx # Provider nộp URL deliverable
│   │   │   └── QualityModal.tsx # Bảng điểm thẩm định chi tiết của Bồi thẩm đoàn AI
│   │   └── App.tsx
│   └── README.md
└── scripts/
    └── deploy/
        └── deploy_info.json   # Thông số triển khai mạng studionet
```

---

## 🛡️ Tuân Thủ Nghiêm Ngặt 7 Quy Tắc Cốt Lõi GenLayer

- ✅ **Line 1 Magic Comment:** `# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }`
- ✅ **No Alias Import:** `from genlayer import *` duy nhất.
- ✅ **Single Contract Class:** Lớp chính là `class Contract(gl.Contract)`.
- ✅ **Không reassign TreeMap/DynArray:** `__init__` chỉ gán giá trị nguyên thủy, để GenVM tự khởi tạo map rỗng.
- ✅ **No Bare int / No float:** Dùng `bigint` cho số dư escrow tiền tệ, `u8`..`u256` cho điểm số/counter.
- ✅ **Storage Structs:** `@allow_storage @dataclass class DatasetOrder`.
- ✅ **Semantic Consensus:** `gl.vm.run_nondet(leader_fn, validator_fn)` chỉ so sánh `mine["verdict"] == leader["verdict"]`, bỏ qua khác biệt văn phong ở trường `reason`.
- ✅ **Native Transfer:** Dùng `gl.get_contract_at(recipient).emit_transfer(value=u256(escrow_val))`.

---

## 🚀 Hướng Dẫn Triển Khai (Deploy lên studionet)

### 1. Triển khai Smart Contract trên GenLayer Studio
1. Truy cập [GenLayer Studio Contracts](https://studio.genlayer.com/contracts).
2. Tạo file mới `DataFair.py` và dán toàn bộ nội dung từ [contracts/contract.py](contracts/contract.py).
3. Mở tab **Run & Debug**:
   - Chọn tài khoản có số dư GEN từ dropdown **Accounts**.
   - Bấm **Deploy**.
4. Sau khi transaction hoàn tất, bấm vào hash giao dịch để kiểm tra `Result: SUCCESS` (không chỉ dừng lại ở `Status: FINALIZED`).
5. Copy địa chỉ contract vừa deploy (ví dụ `0x...`).

### 2. Cấu hình Frontend
Tạo file `frontend/.env`:
```env
VITE_CONTRACT_ADDRESS=0x<DIA_CHI_CONTRACT_DA_DEPLOY>
```

### 3. Chạy Frontend Web3 dApp
```bash
cd frontend
npm install
npm run dev
```
Mở trình duyệt tại `http://localhost:3000`.

### 4. Kết nối Ví & Ký Giao dịch
- Bấm **Connect MetaMask**. Ứng dụng sẽ tự động gọi `wallet_switchEthereumChain` sang mạng **GenLayer Studio Network** (`chainId: 61999`).
- **Lưu ý nạp GEN (Rule R24):** Nếu số dư ví của bạn là 0, mở tab **Accounts** trên [GenLayer Studio](https://studio.genlayer.com) và chuyển một lượng GEN sang địa chỉ MetaMask của bạn.

---

## 🧪 Chạy Bộ Kiểm Thử (Tests)

DataFair đi kèm bộ test toàn diện với `gltest`:
```bash
gltest --network studionet tests/test_datafair.py
```
Test suite kiểm tra:
1. `test_datafair_end_to_end_qualified`: Luồng chuẩn nộp dataset đạt chuẩn -> Giải ngân cho Provider.
2. `test_datafair_adjudication_rejected`: Luồng nộp dữ liệu spam/malformed -> Hoàn tiền cho Buyer.
3. `test_datafair_cancel_order`: Buyer hủy order khi chưa có deliverable -> Hoàn cọc an toàn.

---

## 🏆 Điểm Nhấn Khi Pitch

1. **Giải quyết bài toán sống còn của AI Agent Economy:** Dữ liệu là nhiên liệu của AI, nhưng thị trường dữ liệu phi tập trung thiếu vắng cơ chế thẩm định khách quan. DataFair lấp đầy khoảng trống này.
2. **Tận dụng tối đa sức mạnh GenLayer:** Kết hợp hoàn hảo cả 3 đặc tính duy nhất của GenLayer: Nondeterminism, On-chain Web Scraping, và Optimistic Democracy AI Consensus.
3. **Bảo vệ toàn diện hai chiều:** Buyer không sợ mất tiền oan cho dữ liệu rác; Provider không sợ bị quỵt tiền khi đã cung cấp dataset chất lượng.
