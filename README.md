# Rajesh P. — Portfolio + Egg Hunt

Personal portfolio site for Rajesh P., founder of [CodePup AI](https://codepup.ai), product leader, and builder with 15+ years of experience across Zynga, Flipkart, and Walmart.

Also includes a fully interactive Easter-themed browser game: **Egg Hunt**.

---

## Portfolio (`/`)

A minimal, fast-loading personal site covering:

- **Hero** — intro, background, and links to work
- **Stats** — career highlights at a glance
- **Work** — bento grid showcasing CodePup AI, Zynga, Flipkart, and Walmart
- **Teaching** — AI coding course for non-technical PMs and founders
- **Contact** — email and LinkedIn

---

## Egg Hunt (`/egg-hunt`)

An Easter-themed pattern puzzle game. One of nine animated eggs secretly follows a hidden rule — the others try to fool you.

### How it works

- 9 eggs appear on screen, each changing color, pattern, text, symbols, and rotation independently every 0.5–1.5 seconds
- One **real egg** always obeys a hidden rule (e.g. "never changes color", "always has stripes")
- The other 8 **fake eggs** mimic the rule most of the time but eventually break it
- You have **3 attempts** to click the real egg
- Score is based on how fast you identify it: **< 10s = Excellent**, **10–25s = Good**, **25s+ = Slow**

### Rules (12 total, 4 randomly generated each game)

| Type | Examples |
|---|---|
| Static | Never has text · Never rotates · Always solid color · Always has a symbol |
| Parameterised | Always has [random pattern] · Always shows [random symbol] · Always stays in [warm/cool/purple] tones · Never has [random pattern] |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| State | Zustand |
| Routing | React Router v6 |

---

## Running locally

```bash
npm install
npm run dev
```

- Portfolio → `http://localhost:5175/`
- Egg Hunt → `http://localhost:5175/egg-hunt`

```bash
npm run build      # production build
npm run type-check # TypeScript check
```
