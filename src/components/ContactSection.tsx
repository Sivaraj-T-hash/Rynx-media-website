import React, { useState } from 'react';
import {
  Send,
  MessageCircle,
  Mail,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { CONTACT_CONFIG, getWhatsAppUrl } from '../config/contactConfig';
import { SERVICES_DATA } from '../data/servicesData';
import { enquiriesService } from '../services/enquiriesService';

interface FormState {
  fullName: string;
  email: string;
  whatsApp: string;
  brandName: string;
  editingType: string;
  videoCount: string;
  deadline: string;
  budget: string;
  description: string;
  referenceLink: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  whatsApp?: string;
  editingType?: string;
  description?: string;
  general?: string;
}

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    whatsApp: '',
    brandName: '',
    editingType: '',
    videoCount: '1-3 Videos',
    deadline: '',
    budget: '',
    description: '',
    referenceLink: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBrief, setSubmittedBrief] = useState<boolean>(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.whatsApp.trim()) {
      errs.whatsApp = 'Please provide your WhatsApp number for quick project alignment.';
    }

    if (!formData.editingType) {
      errs.editingType = 'Please select the type of editing required.';
    }

    if (!formData.description.trim() || formData.description.trim().length < 15) {
      errs.description = 'Please describe your project vision (at least 15 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await enquiriesService.submitEnquiry({
        full_name: formData.fullName,
        email: formData.email,
        whatsapp_number: formData.whatsApp,
        brand_name: formData.brandName || null,
        editing_type: formData.editingType,
        video_count: formData.videoCount || null,
        deadline: formData.deadline || null,
        budget: formData.budget || null,
        description: formData.description,
        reference_link: formData.referenceLink || null,
      });

      setSubmittedBrief(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again or message via WhatsApp.';
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compose formatted WhatsApp payload from form fields
  const getPreparedWhatsAppUrl = () => {
    const lines = [
      `*New Project Brief via RYNX Website*`,
      `*Client:* ${formData.fullName}`,
      formData.brandName ? `*Brand/Channel:* ${formData.brandName}` : null,
      `*Service:* ${formData.editingType}`,
      `*Volume:* ${formData.videoCount}`,
      formData.deadline ? `*Target Deadline:* ${formData.deadline}` : null,
      formData.budget ? `*Approx Budget:* ${formData.budget}` : null,
      formData.referenceLink ? `*Reference:* ${formData.referenceLink}` : null,
      `*Project Details:*`,
      formData.description,
    ]
      .filter(Boolean)
      .join('\n');

    return getWhatsAppUrl(lines);
  };

  return (
    <section
      id="contact"
      style={{
        paddingTop: '6.5rem',
        paddingBottom: '6.5rem',
        backgroundColor: '#07070b',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <span className="badge-gold">
              <Sparkles size={12} /> Start Your Production
            </span>
          </div>

          <h2 className="editorial-title">Have a Vision? Let's Create It.</h2>

          <p>
            Tell us about your footage, channel, or commercial campaign. We'll outline pacing, timelines, and sample frames.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 420px) 1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="contact-layout"
        >
          {/* Direct Agency Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick WhatsApp Action Card */}
            <div
              className="card-glass"
              style={{
                padding: '2rem',
                backgroundColor: 'rgba(18, 18, 26, 0.75)',
                border: '1px solid var(--border-gold-subtle)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(37, 211, 102, 0.15)',
                  color: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <MessageCircle size={22} />
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: '#ffffff' }}>
                Instant WhatsApp Chat
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Prefer a fast, direct conversation? Message our team directly with your clips and reference videos.
              </p>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Email & Info Details */}
            <div
              className="card-glass"
              style={{
                padding: '2rem',
                backgroundColor: 'rgba(14, 14, 20, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-400)',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Email Project Inquiries
                  </span>
                  <a
                    href={`mailto:${CONTACT_CONFIG.email}`}
                    style={{
                      display: 'block',
                      fontSize: '0.96rem',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {CONTACT_CONFIG.email}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-400)',
                    flexShrink: 0,
                  }}
                >
                  <InstagramIcon size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Official Instagram
                  </span>
                  <a
                    href={CONTACT_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.96rem',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <span>{CONTACT_CONFIG.instagramHandle}</span>
                    <ArrowUpRight size={14} color="var(--gold-400)" />
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-400)',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Response Time
                  </span>
                  <p style={{ fontSize: '0.92rem', color: '#d0d0db' }}>
                    {CONTACT_CONFIG.averageResponseTime} ({CONTACT_CONFIG.availability})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Project Enquiry Form */}
          <div
            className="card-glass"
            style={{
              padding: '2.5rem',
              backgroundColor: 'rgba(14, 14, 21, 0.85)',
              border: '1px solid var(--border-gold-subtle)',
              borderRadius: '1.5rem',
            }}
          >
            {submittedBrief ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 211, 102, 0.15)',
                    border: '1px solid #25D366',
                    color: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: '#ffffff' }}>
                  Enquiry Successfully Received!
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '480px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.fullName}</strong>. Your project brief has been recorded in our production queue. For instant discussion with our lead editor, tap below to open WhatsApp:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '380px', margin: '0 auto' }}>
                  <a
                    href={getPreparedWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ padding: '0.9rem', fontSize: '0.96rem' }}
                  >
                    <MessageCircle size={18} />
                    <span>Open WhatsApp With Brief</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmittedBrief(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        whatsApp: '',
                        brandName: '',
                        editingType: '',
                        videoCount: '1-3 Videos',
                        deadline: '',
                        budget: '',
                        description: '',
                        referenceLink: '',
                      });
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.65rem' }}
                  >
                    Submit Another Project
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff' }}>
                    Project Enquiry Form
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)' }}>
                    * Required Fields
                  </span>
                </div>

                {errors.general && (
                  <div
                    style={{
                      padding: '0.85rem 1.15rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#fca5a5',
                      fontSize: '0.85rem',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{errors.general}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="form-row">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Vance"
                      aria-invalid={!!errors.fullName}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(22, 22, 32, 0.7)',
                        border: errors.fullName ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    {errors.fullName && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                        <AlertCircle size={12} /> {errors.fullName}
                      </span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@brand.com"
                      aria-invalid={!!errors.email}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(22, 22, 32, 0.7)',
                        border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    {errors.email && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                        <AlertCircle size={12} /> {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="form-row">
                  {/* WhatsApp Number */}
                  <div>
                    <label htmlFor="whatsApp" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      id="whatsApp"
                      name="whatsApp"
                      value={formData.whatsApp}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      aria-invalid={!!errors.whatsApp}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(22, 22, 32, 0.7)',
                        border: errors.whatsApp ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    {errors.whatsApp && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                        <AlertCircle size={12} /> {errors.whatsApp}
                      </span>
                    )}
                  </div>

                  {/* Brand or Channel Name (Optional) */}
                  <div>
                    <label htmlFor="brandName" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                      Business / Channel Name <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="brandName"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Media or @channel"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(22, 22, 32, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="form-row">
                  {/* Type of Editing Required */}
                  <div>
                    <label htmlFor="editingType" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                      Type of Editing Required *
                    </label>
                    <select
                      id="editingType"
                      name="editingType"
                      value={formData.editingType}
                      onChange={handleChange}
                      aria-invalid={!!errors.editingType}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#161622',
                        border: errors.editingType ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: formData.editingType ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    >
                      <option value="">Select Service</option>
                      {SERVICES_DATA.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    {errors.editingType && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                        <AlertCircle size={12} /> {errors.editingType}
                      </span>
                    )}
                  </div>

                  {/* Number of Videos */}
                  <div>
                    <label htmlFor="videoCount" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                      Number of Videos
                    </label>
                    <select
                      id="videoCount"
                      name="videoCount"
                      value={formData.videoCount}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#161622',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    >
                      <option value="1 Single Video">1 Single Video (Test Cut)</option>
                      <option value="2-4 Videos">2 - 4 Videos (Monthly Batch)</option>
                      <option value="5-10 Videos">5 - 10 Videos (Weekly Creator)</option>
                      <option value="10+ Videos / Ongoing Retainer">10+ Videos (Full Production Retainer)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="form-row">
                  {/* Expected Deadline */}
                  <div>
                    <label htmlFor="deadline" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                      Expected Deadline
                    </label>
                    <input
                      type="text"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      placeholder="e.g. In 3 days / Within 2 weeks"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(22, 22, 32, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Approximate Budget (Optional) */}
                  <div>
                    <label htmlFor="budget" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                      Approximate Budget <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="e.g. $500 - $1500 / Negotiable"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(22, 22, 32, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Reference Video Link */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="referenceLink" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Reference Video Link <span style={{ color: 'var(--text-muted)' }}>(YouTube / Instagram / Drive)</span>
                  </label>
                  <input
                    type="url"
                    id="referenceLink"
                    name="referenceLink"
                    value={formData.referenceLink}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=... or Drive link"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Project Description */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label htmlFor="description" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Project Description & Creative Goals *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your footage, pacing, preferred style, hook expectations, sound design requirements..."
                    aria-invalid={!!errors.description}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.7)',
                      border: errors.description ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                  {errors.description && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                      <AlertCircle size={12} /> {errors.description}
                    </span>
                  )}
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', cursor: isSubmitting ? 'wait' : 'pointer' }}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Recording Enquiry...' : 'Submit Project Brief'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
