export type Profile = {
  name: string;
  headline: string;
  about: string;
  skills: string;
  projects: string;
  experience: string;
};

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  responsibilities: string[];
};

/** Clearly labeled sample — not information about the real user. */
export const SAMPLE_PROFILE: Profile = {
  name: "Sample Student",
  headline: "Computer Engineering student (sample profile)",
  about: "This is a sample profile used for demonstration. Replace it with your own details.",
  skills: "Python, HTML, CSS, JavaScript, Arduino",
  projects: "Smart plant monitor using sensors and an Arduino board\nPersonal portfolio website",
  experience: "Teaching assistant for an introductory programming course",
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "ai-automation-intern",
    title: "AI Automation Intern",
    company: "TechFlow",
    description:
      "Support development of AI-powered workflows and automation solutions for business processes.",
    skills: ["Python", "AI", "Automation", "APIs"],
    responsibilities: [
      "Help design and test automated workflows",
      "Write Python scripts that connect services through APIs",
      "Document automation processes and results",
    ],
  },
  {
    id: "junior-frontend-developer",
    title: "Junior Frontend Developer",
    company: "PixelWorks",
    description: "Help build responsive web interfaces and interactive user experiences.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    responsibilities: [
      "Build responsive pages and reusable interface elements",
      "Implement interactive features in React",
      "Collaborate with designers to refine user experience",
    ],
  },
  {
    id: "iot-solutions-engineer",
    title: "IoT Solutions Engineer",
    company: "Connected Systems Lab",
    description:
      "Support development of connected systems using sensors, microcontrollers, and software.",
    skills: ["IoT", "Python", "ESP32", "APIs"],
    responsibilities: [
      "Prototype connected devices with ESP32 microcontrollers",
      "Integrate sensor data with software services via APIs",
      "Test and troubleshoot hardware and software systems",
    ],
  },
];

export const getOpportunity = (id: string) => OPPORTUNITIES.find((o) => o.id === id);

/** Simple keyword match used only for the clearly-labeled demonstration preview. */
export function demoMatch(profile: Profile, opp: Opportunity) {
  const text = Object.values(profile).join(" ").toLowerCase();
  const relevant = opp.skills.filter((s) => text.includes(s.toLowerCase()));
  const gaps = opp.skills.filter((s) => !relevant.includes(s));
  return { relevant, gaps };
}

export function hasEnoughData(p: Profile) {
  return p.skills.trim().length > 0 && (p.projects.trim() || p.experience.trim() || p.about.trim()).length > 0;
}
