# CyberFlow — Academic Project Report

**Project Name:** CyberFlow
**Type:** Interactive Cybersecurity Learning Platform
**Developer:** Mehul Khandelwal
**Duration:** 60 Days
**Live URL:** https://cyberflow.vercel.app
**Repository:** https://github.com/Mehul11-4/cyberflow

---

## 1. Problem Statement

Cybersecurity education has a significant accessibility problem. The majority of available learning resources are:

- Heavily text-based with little to no visual explanation
- Designed for professionals rather than beginners
- Lacking interactive elements that help students understand abstract concepts
- Not providing structured guidance on how to enter the field professionally

Students attempting to learn concepts like SQL injection, network packet flow, or phishing attacks struggle because they cannot visualize what is actually happening. Reading about how a SQL injection works is fundamentally different from seeing the query being constructed and broken in real time.

---

## 2. Proposed Solution

CyberFlow is a web-based interactive learning platform that addresses these problems through:

**Visual Learning**
Every concept is presented with visual aids, animations, and interactive diagrams rather than walls of text.

**Hands-On Simulations**
Students interact with safe educational simulations of real attacks — SQL injection, phishing, and network intrusion — in a controlled environment that cannot cause real harm.

**Structured Guidance**
Career roadmaps provide step-by-step paths from zero knowledge to job-ready, including which skills to learn, in what order, and which certifications to pursue.

**Progress Tracking**
A quiz system and Firestore-backed progress tracking give students measurable goals and feedback on their learning.

---

## 3. Technical Architecture

### Frontend Architecture
CyberFlow uses a component-based React architecture built with Vite. The application is entirely client-side rendered with no custom backend server.
User Browser
↓
React Application (Vercel CDN)
↓
Firebase SDK
↓
Firebase Authentication + Firestore

### Why This Architecture
- No server costs — entirely free hosting
- Fast global delivery via Vercel's CDN
- Firebase handles authentication complexity securely
- Simple deployment — push to GitHub, Vercel auto-deploys

### Technology Decisions

| Technology | Reason For Choice |
|---|---|
| React | Component reusability, large ecosystem, industry standard |
| Vite | Fastest build tool for React in 2025 |
| Tailwind CSS | Rapid UI development without writing custom CSS |
| Framer Motion | Professional animations with minimal code |
| React Flow | Purpose-built for interactive node-based diagrams |
| Firebase | Free tier, no server required, secure by default |
| Vercel | Free hosting with automatic GitHub deployments |

---

## 4. Features Built

### Module 1 — Cybersecurity Fundamentals
Five interactive topics covering What is Cybersecurity, CIA Triad, Threat Actors, Types of Attacks, and Security Basics. Includes a visual CIA Triad diagram, expandable content sections, key takeaways, and per-topic completion tracking with an animated progress bar.

### Module 2 — Cybersecurity Domains
Eight cybersecurity domains presented as interactive cards. Each domain includes a detailed learning path (Beginner → Intermediate → Advanced), knowledge requirements, key concepts, common tools, recommended certifications in priority order, and career paths. All sections are collapsible for focused reading.

### Module 3 — Career Roadmaps
Four complete career roadmaps for SOC Analyst, Penetration Tester, Security Engineer, and Bug Bounty Hunter. Each roadmap includes five numbered stages with what to learn, free resources with clickable links, certifications in priority order, salary ranges, and difficulty ratings.

### Module 4 — Network Visualization Lab
An interactive network diagram with eight draggable devices. Four protocol simulations (HTTP, HTTPS, DNS, Attack Blocked) animate packet flow across the diagram with step-by-step explanations, OSI layer information, packet content previews, and manual/auto playback controls.

### Module 5 — SQL Injection Simulator
Three challenge levels (Basic, Intermediate, Advanced) covering login bypass, comment-based bypass, and UNION-based data extraction. Features a live query visualizer that updates as the student types, injection payload detection, attack success animation with fake database results, and a secure code comparison panel.

### Module 6 — Phishing Simulator
Three phishing scenarios (Fake Bank Alert, IT Department Credential Harvest, CEO Fraud). Students click suspicious elements in realistic email displays to identify red flags. Includes an interactive fake login page that demonstrates credential theft, a guided indicator checklist, and detailed explanations for each red flag.

