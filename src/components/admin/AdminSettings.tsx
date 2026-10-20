import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { WebsiteSettingsMap } from '../../services/settingsService';
import { settingsService, DEFAULT_SETTINGS } from '../../services/settingsService';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettingsMap>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (err: unknown) {
        console.warn('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: keyof WebsiteSettingsMap, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await settingsService.batchUpdateSettings(settings as unknown as Record<string, string>);
      setSuccessMsg('Website settings saved to Supabase successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
          <div style={{ width: '22px', height: '22px', border: '2px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span>Loading settings from Supabase...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Website Settings & Identity
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configure agency branding, contact credentials, hero headlines, and SEO metadata. Changes update live across the public website.
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: '0.85rem 1.15rem',
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: '0.85rem 1.15rem',
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#86efac',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Contact Information Card */}
        <div className="card-glass" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} color="var(--gold-400)" />
            <span>Studio Identity & Direct Channels</span>
          </h2>

          <div className="admin-form-grid-2" style={{ marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                Business Name
              </label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => handleChange('business_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(22, 22, 32, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(22, 22, 32, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div className="admin-form-grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                WhatsApp Number (International format e.g. 916382605739)
              </label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(22, 22, 32, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(22, 22, 32, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Hero & Editorial Copy Card */}
        <div className="card-glass" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem' }}>
            Hero & Public Website Copy
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
              Hero Main Headline
            </label>
            <input
              type="text"
              value={settings.hero_headline}
              onChange={(e) => handleChange('hero_headline', e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(22, 22, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
              Hero Subtitle / Supporting Statement
            </label>
            <textarea
              value={settings.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(22, 22, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
              Primary CTA Label
            </label>
            <input
              type="text"
              value={settings.primary_cta_label}
              onChange={(e) => handleChange('primary_cta_label', e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(22, 22, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
              Footer Concise Agency Description
            </label>
            <textarea
              value={settings.footer_description}
              onChange={(e) => handleChange('footer_description', e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(22, 22, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {/* SEO Metadata Card */}
        <div className="card-glass" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem' }}>
            SEO & Social Meta Tags
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
              SEO Title Tag
            </label>
            <input
              type="text"
              value={settings.seo_title}
              onChange={(e) => handleChange('seo_title', e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(22, 22, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
              SEO Meta Description
            </label>
            <textarea
              value={settings.seo_description}
              onChange={(e) => handleChange('seo_description', e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(22, 22, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', width: '100%', maxWidth: '300px', justifyContent: 'center' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Settings to Supabase'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
