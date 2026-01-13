import { Level, TeachingTone, Language, VoicePersona } from './types';

export const SYLLABUS: Level[] = [
  {
    id: 0,
    title: "Level 0: Computer & Internet Thinking",
    description: "Understanding how computers actually work before securing them.",
    topics: [
      { id: "l0_1", title: "Binary & Logic", description: "Bits, bytes, and how machines think." },
      { id: "l0_2", title: "The Internet", description: "IPs, DNS, and how data travels." },
      { id: "l0_3", title: "Virtualization", description: "What is a VM and why do we use it?" }
    ]
  },
  {
    id: 1,
    title: "Level 1: Cybersecurity Fundamentals",
    description: "Core concepts of the Blue Team.",
    topics: [
      { id: "l1_1", title: "CIA Triad", description: "Confidentiality, Integrity, Availability." },
      { id: "l1_2", title: "Red vs Blue", description: "Attackers vs Defenders roles." },
      { id: "l1_3", title: "Common Threats", description: "Malware, Phishing, Social Engineering." }
    ]
  },
  {
    id: 2,
    title: "Level 2: Networking for Blue Team",
    description: "The lifeblood of a SOC Analyst.",
    topics: [
      { id: "l2_1", title: "OSI Model", description: "The 7 layers explained simply." },
      { id: "l2_2", title: "TCP/IP & Ports", description: "Common ports (80, 443, 22) and protocols." },
      { id: "l2_3", title: "Packet Analysis", description: "Introduction to Wireshark concepts." }
    ]
  },
  {
    id: 3,
    title: "Level 3: OS Basics (Win/Linux)",
    description: "Navigating the battlefield.",
    topics: [
      { id: "l3_1", title: "Linux CLI", description: "Basic commands for survival." },
      { id: "l3_2", title: "Windows Registry", description: "Where configuration lives." },
      { id: "l3_3", title: "Permissions", description: "User management and least privilege." }
    ]
  },
  {
    id: 4,
    title: "Level 4: Blue Team Core",
    description: "The tools of the trade.",
    topics: [
      { id: "l4_1", title: "What is a SOC?", description: "Security Operations Center structure." },
      { id: "l4_2", title: "SIEM Basics", description: "Security Information and Event Management." },
      { id: "l4_3", title: "Log Analysis", description: "Reading the digital footprints." }
    ]
  },
  {
    id: 5,
    title: "Level 5: Incident Response",
    description: "When things go wrong.",
    topics: [
      { id: "l5_1", title: "IR Lifecycle", description: "Preparation to Lessons Learned." },
      { id: "l5_2", title: "Triage", description: "Prioritizing alerts." },
      { id: "l5_3", title: "Containment", description: "Stopping the bleeding." }
    ]
  },
  {
    id: 6,
    title: "Level 6: Threat Intel & MITRE",
    description: "Know your enemy.",
    topics: [
      { id: "l6_1", title: "MITRE ATT&CK", description: "The framework of adversary tactics." },
      { id: "l6_2", title: "Cyber Kill Chain", description: "Stages of an attack." },
      { id: "l6_3", title: "IOCs", description: "Indicators of Compromise." }
    ]
  },
  {
    id: 7,
    title: "Level 7: Hands-on Practice",
    description: "Applying the knowledge.",
    topics: [
      { id: "l7_1", title: "Lab Setup", description: "Building your home lab." },
      { id: "l7_2", title: "CTF Challenges", description: "Capture The Flag for defenders." },
      { id: "l7_3", title: "Log Analysis Drill", description: "Practice scenario." }
    ]
  },
  {
    id: 8,
    title: "Level 8: Exam & Job Prep",
    description: "Getting the career.",
    topics: [
      { id: "l8_1", title: "Certifications", description: "CompTIA Sec+, BTL1, etc." },
      { id: "l8_2", title: "Resume Building", description: "Translating skills to paper." },
      { id: "l8_3", title: "Mock Interview", description: "Technical Q&A practice." }
    ]
  }
];