### Module 7 — Quiz System
Five topic-based quizzes with a total of 39 questions. Features include countdown timer bars that turn red under pressure, A/B/C/D option selection with instant visual feedback, explanation panels after every answer, a score screen with full answer review, and Firebase persistence of best scores.

---

## 5. Security Implementation

Security was treated as a first-class requirement throughout development, consistent with CyberFlow's identity as a cybersecurity platform.

### Authentication Security
Firebase Authentication manages all user identity. The application never stores, transmits, or handles raw passwords. No custom authentication code was written.

### Authorization Security
Every application route is wrapped in a ProtectedRoute component. Unauthenticated users attempting to access any page are redirected to the login page. This is enforced client-side through React Router.

### Data Security
Firestore security rules enforce strict per-user data isolation:
allow read, write: if request.auth != null
&& request.auth.uid == userId;
A user can only read and write documents where the document ID matches their own Firebase UID.

### Configuration Security
All Firebase API keys are stored in environment variables. The `.env` file is listed in `.gitignore` and was never committed to the GitHub repository. Vercel environment variables are used in production.

### Simulation Security
The SQL injection and phishing simulations are entirely client-side educational demonstrations. No real database queries are executed. No real credentials are transmitted. No exploitable vulnerabilities exist in the platform itself.

---

## 6. Development Challenges

| Challenge | How It Was Solved |
|---|---|
| Making SQL injection visual | Built a live query renderer that parses and colorizes SQL syntax in real time as the user types |
| Network animation pacing | Implemented manual step controls alongside auto-play with 3-second intervals so students can go at their own pace |
| Free deployment with secret keys | Used Vercel environment variables to store Firebase config securely in production |
| Keeping scope realistic for 60 days | Maintained a strict MVP list and deferred Phase 2 and 3 features |
| No coding experience at start | Built incrementally — one component at a time, tested after each addition |

---

## 7. Testing Summary

| Test Area | Method | Result |
|---|---|---|
| Authentication flow | Manual — signup, login, logout, protected routes | ✅ Pass |
| Quiz scoring | Manual — complete quiz, verify Firestore | ✅ Pass |
| Network simulation | Manual — all 4 protocols tested | ✅ Pass |
| SQL injection detection | Manual — all payloads tested | ✅ Pass |
| Phishing red flags | Manual — all 3 scenarios tested | ✅ Pass |
| Responsive design | Chrome DevTools mobile view | ✅ Pass |
| Firestore rules | Tested with different user accounts | ✅ Pass |
| Production deployment | Live Vercel URL tested | ✅ Pass |

---

## 8. Project Statistics

| Metric | Value |
|---|---|
| Total modules built | 7 |
| Interactive labs | 3 |
| Quiz questions | 39 |
| Career roadmaps | 4 |
| Cybersecurity domains covered | 8 |
| React components created | 25+ |
| Data files | 7 |
| Lines of code (approx.) | 4,000+ |
| Development time | 60 days |
| Total cost | $0 |

---

## 9. Future Development

### Phase 2
- Achievement badge system with unlock conditions
- Printable completion certificates
- User profile page with full learning history
- Dark/light mode toggle

### Phase 3
- CTF (Capture The Flag) challenge integration
- Multiplayer lab scenarios
- Malware Analysis Simulator
- Incident Response Simulator
- SOC Operations Simulator
- AI learning assistant

---

## 10. Conclusion

CyberFlow demonstrates that a professional-quality, secure, and fully deployed web application can be built from scratch within 60 days with zero budget using modern free tools.

The platform successfully addresses the original problem statement — cybersecurity education is too text-heavy and non-interactive. Every module prioritizes visual explanation and hands-on interaction over passive reading.

All MVP features are complete, the platform is publicly accessible, and user data is securely stored and isolated through Firebase. The codebase follows secure development practices consistent with the cybersecurity focus of the project itself.

---

## 11. References

- OWASP Top 10 (2021) — https://owasp.org/Top10
- MITRE ATT&CK Framework — https://attack.mitre.org
- Firebase Documentation — https://firebase.google.com/docs
- React Documentation — https://react.dev
- Tailwind CSS Documentation — https://tailwindcss.com
- React Flow Documentation — https://reactflow.dev
- TryHackMe — https://tryhackme.com
- PortSwigger Web Security Academy — https://portswigger.net/web-security
- CompTIA Security+ Objectives — https://www.comptia.org
- NIST Cybersecurity Framework — https://www.nist.gov/cyberframework