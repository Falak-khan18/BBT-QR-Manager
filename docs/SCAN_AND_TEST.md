# Scanning & testing the QR flow

## Demo account & sample data

After the stack is up (`docker compose up -d`), load demo rows:

```bash
docker compose exec server python scripts/seed_demo.py
```

- **Email:** `bbt-demo@example.com`  
- **Password:** `DemoPass123`  

This creates two QR codes that redirect to public HTTPS URLs. Open **http://localhost:3000/login**, sign in, open **Dashboard**, click a row — you should see the **QR pattern** in the preview panel.

## Scanning from your phone

Your phone **cannot** open `http://localhost:8000` on your laptop.

1. Find your PC’s LAN IP (e.g. `192.168.1.10`).
2. Set **both**:
   - `REDIRECT_BASE_URL=http://192.168.1.10:8000`
   - `NEXT_PUBLIC_REDIRECT_BASE_URL=http://192.168.1.10:8000`  
   Rebuild the **client** image after changing `NEXT_PUBLIC_*`, or use `npm run dev` with `.env.local`.
3. Open the dashboard on your laptop; the QR encodes `http://192.168.1.10:8000/r/{code}`.
4. On the phone (same Wi‑Fi), use the **camera** or a QR app to scan — you should hit your API then the **destination** URL.

**Alternative:** expose port 8000 with **ngrok** (or similar) and put that HTTPS URL in both variables above.

## Dynamic QR check (assignment flow)

1. Note where the QR sends you (destination A).  
2. In the dashboard, **Edit** that QR and change **only** the destination URL → save.  
3. Scan **again** — you should land on destination B.  
4. The **QR image** in the UI should look the **same** (same encoded redirect link).

## Rebuild UI after auth/password fixes

If icons or JS changes don’t show up, rebuild the frontend container:

```bash
docker compose build client && docker compose up -d client
```
