"""MultiSurfaceTools: SOS + ReportaVNZLA behind one allow-listed tool interface."""

from __future__ import annotations

import json

from bot.config import REPORTAVNZLA_SPEC_PATH, SPEC_PATH
from bot.surfcall_tools import (
    PUBLIC_READS,
    REPORTAVNZLA_READS,
    MultiSurfaceTools,
    SurfcallTools,
)


def _multi() -> MultiSurfaceTools:
    return MultiSurfaceTools(
        [
            SurfcallTools(SPEC_PATH, mode="recorded", allowlist=PUBLIC_READS),
            SurfcallTools(
                REPORTAVNZLA_SPEC_PATH, mode="recorded", allowlist=REPORTAVNZLA_READS
            ),
        ]
    )


def test_union_exposes_both_registries() -> None:
    names = {t["name"] for t in _multi().tools_for_llm()}
    assert {"searchPersons", "getPersonStats"} <= names  # SOS
    assert {"searchPersonas", "listRecursos", "getStats"} <= names  # ReportaVNZLA


def test_call_routes_to_the_owning_surface() -> None:
    out = json.loads(_multi().call("getStats", {}))
    assert "data" in out or "status" in out


def test_unlisted_tool_is_refused_never_raised() -> None:
    assert "no permitida" in _multi().call("deletePerson", {})
