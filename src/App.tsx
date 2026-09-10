import React, { useState, useEffect, useRef } from "react";
import PulsatingBorder from "./components/PulsatingBorder";
import { Smooth3DSlideshow, type Slide as ProjectSlide } from "./components/originkit/ui/coverflowgallery-base";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowLeft,
  ArrowDown,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Home,
  User,
  Cpu,
  GraduationCap,
  Briefcase,
  Layers,
  Video,
  Building,
  Cloud,
  BookOpen,
  Globe,
  FileText,
  ArrowRight,
  Award,
  ExternalLink,
  CheckCircle,
  ShieldCheck,
  Send
} from "lucide-react";

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  category: "AI & ML" | "Cloud" | "Data & Database" | "Programming" | "Other";
  badgeTag: string;
  description: string;
  logoType: "microsoft" | "aws" | "mongodb" | "nptel" | "hindi" | "iste";
  credentialUrl?: string;
}

export interface SocialProfile {
  id: string;
  name: string;
  url: string;
  tooltip: string;
  accentColor: string;
  logoType: "linkedin" | "github" | "codechef" | "leetcode";
}

export default function App() {
  const [stage, setStage] = useState<"intro-box" | "portfolio">("intro-box");
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [activeCertFilter, setActiveCertFilter] = useState<string>("All");
  const [isWatchMineOpen, setIsWatchMineOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typedLength, setTypedLength] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  // Active Tab for Internship Image Slide (0 = ServiceNow, 1 = VDart)
  const [activeInternImageIndex, setActiveInternImageIndex] = useState(0);

  // Active Publication Index for Research Slide (Auto-cycles every 3s)
  const [activePubIndex, setActivePubIndex] = useState(0);

  // Dragging & Pendulum Swing Physics for 3 Hanging Thread Cards (Slide 4)
  const [cardStates, setCardStates] = useState([
    { x: 0, y: 0, rot: -3, isSwinging: false },
    { x: 0, y: 0, rot: 3, isSwinging: false },
    { x: 0, y: 0, rot: 0, isSwinging: false }
  ]);
  const draggingCardRef = useRef<{ index: number; startX: number; startY: number; initX: number; initY: number; moved: boolean } | null>(null);

  // Dragging & Pendulum Swing Physics for Hanging IGI Global ID Badge (Slide 7)
  const [idCardState, setIdCardState] = useState({ x: 0, y: 0, rot: 0, isSwinging: false });
  const draggingIdCardRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  
  // Double-tap refs
  const lastTapRef = useRef<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Full rich bio text for Slide 2
  const fullIntroText =
    "Hi, I'm Sriram, an Artificial Intelligence and Machine Learning Engineering student passionate about building intelligent, real-world solutions. My journey spans AI, Machine Learning, Deep Learning, IoT, Full-Stack Development, and research, with hands-on experience through innovative projects, internships, and academic publications. I continuously explore emerging technologies, strengthen my problem-solving skills through coding, and actively pursue excellence both in technology and sports. Welcome to my portfolio—a glimpse into my skills, projects, research, achievements, and journey of continuous learning.";

  // 5 Master Stacked Skill Cards for Slide 3
  const skillStackCards = [
    {
      num: "01",
      eyebrow: "CORE INTELLIGENCE & RESEARCH",
      title: "ARTIFICIAL INTELLIGENCE & ML",
      tag: "AI & ML SPECIALIZATION",
      groups: [
        {
          label: "Machine Learning & Neural Architecture",
          skills: [
            "Machine Learning",
            "Deep Learning",
            "Neural Networks",
            "Supervised & Unsupervised Learning",
            "Classification & Regression",
            "Clustering",
            "Feature Engineering",
            "Model Evaluation",
            "Hyperparameter Tuning",
            "Anomaly Detection"
          ]
        },
        {
          label: "Core AI Frameworks & Libraries",
          skills: [
            "Scikit-learn",
            "TensorFlow",
            "PyTorch",
            "NumPy",
            "Pandas",
            "Matplotlib",
            "SHAP"
          ]
        }
      ]
    },
    {
      num: "02",
      eyebrow: "SOFTWARE & WEB ARCHITECTURE",
      title: "PROGRAMMING & FULL-STACK",
      tag: "FULL-STACK DEVELOPMENT",
      groups: [
        {
          label: "Programming Languages",
          skills: ["Python", "Java", "JavaScript", "SQL", "HTML", "CSS"]
        },
        {
          label: "Full-Stack Web Technologies",
          skills: [
            "React.js",
            "Next.js",
            "Node.js",
            "Express.js",
            "FastAPI",
            "Spring Boot",
            "REST APIs",
            "Tailwind CSS"
          ]
        }
      ]
    },
    {
      num: "03",
      eyebrow: "INFRASTRUCTURE & DATA STORAGE",
      title: "CLOUD, DEVOPS & DATABASES",
      tag: "CLOUD & DATA STORAGE",
      groups: [
        {
          label: "Databases",
          skills: ["MongoDB", "PostgreSQL", "MySQL", "DynamoDB"]
        },
        {
          label: "Cloud & Dev Tools",
          skills: [
            "AWS",
            "AWS S3",
            "AWS Lambda",
            "AWS IoT Core",
            "Git",
            "GitHub",
            "Apache Kafka"
          ]
        }
      ]
    },
    {
      num: "04",
      eyebrow: "HARDWARE & SMART SENSORS",
      title: "IOT & EMBEDDED SYSTEMS",
      tag: "EMBEDDED HARDWARE",
      groups: [
        {
          label: "Microcontrollers & IoT Platforms",
          skills: ["Internet of Things (IoT)", "ESP32", "Sensor Integration", "Wokwi"]
        },
        {
          label: "Sensors & Real-Time Telemetry",
          skills: ["MAX30102", "MPU6050", "ThingSpeak", "API Integration"]
        }
      ]
    },
    {
      num: "05",
      eyebrow: "SECURITY, NETWORKING & ANALYTICS",
      title: "CYBERSECURITY & DATA ANALYTICS",
      tag: "SECURITY & ANALYTICS",
      groups: [
        {
          label: "Cybersecurity & Networking",
          skills: [
            "Network Intrusion Detection (NIDS)",
            "AI-Based Cybersecurity",
            "Network Security Fundamentals",
            "Cisco Packet Tracer"
          ]
        },
        {
          label: "Data Science & Analysis",
          skills: [
            "Data Analysis",
            "Data Preprocessing",
            "Data Visualization",
            "Exploratory Data Analysis (EDA)"
          ]
        }
      ]
    }
  ];

  // Education Timeline Cards Data (Slide 4)
  const educationCards = [
    {
      num: "01",
      theme: "red",
      category: "SCHOOL",
      title: "School Journey",
      institution: "St. Mary's Matric Hr. Sec. School",
      stats: [
        { label: "10th Grade", value: "96.6%" },
        { label: "12th Grade", value: "93.6%" }
      ],
      desc: "Foundational academic excellence in Mathematics & Computer Science."
    },
    {
      num: "02",
      theme: "red",
      category: "COLLEGE",
      title: "Engineering Journey",
      institution: "Kalaignar Karunanidhi Institute of Technology",
      degree: "B.E. CSE — Artificial Intelligence & Machine Learning",
      stats: [{ label: "Current CGPA", value: "8.78" }],
      desc: "Deep research in Artificial Intelligence, Neural Networks & IoT Systems.",
      url: "https://kitcbe.com/"
    },
    {
      num: "03",
      theme: "light",
      category: "FUTURE",
      title: "What's Next",
      motto: "Building • Learning • Innovating",
      focus: "AI/ML | Research | Real-World Solutions",
      desc: "Architecting autonomous AI agents, scalable tech innovations & research."
    }
  ];

  // EXACT 5 WHITE PLAYING CARDS IN ORIGINKIT 3D COVERFLOW MOTION (Slide 5: Projects)
  const whiteCoverflowProjectSlides: ProjectSlide[] = [
    {
      num: "01",
      suit: "♠",
      suitColor: "suit-dark",
      title: "CYVORA — AI-Driven Intelligent Network Intrusion Detection System",
      desc: "AI-driven cybersecurity system for detecting network attacks and improving rare attack detection.",
      badge: "🛡️ AI Security & NIDS",
      techs: ["Machine Learning", "Random Forest", "Cybersecurity"],
      url: "https://github.com/Sriram2214"
    },
    {
      num: "02",
      suit: "♠",
      suitColor: "suit-dark",
      title: "Real-Time Hybrid ML Fraud Detection & Risk Decision System",
      desc: "Real-time fraud detection using Machine Learning, anomaly detection, and intelligent risk scoring.",
      badge: "⚡ Real-Time ML Engine",
      techs: ["Isolation Forest", "Kafka", "SHAP"],
      url: "https://github.com/Sriram2214"
    },
    {
      num: "03",
      suit: "♠",
      suitColor: "suit-dark",
      title: "SENTRIX — Hackathon Winning Project 🏆",
      desc: "An innovative technology solution developed for a real-world problem and recognized as a Hackathon Winning Project.",
      badge: "🏆 Hackathon Winner",
      techs: ["AI", "IoT Telemetry", "System Design"],
      url: "https://github.com/Sriram2214"
    },
    {
      num: "04",
      suit: "♦",
      suitColor: "suit-red",
      title: "Timetable Management System — Client Internship Project 💼",
      desc: "A practical full-stack timetable management system developed as a real-world client project during an internship.",
      badge: "💼 Client Internship Project",
      techs: ["Full-Stack", "Database Mgmt", "Web Dev"],
      url: "https://github.com/Sriram2214"
    },
    {
      num: "05",
      suit: "♠",
      suitColor: "suit-dark",
      title: "VAANI AI — Intelligent Voice Assistant 🎙️",
      desc: "VAANI AI is an intelligent AI-powered voice assistant designed to interact with users through voice commands and provide smart, responsive assistance with natural language understanding and automation.",
      badge: "🎙️ Intelligent Voice Assistant",
      hasSoundWave: true,
      techs: ["Python", "AI", "Voice Recognition", "Speech Processing", "NLP", "Automation"],
      url: "https://github.com/Sriram2214"
    }
  ];

  // EXACT 2 USER-UPLOADED INTERNSHIP IMAGES (Slide 6: Intern and Experience)
  const internshipImages = [
    {
      id: "01",
      company: "ServiceNow University",
      role: "Enterprise Cloud & Software Intern",
      modeLabel: "Remote",
      desc: "Enterprise workflow automation, cloud administration, and developer fundamentals.",
      imageSrc: "/servicenow-intern.png",
      alt: "ServiceNow University Internship Presentation",
      icon: Cloud
    },
    {
      id: "02",
      company: "VDart Academy",
      role: "Full-Stack Web Development Intern",
      modeLabel: "Offline",
      desc: "Client-oriented full-stack software development and practical application architecture.",
      imageSrc: "/vdart-intern.png",
      alt: "VDart Academy Internship Presentation",
      icon: Building
    }
  ];

  // 2 Major Research Publications (Slide 7)
  const publicationsData = [
    {
      id: "01",
      badge: "RESEARCH PUBLICATION • 01",
      chapterTitle: "The Psychopathology of Anguish",
      fullChapterTitle: "The Psychopathology of Anguish: Clinical Dimensions and Affective Correlates",
      bookMainTitle: "The Psychopathology\nof Anguish",
      bookSubTitle: "Clinical Dimensions and\nAffective Correlates",
      subtitle: "Exploring the Complex Relationship Between Psychological Experience, Clinical Dimensions, and Human Affect.",
      coverImage: "/sriram-book-cover.png",
      domain: "Psychology • Clinical Research\n• Affective Studies",
      type: "Research Chapter",
      url: "https://www.igi-global.com/book/psychopathology-anguish-clinical-dimensions-affective/404716"
    },
    {
      id: "02",
      badge: "RESEARCH PUBLICATION • 02",
      chapterTitle: "Adaptive Vibro-Physiological Fatigue Detection System",
      fullChapterTitle: "Adaptive Vibro-Physiological Fatigue Detection System for AI-Driven Transportation Safety",
      bookMainTitle: "Automatic Systems for\nMonitoring Drivers' Vibrations",
      bookSubTitle: "Adaptive Vibro-Physiological\nFatigue Detection",
      subtitle: "Real-time Monitoring & Predictive Safety Analytics for Driver Fatigue and Vibration Assessment.",
      coverImage: "/sriram-book-cover-2.png",
      domain: "AI Systems • Transportation Safety\n• Physiological Computing",
      type: "Research Chapter",
      url: "https://www.igi-global.com/book/automatic-systems-monitoring-drivers-vibrations/397628"
    }
  ];

  // Centralized Certifications & Credentials Data Structure (Slide 8)
  const certificationsData: Certification[] = [
    {
      id: "cert-01",
      title: "Generate Reports AI Research Agents",
      issuer: "Microsoft",
      category: "AI & ML",
      badgeTag: "AI & Research",
      description: "Autonomous AI research agents engineered for dynamic report generation, synthesis, and deep intelligence analysis.",
      logoType: "microsoft",
      credentialUrl: "https://learn.microsoft.com/"
    },
    {
      id: "cert-02",
      title: "AWS Technical Essentials",
      issuer: "Amazon Web Services (AWS)",
      category: "Cloud",
      badgeTag: "Cloud Architecture",
      description: "Core AWS cloud architectural services, IAM security, high-availability compute, networking, and storage.",
      logoType: "aws",
      credentialUrl: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-03",
      title: "AWS AI Practitioner",
      issuer: "Amazon Web Services (AWS)",
      category: "AI & ML",
      badgeTag: "Cloud AI & GenAI",
      description: "Foundational artificial intelligence, machine learning models, and cloud-native GenAI frameworks on AWS.",
      logoType: "aws",
      credentialUrl: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-04",
      title: "Advanced Schema Design Patterns",
      issuer: "MongoDB",
      category: "Data & Database",
      badgeTag: "NoSQL & Data Modeling",
      description: "Enterprise schema design, high-throughput indexing, polymorphic patterns, and performance tuning in MongoDB.",
      logoType: "mongodb",
      credentialUrl: "https://learn.mongodb.com/"
    },
    {
      id: "cert-05",
      title: "AI Skills Fest 2026",
      issuer: "Microsoft",
      category: "AI & ML",
      badgeTag: "Generative AI",
      description: "Specialized masterclasses and technical labs covering next-generation AI models, copilots, and neural architectures.",
      logoType: "microsoft",
      credentialUrl: "https://learn.microsoft.com/"
    },
    {
      id: "cert-06",
      title: "Algorithmic Graph Theory & Data Structures",
      issuer: "NPTEL (IIT)",
      category: "Programming",
      badgeTag: "Algorithms & DS",
      description: "Advanced graph traversal, network flow optimization, shortest paths, and complex computational data structures.",
      logoType: "nptel",
      credentialUrl: "https://nptel.ac.in/"
    },
    {
      id: "cert-07",
      title: "6 Hindi Certifications",
      issuer: "Dakshina Bharat Hindi Prachar Sabha",
      category: "Other",
      badgeTag: "Language Fluency",
      description: "6 certified qualification levels (Parichaya to Praveen) demonstrating multilingual fluency and academic mastery.",
      logoType: "hindi"
    },
    {
      id: "cert-08",
      title: "State-Level Mathematics",
      issuer: "ISTE",
      category: "Other",
      badgeTag: "Applied Mathematics",
      description: "State-level engineering mathematics recognition, competitive calculus, problem solving, and analytical logic.",
      logoType: "iste"
    }
  ];

  const filterCategories = ["All", "AI & ML", "Cloud", "Data & Database", "Programming", "Other"];

  const filteredCertifications = activeCertFilter === "All"
    ? certificationsData
    : certificationsData.filter((c) => c.category === activeCertFilter);

  const renderCertLogo = (type: string) => {
    switch (type) {
      case "microsoft":
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" className="cert-svg-logo">
            <rect x="1" y="1" width="10" height="10" fill="#f25022" rx="1.5" />
            <rect x="13" y="1" width="10" height="10" fill="#7fba00" rx="1.5" />
            <rect x="1" y="13" width="10" height="10" fill="#00a4ef" rx="1.5" />
            <rect x="13" y="13" width="10" height="10" fill="#ffb900" rx="1.5" />
          </svg>
        );
      case "aws":
        return (
          <svg viewBox="0 0 40 24" width="26" height="18" className="cert-svg-logo">
            <text x="1" y="15" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="13" fill="#ff9900" letterSpacing="-0.5">aws</text>
            <path d="M4 19.5c8 3.5 22 3.5 30 0" stroke="#ff9900" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M32 17.5l4 2.5-2.5 3.5" fill="none" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "mongodb":
        return (
          <svg viewBox="0 0 24 28" width="18" height="22" className="cert-svg-logo">
            <path d="M12 1C11.5 4.5 9 7.5 7 11c-2 3.5-3 7-3 10 0 4.5 3.5 7 8 7s8-2.5 8-7c0-3-1-6.5-3-10-2-3.5-4.5-6.5-5-10z" fill="url(#mongoGrad)" />
            <path d="M12 1v26" stroke="#001e2b" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
            <defs>
              <linearGradient id="mongoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#13aa52" />
                <stop offset="100%" stopColor="#00684a" />
              </linearGradient>
            </defs>
          </svg>
        );
      case "nptel":
        return (
          <svg viewBox="0 0 32 32" width="22" height="22" className="cert-svg-logo">
            <circle cx="16" cy="16" r="14" fill="rgba(2, 132, 199, 0.12)" stroke="#0284c7" strokeWidth="1.8" />
            <path d="M9 12l7-4 7 4-7 4-7-4z" fill="#0284c7" />
            <path d="M11 14.5v5c0 2.5 2.5 4.5 5 4.5s5-2 5-4.5v-5" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M23 13.5v5" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="23" cy="19" r="1" fill="#0284c7" />
          </svg>
        );
      case "hindi":
        return (
          <svg viewBox="0 0 32 32" width="22" height="22" className="cert-svg-logo">
            <rect x="3" y="3" width="26" height="26" rx="8" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M10 9h12M13 9v14M13 15h7c2 0 3.5 1 3.5 3s-1.5 3-3.5 3h-5" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx="21" cy="9" r="1.5" fill="#f59e0b" />
          </svg>
        );
      case "iste":
        return (
          <svg viewBox="0 0 32 32" width="22" height="22" className="cert-svg-logo">
            <circle cx="16" cy="16" r="14" fill="rgba(168, 85, 247, 0.12)" stroke="#a855f7" strokeWidth="1.8" />
            <path d="M10 11h12M16 11v11M12 22h8" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 16l4-3M23 16l-4 3" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      default:
        return <Award size={18} className="cert-svg-logo default-icon" />;
    }
  };

  // Uiverse-Inspired 4 Circular Social Profiles Data (Slide 9: Contact)
  const socialProfilesData: SocialProfile[] = [
    {
      id: "linkedin",
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/sriram-m-90287537b/",
      tooltip: "LinkedIn",
      accentColor: "#0077b5",
      logoType: "linkedin"
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/Sriram2214",
      tooltip: "GitHub",
      accentColor: "#24292e",
      logoType: "github"
    },
    {
      id: "codechef",
      name: "CodeChef",
      url: "https://www.codechef.com/users/srirammuthaiya",
      tooltip: "CodeChef",
      accentColor: "#5b4638",
      logoType: "codechef"
    },
    {
      id: "leetcode",
      name: "LeetCode",
      url: "https://leetcode.com/u/SriramMuthaiya/",
      tooltip: "LeetCode",
      accentColor: "#ffa116",
      logoType: "leetcode"
    }
  ];

  const renderSocialLogo = (type: string) => {
    switch (type) {
      case "linkedin":
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" className="social-svg-icon">
            <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
          </svg>
        );
      case "github":
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" className="social-svg-icon">
            <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
          </svg>
        );
      case "codechef":
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" className="social-svg-icon">
            <path fill="currentColor" d="M12 3c-1.38 0-2.5 1.12-2.5 2.5 0 .28.05.54.14.78C8.5 6.07 7.5 7.18 7.5 8.5c0 .64.22 1.23.59 1.7-.85.5-1.44 1.4-1.44 2.46 0 1.57 1.28 2.84 2.85 2.84h5c1.57 0 2.85-1.27 2.85-2.84 0-1.06-.59-1.96-1.44-2.46.37-.47.59-1.06.59-1.7 0-1.32-1-2.43-2.14-2.22.09-.24.14-.5.14-.78C14.5 4.12 13.38 3 12 3zm-3.5 14v2.5c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V17h-7z"/>
          </svg>
        );
      case "leetcode":
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" className="social-svg-icon">
            <path fill="currentColor" d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.17 5.79a1.374 1.374 0 0 0-.416.977c.004.37.152.72.416.977l5.352 5.352a1.374 1.374 0 0 0 1.944 0l.96-.96a1.374 1.374 0 0 0 0-1.944l-4.38-4.382 4.38-4.38a1.374 1.374 0 0 0 0-1.944l-.96-.96A1.374 1.374 0 0 0 13.483 0zm-8.83 8.3a1.374 1.374 0 0 0-.977.416L.438 12.008a1.374 1.374 0 0 0 0 1.944l3.238 3.238a1.374 1.374 0 0 0 1.944 0l.96-.96a1.374 1.374 0 0 0 0-1.944l-2.266-2.266 2.266-2.266a1.374 1.374 0 0 0 0-1.944l-.96-.96a1.374 1.374 0 0 0-.977-.416zm14.137 0a1.374 1.374 0 0 0-.977.416l-.96.96a1.374 1.374 0 0 0 0 1.944l2.266 2.266-2.266 2.266a1.374 1.374 0 0 0 0 1.944l.96.96a1.374 1.374 0 0 0 1.944 0l3.238-3.238a1.374 1.374 0 0 0 0-1.944l-3.238-3.292a1.374 1.374 0 0 0-.967-.416zm-5.464 7.644a1.374 1.374 0 0 0-.961.438l-5.352 5.352a1.374 1.374 0 0 0 0 1.944l.96.96a1.374 1.374 0 0 0 1.944 0l5.352-5.352a1.374 1.374 0 0 0 0-1.944l-.96-.96a1.374 1.374 0 0 0-.983-.438z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const toggleInternship = () => {
    setActiveInternImageIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handleCollegeDoubleClick = () => {
    window.open("https://kitcbe.com/", "_blank", "noopener,noreferrer");
  };

  const handleCollegeTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      handleCollegeDoubleClick();
    }
    lastTapRef.current = now;
  };

  const handlePublicationDirectUrl = () => {
    const targetUrl = publicationsData[activePubIndex].url;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  // Auto-switch Research Publication every 3 seconds on Slide 7 (Slide index 6)
  useEffect(() => {
    if (stage === "portfolio" && activeSlide === 6) {
      const interval = setInterval(() => {
        setActivePubIndex((prev) => (prev + 1) % publicationsData.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [stage, activeSlide, publicationsData.length]);

  const handleIntroBoxComplete = () => {
    setStage("portfolio");
  };

  const scrollToSlide = (index: number) => {
    setActiveSlide(index);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollPos = containerRef.current.scrollTop;
      const slideIndex = Math.round(scrollPos / window.innerHeight);
      if (slideIndex !== activeSlide) {
        setActiveSlide(slideIndex);
      }
    }
  };

  // Typewriter effect on Slide 1 (Intro)
  useEffect(() => {
    if (stage === "portfolio" && activeSlide === 1 && !isWatchMineOpen) {
      setTypedLength(0);
      let i = 0;
      const interval = setInterval(() => {
        if (i < fullIntroText.length) {
          setTypedLength(i + 1);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [stage, activeSlide, isWatchMineOpen, fullIntroText]);

  // Video playback in Watch Mine
  useEffect(() => {
    if (isWatchMineOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isWatchMineOpen]);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const switchCard = (newIndex: number) => {
    if (newIndex === activeCardIndex || isShuffling) return;
    setIsShuffling(true);
    setActiveCardIndex(newIndex);
    setTimeout(() => {
      setIsShuffling(false);
    }, 450);
  };

  const nextStackCard = () => {
    switchCard((activeCardIndex + 1) % skillStackCards.length);
  };

  const prevStackCard = () => {
    switchCard((activeCardIndex - 1 + skillStackCards.length) % skillStackCards.length);
  };

  // Interactive Drag & Pendulum Swing handlers for Hanging Thread Cards
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    draggingCardRef.current = {
      index,
      startX: e.clientX,
      startY: e.clientY,
      initX: cardStates[index].x,
      initY: cardStates[index].y,
      moved: false
    };
    setCardStates((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isSwinging: false };
      return next;
    });
  };

  const handleIdCardMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    draggingIdCardRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: idCardState.x,
      initY: idCardState.y
    };
    setIdCardState((prev) => ({ ...prev, isSwinging: false }));
  };

  const handleIdCardTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    draggingIdCardRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initX: idCardState.x,
      initY: idCardState.y
    };
    setIdCardState((prev) => ({ ...prev, isSwinging: false }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. Education Hanging Cards
    if (draggingCardRef.current) {
      const { index, startX, startY, initX, initY } = draggingCardRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        draggingCardRef.current.moved = true;
      }
      const tilt = Math.max(-18, Math.min(18, dx * 0.14));

      setCardStates((prev) => {
        const next = [...prev];
        next[index] = {
          x: initX + dx,
          y: initY + dy,
          rot: tilt,
          isSwinging: false
        };
        return next;
      });
    }

    // 2. IGI Global Hanging ID Badge (Slide 7)
    if (draggingIdCardRef.current) {
      const { startX, startY, initX, initY } = draggingIdCardRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const tilt = Math.max(-26, Math.min(26, dx * 0.18));
      setIdCardState({
        x: initX + dx,
        y: initY + dy * 0.5,
        rot: tilt,
        isSwinging: false
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingIdCardRef.current && e.touches.length > 0) {
      const touch = e.touches[0];
      const { startX, startY, initX, initY } = draggingIdCardRef.current;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const tilt = Math.max(-26, Math.min(26, dx * 0.18));
      setIdCardState({
        x: initX + dx,
        y: initY + dy * 0.5,
        rot: tilt,
        isSwinging: false
      });
    }
  };

  const handleMouseUp = () => {
    if (draggingCardRef.current) {
      const index = draggingCardRef.current.index;
      draggingCardRef.current = null;

      // Trigger swinging pendulum wobble on release
      setCardStates((prev) => {
        const next = [...prev];
        next[index] = {
          x: 0,
          y: 0,
          rot: index === 0 ? -3 : index === 1 ? 3 : 0,
          isSwinging: true
        };
        return next;
      });

      setTimeout(() => {
        setCardStates((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], isSwinging: false };
          return next;
        });
      }, 1800);
    }

    if (draggingIdCardRef.current) {
      draggingIdCardRef.current = null;
      setIdCardState({
        x: 0,
        y: 0,
        rot: 0,
        isSwinging: true
      });

      setTimeout(() => {
        setIdCardState((prev) => ({ ...prev, isSwinging: false }));
      }, 2200);
    }
  };

  const handleTouchEnd = () => {
    if (draggingIdCardRef.current) {
      draggingIdCardRef.current = null;
      setIdCardState({
        x: 0,
        y: 0,
        rot: 0,
        isSwinging: true
      });

      setTimeout(() => {
        setIdCardState((prev) => ({ ...prev, isSwinging: false }));
      }, 2200);
    }
  };

  return (
    <div
      className="main-wrapper"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. INITIAL ENTRY STAGE: Pulsating Border */}
      {stage === "intro-box" && (
        <main className="universe-screen animate-fade">
          <div className="pulsating-box-wrapper">
            <div className="border-layer">
              <PulsatingBorder />
            </div>
            <div className="pulsating-box-content">
              <div
                className="text-flow-track"
                onAnimationEnd={handleIntroBoxComplete}
              >
                <h1 className="universe-title">Welcome to Universe of Ram</h1>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 2. PORTFOLIO SLIDES STAGE */}
      {stage === "portfolio" && (
        <div className="portfolio-slides-container animate-enter">
          {/* Uiverse.io Inspired Floating Glass Bevel Pill Navbar */}
          <header className="fixed-nav">
            <nav className="uiverse-menu">
              <button
                className={activeSlide === 0 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(0);
                }}
              >
                <Home size={15} />
                <span>HOME</span>
              </button>

              <button
                className={activeSlide === 1 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(1);
                }}
              >
                <User size={15} />
                <span>MY INTRO</span>
              </button>

              <button
                className={activeSlide === 2 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(2);
                }}
              >
                <Cpu size={15} />
                <span>SKILLS</span>
              </button>

              <button
                className={activeSlide === 3 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(3);
                }}
              >
                <GraduationCap size={15} />
                <span>EDUCATION</span>
              </button>

              <button
                className={activeSlide === 4 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(4);
                }}
              >
                <Briefcase size={15} />
                <span>PROJECTS</span>
              </button>

              <button
                className={activeSlide === 5 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(5);
                }}
              >
                <Layers size={15} />
                <span>EXPERIENCE</span>
              </button>

              <button
                className={activeSlide === 6 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(6);
                }}
              >
                <BookOpen size={15} />
                <span>RESEARCH</span>
              </button>

              <button
                className={activeSlide === 7 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(7);
                }}
              >
                <Award size={15} />
                <span>CERTIFICATIONS</span>
              </button>

              <button
                className={activeSlide === 8 && !isWatchMineOpen ? "active" : ""}
                onClick={() => {
                  setIsWatchMineOpen(false);
                  scrollToSlide(8);
                }}
              >
                <Send size={15} />
                <span>CONNECT</span>
              </button>

              <button
                className={isWatchMineOpen ? "active" : ""}
                onClick={() => setIsWatchMineOpen(true)}
              >
                <Video size={15} />
                <span>WATCH MINE</span>
              </button>
            </nav>
          </header>

          {/* If Watch Mine Section is Open: Left Description + Right Video */}
          {isWatchMineOpen ? (
            <div className="watch-mine-fullpage animate-enter">
              <div className="watch-mine-layout">
                {/* LEFT SIDE: Description & Bio */}
                <div className="watch-mine-left-col">
                  <div className="wm-tag-badge">
                    <Sparkles size={14} className="cyan-glow-icon" />
                    <span>WATCH MINE // INTRO</span>
                  </div>

                  <h2 className="wm-headline">Hi, I'm Sriram</h2>

                  <div className="wm-details-card">
                    <p className="wm-paragraph">
                      Hi, I'm <strong>Sriram</strong>, an <strong>Artificial Intelligence and Machine Learning Engineering student</strong> passionate about building intelligent, real-world solutions.
                    </p>
                    <p className="wm-paragraph">
                      My journey spans <strong>AI, Machine Learning, Deep Learning, IoT, Full-Stack Development</strong>, and <strong>research</strong>, with hands-on experience through innovative projects, internships, and academic publications.
                    </p>
                    <p className="wm-paragraph">
                      I continuously explore emerging technologies, strengthen my problem-solving skills through coding, and actively pursue excellence both in technology and sports. Welcome to my portfolio!
                    </p>
                  </div>

                  <div className="wm-actions-row">
                    <button
                      className="contact-pill-btn wm-back-btn"
                      onClick={() => setIsWatchMineOpen(false)}
                    >
                      <ArrowLeft size={16} />
                      <span>Back to Portfolio</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE: Video Player */}
                <div className="watch-mine-right-col">
                  <div className="wm-video-container">
                    <video
                      ref={videoRef}
                      src="/intro-video.mp4"
                      autoPlay
                      loop
                      playsInline
                      muted={isMuted}
                      className="wm-video-media"
                    />

                    {/* Floating Video Controls */}
                    <div className="wm-controls-bar">
                      <button className="media-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button className="media-btn" onClick={toggleAudio} title={isMuted ? "Unmute" : "Mute"}>
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Smooth Scrollable Slides Viewport */
            <div
              ref={containerRef}
              className="slides-scroll-viewport"
              onScroll={handleScroll}
            >
              {/* SLIDE 1: MAIN HERO (SRIRAM & PORTFOLIO) */}
              <section className="portfolio-slide-section slide-hero">
                <div className="hero-center-container">
                  {/* Backdrop Group */}
                  <div className="portfolio-backdrop-group">
                    <div className="sriram-behind-portfolio">
                      SRIRAM
                    </div>
                    <div className="portfolio-title-layer">
                      PORTFOLIO
                    </div>
                  </div>

                  {/* Sriram Suit Photo */}
                  <div className="person-photo-container animate-rise-up">
                    <div className="photo-clean-wrapper">
                      <img
                        src="/sriram.jpeg"
                        alt="Sriram - Software Developer"
                        className="person-photo"
                      />
                    </div>
                  </div>

                  {/* Left Subtitle */}
                  <div className="hero-bottom-left animate-slide-in-left">
                    <h2 className="title-role">
                      <span className="bold-word">Software</span>{" "}
                      <span className="italic-word">Developer</span>
                    </h2>
                  </div>

                  {/* Right Action: Watch Mine Button */}
                  <div className="hero-bottom-right animate-slide-in-right">
                    <button
                      className="contact-pill-btn watch-mine-btn"
                      onClick={() => setIsWatchMineOpen(true)}
                      title="Watch Sriram's Video Intro"
                    >
                      <span className="pill-pulse-icon">▶</span>
                      <span className="pill-text">Watch Mine</span>
                    </button>

                    <button
                      className="scroll-down-ghost-btn"
                      onClick={() => scrollToSlide(1)}
                      title="Scroll down to Intro"
                    >
                      <span>Scroll to Intro</span>
                      <ArrowDown size={14} className="bounce-arrow" />
                    </button>
                  </div>
                </div>
              </section>

              {/* SLIDE 2: INTRO SLIDE (EXACT COMPOSITE FRAME WITH MOTION TYPEWRITER STREAMING) */}
              <section className="portfolio-slide-section slide-intro-frame-view">
                <div className="exact-intro-frame-container">
                  {/* The Exact User Uploaded Background Frame */}
                  <img
                    src="/sriram-intro.png"
                    alt="Sriram Intro Presentation"
                    className="exact-intro-bg-image"
                  />

                  {/* Card Motion Text Overlay positioned perfectly over the card box */}
                  <div className="exact-intro-card-overlay">
                    <p className="exact-streaming-text">
                      {fullIntroText.slice(0, typedLength)}
                      {typedLength < fullIntroText.length && (
                        <span className="typing-blinking-cursor">|</span>
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* SLIDE 3: VERTICAL STACKED ACCORDION DECK (SKILLS - GRAND LEFT HEADER) */}
              <section className="portfolio-slide-section slide-skills-stack-view">
                <div className="skills-stack-inner">
                  {/* Left Header Info */}
                  <div className="skills-stack-left-header">
                    <div className="skills-eyebrow-tag">
                      <span className="pulsing-cyan-dot"></span>
                      <span>WHAT SHOULD I KNOW</span>
                    </div>
                    <h2 className="giant-skills-title">Skills</h2>
                    <p className="skills-stack-subtitle">
                      Click any card header in the stack or use the controls to shuffle and explore my full technical expertise.
                    </p>

                    {/* Shuffle Controls */}
                    <div className="stack-nav-controls">
                      <button
                        className="stack-arrow-btn"
                        onClick={prevStackCard}
                        title="Previous Stack"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <div className="stack-counter">
                        <span className="active-idx">0{activeCardIndex + 1}</span>
                        <span className="divider">/</span>
                        <span className="total-idx">0{skillStackCards.length}</span>
                      </div>
                      <button
                        className="stack-arrow-btn"
                        onClick={nextStackCard}
                        title="Next Stack"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Right: Layered Physical Stack */}
                  <div className="vertical-deck-wrapper">
                    {skillStackCards.map((card, idx) => {
                      const isActive = idx === activeCardIndex;
                      const isPast = idx < activeCardIndex;

                      return (
                        <div
                          key={idx}
                          className={`stacked-layer-card ${isActive ? "card-active-front" : isPast ? "card-peeking-top" : "card-peeking-bottom"}`}
                          style={{
                            zIndex: isActive ? 30 : 20 - Math.abs(idx - activeCardIndex),
                            transform: isActive
                              ? "translateY(0) scale(1)"
                              : isPast
                              ? `translateY(-${(activeCardIndex - idx) * 36}px) scale(${1 - (activeCardIndex - idx) * 0.03})`
                              : `translateY(${(idx - activeCardIndex) * 28}px) scale(${1 - (idx - activeCardIndex) * 0.03})`,
                            opacity: isActive ? 1 : 0.85 - Math.abs(idx - activeCardIndex) * 0.15
                          }}
                          onClick={() => switchCard(idx)}
                        >
                          {/* Card Header */}
                          <div className="stacked-card-header">
                            <div className="card-num-eyebrow-group">
                              <span className="card-big-num">{card.num}</span>
                              <div className="card-title-group">
                                <span className="card-eyebrow-text">{card.eyebrow}</span>
                                <h3 className="card-main-title">{card.title}</h3>
                              </div>
                            </div>

                            <div className="live-project-pill-btn">
                              <span>{card.tag}</span>
                            </div>
                          </div>

                          {/* Card Body with Skills */}
                          <div className="stacked-card-body">
                            {card.groups.map((grp, gIdx) => (
                              <div key={gIdx} className="card-skill-subgroup">
                                <h4 className="subgroup-title">{grp.label}</h4>
                                <div className="subgroup-badges-list">
                                  {grp.skills.map((sk, sIdx) => (
                                    <span key={sIdx} className="deck-skill-badge">
                                      <span className="deck-dot"></span>
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Top Subtle Edge Highlight */}
                          <div className="card-top-edge-highlight"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* SLIDE 4: EDUCATION (GRAND LEFT HEADER - THE WAY I HAVE CAME) */}
              <section className="portfolio-slide-section slide-education-view">
                <div className="education-slide-inner">
                  {/* Top-Left Section Header */}
                  <div className="education-header-wrap">
                    <div className="skills-eyebrow-tag">
                      <span className="pulsing-red-dot"></span>
                      <span>THE WAY I HAVE CAME</span>
                    </div>
                    <h2 className="giant-skills-title">Education Journey</h2>
                  </div>

                  {/* Canvas with Symmetrical Zero-Touch Layout */}
                  <div className="hanging-threads-canvas">
                    {/* SVG Connecting Thread Lines */}
                    <svg className="threads-svg-layer" viewBox="0 0 1200 580" preserveAspectRatio="none">
                      {/* Thread from Card 01 to Card 02 */}
                      <path
                        d="M 260 130 C 460 20, 740 20, 940 130"
                        className="hanging-thread-line"
                      />
                      {/* Thread from Card 02 to Dead-Center Card 03 */}
                      <path
                        d="M 940 180 C 920 380, 760 440, 600 440"
                        className="hanging-thread-line"
                      />
                      {/* Thread from Dead-Center Card 03 to Card 01 */}
                      <path
                        d="M 600 440 C 440 440, 280 380, 260 180"
                        className="hanging-thread-line"
                      />
                    </svg>

                    {/* CARD 01: Top-Left (School) */}
                    <div
                      className={`hanging-card-wrapper card-pos-top-left ${cardStates[0].isSwinging ? "pendulum-swing-active" : "hanging-idle-sway-1"}`}
                      style={{
                        transform: `translate(${cardStates[0].x}px, ${cardStates[0].y}px) rotate(${cardStates[0].rot}deg)`
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 0)}
                    >
                      <div className="thread-pin-anchor"></div>
                      <div className="hanging-thread-stalk"></div>
                      <div className="edu-journey-card card-glow-red">
                        <div className="edu-card-top-bar">
                          <span className="edu-num-badge">{educationCards[0].num}</span>
                          <span className="edu-cat-pill">{educationCards[0].category}</span>
                        </div>
                        <h3 className="edu-card-title">{educationCards[0].title}</h3>
                        <p className="edu-card-institution">{educationCards[0].institution}</p>
                        <div className="edu-stats-row">
                          {educationCards[0].stats?.map((st, sIdx) => (
                            <div key={sIdx} className="edu-stat-item">
                              <span className="edu-stat-label">{st.label}</span>
                              <span className="edu-stat-val">{st.value}</span>
                            </div>
                          ))}
                        </div>
                        <p className="edu-card-desc">{educationCards[0].desc}</p>
                      </div>
                    </div>

                    {/* CARD 02: Top-Right (College - Silent Double-Tap to https://kitcbe.com/) */}
                    <div
                      className={`hanging-card-wrapper card-pos-top-right ${cardStates[1].isSwinging ? "pendulum-swing-active" : "hanging-idle-sway-2"}`}
                      style={{
                        transform: `translate(${cardStates[1].x}px, ${cardStates[1].y}px) rotate(${cardStates[1].rot}deg)`
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 1)}
                      onDoubleClick={handleCollegeDoubleClick}
                      onTouchEnd={handleCollegeTouchEnd}
                    >
                      <div className="thread-pin-anchor"></div>
                      <div className="hanging-thread-stalk"></div>
                      <div className="edu-journey-card card-glow-red">
                        <div className="edu-card-top-bar">
                          <span className="edu-num-badge">{educationCards[1].num}</span>
                          <span
                            className="edu-cat-pill"
                            onDoubleClick={handleCollegeDoubleClick}
                          >
                            {educationCards[1].category}
                          </span>
                        </div>
                        <h3 className="edu-card-title">{educationCards[1].title}</h3>
                        <p className="edu-card-institution" onDoubleClick={handleCollegeDoubleClick}>
                          {educationCards[1].institution}
                        </p>
                        <p className="edu-card-degree">{educationCards[1].degree}</p>
                        <div className="edu-stats-row">
                          {educationCards[1].stats?.map((st, sIdx) => (
                            <div key={sIdx} className="edu-stat-item">
                              <span className="edu-stat-label">{st.label}</span>
                              <span className="edu-stat-val">{st.value}</span>
                            </div>
                          ))}
                        </div>
                        <p className="edu-card-desc">{educationCards[1].desc}</p>
                      </div>
                    </div>

                    {/* CARD 03: DEAD CENTER BETWEEN BOTH (Future - Zero Touch Guaranteed) */}
                    <div
                      className={`hanging-card-wrapper card-pos-dead-center ${cardStates[2].isSwinging ? "pendulum-swing-active" : "hanging-idle-sway-3"}`}
                      style={{
                        transform: `translate(${cardStates[2].x}px, ${cardStates[2].y}px) rotate(${cardStates[2].rot}deg)`
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 2)}
                    >
                      <div className="thread-pin-anchor"></div>
                      <div className="hanging-thread-stalk"></div>
                      <div className="edu-journey-card card-glow-white">
                        <div className="edu-card-top-bar">
                          <span className="edu-num-badge">{educationCards[2].num}</span>
                          <span className="edu-cat-pill">{educationCards[2].category}</span>
                        </div>
                        <h3 className="edu-card-title">{educationCards[2].title}</h3>
                        <div className="edu-future-motto">
                          <span>{educationCards[2].motto}</span>
                        </div>
                        <p className="edu-future-focus">{educationCards[2].focus}</p>
                        <p className="edu-card-desc">{educationCards[2].desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SLIDE 5: PROJECTS (GRAND LEFT HEADER - WHAT I HAVE DONE) */}
              <section className="portfolio-slide-section slide-coverflow-projects-view">
                <div className="coverflow-projects-inner">
                  {/* Top-Left Section Header */}
                  <div className="slide-section-top-left-header">
                    <div className="skills-eyebrow-tag">
                      <span className="pulsing-cyan-dot"></span>
                      <span>WHAT I HAVE DONE</span>
                    </div>
                    <h2 className="giant-skills-title">Projects</h2>
                  </div>

                  {/* 3D Coverflow Gallery Canvas with 5 Clean White Playing Cards */}
                  <div className="coverflow-gallery-stage">
                    <Smooth3DSlideshow
                      slides={whiteCoverflowProjectSlides}
                      cardWidth={380}
                      cardHeight={380}
                      radius={26}
                      tilt={18}
                      sideTilt={6}
                      gap={7.8}
                      opacity={50}
                    />
                  </div>
                </div>
              </section>

              {/* SLIDE 6: INTERN AND EXPERIENCE (LEFT SRIRAM PHOTO + RIGHT INTERNSHIP + BOTTOM SPEEDER SWITCHER) */}
              <section className="portfolio-slide-section slide-internship-exact-view">
                <div className="internship-exact-slide-inner">
                  {/* Top Header Row */}
                  <div className="intern-dual-header-row">
                    <div className="slide-section-top-left-header">
                      <div className="skills-eyebrow-tag">
                        <span className="pulsing-cyan-dot"></span>
                        <span>CAREER JOURNEY</span>
                      </div>
                      <h2 className="giant-skills-title">Intern and Experience</h2>
                    </div>
                  </div>

                  {/* Dual Frame Canvas: Left Sriram Photo Frame + Center Floating Speeder Switcher + Right 3D Flipping Internship */}
                  <div className="intern-dual-frames-canvas">
                    {/* Left Frame: Sriram Developer Portrait Frame */}
                    <div className="sriram-dev-frame-wrapper">
                      <img
                        src="/sriram-intern-frame.png"
                        alt="Sriram Developer Profile"
                        className="sriram-dev-frame-image"
                      />
                    </div>

                    {/* Center Floating Interactive Speeder Icon (Between both frames) */}
                    <div
                      className="intern-center-speeder-orb"
                      onClick={toggleInternship}
                      title="Touch to Flip Internship"
                    >
                      <img
                        src="/speeder-runner.png"
                        alt="Speeder Runner"
                        className="speeder-runner-img"
                      />
                    </div>

                    {/* Right Frame: 3D Flapping / Flipping Internship Presentation Sheet */}
                    <div className="intern-right-showcase-column">
                      <div className={`intern-flip-card-stage ${activeInternImageIndex === 1 ? "is-flipped" : ""}`}>
                        <div className="intern-flip-card-inner">
                          {/* Front Face: ServiceNow University */}
                          <div className="intern-flip-card-face intern-face-front">
                            <img
                              src={internshipImages[0].imageSrc}
                              alt={internshipImages[0].alt}
                              className="exact-intern-image-display"
                            />
                          </div>

                          {/* Back Face: VDart Academy */}
                          <div className="intern-flip-card-face intern-face-back">
                            <img
                              src={internshipImages[1].imageSrc}
                              alt={internshipImages[1].alt}
                              className="exact-intern-image-display"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SLIDE 7: ULTRA-PREMIUM CINEMATIC 3D RESEARCH PUBLICATION (EXACT MATCH TO REFERENCE DESIGN) */}
              <section className="portfolio-slide-section slide-research-pub-view">
                <div className="research-pub-exact-stage">
                  {/* Atmospheric Background Effects */}
                  <div className="research-cosmic-bg">
                    <div className="cosmic-glow-spot-1"></div>
                    <div className="cosmic-glow-spot-2"></div>
                    <div className="cosmic-grid-lines"></div>
                  </div>

                  {/* TOP-LEFT HEADER (Matching all other slides: giant-skills-title) */}
                  <div className="slide-section-top-left-header research-exact-header">
                    <div className="skills-eyebrow-tag">
                      <span className="pulsing-cyan-dot"></span>
                      <span>{publicationsData[activePubIndex].badge}</span>
                    </div>

                    <h2 className="giant-skills-title">Research Publication</h2>

                    <p className="research-exact-subtitle">
                      {publicationsData[activePubIndex].fullChapterTitle}
                    </p>
                  </div>

                  {/* LEFT RESEARCHER GLASS CARD (Exact match to Reference: Photo on Left, Metadata on Right) */}
                  <div className="research-exact-left-card">
                    <div className="research-exact-portrait-box">
                      <img
                        src="/sriram-research-portrait.jpg"
                        alt="Sriram Researcher Portrait"
                        className="research-exact-photo"
                      />
                    </div>

                    <div className="research-exact-meta-list">
                      <div className="research-exact-meta-item">
                        <BookOpen className="meta-icon cyan" size={17} />
                        <div className="meta-info">
                          <span className="meta-heading">Publication Type</span>
                          <span className="meta-desc">{publicationsData[activePubIndex].type}</span>
                        </div>
                      </div>

                      <div className="research-exact-meta-item">
                        <Globe className="meta-icon cyan" size={17} />
                        <div className="meta-info">
                          <span className="meta-heading">Research Domain</span>
                          <span className="meta-desc" style={{ whiteSpace: 'pre-line' }}>{publicationsData[activePubIndex].domain}</span>
                        </div>
                      </div>

                      <div className="research-exact-meta-item">
                        <FileText className="meta-icon cyan" size={17} />
                        <div className="meta-info">
                          <span className="meta-heading">Chapter Title</span>
                          <span className="meta-desc">{publicationsData[activePubIndex].fullChapterTitle}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CENTER FLOATING 3D BOOK WITH DIRECT LINK TO PUBLICATION */}
                  <div
                    className="research-exact-center-book"
                    onClick={handlePublicationDirectUrl}
                    title={`Explore ${publicationsData[activePubIndex].fullChapterTitle} on IGI Global`}
                  >
                    <div className="exact-book-3d-wrapper">
                      <div className="exact-book-face">
                        <div className="exact-book-top-tag">— {publicationsData[activePubIndex].badge} —</div>
                        <div className="exact-book-main-title" style={{ whiteSpace: 'pre-line' }}>
                          {publicationsData[activePubIndex].bookMainTitle}
                        </div>
                        <div className="exact-book-sub-title" style={{ whiteSpace: 'pre-line' }}>
                          {publicationsData[activePubIndex].bookSubTitle}
                        </div>

                        <div className="exact-book-cover-frame">
                          <img
                            key={activePubIndex}
                            src={publicationsData[activePubIndex].coverImage}
                            alt={publicationsData[activePubIndex].fullChapterTitle}
                            className="exact-book-cover-image"
                          />
                        </div>

                        <div
                          className="exact-book-btn-floating"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePublicationDirectUrl();
                          }}
                        >
                          <span>EXPLORE PUBLICATION</span>
                          <ArrowRight size={12} />
                        </div>
                      </div>
                      <div className="exact-book-pages-bottom"></div>
                      <div className="exact-book-pages-left"></div>
                    </div>
                    <div className="exact-book-shadow"></div>
                  </div>

                  {/* RIGHT HANGING IGI GLOBAL ID CARD (PHYSICS DRAG & PENDULUM SWING) */}
                  <div className="research-exact-right-idcard-zone">
                    <div
                      className={`hanging-idcard-wrapper ${idCardState.isSwinging ? "id-card-pendulum-active" : "id-card-idle-sway"}`}
                      style={{
                        transform: `translate(${idCardState.x}px, ${idCardState.y}px) rotate(${idCardState.rot}deg)`
                      }}
                      onMouseDown={handleIdCardMouseDown}
                      onTouchStart={handleIdCardTouchStart}
                      title="Drag to Swing IGI Global ID Badge"
                    >
                      <div className="igi-idcard-badge-body">
                        <img
                          src="/sriram-igi-id-card.png"
                          alt="Sriram M - IGI Global Research Contributor ID Badge"
                          className="igi-idcard-badge-image"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* LOWER-MIDDLE THREE CONCEPTUAL RESEARCH DIALS */}
                  <div className="research-exact-spheres-bar">
                    {/* Circle 01 */}
                    <div className="exact-sphere-dial dial-blue">
                      <div className="dial-circle-glow glow-blue">
                        <span className="dial-num">01</span>
                        <h4 className="dial-title">PSYCHOLOGICAL<br />EXPERIENCE</h4>
                        <p className="dial-text">Human emotional experience and psychological complexity.</p>
                      </div>
                    </div>

                    {/* Connector Arrow 1 */}
                    <div className="exact-dial-arrow">
                      <svg className="arc-path-svg" viewBox="0 0 60 20">
                        <path d="M5 18 Q30 2 55 18" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeDasharray="3 2" />
                      </svg>
                      <span className="double-arrow-sym">↕</span>
                    </div>

                    {/* Circle 02 */}
                    <div className="exact-sphere-dial dial-purple">
                      <div className="dial-circle-glow glow-purple">
                        <span className="dial-num">02</span>
                        <h4 className="dial-title">CLINICAL<br />DIMENSIONS</h4>
                        <p className="dial-text">Analytical frameworks, clinical perspectives, and structured observation.</p>
                      </div>
                    </div>

                    {/* Connector Arrow 2 */}
                    <div className="exact-dial-arrow">
                      <svg className="arc-path-svg" viewBox="0 0 60 20">
                        <path d="M5 18 Q30 2 55 18" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeDasharray="3 2" />
                      </svg>
                      <span className="double-arrow-sym">↕</span>
                    </div>

                    {/* Circle 03 */}
                    <div className="exact-sphere-dial dial-cyan">
                      <div className="dial-circle-glow glow-cyan">
                        <span className="dial-num">03</span>
                        <h4 className="dial-title">AFFECTIVE<br />CORRELATES</h4>
                        <p className="dial-text">Emotional patterns, affective processes, and emotional relationships.</p>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM FULL-WIDTH GLASS PANEL */}
                  <div className="research-exact-bottom-banner">
                    {/* Left Waveform Graphic */}
                    <div className="banner-left-waveform">
                      <svg viewBox="0 0 160 50" className="banner-wave-svg">
                        <path d="M0 25 Q20 5 40 25 T80 25 T120 25 T160 25" fill="none" stroke="#38bdf8" strokeWidth="1.8" opacity="0.8" />
                        <path d="M0 25 Q20 40 40 25 T80 25 T120 25 T160 25" fill="none" stroke="#818cf8" strokeWidth="1.2" opacity="0.5" strokeDasharray="4 2" />
                        <circle cx="80" cy="25" r="3.5" fill="#38bdf8" />
                        <circle cx="120" cy="25" r="3.5" fill="#06b6d4" />
                      </svg>
                    </div>

                    {/* Center Text */}
                    <div className="banner-center-text">
                      <h3 className="banner-main-title">Exploring Complex Questions Through Research.</h3>
                      <p className="banner-sub-text">
                        Research creates space for deeper understanding, critical analysis,<br />
                        and the exploration of complex human experiences.
                      </p>
                    </div>

                    {/* Right Data Equalizer & Radar Gauge Graphic */}
                    <div className="banner-right-telemetry">
                      <div className="telemetry-bars">
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                      </div>
                      <div className="telemetry-gauge">
                        <div className="gauge-ring"></div>
                        <div className="gauge-dot"></div>
                      </div>
                      <div className="telemetry-bars mini">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SLIDE 8: CERTIFICATIONS & CREDENTIALS (PREMIUM LIGHT-THEME LIQUID GLASS AESTHETIC) */}
              <section className="portfolio-slide-section slide-certifications-view">
                <div className="certifications-slide-inner">
                  {/* Top Header Block with Section Title, Subtitle & Summary Badge */}
                  <div className="certifications-header-block">
                    <div className="skills-eyebrow-tag">
                      <span className="pulsing-cyan-dot"></span>
                      <span>INDUSTRY-RECOGNIZED EXCELLENCE</span>
                      <span className="cert-count-pill">{certificationsData.length} Credentials</span>
                    </div>

                    <h2 className="giant-skills-title">Certifications</h2>

                    <p className="certifications-subtitle">
                      Industry-recognized certifications and continuous learning across AI, Cloud, Data, and Software Engineering.
                    </p>

                    {/* Filter Tabs Bar */}
                    <div className="cert-filter-tabs">
                      {filterCategories.map((cat) => (
                        <button
                          key={cat}
                          className={`cert-filter-btn ${activeCertFilter === cat ? "active" : ""}`}
                          onClick={() => setActiveCertFilter(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3-Column Glass-Card Grid */}
                  <div className="certifications-grid">
                    {filteredCertifications.map((cert) => (
                      <div key={cert.id} className="cert-glass-card">
                        {/* Top Row: Issuer Logo & Category Badge */}
                        <div className="cert-card-top">
                          <div className="cert-logo-box">
                            {renderCertLogo(cert.logoType)}
                          </div>
                          <span className="cert-category-tag">{cert.badgeTag}</span>
                        </div>

                        {/* Title & Issuer Name */}
                        <div>
                          <h3 className="cert-card-title">{cert.title}</h3>
                          <p className="cert-issuer-name">{cert.issuer}</p>
                        </div>

                        {/* Short Description */}
                        <p className="cert-card-desc">{cert.description}</p>

                        {/* Bottom Action Footer */}
                        <div className="cert-card-footer">
                          {cert.credentialUrl ? (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cert-view-btn"
                            >
                              <span>View Credential</span>
                              <ExternalLink size={14} className="cert-btn-icon" />
                            </a>
                          ) : (
                            <button disabled className="cert-view-btn disabled">
                              <span>Verified Credential</span>
                              <CheckCircle size={14} className="cert-btn-icon" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SLIDE 9: LET'S CONNECT (PREMIUM CONTACT & UIVERSE GLASS SOCIAL PROFILES) */}
              <section className="portfolio-slide-section slide-contact-view">
                <div className="contact-slide-inner">
                  {/* Header Block */}
                  <div className="contact-header-block">
                    <div className="skills-eyebrow-tag">
                      <span className="pulsing-cyan-dot"></span>
                      <span>GET IN TOUCH</span>
                    </div>

                    <h2 className="giant-skills-title">Let’s Connect</h2>

                    <p className="contact-subtitle">
                      Have an idea, opportunity, or project in mind? Let’s connect and build something meaningful.
                    </p>
                  </div>

                  {/* Uiverse.io MrBishtji Social Icons Component */}
                  <div id="SocailIcons">
                    <a
                      href="https://www.linkedin.com/in/sriram-m-90287537b/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icons linkedin"
                      aria-label="LinkedIn"
                    >
                      <p className="iconName">LinkedIn</p>
                      <div className="icon link">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
                        </svg>
                      </div>
                    </a>

                    <a
                      href="https://github.com/Sriram2214"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icons github"
                      aria-label="GitHub"
                    >
                      <p className="iconName">GitHub</p>
                      <div className="icon git">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                        </svg>
                      </div>
                    </a>

                    <a
                      href="https://www.codechef.com/users/srirammuthaiya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icons codechef"
                      aria-label="CodeChef"
                    >
                      <p className="iconName">CodeChef</p>
                      <div className="icon chef">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                          <path d="M12 3c-1.38 0-2.5 1.12-2.5 2.5 0 .28.05.54.14.78C8.5 6.07 7.5 7.18 7.5 8.5c0 .64.22 1.23.59 1.7-.85.5-1.44 1.4-1.44 2.46 0 1.57 1.28 2.84 2.85 2.84h5c1.57 0 2.85-1.27 2.85-2.84 0-1.06-.59-1.96-1.44-2.46.37-.47.59-1.06.59-1.7 0-1.32-1-2.43-2.14-2.22.09-.24.14-.5.14-.78C14.5 4.12 13.38 3 12 3zm-3.5 14v2.5c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V17h-7z"/>
                        </svg>
                      </div>
                    </a>

                    <a
                      href="https://leetcode.com/u/SriramMuthaiya/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icons leetcode"
                      aria-label="LeetCode"
                    >
                      <p className="iconName">LeetCode</p>
                      <div className="icon leet">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.17 5.79a1.374 1.374 0 0 0-.416.977c.004.37.152.72.416.977l5.352 5.352a1.374 1.374 0 0 0 1.944 0l.96-.96a1.374 1.374 0 0 0 0-1.944l-4.38-4.382 4.38-4.38a1.374 1.374 0 0 0 0-1.944l-.96-.96A1.374 1.374 0 0 0 13.483 0zm-8.83 8.3a1.374 1.374 0 0 0-.977.416L.438 12.008a1.374 1.374 0 0 0 0 1.944l3.238 3.238a1.374 1.374 0 0 0 1.944 0l.96-.96a1.374 1.374 0 0 0 0-1.944l-2.266-2.266 2.266-2.266a1.374 1.374 0 0 0 0-1.944l-.96-.96a1.374 1.374 0 0 0-.977-.416zm14.137 0a1.374 1.374 0 0 0-.977.416l-.96.96a1.374 1.374 0 0 0 0 1.944l2.266 2.266-2.266 2.266a1.374 1.374 0 0 0 0 1.944l.96.96a1.374 1.374 0 0 0 1.944 0l3.238-3.238a1.374 1.374 0 0 0 0-1.944l-3.238-3.292a1.374 1.374 0 0 0-.967-.416zm-5.464 7.644a1.374 1.374 0 0 0-.961.438l-5.352 5.352a1.374 1.374 0 0 0 0 1.944l.96.96a1.374 1.374 0 0 0 1.944 0l5.352-5.352a1.374 1.374 0 0 0 0-1.944l-.96-.96a1.374 1.374 0 0 0-.983-.438z"/>
                        </svg>
                      </div>
                    </a>
                  </div>

                  {/* Minimal Contact Information Card */}
                  <div className="contact-info-glass-card">
                    <h3 className="contact-person-name">Sriram M.</h3>
                    <p className="contact-person-role">AI & ML Engineering Student</p>
                    <p className="contact-person-location">Coimbatore, Tamil Nadu</p>
                  </div>

                  {/* Premium Glass CTA Button */}
                  <div className="contact-cta-wrapper">
                    <a
                      href="https://www.linkedin.com/in/sriram-m-90287537b/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-cta-btn"
                    >
                      <span>Let’s Work Together</span>
                      <ArrowRight size={16} className="cta-arrow-icon" />
                    </a>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
