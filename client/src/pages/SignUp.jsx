import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { setError(data.message); setLoading(false); return; }
      setLoading(false); setError(null); navigate('/sign-in');
    } catch (err) { setLoading(false); setError(err.message); }
  };

  return (
    <div className='auth-container'>
      {/* Left panel */}
      <div className='auth-left' style={{ background: 'linear-gradient(135deg, #0f0e17 0%, #1a1828 100%)', flex: 1 }}>
        <div className='blob' style={{ width: '400px', height: '400px', background: '#7c3aed', top: '-80px', right: '-80px' }} />
        <div className='blob' style={{ width: '300px', height: '300px', background: '#db2777', bottom: '0', left: '-50px', animationDelay: '2s' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '420px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 32px',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(124,58,237,0.5)',
          }}>
            <FaHome size={36} color='#fff' />
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Rejoignez <span className='gradient-text'>Hamza Estate</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>
            Créez votre compte gratuit et commencez à explorer les meilleures propriétés disponibles sur le marché.
          </p>
          <div style={{
            marginTop: '40px', padding: '24px', borderRadius: '16px',
            background: 'var(--glass)', border: '1px solid var(--glass-border)',
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              En vous inscrivant, vous bénéficiez d'un accès complet à toutes les fonctionnalités, y compris la création d'annonces et la messagerie directe.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className='auth-right' style={{ flex: 1 }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '40px' }}>
            <p style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Inscription
            </p>
            <h1 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Créer un compte
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Déjà inscrit ?{' '}
              <Link to='/sign-in' style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '16px' }} />
              <input
                type='text' id='username' placeholder="Nom d'utilisateur"
                onChange={handleChange} className='input-glass'
                style={{ paddingLeft: '44px' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '16px' }} />
              <input
                type='email' id='email' placeholder='Adresse e-mail'
                onChange={handleChange} className='input-glass'
                style={{ paddingLeft: '44px' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '16px' }} />
              <input
                type='password' id='password' placeholder='Mot de passe'
                onChange={handleChange} className='input-glass'
                style={{ paddingLeft: '44px' }}
              />
            </div>

            <button
              type='submit' disabled={loading} className='btn-primary'
              style={{ marginTop: '8px', width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Création...' : "Créer mon compte"}
              {!loading && <FiArrowRight size={16} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ou</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
            </div>

            <OAuth />
          </form>

          {error && (
            <div style={{
              marginTop: '16px', padding: '12px 16px', borderRadius: '10px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', fontSize: '0.875rem',
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}