# CyberFlow 🛡️
> An interactive visual cybersecurity learning platform for students and beginners.

## 🌐 Live Demo
**[View Live Platform →](https://cyberflow.vercel.app)**

---

## 📌 About The Project

CyberFlow was built to solve a real problem in cybersecurity education — most learning resources are text-heavy, theory-focused, and difficult for beginners to engage with.

CyberFlow makes cybersecurity **visual, interactive, and accessible** through simulations, animated labs, and guided career roadmaps — all accessible through a browser with no installation required.

---

## ✨ What's Inside

### 🎓 Learning Modules
| Module | Description |
|---|---|
| Cybersecurity Fundamentals | CIA Triad, Threat Actors, Attack Types, Security Basics |
| Cybersecurity Domains | 8 domains with learning paths, tools, certs, and career guides |
| Career Roadmaps | SOC Analyst, Pentester, Security Engineer, Bug Bounty Hunter |

### ⚗️ Interactive Labs
| Lab | Description |
|---|---|
| Network Visualization Lab | Draggable network diagram with animated packet flow simulation |
| SQL Injection Simulator | Live query visualizer with 3-level attack challenges |
| Phishing Simulator | Clickable email analysis with fake login page simulation |

### 🧠 Quiz System
- 5 topic-based quizzes — Fundamentals, Domains, Network, SQL, Phishing
- Countdown timer per question
- Instant feedback with explanations after every answer
- Scores saved permanently to Firebase

### 🔐 Authentication & Progress
- Email and password login via Firebase Authentication
- All routes protected — unauthenticated users redirected to login
- Quiz scores and completed modules saved to Firestore
- Dashboard shows real-time progress statistics

---

## 🛠️ Built With

| Category | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Network Diagrams | React Flow |
| Icons | Lucide React |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| Hosting | Vercel |
| Version Control | Git + GitHub |

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- npm v9+
- A Firebase project with Authentication and Firestore enabled

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Mehul11-4/cyberflow.git
cd cyberflow
```

**2. Install dependencies**
```bash
npm install
```

**3. Create your `.env` file in the root folder**
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket_here
VITE_FIREBASE_MESSAGING_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

**4. Start the development server**
```bash
npm run dev
```

**5. Open in browser**
http://localhost:5173

---

## 📁 Folder Structure
cyberflow/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx      # Page wrapper with sidebar
│   │   │   └── Sidebar.jsx         # Navigation sidebar
│   │   └── ui/
│   │       ├── StatCard.jsx        # Dashboard stat cards
│   │       ├── TopicCard.jsx       # Recommended topic cards
│   │       ├── DomainCard.jsx      # Domain grid cards
│   │       ├── CIATriad.jsx        # CIA Triad visual diagram
│   │       └── NetworkNode.jsx     # Custom React Flow node
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state
│   ├── data/
│   │   ├── fundamentals.js         # Module 1 content
│   │   ├── domains.js              # Module 2 content
│   │   ├── roadmaps.js             # Module 3 content
│   │   ├── networkLab.js           # Module 4 content
│   │   ├── sqlLab.js               # Module 5 content
│   │   ├── phishingLab.js          # Module 6 content
│   │   └── quizData.js             # Module 7 questions
│   ├── firebase/
│   │   └── config.js               # Firebase initialization
│   ├── hooks/
│   │   └── useUserProgress.js      # Firestore read/write hook
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── Dashboard/
│   │   ├── Fundamentals/
│   │   ├── Domains/
│   │   ├── Roadmaps/
│   │   ├── Labs/
│   │   └── Quizzes/
│   ├── App.jsx                     # Route definitions
│   ├── main.jsx                    # App entry point
│   └── index.css                   # Global styles
├── .env                            # Secret keys (not in Git)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js

---

## 🔒 Security Practices

CyberFlow was built with security as a core requirement throughout development.

**Authentication**
- Firebase Authentication handles all identity management
- No custom password storage or hashing implemented
- Passwords never touched by application code

**Authorization**
- Every page is a protected route
- Unauthenticated users are automatically redirected to login
- Firestore rules enforce per-user data isolation

**Secure Configuration**
- All Firebase API keys stored in `.env` environment variables
- `.env` listed in `.gitignore` — never committed to version control
- Vercel environment variables used for production deployment

**Educational Simulations**
- SQL injection and phishing labs are front-end simulations only
- No real database vulnerabilities exist in the platform
- Attack demonstrations use controlled, client-side logic

**OWASP Awareness**
- Input validation applied throughout
- No user input executed as code
- No sensitive data stored in localStorage

---

## 🗺️ Roadmap

**✅ Phase 1 — MVP (Complete)**
- 7 learning modules
- 3 interactive labs
- Quiz system with Firebase persistence
- User authentication and protected routes
- Live deployment on Vercel

**🔜 Phase 2 — Planned**
- Achievement badges and certificates
- User profile page with full progress history
- Community discussion features

**🔜 Phase 3 — Future**
- CTF challenge integration
- Multiplayer lab scenarios
- Malware Analysis Simulator
- Incident Response Simulator
- SOC Operations Simulator

---

## 👨‍💻 Author

**Mehul Khandelwal**
Cybersecurity Learning Platform — Academic Project

---

## 📄 License
This project was created for academic and educational purposes.