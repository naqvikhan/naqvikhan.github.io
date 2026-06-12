/* ============================================================
   PORTFOLIO CONTENT  —  edit this file to update the site
   ------------------------------------------------------------
   Everything below is data. To add an experience, education
   entry, tool, or project, just add an object/string to the
   matching array — the page rebuilds itself. No HTML needed.
   ============================================================ */
window.PORTFOLIO = {

  /* — identity — */
  name: "Naqvi Khan",
  brand: "naqvi khan",                 // shown in the nav
  role: "Software Engineer · Aspiring Researcher",
  // The hero headline. Wrap the part you want emphasised in {{ }}.
  headline: "Hello world,<br>I'm {{Naqvi}}.",
  quote: "“Stay hungry, stay foolish.” — building thoughtful software at the intersection of systems & design.",
  // Hero quote pool. One is chosen at random on every page load (a different
  // one than last time when possible). Add more strings to this array anytime.
  quotes: [
    "How many hidden ducks does it take to get a PR approved? One more than you’ve found so far. Keep digging through the layers—you’re not done yet.",
    "Why is the rubber duck the only thing on this page that doesn't have a bug? Maybe it’s because it knows where all the others are hidden. Are you sharp enough to find them?",
    "Why does the rubber duck stay silent while you debug? Because it’s waiting for you to find the rest of its friends hidden in the source. (Found: 1/N)"
  ],
  resumeHref: "files/resume.pdf",
  socials: [
    { label: "GitHub",   href: "http://github.com/naqvikhan" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/naqvik/" },
    { label: "Email",    href: "mailto:naqvikhan98@gmail.com" }
  ],

  /* — ABOUT — */
  about: {
    photo: "images/profile.jpg",
    statement: "I'm a software engineer who loves turning complex challenges into {{simple, effective solutions}}.",
    paragraphs: [
      "Whether it's helping a startup navigate growth or building tools to keep financial systems secure, I've always enjoyed the process of creating things that make an impact.",
      "My background is pretty diverse, spanning everything from web development to mobile apps. While I've spent a lot of time working with languages like Java, Python and React, I'm most passionate about what comes next. I'm currently diving deep into the world of AI security and am always looking for new things to learn, projects to tackle, and ways to grow as a developer."
    ],
    status: "Open to connect"
  },

  /* — EDUCATION —  (add more objects to grow the list) */
  education: [
    {
      mark: "UTD",
      title: "University of Texas at Dallas",
      sub: "B.S. Computer Science",
      date: "Dec 2021",
      blurb: "Relevant coursework: Data Structures, UNIX, Probability & Statistics, Computer Architecture, Discrete Math II, Database Systems, Software Testing, Advanced Algorithm Design & Analysis, Machine Learning.",
      tags: ["2× Competitive Scholarship", "Student Spotlight: UTD Info Tech", "BSO President"]
    }
  ],

  /* — EXPERIENCE —  (same card shape as education) */
  experience: [
    {
      mark: "AI",
      title: "Algorizin Inc.",
      sub: "Software Engineer",
      date: "Apr 2023 — Oct 2024",
      blurb: "Worked on their Learning Management Platform, implementing user-centric features and driving performance improvements through a backend migration.",
      tags: ["Java", "Spring Boot", "JUnit", "Selenium", "Cucumber", "OAuth 2.0", "Spring Security", "AWS API Gateway", "SQL", "React", "Redux", "JIRA", "GitHub", "Jenkins"]
    },
    {
      mark: "SC",
      title: "SimpleCitizen Inc.",
      sub: "Workflow Engineer",
      date: "May 2022 — Apr 2023",
      blurb: "For SimpleCitizen's immigration platform, strategically optimized web applications and streamlined processing workflows, significantly reducing case processing times.",
      tags: ["Python", "Django", "JavaScript", "XML", "JSON"]
    },
    {
      mark: "BD",
      title: "Big Data Analytics Lab — UT Dallas",
      sub: "Research Volunteer",
      date: "Jan 2020 — May 2020",
      blurb: "Built an iOS app to visualize COVID-19 data and researched API query latency, optimizing it with caching. Designed validation frameworks to ensure data quality and model reliability within ML pipelines.",
      tags: ["Python", "TensorFlow", "Swift", "Google Maps API", "JSON", "Redis", "Memcached"]
    },
    {
      mark: "OIT",
      title: "Office of Information Technology — UT Dallas",
      sub: "ITSM Student Supervisor",
      date: "May 2019 — Dec 2021",
      blurb: "Led a large team of support analysts with mentorship and training to improve efficiency. Managed enterprise access via Active Directory and ran security-awareness workshops on phishing and spam defense.",
      tags: ["Active Directory", "Network Troubleshooting", "Help Desk Support", "Windows", "macOS"]
    }
  ],

  /* — TOOLS —  (flat list; split into two scrolling rows automatically) */
  tools: [
    "Java", "C++", "C", "C#", "Python", "HTML", "CSS", "JavaScript", "TypeScript",
    "Swift", "Objective-C", "Verilog", "MIPS Assembly", "R",
    "Spring Boot", "Django", "React", "Node.js", "Next.js", "jQuery", "Bootstrap",
    "Selenium", "PyTorch", "Cryptography",
    "Git", "Unix / Linux", "Docker", "AWS", "Jira", "Maven",
    "MySQL", "PostgreSQL", "MongoDB", "Memcached"
  ],

  /* — PROJECTS —  (add more objects to grow the showcase) */
  projects: [
    {
      name: "Fraud Detection Microservice",
      desc: "Sponsored by Capital One, engineered a microservice with a team of six that reduced anomaly detection time in financial documents from 15 minutes to under 12 seconds.",
      stack: ["Java", "Spring Boot", "Tesseract", "Drools", "Maven", "JUnit", "Git"],
      href: "https://github.com/naqvikhan/fraud_detection_microservice",
      posterDesign: { kind: "wordmark", word: "detectly", brandMark: true }
    },
    {
      name: "Workflow Automation",
      desc: "A Python automation script using Selenium for the school's IT office — enabling lightning-fast logins to work accounts, tools, web apps, and VPN, reducing a 5-minute task to under 15 seconds.",
      stack: ["Python", "Selenium"],
      href: "https://github.com/naqvikhan/WorkflowAutomation",
      posterDesign: {
        kind: "terminal",
        title: "automate.py",
        lines: [
          { t: "cmd", s: "python automate.py --all" },
          { t: "info", s: "launching headless chrome\u2026" },
          { t: "ok", s: "signed in \u00b7 workspace" },
          { t: "ok", s: "signed in \u00b7 vpn + 6 tools" },
          { t: "done", s: "done in 14.8s" }
        ]
      }
    },
    {
      name: "Pomodoro",
      desc: "A feature-rich web app built with React, JavaScript, and jQuery to enhance user productivity through the Pomodoro technique.",
      stack: ["React", "JavaScript", "jQuery"],
      href: "https://github.com/naqvikhan/pomodoro-app",
      posterDesign: { kind: "app", title: "Pomodoro", time: "38:24" }
    },
    {
      name: "Duck Locator",
      desc: "This isn't really a project — I just wanted to help you locate a duck. Here's a hint: follow the arrow and sweep your cursor up toward the top of this section.",
      stack: ["Duck", "Duck", "Goose"],
      href: "#projects",
      linkText: "View duck",
      arrow: "↑",
      emoji: "🔍🦆",
      posterDesign: { kind: "radar" },
      label: "duck poster"
    }
  ]
};
