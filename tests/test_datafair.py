import json
import pytest
from conftest import install_mocks, MOCK_JURY_QUALIFIED_RESULT, MOCK_JURY_REJECTED_RESULT, MOCK_JSONL_VALID


def test_datafair_end_to_end_qualified(client, accounts):
    """
    Test Complete Flow:
    1. Buyer creates order with escrow
    2. Provider submits live sample URL
    3. AI Jury adjudicates -> DATA_QUALIFIED -> Funds released to provider
    """
    buyer = accounts[0]
    provider = accounts[1]

    # Deploy contract
    contract = client.deploy_contract(
        contract_path="contracts/contract.py",
        account=buyer
    )

    escrow_wei = 5_000_000_000_000_000_000  # 5 GEN
    requirements = "JSONL format, instruction-tuning dataset on AI and Computer Science. At least 3 sample rows."

    # 1. Buyer creates order
    order_id = contract.connect(buyer).create_order(
        args=[requirements]
    ).transact(value=escrow_wei)

    assert order_id == "data-1"

    # Verify order state
    raw_order = contract.get_order(args=[order_id]).call()
    order_data = json.loads(raw_order)
    assert order_data["status"] == 0  # OPEN
    assert order_data["verdict"] == "PENDING"
    assert int(order_data["escrow_amount"]) == escrow_wei

    # 2. Provider claims order and submits dataset sample URL
    sample_url = "https://raw.githubusercontent.com/datasets/ai-instruct/main/sample.jsonl"
    contract.connect(provider).submit_dataset_sample(
        args=[order_id, sample_url]
    ).transact()

    raw_order = contract.get_order(args=[order_id]).call()
    order_data = json.loads(raw_order)
    assert order_data["status"] == 1  # IN_REVIEW
    assert order_data["sample_dataset_url"] == sample_url

    # 3. Install mocks and run AI Adjudication
    install_mocks(client, jury_res=MOCK_JURY_QUALIFIED_RESULT, web_content=MOCK_JSONL_VALID)

    contract.connect(buyer).adjudicate_dataset(
        args=[order_id]
    ).transact()

    raw_order = contract.get_order(args=[order_id]).call()
    order_data = json.loads(raw_order)

    assert order_data["status"] == 2  # RESOLVED_PAID
    assert order_data["verdict"] == "DATA_QUALIFIED"
    assert order_data["schema_score"] >= 70
    assert order_data["quality_score"] >= 70
    assert "JSONL" in order_data["reason"]

    # Verify contract stats
    raw_stats = contract.get_stats().call()
    stats = json.loads(raw_stats)
    assert stats["total_orders"] == 1
    assert stats["total_orders_settled"] == 1
    assert stats["total_escrow_locked"] == "0"


def test_datafair_adjudication_rejected(client, accounts):
    """
    Test Flow with Rejected Dataset:
    1. Buyer creates order with escrow
    2. Provider submits sample URL
    3. AI Jury finds spam/malformed data -> DATA_REJECTED -> Refunded to buyer
    """
    buyer = accounts[0]
    provider = accounts[1]

    contract = client.deploy_contract(
        contract_path="contracts/contract.py",
        account=buyer
    )

    escrow_wei = 2_000_000_000_000_000_000  # 2 GEN
    order_id = contract.connect(buyer).create_order(
        args=["Medical QA dataset, strictly verified"]
    ).transact(value=escrow_wei)

    contract.connect(provider).submit_dataset_sample(
        args=[order_id, "https://raw.githubusercontent.com/datasets/spam/sample.jsonl"]
    ).transact()

    # Install rejected mock
    install_mocks(client, jury_res=MOCK_JURY_REJECTED_RESULT, web_content="spam spam spam")

    contract.connect(buyer).adjudicate_dataset(
        args=[order_id]
    ).transact()

    raw_order = contract.get_order(args=[order_id]).call()
    order_data = json.loads(raw_order)

    assert order_data["status"] == 3  # RESOLVED_REJECTED
    assert order_data["verdict"] == "DATA_REJECTED"
    assert order_data["schema_score"] < 70


def test_datafair_cancel_order(client, accounts):
    """
    Test Cancellation Flow:
    1. Buyer creates order
    2. Buyer cancels order before any provider claims it
    3. Escrow is refunded and status set to CANCELLED
    """
    buyer = accounts[0]
    provider = accounts[1]

    contract = client.deploy_contract(
        contract_path="contracts/contract.py",
        account=buyer
    )

    escrow_wei = 1_000_000_000_000_000_000
    order_id = contract.connect(buyer).create_order(
        args=["Code benchmark dataset"]
    ).transact(value=escrow_wei)

    # Unauthorized account cannot cancel
    with pytest.raises(Exception):
        contract.connect(provider).cancel_order(args=[order_id]).transact()

    # Buyer cancels
    contract.connect(buyer).cancel_order(args=[order_id]).transact()

    raw_order = contract.get_order(args=[order_id]).call()
    order_data = json.loads(raw_order)
    assert order_data["status"] == 4  # CANCELLED
    assert order_data["verdict"] == "CANCELLED"