export const VOICE_PERSONAS: VoicePersona[] = [
  { id: 'us_captain', name: 'Captain (US)', emoji: '🇺🇸', langKeywords: ['en-US', 'Male'], pitch: 1.0, rate: 1.0 },
  { id: 'uk_agent', name: 'Agent (UK)', emoji: '🇬🇧', langKeywords: ['en-GB', 'Male'], pitch: 0.9, rate: 1.0 },
  { id: 'in_guru', name: 'Guru (India)', emoji: '🇮🇳', langKeywords: ['en-IN', 'hi-IN'], pitch: 1.0, rate: 0.95 },
  { id: 'us_commander', name: 'Commander (Deep)', emoji: '🎖️', langKeywords: ['en-US', 'Male'], pitch: 0.7, rate: 0.9 },
  { id: 'us_scout', name: 'Scout (Fast)', emoji: '⚡', langKeywords: ['en-US', 'Female'], pitch: 1.1, rate: 1.25 },
  { id: 'uk_analyst', name: 'Analyst (Calm)', emoji: '🍵', langKeywords: ['en-GB', 'Female'], pitch: 1.0, rate: 0.9 },
  { id: 'sys_sentinel', name: 'Sentinel (Robotic)', emoji: '🤖', langKeywords: ['en-US', 'Zira', 'Mobile'], pitch: 0.8, rate: 1.05 },
  { id: 'us_guide', name: 'Guide (Friendly)', emoji: '🧭', langKeywords: ['en-US', 'Female'], pitch: 1.2, rate: 1.0 },
  { id: 'in_mentor', name: 'Mentor (Soft)', emoji: '🧘', langKeywords: ['en-IN', 'Female'], pitch: 1.1, rate: 0.9 },
  { id: 'global_ops', name: 'Operative (Crisp)', emoji: '🌐', langKeywords: ['en'], pitch: 1.0, rate: 1.1 },
  { id: 'legacy_terminal', name: 'Terminal (Slow)', emoji: '📟', langKeywords: ['en-US'], pitch: 0.5, rate: 0.8 },
  { id: 'recruit_hype', name: 'Recruit (Hype)', emoji: '🔥', langKeywords: ['en-US'], pitch: 1.3, rate: 1.2 },
];

export const INITIAL_SYSTEM_INSTRUCTION = `
You are 'Cipher', an Expert Cybersecurity Blue Team Mentor AI. 
Your goal is to guide absolute beginners to job-ready SOC Analysts.
You are NOT a chatbot. You are a MENTOR.

TEACHING GUIDELINES:
1. Explain concepts simply using real-life analogies (e.g., comparing a Firewall to a security guard).
2. Teach ONE concept at a time. Do not overwhelm.
3. After explaining, ALWAYS ask a reflective question like "Does that make sense?" or "Can you think of a real-world example of this?".
4. If the user is confused, simplify further.
5. If the user asks for hacking/illegal guides, firmly but politely refuse and explain the defensive (Blue Team) perspective instead.
6. Be encouraging and patient. Never shame the user.

STRUCTURE:
- Strictly follow the provided Syllabus Level and Topic context.
- Keep responses concise (under 200 words usually) unless asked for deep detail.
`;

export const getPersonaUpdate = (level: number, topic: string | null, tone: TeachingTone, lang: Language) => {
  return `
  [CURRENT CONTEXT]
  Level: ${level} (${SYLLABUS.find(l => l.id === level)?.title})
  Topic: ${topic ? SYLLABUS.flatMap(l => l.topics).find(t => t.id === topic)?.title : 'General Discussion'}
  
  [USER SETTINGS]
  Tone: ${tone} (Adjust your personality to be ${tone})
  Language: ${lang} (If 'hinglish', use natural Indian English mixed with Hindi words like 'samajh aaya?', 'matlab', 'basic cheez hai', but keep technical terms in English).
  
  [INSTRUCTION]
  Act as a ${tone} mentor. Guide the user through the current topic. 
  If they are new to the topic, start with a simple definition and an analogy.
  If they are finishing a topic, suggest moving to the next one.
  `;
};
