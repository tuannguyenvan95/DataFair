import json
import pytest

# Sample mock dataset content
MOCK_JSONL_VALID = """{"instruction": "Summarize quantum computing.", "response": "Quantum computing harnesses superposition and entanglement to compute exponentially faster for certain problems."}
{"instruction": "Define reinforcement learning.", "response": "Reinforcement learning is an area of machine learning concerned with how intelligent agents ought to take actions in an environment to maximize cumulative reward."}
{"instruction": "What is transformer architecture?", "response": "The transformer architecture relies entirely on an attention mechanism to draw global dependencies between input and output."}"""

MOCK_JURY_QUALIFIED_RESULT = {
    "verdict": "DATA_QUALIFIED",
    "confidence": 95,
    "schema_score": 90,
    "quality_score": 92,
    "reason": "All 3 sample lines follow valid JSONL syntax. Content has high semantic diversity with zero repetitive spam."
}

MOCK_JURY_REJECTED_RESULT = {
    "verdict": "DATA_REJECTED",
    "confidence": 90,
    "schema_score": 30,
    "quality_score": 25,
    "reason": "Malformed JSONL structure and repetitive hallucinated text failing quality rubric."
}


def install_mocks(client, jury_res=MOCK_JURY_QUALIFIED_RESULT, web_content=MOCK_JSONL_VALID, web_status=200):
    """
    Installs LLM and Web mocks into GenLayer simulator using a bare dictionary (Rule R17).
    """
    client.provider.make_request(
        method="sim_installMocks",
        params={
            "llm_mocks": {
                ".*": json.dumps(jury_res)
            },
            "web_mocks": {
                ".*": {
                    "status": web_status,
                    "body": web_content
                }
            }
        }
    )
