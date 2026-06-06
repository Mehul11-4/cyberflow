// src/data/sqlLab.js
export const challenges = [
  {
    id: 1,
    level: 'Basic',
    color: 'green',
    title: 'Classic Login Bypass',
    description: 'The most common SQL injection. The login form passes user input directly into a SQL query without sanitization. Can you bypass the login without knowing the password?',
    hint: "Try entering ' OR '1'='1 as the username",
    context: 'A vulnerable login form that concatenates user input directly into SQL.',
    vulnerableQuery: (user, pass) =>
      `SELECT * FROM users\nWHERE username = '${user}'\nAND password = '${pass}';`,
    secureQuery: `SELECT * FROM users\nWHERE username = ?\nAND password = ?;`,
    successPayloads: ["' OR '1'='1", "admin'--", "' OR 1=1--", "admin' --"],
    explanation: "By entering ' OR '1'='1, the query becomes: WHERE username = '' OR '1'='1' — which is always TRUE. The database returns all users and the attacker is logged in as the first user, usually admin.",
    prevention: [
      'Use parameterized queries (prepared statements)',
      'Never concatenate user input into SQL strings',
      'Validate and whitelist expected input formats',
      'Use an ORM that handles escaping automatically',
    ],
    secureExplanation: 'The ? placeholder tells the database to treat the input as pure data, not SQL code. Even if an attacker enters malicious SQL, it is treated as a literal string — harmless.',
  },
  {
    id: 2,
    level: 'Intermediate',
    color: 'yellow',
    title: 'Comment-Based Bypass',
    description: 'SQL supports inline comments using --. An attacker can use this to comment out the rest of the query, removing password checks entirely.',
    hint: "Try entering admin'-- as the username",
    context: 'The attacker knows the username is "admin" and wants to skip the password check.',
    vulnerableQuery: (user, pass) =>
      `SELECT * FROM users\nWHERE username = '${user}'\nAND password = '${pass}';`,
    secureQuery: `SELECT * FROM users\nWHERE username = ?\nAND password = ?;`,
    successPayloads: ["admin'--", "admin' --", "admin'-- -", "admin'#"],
    explanation: "Entering admin'-- makes the query: WHERE username = 'admin'-- AND password = '...'. Everything after -- is a comment and is ignored. The password check is completely removed.",
    prevention: [
      'Use parameterized queries',
      'Implement multi-factor authentication',
      'Never reveal which field is wrong in login errors',
      'Rate limit login attempts',
    ],
    secureExplanation: "With parameterized queries, admin'-- is treated as a literal username string. The database looks for a user literally named admin'-- which doesn't exist. Attack fails.",
  },
  {
    id: 3,
    level: 'Advanced',
    color: 'red',
    title: 'UNION-Based Data Extraction',
    description: 'A UNION attack appends a second SELECT statement to extract data from other tables. This is how attackers steal entire databases.',
    hint: "Try: ' UNION SELECT username, password FROM users--",
    context: 'A product search page that returns results directly from the database.',
    vulnerableQuery: (search, _) =>
      `SELECT name, price FROM products\nWHERE name LIKE '%${search}%';`,
    secureQuery: `SELECT name, price FROM products\nWHERE name LIKE ?;`,
    successPayloads: [
      "' UNION SELECT username, password FROM users--",
      "' UNION SELECT table_name, null FROM information_schema.tables--",
    ],
    explanation: "The UNION keyword combines two SELECT results. The injected query appends SELECT username, password FROM users — dumping the entire users table alongside the product results. This is how major data breaches happen.",
    prevention: [
      'Use parameterized queries for all database operations',
      'Apply least privilege — the app DB user should only have SELECT on needed tables',
      'Use a WAF to detect UNION-based injection patterns',
      'Never expose detailed database error messages',
    ],
    secureExplanation: "The ? binds the search term as a literal value inside the LIKE clause. The injected UNION becomes part of the search string, not SQL code. The database searches for a product literally named that string.",
  },
]

export const osiLayers = [
  { layer: 'Application', detail: 'User submits form data via browser' },
  { layer: 'HTTP Request', detail: 'POST /login with username & password fields' },
  { layer: 'Web Server', detail: 'Server receives input and builds SQL query' },
  { layer: 'Database', detail: 'SQL engine executes the query — injection happens here' },
]