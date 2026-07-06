export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  achievements: string[];
  current?: boolean;
}

export const experiences: Experience[] = [
  {
    company: "Unifycx",
    role: "Web Advisor",
    period: "Jun 2025 — Present",
    location: "Mangalore, Karnataka",
    current: true,
    achievements: [
      "Assisted customers with website migrations, SSL installations, email configurations, and hosting control panel issues.",
      "Provided technical support for WordPress, CMS platforms, hosting, DNS, and email services in shared hosting environments.",
      "Collaborated with teams, documented support interactions, and resolved issues through effective troubleshooting.",
    ],
  },
  {
    company: "Freelancer",
    role: "Freelance Web Developer",
    period: "Dec 2024 — Jun 2025",
    location: "Mangalore, Karnataka",
    achievements: [
      "Designed and developed custom websites and web applications using modern frontend and backend technologies.",
      "Delivered responsive, performance-focused, and user-friendly solutions.",
      "Improved applications continuously based on user feedback.",
    ],
  },
  {
    company: "Glowtouch Technologies",
    role: "Junior Support Engineer",
    period: "Aug 2024 — Dec 2024",
    location: "Mangalore, Karnataka",
    achievements: [
      "Provided live chat support for hosting, domain, and website-related issues.",
      "Troubleshot WordPress, PHP, MySQL, server, DNS, email, and website migration issues.",
      "Documented common issues and collaborated to improve support efficiency.",
    ],
  },
  {
    company: "Vitvara Technologies",
    role: "Web Developer Intern",
    period: "Jan 2024 — May 2024",
    location: "Mangalore, Karnataka",
    achievements: [
      "Engineered responsive, user-centric web apps with HTML, CSS, JavaScript, and React.js.",
      "Designed and implemented scalable API functionality, optimizing for performance and security.",
      "Debugged and tested applications, reducing reported bugs and improving reliability.",
    ],
  },
];

export interface Education {
  school: string;
  degree: string;
  period: string;
  location: string;
}

export const education: Education[] = [
  {
    school: "Karnataka (Govt) Polytechnic, Mangalore",
    degree: "Diploma — Full Stack Development",
    period: "May 2024",
    location: "Mangalore, Karnataka",
  },
  {
    school: "Milagres High School",
    degree: "10th — High School",
    period: "May 2018",
    location: "Mangalore, Karnataka",
  },
];

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  verifyUrl: string;
}

export const certifications: Certification[] = [
  { name: "Full Stack Web Development", issuer: "Karnataka Govt Polytechnic", year: "2024", verifyUrl: "#" }
];
