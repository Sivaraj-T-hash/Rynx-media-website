/**
 * RYNX DIGITAL MEDIA - PORTFOLIO DATA
 * 
 * [PLACEHOLDER / DEMONSTRATION DATA]
 * In accordance with client guidelines:
 * Replace video URLs, posters, and details below with genuine RYNX client masters.
 * Never present these placeholder assets as real past client work to the public.
 */

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  categories: string[]; // For multi-category filtering
  aspectRatio: "9:16" | "16:9" | "2.39:1";
  duration: string;
  thumbnail: string;
  videoPreviewUrl: string; // Lightweight preview for hovering / grid
  videoMasterUrl: string;  // High quality version for lightbox modal
  description: string;
  detailedCaseStudy?: string;
  clientIndustry: string;
  deliverables: string[];
  toolsUsed: string[];
  featured?: boolean;
}

export const PORTFOLIO_CATEGORIES = [
  "All Work",
  "Instagram Reels",
  "YouTube Videos",
  "Podcast Editing",
  "Promotional Videos",
  "Business Advertisements",
  "Cinematic Editing",
  "Motion Graphics",
  "Short-form Content",
] as const;

export type CategoryType = typeof PORTFOLIO_CATEGORIES[number];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "project-hypercar-ad",
    title: "Apex Velocity — Hypercar Launch Commercial",
    category: "Business Advertisements",
    categories: ["Business Advertisements", "Cinematic Editing", "Promotional Videos"],
    aspectRatio: "16:9",
    duration: "00:45",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-car-driving-at-sunset-10028-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-car-driving-at-sunset-10028-large.mp4",
    description: "High-octane commercial edit featuring sound design, dynamic speed ramping, and precision automotive color grading in DaVinci Resolve.",
    detailedCaseStudy: "Engineered to deliver heart-pounding energy within the first 3 seconds. Sound design utilizes layered twin-turbo V8 engine exhausts blended with sub-bass drops and precision speed ramps timed to musical transient peaks.",
    clientIndustry: "Automotive / Luxury",
    deliverables: ["4K Broadcast Commercial", "9:16 Story Cutdowns", "Clean Textless Masters"],
    toolsUsed: ["Premiere Pro", "DaVinci Resolve", "After Effects"],
    featured: true,
  },
  {
    id: "project-viral-reel-fitness",
    title: "Olympian Mindset — Viral Workout Reel",
    category: "Instagram Reels",
    categories: ["Instagram Reels", "Short-form Content"],
    aspectRatio: "9:16",
    duration: "00:28",
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-training-in-the-gym-41315-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-training-in-the-gym-41315-large.mp4",
    description: "Punchy short-form reel built with viral retention hook pacing, animated kinetic captions, and sound effects.",
    detailedCaseStudy: "Formulated specifically for Instagram Reels algorithm retention. Features a pattern interrupt hook at 0.8s, animated word-by-word highlighted captions, and micro whip-pan camera transitions.",
    clientIndustry: "Fitness & Lifestyle",
    deliverables: ["9:16 Vertical Reel", "Burned-in Captions", "Raw Sound stems"],
    toolsUsed: ["Premiere Pro", "After Effects"],
    featured: true,
  },
  {
    id: "project-podcast-highlight",
    title: "The Founder's Journey — Multi-Cam Podcast",
    category: "Podcast Editing",
    categories: ["Podcast Editing", "YouTube Videos"],
    aspectRatio: "16:9",
    duration: "02:15",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-podcaster-speaking-into-a-microphone-42416-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-podcaster-speaking-into-a-microphone-42416-large.mp4",
    description: "Multi-angle studio podcast edit with clean vocal mastering, lower thirds, and B-roll cutaway integration.",
    detailedCaseStudy: "Synchronized 3-camera 4K ISO streams. Cleaned dialogue using spectral de-noise, balanced guest voice levels, and added dynamic speaker focus cuts to maintain narrative flow.",
    clientIndustry: "Media & Tech Podcast",
    deliverables: ["Full YouTube Episode", "5 Viral Short Clips", "Audio-only Podcast Master"],
    toolsUsed: ["Premiere Pro", "iZotope RX", "Audition"],
    featured: false,
  },
  {
    id: "project-luxury-watch-promo",
    title: "Chrono Heritage — Luxury Timepiece Teaser",
    category: "Promotional Videos",
    categories: ["Promotional Videos", "Cinematic Editing", "Business Advertisements"],
    aspectRatio: "16:9",
    duration: "00:35",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-watchmaker-repairing-a-watch-41804-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-watchmaker-repairing-a-watch-41804-large.mp4",
    description: "Elegantly paced macro cinematography edit showcasing craftsmanship, metallic reflections, and ticking audio design.",
    detailedCaseStudy: "Focused on high-end luxury aesthetics. Every cut is timed to the mechanical escapement of the watch mechanism. Color graded with warm gold highlights and deep obsidian contrast.",
    clientIndustry: "Luxury Goods",
    deliverables: ["Cinema 4K Master", "Social Media Cutdowns", "Instagram Feed Edit"],
    toolsUsed: ["DaVinci Resolve Studio", "Premiere Pro"],
    featured: true,
  },
  {
    id: "project-tech-explainer-motion",
    title: "Quantum Cloud — 3D Motion Graphics Explainer",
    category: "Motion Graphics",
    categories: ["Motion Graphics", "Promotional Videos"],
    aspectRatio: "16:9",
    duration: "01:10",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-and-binary-code-31517-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-and-binary-code-31517-large.mp4",
    description: "Sleek kinetic typography, 3D abstract network renders, and futuristic HUD graphics for a SaaS platform.",
    detailedCaseStudy: "Turned abstract cloud architecture concepts into clean visual metaphors using procedural 3D elements, glass panels, and smooth camera depth-of-field movement.",
    clientIndustry: "Enterprise Software",
    deliverables: ["Product Launch Video", "Hero Website Loop", "Feature Snippets"],
    toolsUsed: ["After Effects", "Blender", "Illustrator"],
    featured: false,
  },
  {
    id: "project-travel-documentary",
    title: "Echoes of Iceland — Cinematic Travel Story",
    category: "Cinematic Editing",
    categories: ["Cinematic Editing", "YouTube Videos"],
    aspectRatio: "16:9",
    duration: "03:40",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-beach-1172-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-beach-1172-large.mp4",
    description: "Atmospheric landscape editing with film grain, orchestral sound design, and analog film emulation.",
    detailedCaseStudy: "An immersive sensory narrative. Utilizes Kodak 2383 print film emulation curves, spatial audio mixing of ocean swells and mountain winds, and seamless match-cuts.",
    clientIndustry: "Travel & Documentary",
    deliverables: ["4K Feature Cut", "Trailer Cut", "Color LUT Package"],
    toolsUsed: ["DaVinci Resolve", "Premiere Pro", "Audition"],
    featured: true,
  },
  {
    id: "project-finance-short",
    title: "The 80/20 Wealth Rule — High Retention Short",
    category: "Short-form Content",
    categories: ["Short-form Content", "Instagram Reels"],
    aspectRatio: "9:16",
    duration: "00:42",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-counting-a-bundle-of-bills-41793-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-counting-a-bundle-of-bills-41793-large.mp4",
    description: "Finance niche short-form edit with 3D charts, pop-up motion assets, sound effects, and zero dead air.",
    detailedCaseStudy: "Every single millisecond of silence trimmed. Custom motion graphics illustrate financial equations in real time with dynamic camera punch-ins every 2.5 seconds.",
    clientIndustry: "Personal Finance & Creator",
    deliverables: ["9:16 Short", "YouTube Shorts Version", "Thumbnail Graphic"],
    toolsUsed: ["Premiere Pro", "After Effects"],
    featured: false,
  },
  {
    id: "project-tech-review-yt",
    title: "CyberDeck Studio — M4 Max Review & Studio Tour",
    category: "YouTube Videos",
    categories: ["YouTube Videos", "Promotional Videos"],
    aspectRatio: "16:9",
    duration: "08:15",
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-desk-with-screens-and-keyboard-in-a-dark-room-41584-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-desk-with-screens-and-keyboard-in-a-dark-room-41584-large.mp4",
    description: "Full-length YouTube tech edit with benchmark graphs, dynamic sound effects, and seamless storytelling chapters.",
    detailedCaseStudy: "Engineered for 65%+ YouTube average view duration (AVD). Incorporated custom lower thirds, chapter cards, and witty visual memes balanced with sleek product B-roll.",
    clientIndustry: "Consumer Tech / Creator",
    deliverables: ["4K YouTube Master", "Custom Chapter Markers", "Short Teaser"],
    toolsUsed: ["Premiere Pro", "After Effects", "Photoshop"],
    featured: false,
  },
  {
    id: "project-restaurant-reels",
    title: "Artisan Smokehouse — Culinary Brand Showcase",
    category: "Instagram Reels",
    categories: ["Instagram Reels", "Business Advertisements", "Short-form Content"],
    aspectRatio: "9:16",
    duration: "00:22",
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-the-kitchen-41505-large.mp4",
    videoMasterUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-the-kitchen-41505-large.mp4",
    description: "Mouth-watering culinary edit with sizzle sound design, slow-motion flame transitions, and warm grading.",
    detailedCaseStudy: "Enhanced the sensory experience by exaggerating searing sounds, plate clinks, and pouring liquids. Color grading pushes appetising golden-brown tones and rich highlights.",
    clientIndustry: "Hospitality & Dining",
    deliverables: ["Vertical Reel Series (5 videos)", "Story Teasers", "Raw B-roll Archive"],
    toolsUsed: ["Premiere Pro", "DaVinci Resolve"],
    featured: false,
  },
];
