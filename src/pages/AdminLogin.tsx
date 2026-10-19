import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import logoImg from '../assets/logo.jpeg';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if already authenticated as admin
  useEffect(() => {
    async function checkExisting() {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          const isAdmin = await authService.checkIsAdmin(session.user.id);
          if (isAdmin) {
            navigate('/admin/dashboard', { replace: true });
          }
        }
      } catch {
        // Not logged in
      }
    }
    checkExisting();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      await authService.signIn(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050508',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Lighting */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="card-glass"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          backgroundColor: 'rgba(15, 15, 23, 0.9)',
          border: '1px solid var(--border-gold-subtle)',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.95), 0 0 30px rgba(212, 175, 55, 0.15)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Back to Website Link */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.84rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} />
          <span>Back to RYNX Website</span>
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src={logoImg}
            alt="RYNX Digital Media"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.25)',
              margin: '0 auto 1rem auto',
              objectFit: 'contain',
            }}
          />
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--gold-400)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            RYNX Digital Media Management
          </p>
        </div>

        {/* Security Notice */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.78rem',
            color: '#e4e4ed',
            marginBottom: '1.5rem',
          }}
        >
          <ShieldCheck size={16} color="var(--gold-400)" style={{ flexShrink: 0 }} />
          <span>
            Authorized administrator access only. Public registration is restricted.
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="admin-email"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}
            >
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }}
              />
              <input
                type="email"
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rynxmedia.com"
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.85rem',
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

          <div style={{ marginBottom: '1.75rem' }}>
            <label
              htmlFor="admin-password"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}
            >
              Master Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }}
              />
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.85rem',
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
