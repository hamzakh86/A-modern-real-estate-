import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(signInFailure(data.message)); return; }
      dispatch(signInSuccess({ user: data.user, token: data.token }));
      navigate('/');
    } catch (error) { dispatch(signInFailure(error.message)); }
  };

  return (
    <div className='auth-container'>
      {/* Left panel */}
      <div className='auth-left' style={{ background: 'linear-gradient(135deg, #0f0e17 0%, #1a1828 100%)', flex: 1 }}>
        <div className='blob' style={{ width: '400px', height: '400px', background: '#4f46e5', top: '-80px', left: '-80px' }} />
        <div className='blob' style={{ width: '300px', height: '300px', background: '#7c3aed', bottom: '0', right: '-50px', animationDelay: '3s' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '420px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 32px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(79,70,229,0.5)',
          }}>
            <FaHome size={36} color='#fff' />
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Bienvenue sur <span className='gradient-text'>Hamza Estate</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>
            Votre portail immobilier premium. Connectez-vous pour accéder à des milliers de propriétés exclusives.
          </p>
          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: <FiArrowRight size={16} />, text: 'Accédez à des offres exclusives' },
              { icon: <FiArrowRight size={16} />, text: 'Gérez vos annonces facilement' },
              { icon: <FiArrowRight size={16} />, text: 'Contactez les propriétaires directement' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#818cf8' }}>{item.icon}</span>
                <span style={{ fontSize: '0.95rem' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className='auth-right' style={{ flex: 1 }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '40px' }}>
            <p style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Connexion
            </p>
            <h1 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Bon retour !
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Pas de compte ?{' '}
              <Link to='/sign-up' style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>S'inscrire</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              {loading ? 'Connexion...' : 'Se connecter'}
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
