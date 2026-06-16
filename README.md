# 🧠 LeetCode Solution Explainer


\

> An AI-powered DSA tutor that explains *your own* LeetCode solutions — instantly.

🔗 **Live Demo:** https://leetcode-solution-explainer-403884323000.asia-southeast1.run.app/

🎥 Built for: Google's 5-Day AI Agents Intensive — Day 1 Assignment (AI Studio → Cloud Run)

---

## 💡 Why this exists

Most students can copy-paste a LeetCode solution from YouTube but can't explain it in an interview. This tool closes that gap — paste your code, and an AI tutor breaks down the **intuition**, **pattern**, **complexity**, and a **memory trick**, so you actually retain it instead of memorizing it.

---

## ✨ Features

* 📝 Paste any solution (Python / Java / C++ / JavaScript)
* ⚡ One-click sample solutions (Two Sum, Reverse Linked List, 3Sum, Longest Substring)
* 🤖 Powered by Gemini 2.0 Flash
* 🃏 Structured explanation cards:

  * 💡 **Intuition** — plain-English explanation
  * 🧩 **Pattern Used** — e.g. Hash Map, Sliding Window, BFS
  * ⏱️ **Time & Space Complexity** — Big O with reasoning
  * 🧠 **How to Remember This** — a retention trick
* 📋 Copy button on every card
* 🌗 Light / Dark / Auto theme
* 📱 Fully responsive design

---

## 🛠️ Tech Stack

| Layer      | Tech                         |
| ---------- | ---------------------------- |
| Frontend   | React + TypeScript + Vite    |
| AI         | Gemini 2.0 Flash             |
| Styling    | CSS                          |
| Deployment | Google AI Studio + Cloud Run |
| Runtime    | Node.js                      |

---

## 🖼️ Preview

<img src="C:\Users\riyas\OneDrive\Documents\leetcode-solution-explainer\leetcode-solution-explainer\screenshot.png" alt="View of website">

---

## 🚀 Live Demo

Visit the deployed application:

https://leetcode-solution-explainer-403884323000.asia-southeast1.run.app/

---

## 💻 Run Locally

```bash
git clone https://github.com/<your-username>/leetcode-solution-explainer.git

cd leetcode-solution-explainer

npm install

npm run dev
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Then open:

```text
http://localhost:5173
```

---

## ☁️ Deployment

Built and deployed using **Google AI Studio's Deploy to Cloud Run integration**.

Cloud Run automatically handles:

* Containerization
* HTTPS
* Autoscaling
* Scale-to-zero when idle

No manual infrastructure setup required.

---

## 🗺️ Roadmap

* [ ] Save explanation history
* [ ] Export explanation cards as images
* [ ] Multi-language support
* [ ] User authentication
* [ ] Shareable explanation links

---

## 🙏 Acknowledgements

Built as part of Google's **5-Day AI Agents Intensive (Vibe Coding Course)**.

Special thanks to:

* Google AI Studio
* Gemini 2.0 Flash
* Google Cloud Run

---

⭐ If this project helped you understand DSA concepts better, consider giving it a star!
