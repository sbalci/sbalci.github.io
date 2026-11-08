#!/usr/bin/env python3
"""Regenerate the offline contact QR from the canonical vCard.

Install the build-only dependency with: python -m pip install segno==1.6.6
Run from any directory: python R-scripts/generate-contact-qr.py
The page has no runtime QR dependency or third-party QR service.
"""

from pathlib import Path

import segno


ROOT = Path(__file__).resolve().parents[1]
payload = (ROOT / "links" / "Serdar-Balci.vcf").read_bytes().decode("utf-8")
assert payload.startswith("BEGIN:VCARD\r\nVERSION:3.0\r\n")
assert payload.endswith("END:VCARD\r\n")
assert "orcid" not in payload.lower()

# UTF-8 ECI preserves the Turkish dotless i in Balcı. A four-module
# white quiet zone and opaque background keep both image formats scannable.
qr = segno.make(payload, error="m", encoding="utf-8", eci=True, boost_error=False)
for directory in (ROOT / "links", ROOT / "docs" / "links"):
    directory.mkdir(parents=True, exist_ok=True)
    qr.save(directory / "qr-vcard-offline.svg", scale=4, border=4,
            dark="#000", light="#fff", title="Offline contact QR for Serdar Balcı")
    qr.save(directory / "qr-vcard-offline.png", scale=10, border=4,
            dark="#000", light="#fff")

print(f"Offline vCard QR: version {qr.version}, error correction {qr.error}, "
      f"{len(payload.encode('utf-8'))} bytes")
