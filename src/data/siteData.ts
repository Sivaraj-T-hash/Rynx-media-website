/**
 * RYNX DIGITAL MEDIA - FAQ & PROCESS & TESTIMONIALS DATA
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-types",
    question: "What types of videos do you edit?",
    answer: "We edit across the full spectrum of modern digital video: Instagram Reels, YouTube long-form videos, Shorts, multi-camera podcasts, promotional commercials, corporate presentations, documentary edits, and motion graphic sequences. Whether you need snappy 30-second vertical videos or an hour-long documentary, we tailor our editing pipeline to your format.",
  },
  {
    id: "faq-start",
    question: "How do I start a project?",
    answer: "Starting is simple and frictionless. You can click 'Start Your Project' or reach out directly via WhatsApp. Share your raw footage link (Google Drive, Dropbox, Frame.io, or WeTransfer), your goals, and any style references. We'll review your material and discuss creative direction, timelines, and scope right away.",
  },
  {
    id: "faq-style",
    question: "Can I request a specific editing style?",
    answer: "Absolutely. We adapt completely to your personal brand or channel identity. If you have an existing editing guideline, favorite creator style (e.g., Ali Abdaal, Alex Hormozi, cinematic vlog, or luxury fashion), or specific color grade preference, our editors calibrate the pacing, typography, and sound effects to match.",
  },
  {
    id: "faq-references",
    question: "Can I provide reference videos?",
    answer: "Yes, we actively encourage it! Sharing 1 to 3 reference links (from YouTube, Instagram, or TikTok) helps us precisely understand your desired pacing, typography style, transitions, and audio vibe from day one.",
  },
  {
    id: "faq-discuss",
    question: "How can I discuss my project with your team?",
    answer: "You can talk directly with our creative lead on WhatsApp for instant, personal communication. We are also available over Google Meet or Zoom for detailed kickoff calls and screen-sharing sessions when planning larger productions or recurring monthly retainers.",
  },
  {
    id: "faq-footage-format",
    question: "What format should I provide my raw footage in?",
    answer: "We accept all standard industry formats: 4K/1080p MP4, MOV, ProRes, Sony S-Log, Canon C-Log, Panasonic V-Log, RED RAW, and Blackmagic RAW. You can upload them to your preferred cloud drive (Google Drive, Dropbox, OneDrive, Frame.io, or WeTransfer) and share the link with our team.",
  },
  {
    id: "faq-revisions",
    question: "How do revisions work?",
    answer: "Every project includes dedicated revision rounds. We review cuts with timestamped feedback to ensure quick turnarounds. Our objective is 100% alignment with your creative vision before final master exports are delivered.",
  },
];

export interface ProcessStep {
  step: string;
  number: string;
  title: string;
  description: string;
  details: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    number: "Phase 01",
    title: "Enquiry & Media Share",
    description: "Submit your project brief and securely share your raw footage via Google Drive, Dropbox, or WeTransfer.",
    details: ["Asset & footage ingest", "Initial creative brief", "Format & aspect ratio selection"],
  },
  {
    step: "02",
    number: "Phase 02",
    title: "Creative Discussion",
    description: "We align on narrative pacing, music choice, reference videos, brand guidelines, and milestone deadlines.",
    details: ["Storyboarding & hook planning", "Music curation & licensing", "Timeline schedule lock"],
  },
  {
    step: "03",
    number: "Phase 03",
    title: "Editing & Review",
    description: "Our editors assemble the cut, master sound, grade color, and integrate graphics. You review cuts with timestamped feedback.",
    details: ["Rough cut assembly", "Sound design & Foley FX", "DaVinci Resolve color grading", "Iterative revision passes"],
  },
  {
    step: "04",
    number: "Phase 04",
    title: "Final Delivery",
    description: "Receive full-resolution 4K masters, optimized social cutdowns, clean textless versions, and project archives.",
    details: ["Master 4K UHD export", "Social aspect ratio exports", "Archived project backup"],
  },
];

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight: string;
}

export const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    id: "quality",
    title: "Professional Editing Quality",
    description: "Every cut, sound effect, and frame transition is polished to broadcast and cinema standards using industry-standard tools.",
    icon: "Sparkles",
    highlight: "Cinema & Broadcast Grade",
  },
  {
    id: "storytelling",
    title: "Creative Storytelling",
    description: "We don't merely assemble clips; we craft narrative arcs engineered to hook viewers in the first seconds and maintain high engagement.",
    icon: "Compass",
    highlight: "Retention-Engineered Pacing",
  },
  {
    id: "communication",
    title: "Fast Communication",
    description: "Direct access to your dedicated video editor via WhatsApp and email. No endless ticket queues or frustrating delays.",
    icon: "MessageSquare",
    highlight: "Direct Editor Access",
  },
  {
    id: "custom-styles",
    title: "Customized Editing Styles",
    description: "We never use generic one-size-fits-all presets. Every font, color curve, and transition is customized to fit your unique visual identity.",
    icon: "Sliders",
    highlight: "Bespoke Brand Identity",
  },
  {
    id: "client-workflow",
    title: "Client-Focused Workflow",
    description: "A frictionless review process with timestamped feedback notes that makes iterations effortless and stress-free.",
    icon: "Users",
    highlight: "Frictionless Iterations",
  },
  {
    id: "project-delivery",
    title: "Professional Project Delivery",
    description: "Well-organized project folder packages containing full-resolution masters, platform cutdowns, clean versions, and assets.",
    icon: "CheckCircle",
    highlight: "Multi-Format Masters",
  },
];

/**
 * TESTIMONIALS - Ready for Supabase Integration
 * 
 * NOTE: As per project guidelines, these entries represent sample data structures
 * for demonstration and layout validation. Genuine client testimonials will be
 * connected dynamically when Supabase backend is integrated in the next phase.
 */
export interface TestimonialItem {
  id: string;
  clientName: string;
  roleOrBrand: string;
  company?: string;
  quote: string;
  category: "YouTube Creator" | "Brand Commercial" | "Agency Partner" | "Podcast Host";
  rating: number;
  avatarUrl?: string;
  isDemonstration: boolean;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "demo-test-1",
    clientName: "Creator Showcase — Fitness & Lifestyle",
    roleOrBrand: "500K+ Social Reach Creator",
    company: "Demonstration Client Slot #1",
    quote: "The retention pacing and dynamic subtitles RYNX implemented took our Reels from 20k average views to over 350k. Their understanding of modern algorithm pacing is unmatched.",
    category: "YouTube Creator",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    isDemonstration: true,
  },
  {
    id: "demo-test-2",
    clientName: "Brand Showcase — Luxury Automotive",
    roleOrBrand: "Creative Director",
    company: "Demonstration Client Slot #2",
    quote: "The color grading and sound design blew our marketing team away. They turned our raw track footage into a television-quality commercial that elevated our brand prestige.",
    category: "Brand Commercial",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    isDemonstration: true,
  },
  {
    id: "demo-test-3",
    clientName: "Media Showcase — Tech & Venture Podcast",
    roleOrBrand: "Executive Producer",
    company: "Demonstration Client Slot #3",
    quote: "Handling 3-camera 4K podcast switches with pristine audio clean up used to take us a week. RYNX delivers polished episodes and 10 viral cutdowns in 48 hours.",
    category: "Podcast Host",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    isDemonstration: true,
  },
];
