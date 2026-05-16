import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // ✅ corrigé
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main style={{ background: 'var(--surface)', minHeight: '100vh', paddingTop: '72px' }}>
      {loading && <p className='text-center my-12 text-2xl text-[var(--primary-light)] animate-pulse'>Chargement...</p>}
      {error && (
        <p className='text-center my-12 text-2xl text-red-500'>Une erreur est survenue !</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[400px] md:h-[600px] relative'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent opacity-90"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className='fixed top-[15%] right-[5%] z-10 w-12 h-12 flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-110'
            style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)', borderRadius: '50%' }}>
            <FaShare
              className='text-[var(--primary-light)]'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 p-2 text-sm font-semibold'
              style={{ background: 'var(--primary)', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
              Lien copié !
            </p>
          )}
          
          <div className='flex flex-col max-w-5xl mx-auto p-6 md:p-10 my-[-80px] md:my-[-120px] gap-6 relative z-10 glass-card' style={{ marginBottom: '60px' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className='text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]'>
                {listing.name}
              </h1>
              <div className="text-2xl font-bold gradient-text">
                {listing.offer
                  ? listing.discountPrice.toLocaleString('fr-FR')
                  : listing.regularPrice.toLocaleString('fr-FR')} €
                {listing.type === 'rent' && <span className="text-sm font-medium text-[var(--text-secondary)]"> / mois</span>}
              </div>
            </div>

            <p className='flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium'>
              <FaMapMarkerAlt className='text-[var(--primary-light)] text-lg' />
              {listing.address}
            </p>

            <div className='flex gap-4 mt-2'>
              <span className='px-4 py-1 rounded-full text-sm font-semibold'
                style={{ background: listing.type === 'rent' ? 'rgba(52,211,153,0.15)' : 'rgba(129,140,248,0.15)', color: listing.type === 'rent' ? '#34d399' : '#818cf8', border: `1px solid ${listing.type === 'rent' ? 'rgba(52,211,153,0.3)' : 'rgba(129,140,248,0.3)'}` }}>
                {listing.type === 'rent' ? 'À louer' : 'À vendre'}
              </span>
              {listing.offer && (
                <span className='px-4 py-1 rounded-full text-sm font-semibold'
                  style={{ background: 'rgba(244,114,182,0.15)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.3)' }}>
                  Promo : -{+listing.regularPrice - +listing.discountPrice} €
                </span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-[var(--primary-light)] mb-2 uppercase tracking-wider text-sm">Description</h3>
              <p className='text-[var(--text-secondary)] leading-relaxed'>
                {listing.description}
              </p>
            </div>

            <ul className='flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pb-6 border-b border-[rgba(255,255,255,0.08)]'>
              <li className='flex items-center gap-2 text-[var(--text-primary)] font-semibold bg-[rgba(255,255,255,0.03)] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.05)]'>
                <FaBed className='text-[var(--primary-light)] text-xl' />
                {listing.bedrooms > 1 ? `${listing.bedrooms} Chambres` : `${listing.bedrooms} Chambre`}
              </li>
              <li className='flex items-center gap-2 text-[var(--text-primary)] font-semibold bg-[rgba(255,255,255,0.03)] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.05)]'>
                <FaBath className='text-[var(--primary-light)] text-xl' />
                {listing.bathrooms > 1 ? `${listing.bathrooms} Salles de bain` : `${listing.bathrooms} Salle de bain`}
              </li>
              <li className='flex items-center gap-2 text-[var(--text-primary)] font-semibold bg-[rgba(255,255,255,0.03)] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.05)]'>
                <FaParking className='text-[var(--primary-light)] text-xl' />
                {listing.parking ? 'Parking' : 'Sans parking'}
              </li>
              <li className='flex items-center gap-2 text-[var(--text-primary)] font-semibold bg-[rgba(255,255,255,0.03)] px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.05)]'>
                <FaChair className='text-[var(--primary-light)] text-xl' />
                {listing.furnished ? 'Meublé' : 'Non meublé'}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='btn-primary mt-4 py-4 w-full md:w-auto self-start'
              >
                Contacter le propriétaire
              </button>
            )}
            {contact && <div className="mt-4"><Contact listing={listing} /></div>}
          </div>
        </div>
      )}
    </main>
  );
}
