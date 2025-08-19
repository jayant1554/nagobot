# Nagobot

**AI negotiation chatbot for e‑commerce**

Live demo: [https://nagobot.lovable.app/](https://nagobot.lovable.app/)
Repository: [https://github.com/jayant1554/nagobot](https://github.com/jayant1554/nagobot)

---

## TL;DR

Nagobot is an AI-powered chatbot that negotiates product prices with customers in real time. It uses a backend negotiation engine (Qrok API) to make data-driven counteroffers that balance customer satisfaction and company margins. This project demonstrates frontend engineering, conversational UX design, and API integration for product-driven solutions.

---

## Key features

* Real-time conversational price negotiation
* Backend decisioning via **Qrok API** for intelligent counteroffers
* Clean, responsive UI built with **React + TypeScript** and **shadcn‑ui/Tailwind CSS**
* Fast dev/build workflow with **Vite**
* Optional integration points for Supabase (auth/data)

---

## Why it matters

Pricing is a product decision. Instead of static discounts, Nagobot turns pricing into an interactive experience that can:

* Improve conversion by engaging price-sensitive shoppers
* Protect margins through data-driven counteroffers
* Provide measurable business impact when integrated into seller flows

---

## My role

* Designed the negotiation conversation flows and UX
* Implemented the frontend UI using React + TypeScript
* Integrated the Qrok API backend for negotiation logic
* Connected optional data/auth via Supabase (configurable)

---

## Tech stack

* Frontend: React, TypeScript, Vite
* Styling/UI: Tailwind CSS, shadcn‑ui
* Backend decisioning: Qrok API
* Optional: Supabase for auth & persistent data
* Dev tooling: npm, Vite, ESLint/Prettier (if configured)

---

## Live demo

Open the live app: [https://nagobot.lovable.app/](https://nagobot.lovable.app/)

Include this link in any public post or demo so recruiters and stakeholders can interact directly.

---

## Quick start (local)

1. Clone the repo:

```bash
git clone https://github.com/jayant1554/nagobot.git
cd nagobot
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root (or set environment variables):

```env
# Qrok negotiation API
VITE_QROK_API_KEY=your_qrok_api_key
VITE_QROK_BASE_URL=https://api.qrok.example

# (Optional) Supabase
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Important:** Use client-prefixed env variable names (VITE\_...) so Vite exposes them to the browser. Never commit secrets to the repo. For demos, use ephemeral/test keys.

4. Run the dev server:

```bash
npm run dev
```

5. Open `http://localhost:5173` (or the URL printed in terminal) and try negotiating.

---

## Build & deploy

* Build for production:

```bash
npm run build
```

* Preview production build locally (optional):

```bash
npm run preview
```

* Deploy on any static hosting (Netlify, Vercel) or your preferred host. Make sure to set the `VITE_` env variables in the platform.

---

## Demo script & GIF plan (20–30s)

Use this exact script to record a short demo GIF/video to include in the README or LinkedIn post:

1. Show product listing -> click **Negotiate** (2–3s)
2. Customer: "Price too high — can you lower?" — show Nagobot offering a counteroffer (5–8s)
3. Customer counters; Nagobot computes and finalizes a fair price (8–10s)
4. Show a short console/network snippet of the API call to **Qrok API** (3–4s), caption: "Qrok API powers the negotiation logic".

Caption the final clip: **"20s demo — conversational negotiation + real-time decisioning"**

---

## README improvements you can add (suggested)

* Add `screenshots/` and a short GIF (`demo.gif`) in the repo root and reference them in README. Visuals increase recruiter engagement.
* Add a **Role & Learnings** section with 3 bullets describing your contributions and technical challenges.
* Add a **Simulated results**/metrics section if you run test scenarios (e.g., "simulated tests: average accepted price +X% vs baseline"). Be transparent if results are simulated.
* Add clear run instructions for using test API keys or mocks (if Qrok keys are sensitive).

---

## Notes on Qrok API integration

* Ensure the frontend only uses short-lived or limited-scope keys if the negotiation call is made from the browser. Prefer server-side proxying for production to hide sensitive keys. If a serverless proxy is used, document the endpoint and example request/response structure here.

Example (pseudo) network call (show this in the README if you want transparency for recruiters):

```js
// pseudo-example
fetch(`${import.meta.env.VITE_QROK_BASE_URL}/negotiate`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${import.meta.env.VITE_QROK_API_KEY}` },
  body: JSON.stringify({ productId, userOffer })
})
```

---

## How to demo to recruiters

* Start with the 20s GIF in the post.
* Offer a 1-minute live demo link or a short screenshare.
* Have a one-page PDF summary ready (problem, solution, tech, role, link) to share in DMs.

---

## Contribution

If you want to contribute or extend Nagobot, consider:

* Adding server-side proxying for Qrok API requests
* Improving negotiation strategy (A/B tests, reinforcement learning loop)
* Adding analytics to measure negotiation outcomes and conversion lift
* Mobile responsiveness and accessibility improvements

---

## Contact

Jayant Bisht — [jk913600@gmail.com](mailto:jk913600@gmail.com)
Repo: [https://github.com/jayant1554/nagobot](https://github.com/jayant1554/nagobot)
Live: [https://nagobot.lovable.app/](https://nagobot.lovable.app/)

---

## Credits

Built as a PWSkills (PhysicsWallah) project.
Inspired by real-world e-commerce pricing challenges.

---

## License

Add your preferred license (MIT recommended for open-source projects).

