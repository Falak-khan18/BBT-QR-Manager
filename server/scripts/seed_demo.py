#!/usr/bin/env python3
"""
Create demo login + sample QR codes (safe to run multiple times).

Docker:
  docker compose exec server python scripts/seed_demo.py

Local (from server/, venv active, DATABASE_URL set):
  python scripts/seed_demo.py
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.db.session import SessionLocal  # noqa: E402
from app.schemas.auth import RegisterRequest  # noqa: E402
from app.schemas.qr import QRCreate  # noqa: E402
from app.services import qr_service, user_service  # noqa: E402

DEMO_EMAIL = "bbt-demo@example.com"
DEMO_PASSWORD = "DemoPass123"


def main() -> None:
    db = SessionLocal()
    try:
        user = user_service.get_user_by_email(db, DEMO_EMAIL)
        if user is None:
            user = user_service.create_user(
                db,
                RegisterRequest(email=DEMO_EMAIL, password=DEMO_PASSWORD),
            )
            print(f"Created user: {DEMO_EMAIL} / {DEMO_PASSWORD}")
        else:
            print(f"User already exists: {DEMO_EMAIL}")

        existing = qr_service.list_qrs_for_owner(db, user.id)
        samples = [
            ("Spring landing page", "https://example.com"),
            ("Product docs", "https://developer.mozilla.org/en-US/"),
        ]
        existing_titles = {r.title for r in existing}
        created_any = False
        for title, url in samples:
            if title in existing_titles:
                continue
            row = qr_service.create_qr(
                db,
                user.id,
                QRCreate(title=title, destination_url=url),
            )
            created_any = True
            print(f"QR '{title}' short_code={row.short_code}")
            print(f"  Scan URL: {row.redirect_url}")
            print(f"  Destination (editable): {row.destination_url}")

        if not created_any:
            print("Demo QR titles already present:")
            for row in existing[:10]:
                print(f"  - {row.short_code}: {row.redirect_url}")

        print("\nLog in at http://localhost:3000/login with the demo account to see QR previews.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
