/**
 * RYNX DIGITAL MEDIA - CENTRALIZED CONTACT CONFIGURATION
 * 
 * IMPORTANT: Replace the placeholder contact details below with your official
 * company information before launching to production.
 */

export const CONTACT_CONFIG = {
  // Agency Information
  agencyName: "RYNX Digital Media",
  tagline: "Rise Your Next Level",
  location: "Global Creative Studio & Remote Production",
  
  // WhatsApp Configuration (Country code 91 + 6382605739)
  whatsAppNumber: "916382605739",
  
  // Email Configuration
  email: "ramankandhan11@gmail.com",
  
  // Social Media Configuration
  instagramHandle: "@raman_kandhan",
  instagramUrl: "https://www.instagram.com/raman_kandhan?dlrf=bnIzdHJsbWtsZjNr",
  
  // Working Hours & Turnaround
  availability: "Mon - Sat: 9:00 AM - 8:00 PM IST",
  averageResponseTime: "Within 2 Hours",

  // Default General Message for WhatsApp
  defaultMessage: "Hi RYNX Team! I visited your website and I'm interested in your video editing services. Can we discuss my project?",
};

/**
 * Generates an official WhatsApp click-to-chat URL with a prefilled message.
 */
export function getWhatsAppUrl(message?: string): string {
  const text = message || CONTACT_CONFIG.defaultMessage;
  return `https://wa.me/${CONTACT_CONFIG.whatsAppNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates a WhatsApp enquiry URL for a specific portfolio project.
 */
export function getProjectEnquiryUrl(projectTitle: string): string {
  const message = `Hi RYNX Team! I was browsing your portfolio and I'm interested in getting similar video editing to "${projectTitle}". Could we discuss my project and pricing?`;
  return getWhatsAppUrl(message);
}

/**
 * Generates a WhatsApp enquiry URL for a specific editing service.
 */
export function getServiceEnquiryUrl(serviceName: string): string {
  const message = `Hi RYNX Team! I'm interested in your "${serviceName}" service. I have some footage and would like to explore how we can collaborate.`;
  return getWhatsAppUrl(message);
}
