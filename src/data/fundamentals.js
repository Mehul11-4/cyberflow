// src/data/fundamentals.js
export const fundamentalsData = [
  {
    id: 1,
    title: 'What is Cybersecurity',
    icon: '🛡️',
    color: 'cyan',
    summary: 'The practice of protecting systems, networks, and programs from digital attacks.',
    sections: [
      {
        heading: 'Definition',
        content: 'Cybersecurity is the practice of protecting computers, servers, mobile devices, networks, and data from malicious attacks. It is also known as information technology security or electronic information security.',
      },
      {
        heading: 'Why It Matters',
        content: 'Every day, billions of people use the internet for banking, communication, and work. Cybersecurity ensures that their data, privacy, and systems remain safe from attackers who want to steal, disrupt, or destroy.',
      },
      {
        heading: 'Key Areas',
        content: 'Cybersecurity covers network security, application security, cloud security, physical security, and end-user education. Each area defends a different layer of a system.',
      },
    ],
    keyPoints: [
      'Protects systems, networks, and data',
      'Defends against hackers, malware, and breaches',
      'Critical for individuals, businesses, and governments',
      'Growing field with millions of job opportunities',
    ],
  },
  {
    id: 2,
    title: 'CIA Triad',
    icon: '🔺',
    color: 'purple',
    summary: 'The three core principles that guide all cybersecurity decisions.',
    sections: [
      {
        heading: 'Confidentiality',
        content: 'Ensuring that information is only accessible to those who are authorized to see it. Examples include encryption, access controls, and passwords. A breach of confidentiality means unauthorized people saw data they should not have.',
      },
      {
        heading: 'Integrity',
        content: 'Ensuring that data is accurate and has not been tampered with. If an attacker modifies a file or database without authorization, integrity is violated. Hashing and digital signatures help verify integrity.',
      },
      {
        heading: 'Availability',
        content: 'Ensuring that systems and data are accessible when needed by authorized users. DDoS attacks target availability by overwhelming servers. Backups and redundancy protect availability.',
      },
    ],
    keyPoints: [
      'Confidentiality — only authorized access',
      'Integrity — data is accurate and untampered',
      'Availability — systems work when needed',
      'Every security decision maps to one or more of these',
    ],
  },
  {
    id: 3,
    title: 'Threat Actors',
    icon: '🎭',
    color: 'red',
    summary: 'Understanding who attacks systems and why.',
    sections: [
      {
        heading: 'Script Kiddies',
        content: 'Unskilled attackers who use pre-built tools without understanding how they work. They are opportunistic and typically cause minor damage. Often motivated by curiosity or wanting to appear skilled.',
      },
      {
        heading: 'Hacktivists',
        content: 'Attackers motivated by political or social causes. They deface websites or leak data to send a message. Anonymous is a well-known hacktivist group.',
      },
      {
        heading: 'Cybercriminals',
        content: 'Financially motivated attackers who steal data, deploy ransomware, or commit fraud. They are organized and operate like businesses, with specialized roles for each attack phase.',
      },
      {
        heading: 'Nation-State Actors',
        content: 'Government-sponsored attackers conducting espionage, sabotage, or influence operations. They have large budgets and advanced capabilities. Examples include attacks on power grids and election systems.',
      },
      {
        heading: 'Insider Threats',
        content: 'Employees or contractors who misuse their authorized access. Can be intentional (disgruntled employee) or accidental (clicking a phishing link). Considered one of the most dangerous threat types.',
      },
    ],
    keyPoints: [
      'Script Kiddies — unskilled, opportunistic',
      'Hacktivists — politically motivated',
      'Cybercriminals — financially motivated',
      'Nation-States — government-sponsored espionage',
      'Insiders — trusted users who misuse access',
    ],
  },
  {
    id: 4,
    title: 'Types of Cyber Attacks',
    icon: '⚡',
    color: 'orange',
    summary: 'The most common attack techniques used by threat actors.',
    sections: [
      {
        heading: 'Malware',
        content: 'Malicious software designed to damage or gain unauthorized access to systems. Types include viruses, worms, trojans, ransomware, and spyware. Malware is typically delivered via email attachments or infected downloads.',
      },
      {
        heading: 'Phishing',
        content: 'Deceptive emails or messages that trick users into revealing credentials or clicking malicious links. Spear phishing targets specific individuals with personalized content, making it harder to detect.',
      },
      {
        heading: 'SQL Injection',
        content: 'Inserting malicious SQL code into input fields to manipulate a database. Attackers can extract, modify, or delete data. Prevented by using parameterized queries and input validation.',
      },
      {
        heading: 'Man-in-the-Middle',
        content: 'An attacker secretly intercepts communication between two parties. Common on unsecured public WiFi. HTTPS and VPNs help prevent these attacks.',
      },
      {
        heading: 'DDoS',
        content: 'Distributed Denial of Service — flooding a server with traffic until it crashes. Uses botnets (networks of infected computers). Mitigated with rate limiting and traffic filtering.',
      },
    ],
    keyPoints: [
      'Malware — malicious software',
      'Phishing — deceptive messages',
      'SQL Injection — database attacks',
      'MitM — intercepted communications',
      'DDoS — server flooding attacks',
    ],
  },
  {
    id: 5,
    title: 'Security Basics',
    icon: '🔐',
    color: 'green',
    summary: 'Foundational practices that every secure system follows.',
    sections: [
      {
        heading: 'Authentication vs Authorization',
        content: 'Authentication verifies who you are (login with password). Authorization determines what you are allowed to do (admin vs regular user). Both are essential layers of access control.',
      },
      {
        heading: 'Encryption',
        content: 'Converting data into an unreadable format that can only be decoded with the correct key. Used to protect data in transit (HTTPS) and data at rest (encrypted databases). AES and RSA are common algorithms.',
      },
      {
        heading: 'Principle of Least Privilege',
        content: 'Users and systems should only have the minimum access required to do their job. This limits the damage an attacker can do if they compromise an account.',
      },
      {
        heading: 'Patching and Updates',
        content: 'Keeping software updated closes known vulnerabilities. Many major breaches occur because organizations failed to apply available security patches.',
      },
    ],
    keyPoints: [
      'Authentication proves identity',
      'Authorization controls access',
      'Encryption protects data',
      'Least privilege limits damage',
      'Patching closes known vulnerabilities',
    ],
  },
]