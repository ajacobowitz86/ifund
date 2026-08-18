#!/usr/bin/env bash
set -euo pipefail

# Seed local env from the example, then copy injected Cloud Agent secrets
# into .env.local so Next.js can expose NEXT_PUBLIC_ values to the browser.
# Does not print secret values.

if [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

python3 - <<'PY'
import os
import pathlib
import re

path = pathlib.Path(".env.local")
text = path.read_text() if path.exists() else ""
key = os.environ.get("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "").strip()
if not key:
    raise SystemExit(0)

line = f"NEXT_PUBLIC_GOOGLE_MAPS_API_KEY={key}"
updated, count = re.subn(
    r"^NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=.*$",
    line,
    text,
    flags=re.M,
)
if count == 0:
    updated = (text.rstrip() + "\n" + line + "\n") if text.strip() else (line + "\n")
path.write_text(updated)
PY
