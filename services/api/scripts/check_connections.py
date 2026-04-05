"""
Smoke-test third-party connectivity using services/api/.env.

Run from the api directory (so .env is found by Settings):

    cd services/api
    .\\.venv\\Scripts\\activate   # Windows
    pip install -r requirements.txt
    python scripts/check_connections.py
"""

from __future__ import annotations

import sys
from pathlib import Path

# Import app settings with cwd = services/api
_API_ROOT = Path(__file__).resolve().parent.parent
if str(_API_ROOT) not in sys.path:
    sys.path.insert(0, str(_API_ROOT))


def _neo4j_hints(uri: str, ssl_related: bool = False) -> None:
    host = uri.split("://", 1)[-1].split("/")[0] if "://" in uri else uri
    print("       Hints:")
    print("       • Aura console → copy “Neo4j URI” (usually neo4j+s://….databases.neo4j.io).")
    print("       • Do not use https:// or the browser console URL as NEO4J_URI.")
    if uri.startswith("bolt://") and "databases.neo4j.io" in uri:
        print("       • For Aura, prefer neo4j+s:// or bolt+s:// (TLS), not plain bolt://.")
    print(f"       • Check VPN/firewall allows outbound to {host}:7687.")
    print("       • Confirm the instance is running (Aura free tier can pause).")
    if ssl_related:
        print(
            "       • SSL on Windows: this script sets SSL_CERT_FILE to certifi’s CA bundle "
            "(neo4j+s forbids passing ssl_context to the driver). Run `pip install -U certifi`."
        )
        print("       • Try another network (phone hotspot) if antivirus or corporate SSL inspection blocks Bolt.")


def main() -> int:
    import os

    import httpx
    from groq import Groq
    from neo4j import GraphDatabase

    # pydantic-settings loads `.env` relative to cwd
    os.chdir(_API_ROOT)
    from app.config import get_settings

    get_settings.cache_clear()
    settings = get_settings()
    ok_all = True

    # --- Groq ---
    if not settings.groq_api_key.strip():
        print("Groq: SKIP (GROQ_API_KEY empty)")
    else:
        try:
            client = Groq(api_key=settings.groq_api_key)
            r = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": "Reply with exactly: ok"}],
                max_tokens=8,
            )
            text = (r.choices[0].message.content or "").strip()
            print(f"Groq: OK (sample reply: {text[:80]!r})")
        except Exception as e:
            ok_all = False
            print(f"Groq: FAIL — {e}")

    # --- Deepgram (management API; validates key) ---
    if not settings.deepgram_api_key.strip():
        print("Deepgram: SKIP (DEEPGRAM_API_KEY empty)")
    else:
        try:
            resp = httpx.get(
                "https://api.deepgram.com/v1/projects",
                headers={"Authorization": f"Token {settings.deepgram_api_key}"},
                timeout=15.0,
            )
            if resp.status_code == 200:
                print("Deepgram: OK (GET /v1/projects returned 200)")
            else:
                ok_all = False
                print(f"Deepgram: FAIL — HTTP {resp.status_code} {resp.text[:200]}")
        except Exception as e:
            ok_all = False
            print(f"Deepgram: FAIL — {e}")

    # --- Neo4j ---
    neo4j_uri = (
        settings.neo4j_uri.strip().strip('"').strip("'").rstrip("/")
    )
    neo4j_user = settings.neo4j_user.strip().strip('"').strip("'")
    neo4j_password = settings.neo4j_password.strip().strip('"').strip("'")

    if not (neo4j_uri and neo4j_user and neo4j_password):
        print("Neo4j: SKIP (NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD incomplete)")
    else:
        # Driver rule: ssl_context is only for neo4j:// / bolt://. Aura uses neo4j+s / bolt+s — TLS is in the URI;
        # point OpenSSL at certifi CAs instead (helps Windows verify Aura’s cert).
        import certifi

        os.environ.setdefault("SSL_CERT_FILE", certifi.where())

        def _try_neo4j(uri: str) -> None:
            d = GraphDatabase.driver(uri, auth=(neo4j_user, neo4j_password))
            try:
                d.verify_connectivity()
            finally:
                d.close()

        def _is_ssl_error(msg: str) -> bool:
            m = msg.lower()
            return any(
                x in m
                for x in (
                    "ssl",
                    "certificate",
                    "tls",
                    "operation not permitted",
                    "encrypted connection",
                    "ssl_context",
                )
            )

        try:
            _try_neo4j(neo4j_uri)
            print("Neo4j: OK (verify_connectivity succeeded)")
        except Exception as e:
            err = str(e)
            # Aura: routing (neo4j+s) can fail on some networks; direct Bolt+TLS often works.
            if "routing" in err.lower() and neo4j_uri.startswith(
                ("neo4j+s://", "neo4j+ssc://")
            ):
                rest = neo4j_uri.split("://", 1)[1]
                bolt_uri = (
                    "bolt+ssc://" + rest
                    if neo4j_uri.startswith("neo4j+ssc://")
                    else "bolt+s://" + rest
                )
                try:
                    _try_neo4j(bolt_uri)
                    print(
                        "Neo4j: OK (via bolt+s fallback — you can set NEO4J_URI=bolt+s://… "
                        "in .env if that stays more reliable; see README Neo4j troubleshooting)"
                    )
                except Exception as e2:
                    ok_all = False
                    e2s = str(e2)
                    print(f"Neo4j: FAIL — {err}")
                    print(f"       (retry with bolt+s also failed: {e2s})")
                    _neo4j_hints(neo4j_uri, ssl_related=_is_ssl_error(err + e2s))
            else:
                ok_all = False
                print(f"Neo4j: FAIL — {e}")
                _neo4j_hints(neo4j_uri, ssl_related=_is_ssl_error(err))

    return 0 if ok_all else 1


if __name__ == "__main__":
    raise SystemExit(main())
