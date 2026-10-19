/**
 * RYNX DIGITAL MEDIA - SERVICES DATA
 */

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  features: string[];
  icon: string; // Lucide icon identifier
  badge?: string;
  category: "Short-Form" | "Long-Form" | "Commercial" | "Post-Production";
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "instagram-reels",
    title: "Instagram Reels Editing",
    shortDescription: "High-retention vertical edits engineered for viral reach, utilizing fast-paced pacing, pattern interrupts, and trending sound design.",
    features: ["Hook pacing in first 3 seconds", "Dynamic zoom cuts & speed ramps", "Trend-aligned SFX design", "High-contrast color enhancement"],
    icon: "Smartphone",
    badge: "Popular",
    category: "Short-Form",
  },
  {
    id: "youtube-videos",
    title: "YouTube Video Editing",
    shortDescription: "Story-driven long-form editing that boosts Average View Duration (AVD), featuring seamless pacing, engaging B-roll, and comedic or dramatic timing.",
    features: ["Viewer retention curve optimization", "Custom chapter lower thirds", "Visual gags & meme integration", "Multi-layered sound effects & music beds"],
    icon: "Youtube",
    badge: "High Impact",
    category: "Long-Form",
  },
  {
    id: "shorts-editing",
    title: "Shorts Editing",
    shortDescription: "Ultra-condensed vertical narratives tailored for YouTube Shorts algorithms, designed to loop seamlessly and maximize viewer completion rate.",
    features: ["Seamless infinite loop cuts", "Punchy visual pop-ups", "Engaging hook sequencing", "Fast mobile-optimized delivery"],
    icon: "Zap",
    category: "Short-Form",
  },
  {
    id: "podcast-editing",
    title: "Podcast Editing",
    shortDescription: "Multi-camera studio podcast editing with pristine studio audio mastering, active speaker switching, and bite-sized viral audiogram cutdowns.",
    features: ["Multi-cam sync & intelligent switching", "Audio noise reduction & dialogue mastering", "Social-ready bite-sized clips", "Custom branding & lower thirds"],
    icon: "Mic",
    category: "Long-Form",
  },
  {
    id: "promotional-videos",
    title: "Promotional Video Editing",
    shortDescription: "Sleek, cinematic promotional edits for product launches, events, and brand campaigns that elevate perceived value and convert viewers into customers.",
    features: ["Dynamic rhythm synchronized to music", "Product detail macro emphasis", "Call-to-action motion graphics", "Commercial licensing & 4K exports"],
    icon: "Megaphone",
    badge: "Conversion",
    category: "Commercial",
  },
  {
    id: "corporate-videos",
    title: "Corporate Video Editing",
    shortDescription: "Refined, boardroom-ready video edits for executive interviews, company overviews, investor pitches, and culture spotlights.",
    features: ["Executive interview pacing", "Clean corporate lower thirds", "Bespoke brand typography & colors", "Confidential NDA compliance"],
    icon: "Briefcase",
    category: "Commercial",
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    shortDescription: "Custom 2D and 3D kinetic typography, logo reveals, animated infographics, and UI mockups that explain complex concepts effortlessly.",
    features: ["Custom logo reveals & stingers", "Kinetic animated typography", "3D product mockups & HUD elements", "Transparent alpha channel overlays"],
    icon: "Layers",
    category: "Post-Production",
  },
  {
    id: "subtitles-and-captions",
    title: "Subtitles and Captions",
    shortDescription: "Visually captivating karaoke-style animated captions and stylized subtitles that keep silent scrollers engaged and reading every word.",
    features: ["Word-by-word highlighted text", "Custom fonts & emoji accents", "Multi-lingual subtitle sync", "99%+ transcription accuracy"],
    icon: "Subtitles",
    category: "Post-Production",
  },
  {
    id: "colour-grading",
    title: "Colour Grading",
    shortDescription: "Hollywood-grade color transformation in DaVinci Resolve. From flat LOG camera profiles to rich, cinematic, filmic color palettes that evoke emotion.",
    features: ["LOG to Rec.709 conversion", "Skin tone preservation & beautification", "Film emulation (Kodak/Fuji stock)", "Consistent multi-camera shot matching"],
    icon: "Palette",
    badge: "Cinematic",
    category: "Post-Production",
  },
  {
    id: "social-media-content",
    title: "Social Media Content Editing",
    shortDescription: "Full-scale content repurposing. Turn one long video or podcast into 10+ high-performing assets formatted for TikTok, Reels, LinkedIn, and Shorts.",
    features: ["Omni-channel aspect ratio formats", "Batch delivery on monthly retainers", "Platform-specific caption styles", "A/B test variation cutdowns"],
    icon: "Share2",
    category: "Short-Form",
  },
];
