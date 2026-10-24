# BLR Spin the Wheel

Kiosk hub for **BLR Transit Play Zone**. Guests spin the wheel; whichever game lands is opened in-app so they can play immediately.

## Ports

| App | Folder | URL |
| --- | --- | --- |
| Spin the Wheel | `SPIN THE WHEEL` | http://127.0.0.1:5180/ |
| Namma Karnataka | `NAMMA KARNATAKA CHALLENGE` | http://127.0.0.1:5173/ |
| Flip & Match | `FLIP AND MATCH` | http://127.0.0.1:5174/ |
| Emoji Challenge | `BLR EMOJI CHALLENGE` | http://127.0.0.1:5175/ |

## Run everything (recommended)

From the `Blr Airport Project` folder:

```bash
node start-all.mjs
```

Then open **http://127.0.0.1:5180/** — spin, tap **PLAY**, and the selected game loads with autostart.

## Run wheel only

```bash
cd "SPIN THE WHEEL"
npm install
npm run dev
```

Games must also be running on the ports above, or **PLAY** will show “Game unavailable”.

Edit launch URLs in `public/config.json` if needed.
