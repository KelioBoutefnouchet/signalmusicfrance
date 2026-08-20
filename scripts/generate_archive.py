#!/usr/bin/env python3
"""Ajoute au manifeste les images d'archive qui n'y figurent pas encore."""

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_DIR = ROOT / "assets" / "archive"
MANIFEST = ROOT / "data" / "archive.json"
WEB_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}


def slugify(filename: str) -> str:
    stem = unicodedata.normalize("NFKD", Path(filename).stem)
    stem = stem.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", "-", stem).strip("-") or "image"


def unique_id(filename: str, used_ids: set[str]) -> str:
    base = slugify(filename)
    candidate = base
    number = 2
    while candidate in used_ids:
        candidate = f"{base}-{number}"
        number += 1
    return candidate


def main() -> None:
    entries = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else []
    if not isinstance(entries, list):
        raise SystemExit(f"Le manifeste {MANIFEST} doit contenir une liste JSON.")

    referenced = {entry.get("image") for entry in entries if isinstance(entry, dict)}
    used_ids = {entry.get("id") for entry in entries if isinstance(entry, dict) and entry.get("id")}
    added = 0

    for image in sorted(ARCHIVE_DIR.iterdir(), key=lambda item: item.name.casefold()):
        if not image.is_file() or image.suffix.lower() not in WEB_EXTENSIONS:
            continue
        web_path = f"assets/archive/{image.name}"
        if web_path in referenced:
            continue
        entry_id = unique_id(image.name, used_ids)
        entries.append({
            "id": entry_id,
            "image": web_path,
            "type": "",
            "artiste": "",
            "titre": "",
            "date": "",
            "credit": "",
            "url": "",
            "comportement": "lightbox",
            "span": 1,
        })
        referenced.add(web_path)
        used_ids.add(entry_id)
        added += 1

    MANIFEST.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Archive actualisée : {added} nouvelle(s) image(s), {len(entries)} entrée(s) au total.")


if __name__ == "__main__":
    main()
