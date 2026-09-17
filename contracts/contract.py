# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
from dataclasses import dataclass
import json


def _addr_str(addr: Address) -> str:
    """Safely format an Address instance into a hex string."""
    try:
        return addr.as_hex
    except Exception:
        return str(addr)


@allow_storage
@dataclass
class DatasetOrder:
    """Storage struct representing an AI dataset procurement order."""
    order_id: str
    buyer: Address
    provider: Address
    escrow_amount: bigint
    spec_requirements: str         # Required format, schema, domain topics, quality rubric
    sample_dataset_url: str        # Live raw dataset sample URL (e.g. GitHub raw, Hugging Face sample)
    status: u8                     # 0: OPEN, 1: IN_REVIEW, 2: RESOLVED_PAID, 3: RESOLVED_REJECTED, 4: CANCELLED
    verdict: str                   # "PENDING", "DATA_QUALIFIED", "DATA_REJECTED"
    reason: str                    # Detailed quality assessment and schema verification breakdown
    confidence: u8                 # 0 - 100: Validator consensus confidence
    schema_score: u8               # 0 - 100: Formatting and schema structural alignment
    quality_score: u8              # 0 - 100: Semantic richness and factual validity
    created_at_block: u256


class Contract(gl.Contract):
    """
    DataFair: Autonomous AI Training Dataset Escrow & Quality Adjudication
    Target Network: studionet (Chain ID: 61999)
    """
    orders: TreeMap[str, DatasetOrder]
    order_ids: DynArray[str]
    total_escrow_locked: bigint
    total_orders_settled: u32
    order_counter: u64

    def __init__(self):
        # GenVM auto-initializes TreeMap and DynArray. Do NOT reassign in __init__.
        self.total_escrow_locked = bigint(0)
        self.total_orders_settled = u32(0)
        self.order_counter = u64(0)

    @gl.public.write.payable
    def create_order(self, spec_requirements: str) -> str:
        """
        Buyer locks GEN bounty in escrow and sets dataset quality requirements.
        """
        escrow = bigint(gl.message.value)
        if escrow <= bigint(0):
            raise gl.UserError("Dataset escrow budget must be greater than 0 GEN.")

        if not spec_requirements or len(spec_requirements.strip()) == 0:
            raise gl.UserError("Dataset specification requirements cannot be empty.")

        self.order_counter = self.order_counter + u64(1)
        order_id = f"data-{int(self.order_counter)}"
        current_block = u256(int(self.order_counter))
        empty_provider = Address("0x0000000000000000000000000000000000000000")

        new_order = DatasetOrder(
            order_id=order_id,
            buyer=gl.message.sender_address,
            provider=empty_provider,
            escrow_amount=escrow,
            spec_requirements=spec_requirements.strip(),
            sample_dataset_url="",
            status=u8(0),  # OPEN
            verdict="PENDING",
            reason="Awaiting data provider deliverable sample submission.",
            confidence=u8(0),
            schema_score=u8(0),
            quality_score=u8(0),
            created_at_block=current_block,
        )

        self.orders[order_id] = new_order
        self.order_ids.append(order_id)
        self.total_escrow_locked = self.total_escrow_locked + escrow

        return order_id

    @gl.public.write
    def submit_dataset_sample(self, order_id: str, sample_dataset_url: str) -> None:
        """
        Data Provider claims order and provides raw sample URL for verification.
        """
        if order_id not in self.orders:
            raise gl.UserError(f"Order {order_id} does not exist.")

        order = self.orders[order_id]
        if order.status != u8(0):
            raise gl.UserError(f"Order {order_id} is not open for submission.")

        clean_url = sample_dataset_url.strip()
        if not clean_url.startswith("http"):
            raise gl.UserError("Valid live dataset URL is required.")

        order.provider = gl.message.sender_address
        order.sample_dataset_url = clean_url
        order.status = u8(1)  # IN_REVIEW
        order.reason = "Dataset sample submitted. Ready for on-chain AI quality adjudication."

    @gl.public.write
    def adjudicate_dataset(self, order_id: str) -> None:
        """
        On-chain AI Jury fetches dataset content directly on-chain via gl.nondet.web.render,
        evaluates schema adherence, semantic quality, and synthetic spam presence,
        and reaches consensus on the VERDICT (DATA_QUALIFIED or DATA_REJECTED).
        """
        if order_id not in self.orders:
            raise gl.UserError(f"Order {order_id} does not exist.")

        order = self.orders[order_id]
        if order.status != u8(1):
            raise gl.UserError(f"Order {order_id} is not awaiting review.")

        data_url = order.sample_dataset_url
        requirements = order.spec_requirements

        def leader_fn():
            raw_content = ""
            fetch_error = False
            try:
                raw_content = gl.nondet.web.render(data_url, mode="text")
            except Exception:
                fetch_error = True

            if fetch_error or not raw_content or len(raw_content.strip()) == 0:
                return {
                    "verdict": "DATA_REJECTED",
                    "confidence": 100,
                    "schema_score": 0,
                    "quality_score": 0,
                    "reason": "Could not access or render dataset URL. Data missing or 404."
                }

            # Truncate content to respect GenVM context window
            truncated_data = raw_content[:7000] if len(raw_content) > 7000 else raw_content

            prompt = f"""You are the Chief Data Quality Auditor of the DataFair Internet Court on GenLayer.
Evaluate whether the submitted AI Dataset sample satisfies the Buyer's Technical and Domain Requirements.

BUYER SPECIFICATIONS:
{requirements}

RAW DATASET SAMPLE EXTRACTED ON-CHAIN:
{truncated_data}

EVALUATION RUBRIC:
1. Schema & Structure (0-100): Are the fields properly formatted (JSONL, CSV, keys intact, parseable)?
2. Semantic Richness & Diversity (0-100): Is the data informative, genuine, coherent, and free of trivial spam or repetitive hallucinations?
3. Verdict:
   - Output "DATA_QUALIFIED" if Schema Score >= 70 and Quality Score >= 70.
   - Output "DATA_REJECTED" if formatting fails, records are malformed, or content is low-grade spam.

Respond ONLY with valid JSON without markdown formatting or code blocks:
{{
  "verdict": "DATA_QUALIFIED"|"DATA_REJECTED",
  "confidence": <0-100>,
  "schema_score": <0-100>,
  "quality_score": <0-100>,
  "reason": "<rigorous assessment of schema adherence and semantic validity>"
}}"""

            raw_res = gl.nondet.exec_prompt(prompt, response_format="json")

            parsed = None
            if isinstance(raw_res, dict):
                parsed = raw_res
            elif isinstance(raw_res, str):
                cleaned = raw_res.strip()
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:]
                elif cleaned.startswith("```"):
                    cleaned = cleaned[3:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]
                cleaned = cleaned.strip()
                try:
                    parsed = json.loads(cleaned)
                except Exception:
                    pass

            if not parsed or "verdict" not in parsed:
                return {
                    "verdict": "DATA_REJECTED",
                    "confidence": 50,
                    "schema_score": 0,
                    "quality_score": 0,
                    "reason": "Consensus failed to parse validator output."
                }

            verdict_str = str(parsed.get("verdict", "")).strip().upper()
            if verdict_str not in ("DATA_QUALIFIED", "DATA_REJECTED"):
                verdict_str = "DATA_REJECTED"

            def _clean_num(val, default):
                try:
                    s = int(val)
                    return max(0, min(100, s))
                except Exception:
                    return default

            conf_val = _clean_num(parsed.get("confidence"), 85)
            schema_val = _clean_num(parsed.get("schema_score"), 80 if verdict_str == "DATA_QUALIFIED" else 30)
            qual_val = _clean_num(parsed.get("quality_score"), 80 if verdict_str == "DATA_QUALIFIED" else 30)
            reason_str = str(parsed.get("reason", "Consensus audit concluded."))

            return {
                "verdict": verdict_str,
                "confidence": conf_val,
                "schema_score": schema_val,
                "quality_score": qual_val,
                "reason": reason_str
            }

        def validator_fn(leader_res) -> bool:
            if not isinstance(leader_res, gl.vm.Return):
                return False
            leader = leader_res.calldata
            if not isinstance(leader, dict) or "verdict" not in leader:
                return False

            mine = leader_fn()
            # Semantic Consensus: Compare VERDICT ONLY!
            return mine["verdict"] == leader["verdict"]

        adjudication_res = gl.vm.run_nondet(leader_fn, validator_fn)

        verdict = adjudication_res["verdict"]
        reason = adjudication_res["reason"]
        confidence = u8(int(adjudication_res["confidence"]))
        schema_score = u8(int(adjudication_res["schema_score"]))
        quality_score = u8(int(adjudication_res["quality_score"]))

        order.verdict = verdict
        order.reason = reason
        order.confidence = confidence
        order.schema_score = schema_score
        order.quality_score = quality_score

        escrow_val = order.escrow_amount
        self.total_escrow_locked = self.total_escrow_locked - escrow_val
        self.total_orders_settled = self.total_orders_settled + u32(1)

        # Automatic payout or refund
        if verdict == "DATA_QUALIFIED":
            order.status = u8(2)  # RESOLVED_PAID
            gl.get_contract_at(order.provider).emit_transfer(value=u256(escrow_val))
        else:
            order.status = u8(3)  # RESOLVED_REJECTED
            gl.get_contract_at(order.buyer).emit_transfer(value=u256(escrow_val))

    @gl.public.write
    def cancel_order(self, order_id: str) -> None:
        """
        Buyer can cancel an OPEN order before any provider submits a deliverable.
        """
        if order_id not in self.orders:
            raise gl.UserError(f"Order {order_id} does not exist.")

        order = self.orders[order_id]
        if gl.message.sender_address != order.buyer:
            raise gl.UserError("Only the buyer can cancel this order.")

        if order.status != u8(0):
            raise gl.UserError("Cannot cancel: Dataset has already been submitted.")

        order.status = u8(4)  # CANCELLED
        order.verdict = "CANCELLED"
        order.reason = "Order cancelled by buyer prior to deliverable submission."

        escrow_val = order.escrow_amount
        self.total_escrow_locked = self.total_escrow_locked - escrow_val

        gl.get_contract_at(order.buyer).emit_transfer(value=u256(escrow_val))

    # --- Read-only Views ---

    @gl.public.view
    def get_order(self, order_id: str) -> str:
        """Returns JSON serialized representation of an order."""
        if order_id not in self.orders:
            raise gl.UserError(f"Order {order_id} does not exist.")

        o = self.orders[order_id]
        data = {
            "order_id": o.order_id,
            "buyer": _addr_str(o.buyer),
            "provider": _addr_str(o.provider),
            "escrow_amount": str(o.escrow_amount),
            "spec_requirements": o.spec_requirements,
            "sample_dataset_url": o.sample_dataset_url,
            "status": int(o.status),
            "verdict": o.verdict,
            "reason": o.reason,
            "confidence": int(o.confidence),
            "schema_score": int(o.schema_score),
            "quality_score": int(o.quality_score),
            "created_at_block": str(o.created_at_block),
        }
        return json.dumps(data)

    @gl.public.view
    def get_order_count(self) -> int:
        return len(self.order_ids)

    @gl.public.view
    def get_order_id_by_index(self, idx: int) -> str:
        if idx < 0 or idx >= len(self.order_ids):
            raise gl.UserError("Index out of bounds.")
        return self.order_ids[idx]

    @gl.public.view
    def get_stats(self) -> str:
        data = {
            "total_orders": len(self.order_ids),
            "total_escrow_locked": str(self.total_escrow_locked),
            "total_orders_settled": int(self.total_orders_settled),
        }
        return json.dumps(data)
