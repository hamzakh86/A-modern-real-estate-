import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEdit2, FiPlusCircle, FiLogOut, FiTrash2, FiList, FiChevronRight } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error, token } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => { if (file) handleFileUpload(file); }, [file]);

  const handleFileUpload = (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: data })
      .then((res) => res.json())
      .then((data) => { if (data.secure_url) { setFormData({ ...formData, avatar: data.secure_url }); setFilePerc(100); } else setFileUploadError(true); })
      .catch(() => setFileUploadError(true));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/update/${currentUser._id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        credentials: 'include', body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(updateUserFailure(data.message)); return; }
      dispatch(updateUserSuccess(data)); setUpdateSuccess(true);
    } catch (error) { dispatch(updateUserFailure(error.message)); }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/delete/${currentUser._id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }, credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      dispatch(deleteUserSuccess(data));
    } catch (error) { dispatch(deleteUserFailure(error.message)); }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signout`, {
        headers: { 'Authorization': `Bearer ${token}` }, credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      dispatch(deleteUserSuccess(data));
    } catch (error) { dispatch(deleteUserFailure(error.message)); }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/listings/${currentUser._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }, credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) { setShowListingsError(true); return; }
      setUserListings(data);
    } catch { setShowListingsError(true); }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listing/delete/${listingId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }, credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) return;
      setUserListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (error) { console.log(error.message); }
  };

  const inputStyle = {
    width: '100%', background: 'var(--glass)', color: 'var(--text-primary)',
    border: '1px solid var(--glass-border)', borderRadius: '10px',
    padding: '14px 16px 14px 44px', fontSize: '0.95rem',
    fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'all 0.3s ease',
  };

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingTop: '72px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div className='section-label'><FiUser size={12} /> Mon compte</div>
          <h1 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em' }}>Profil</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left: Avatar + form */}
          <div className='glass-card' style={{ padding: '36px 28px' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
              <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileRef.current.click()}>
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt='profile'
                  style={{
                    width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover',
                    border: '3px solid rgba(79,70,229,0.6)',
                    boxShadow: '0 0 30px rgba(79,70,229,0.4)',
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--surface-2)',
                }}>
                  <FiEdit2 size={12} color='#fff' />
                </div>
              </div>
              <p style={{ marginTop: '12px', fontWeight: 700, fontSize: '1rem' }}>{currentUser.username}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{currentUser.email}</p>
              {fileUploadError && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '6px' }}>Erreur : image {'<'} 2MB</p>}
              {filePerc > 0 && filePerc < 100 && <p style={{ color: '#818cf8', fontSize: '0.8rem', marginTop: '6px' }}>{filePerc}% chargé...</p>}
              {filePerc === 100 && <p style={{ color: '#34d399', fontSize: '0.8rem', marginTop: '6px' }}>Image mise à jour !</p>}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={15} />
                <input type='text' id='username' placeholder="Nom d'utilisateur"
                  defaultValue={currentUser.username} onChange={handleChange} style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(129,140,248,0.5)'; e.target.style.background = 'rgba(79,70,229,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.background = 'var(--glass)'; }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={15} />
                <input type='email' id='email' placeholder='Email'
                  defaultValue={currentUser.email} onChange={handleChange} style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(129,140,248,0.5)'; e.target.style.background = 'rgba(79,70,229,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.background = 'var(--glass)'; }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={15} />
                <input type='password' id='password' placeholder='Nouveau mot de passe'
                  onChange={handleChange} style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(129,140,248,0.5)'; e.target.style.background = 'rgba(79,70,229,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.background = 'var(--glass)'; }}
                />
              </div>

              <button type='submit' disabled={loading} className='btn-primary'
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, marginTop: '4px' }}>
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </form>

            {/* Feedback */}
            {error && <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}
            {updateSuccess && <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: '0.85rem' }}>Profil mis à jour avec succès !</div>}
          </div>

          {/* Right: Actions + listings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Quick actions */}
            <div className='glass-card' style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Actions rapides
              </p>
              <Link to='/create-listing' className='btn-primary' style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', marginBottom: '12px' }}>
                <FiPlusCircle size={16} /> Créer une annonce
              </Link>
              <button onClick={handleShowListings} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '10px',
                padding: '12px 20px', cursor: 'pointer', color: 'var(--text-primary)',
                fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--glass)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                <FiList size={16} /> Mes annonces
              </button>
            </div>

            {/* Danger zone */}
            <div className='glass-card' style={{ padding: '24px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Zone dangereuse
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSignOut} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#f87171',
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s ease',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                  <FiLogOut size={14} /> Déconnexion
                </button>
                <button onClick={handleDeleteUser} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#f87171',
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s ease',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                  <FiTrash2 size={14} /> Supprimer
                </button>
              </div>
            </div>

            {/* Listings */}
            {showListingsError && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.85rem' }}>Erreur lors du chargement des annonces</div>}
            {userListings?.length > 0 && (
              <div className='glass-card' style={{ padding: '24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Mes annonces ({userListings.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {userListings.map((listing) => (
                    <div key={listing._id} style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      background: 'var(--surface-3)', borderRadius: '12px', padding: '12px',
                      border: '1px solid var(--glass-border)',
                    }}>
                      <Link to={`/listing/${listing._id}`}>
                        <img src={listing.imageUrls[0]} alt='cover'
                          style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                      </Link>
                      <Link to={`/listing/${listing._id}`} style={{ flex: 1, textDecoration: 'none', overflow: 'hidden' }}>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {listing.name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                          <MdLocationOn size={12} style={{ color: '#818cf8' }} />
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.address}</p>
                        </div>
                      </Link>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <Link to={`/update-listing/${listing._id}`}>
                          <button style={{
                            background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)',
                            borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#818cf8',
                            fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 600,
                          }}>Éditer</button>
                        </Link>
                        <button onClick={() => handleListingDelete(listing._id)} style={{
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#f87171',
                          fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 600,
                        }}>Suppr.</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
