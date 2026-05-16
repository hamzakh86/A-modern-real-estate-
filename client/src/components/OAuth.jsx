import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess({ user: data.user, token: data.token }));
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with Google', error);
      alert('Erreur de connexion Google : ' + error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        background: 'var(--glass)', border: '1px solid var(--glass-border)',
        borderRadius: '10px', padding: '14px 20px', cursor: 'pointer',
        color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif",
        fontWeight: 600, fontSize: '0.95rem',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--glass)';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <FcGoogle size={20} />
      Continuer avec Google
    </button>
  );
}