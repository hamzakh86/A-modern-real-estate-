import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUploadCloud, FiX, FiEdit2, FiHome, FiDollarSign } from 'react-icons/fi';
import { FaBed, FaBath, FaCar, FaCouch, FaTag, FaPercent } from 'react-icons/fa';

const checkboxData = [
  { id: 'sale', label: 'Vente', icon: <FaTag size={13} /> },
  { id: 'rent', label: 'Location', icon: <FiHome size={13} /> },
  { id: 'parking', label: 'Parking', icon: <FaCar size={13} /> },
  { id: 'furnished', label: 'Meublé', icon: <FaCouch size={13} /> },
  { id: 'offer', label: 'Offre', icon: <FaPercent size={13} /> },
];

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [], name: '', description: '', address: '',
    type: 'rent', bedrooms: 1, bathrooms: 1,
    regularPrice: 50, discountPrice: 0, offer: false, parking: false, furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listing/get/${params.listingId}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success === false) { console.log(data.message); return; }
      setFormData(data);
    };
    fetchListing();
  }, []);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true); setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) promises.push(storeImage(files[i]));
      Promise.all(promises)
        .then((urls) => { setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) }); setUploading(false); })
        .catch(() => { setImageUploadError('Échec du téléchargement (2 MB max)'); setUploading(false); });
    } else { setImageUploadError('Maximum 6 images par annonce'); }
  };

  const storeImage = async (file) => new Promise((resolve, reject) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: data })
      .then((r) => r.json())
      .then((d) => d.secure_url ? resolve(d.secure_url) : reject(new Error('Upload failed')))
      .catch(reject);
  });

  const handleRemoveImage = (index) => setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index) });

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') setFormData({ ...formData, type: e.target.id });
    else if (['parking', 'furnished', 'offer'].includes(e.target.id)) setFormData({ ...formData, [e.target.id]: e.target.checked });
    else if (['number', 'text', 'textarea'].includes(e.target.type)) setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) return setError('Veuillez ajouter au moins une image');
    if (+formData.regularPrice < +formData.discountPrice) return setError('Le prix réduit doit être inférieur au prix normal');
    try {
      setLoading(true); setError(false);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listing/update/${params.listingId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) return setError(data.message);
      navigate(`/listing/${data._id}`);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: 'var(--glass)', color: 'var(--text-primary)',
    border: '1px solid var(--glass-border)', borderRadius: '10px',
    padding: '14px 16px', fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif", outline: 'none',
    transition: 'all 0.3s ease', resize: 'vertical',
  };
  const numInputStyle = {
    width: '80px', background: 'var(--glass)', color: 'var(--text-primary)',
    border: '1px solid var(--glass-border)', borderRadius: '10px',
    padding: '12px 14px', fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif", outline: 'none',
    textAlign: 'center', transition: 'all 0.3s ease',
  };
  const focusInput = (e) => { e.target.style.borderColor = 'rgba(129,140,248,0.5)'; e.target.style.background = 'rgba(79,70,229,0.08)'; };
  const blurInput  = (e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.background = 'var(--glass)'; };

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingTop: '72px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '36px' }}>
          <div className='section-label'><FiEdit2 size={12} /> Modifier l'annonce</div>
          <h1 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em' }}>Modifier une annonce</h1>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Left col */}
          <div className='glass-card' style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Informations</p>
            <input type='text' id='name' placeholder='Nom de la propriété' maxLength='62' minLength='10' required onChange={handleChange} value={formData.name} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            <textarea id='description' placeholder='Description...' required rows={4} onChange={handleChange} value={formData.description} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            <input type='text' id='address' placeholder='Adresse complète' required onChange={handleChange} value={formData.address} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Caractéristiques</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {checkboxData.map(({ id, label, icon }) => {
                  const isActive = id === 'sale' ? formData.type === 'sale' : id === 'rent' ? formData.type === 'rent' : formData[id];
                  return (
                    <label key={id} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                      padding: '8px 14px', borderRadius: '50px',
                      background: isActive ? 'rgba(79,70,229,0.2)' : 'var(--glass)',
                      border: `1px solid ${isActive ? 'rgba(129,140,248,0.5)' : 'var(--glass-border)'}`,
                      color: isActive ? '#818cf8' : 'var(--text-secondary)',
                      fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s ease',
                    }}>
                      <input type='checkbox' id={id} onChange={handleChange}
                        checked={id === 'sale' ? formData.type === 'sale' : id === 'rent' ? formData.type === 'rent' : formData[id]}
                        style={{ display: 'none' }} />
                      {icon} {label}
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Détails</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {[
                  { id: 'bedrooms', icon: <FaBed size={14} style={{ color: '#818cf8' }} />, label: 'Chambres', min: 1, max: 10 },
                  { id: 'bathrooms', icon: <FaBath size={14} style={{ color: '#818cf8' }} />, label: 'Salles de bain', min: 1, max: 10 },
                  { id: 'regularPrice', icon: <FiDollarSign size={14} style={{ color: '#818cf8' }} />, label: 'Prix normal', min: 50, max: 10000000 },
                ].map(({ id, icon, label, min, max }) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type='number' id={id} min={min} max={max} required value={formData[id]} onChange={handleChange} style={numInputStyle} onFocus={focusInput} onBlur={blurInput} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {icon} {label}
                    </div>
                  </div>
                ))}
                {formData.offer && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type='number' id='discountPrice' min='0' max='10000000' required value={formData.discountPrice} onChange={handleChange} style={numInputStyle} onFocus={focusInput} onBlur={blurInput} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <FaPercent size={12} style={{ color: '#f59e0b' }} /> Prix réduit
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right col */}
          <div className='glass-card' style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Images <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(max 6)</span></p>
            <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '24px 20px', textAlign: 'center' }}>
              <FiUploadCloud size={32} style={{ color: '#818cf8', margin: '0 auto 10px' }} />
              <input onChange={(e) => setFiles(e.target.files)} type='file' id='images' accept='image/*' multiple style={{ display: 'block', margin: '0 auto', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer' }} />
            </div>
            <button type='button' disabled={uploading} onClick={handleImageSubmit} className='btn-outline' style={{ width: '100%', justifyContent: 'center' }}>
              <FiUploadCloud size={15} /> {uploading ? 'Téléchargement...' : 'Télécharger les images'}
            </button>
            {imageUploadError && <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.85rem' }}>{imageUploadError}</div>}
            {formData.imageUrls.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {formData.imageUrls.map((url, index) => (
                  <div key={url} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img src={url} alt='preview' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {index === 0 && <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(79,70,229,0.85)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '50px' }}>Couverture</span>}
                    <button type='button' onClick={() => handleRemoveImage(index)} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiX size={13} color='#fff' />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type='submit' disabled={loading || uploading} className='btn-primary' style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', opacity: (loading || uploading) ? 0.7 : 1 }}>
              <FiEdit2 size={15} /> {loading ? 'Mise à jour...' : "Mettre à jour l'annonce"}
            </button>
            {error && <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
