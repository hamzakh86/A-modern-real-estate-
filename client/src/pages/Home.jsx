import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaArrowRight, FaSearch, FaHome, FaKey, FaStar, FaPercent, FaBuilding, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { MdVilla, MdLocationPin } from 'react-icons/md';

SwiperCore.use([Navigation, Pagination, Autoplay]);

const stats = [
  { number: '12K+', label: 'Propriétés listées' },
  { number: '8K+',  label: 'Clients satisfaits' },
  { number: '95%',  label: 'Taux de satisfaction' },
  { number: '150+', label: 'Villes couvertes' },
];

const features = [
  { icon: <FaHome size={22} />, title: 'Acheter', desc: 'Trouvez la maison de vos rêves parmi nos milliers de propriétés sélectionnées.' },
  { icon: <FaKey size={22} />,  title: 'Louer',   desc: 'Découvrez des appartements et maisons à louer dans les meilleurs quartiers.' },
  { icon: <MdVilla size={22} />, title: 'Vendre', desc: "Mettez votre bien en vente et atteignez des milliers d'acheteurs qualifiés." },
];

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings,  setSaleListings]  = useState([]);
  const [rentListings,  setRentListings]  = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || '/api'}/listing/get?offer=true&limit=4`),
          fetch(`${import.meta.env.VITE_API_URL || '/api'}/listing/get?type=rent&limit=4`),
          fetch(`${import.meta.env.VITE_API_URL || '/api'}/listing/get?type=sale&limit=4`),
        ]);
        const offerData = await offerRes.json();
        const rentData  = await rentRes.json();
        const saleData  = await saleRes.json();
        if (Array.isArray(offerData)) setOfferListings(offerData);
        if (Array.isArray(rentData))  setRentListings(rentData);
        if (Array.isArray(saleData))  setSaleListings(saleData);
      } catch (e) { console.log('Erreur API:', e); }
    };
    fetchAll();
  }, []);

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '72px' }}>
        <div className='blob' style={{ width: '500px', height: '500px', background: '#4f46e5', top: '-80px', left: '-100px' }} />
        <div className='blob' style={{ width: '400px', height: '400px', background: '#7c3aed', bottom: '-80px', right: '5%', animationDelay: '3s' }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 48px', zIndex: 1, width: '100%' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — Text */}
            <div>
              <div className='section-label animate-fadeInUp' style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaStar size={10} style={{ color: 'var(--primary-light)' }} /> Bienvenue chez Hamza Estate
              </div>
              <h1 className='animate-fadeInUp delay-100' style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 900,
                fontSize: 'clamp(2rem, 4.5vw, 4.2rem)', lineHeight: 1.1,
                letterSpacing: '-0.03em', marginBottom: '20px',
              }}>
                Trouvez votre{' '}
                <span className='gradient-text'>propriété</span>
                <br />idéale
              </h1>
              <p className='animate-fadeInUp delay-200' style={{
                color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '32px',
              }}>
                Des milliers de propriétés premium sélectionnées pour vous. Achetez, louez ou vendez en toute confiance avec Hamza Estate.
              </p>
              <div className='animate-fadeInUp delay-300' style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <Link to='/search' className='btn-primary' style={{ textDecoration: 'none', width: 'max-content' }}>
                  <FaSearch size={13} /> Explorer les propriétés
                </Link>
                <Link to='/search?offer=true' className='btn-outline' style={{ textDecoration: 'none', width: 'max-content' }}>
                  Voir les offres <FaArrowRight size={13} />
                </Link>
              </div>
              
              <div className='animate-fadeInUp delay-400 grid grid-cols-3 gap-2 sm:gap-6 border-t border-[rgba(255,255,255,0.12)] pt-6 mt-6'>
                {stats.map((s, i) => (
                  <div key={i} className={`text-center ${i < stats.length - 1 ? 'border-r border-[rgba(255,255,255,0.12)]' : ''}`}>
                    <div style={{ fontWeight: 900, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', lineHeight: 1, background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.number}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Animated Visual */}
            <div className="hidden lg:flex relative h-[480px] items-center justify-center">

              {/* Central icon */}
              <div style={{ width: '190px', height: '190px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(79,70,229,0.25), rgba(124,58,237,0.25))', border: '1px solid rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(79,70,229,0.4)', position: 'relative', zIndex: 2, animation: 'pulse-glow 3s ease-in-out infinite' }}>
                <div style={{ width: '115px', height: '115px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(79,70,229,0.6)' }}>
                  <FaHome size={46} color='#fff' />
                </div>
              </div>

              {/* Orbit rings */}
              <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', border: '1px dashed rgba(129,140,248,0.2)', animation: 'spin-slow 18s linear infinite' }} />
              <div style={{ position: 'absolute', width: '430px', height: '430px', borderRadius: '50%', border: '1px dashed rgba(129,140,248,0.1)', animation: 'spin-slow 28s linear infinite reverse' }} />

              {/* Floating cards */}
              {[
                { icon: <FaKey size={20} color='#fcd34d' />, label: 'Clés remises', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', top: '20px', left: '30px', delay: '0s' },
                { icon: <MdLocationPin size={22} color='#34d399' />, label: 'Top localisation', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.35)', top: '40px', right: '20px', delay: '1s' },
                { icon: <FaBuilding size={18} color='#818cf8' />, label: 'Appartements', bg: 'rgba(129,140,248,0.15)', border: 'rgba(129,140,248,0.35)', bottom: '90px', left: '10px', delay: '2s' },
                { icon: <FaShieldAlt size={18} color='#f472b6' />, label: 'Sécurisé', bg: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.35)', bottom: '70px', right: '10px', delay: '0.5s' },
                { icon: <FaChartLine size={18} color='#60a5fa' />, label: 'Meilleur prix', bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.35)', top: '44%', left: '-10px', delay: '1.5s' },
              ].map((card, i) => (
                <div key={i} style={{ position: 'absolute', top: card.top, left: card.left, right: card.right, bottom: card.bottom, background: card.bg, border: `1px solid ${card.border}`, backdropFilter: 'blur(12px)', borderRadius: '14px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'float 4s ease-in-out infinite', animationDelay: card.delay, whiteSpace: 'nowrap', zIndex: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', minWidth: '140px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: card.bg, border: `1px solid ${card.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{card.icon}</div>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>{card.label}</span>
                </div>
              ))}

              {/* Glowing dots */}
              {[
                { top: '12%', left: '42%', size: '8px', color: '#818cf8', delay: '0s' },
                { top: '78%', left: '52%', size: '6px', color: '#c084fc', delay: '1s' },
                { top: '50%', right: '5%', size: '9px', color: '#f472b6', delay: '2s' },
                { top: '20%', left: '72%', size: '6px', color: '#34d399', delay: '0.5s' },
              ].map((dot, i) => (
                <div key={i} style={{ position: 'absolute', top: dot.top, left: dot.left, right: dot.right, width: dot.size, height: dot.size, borderRadius: '50%', background: dot.color, boxShadow: `0 0 10px ${dot.color}`, animation: 'float 3s ease-in-out infinite', animationDelay: dot.delay }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '40px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className='section-label' style={{ justifyContent: 'center' }}>Nos services</div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Tout ce dont vous avez <span className='gradient-text'>besoin</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} className='glass-card' style={{ padding: '28px 24px', textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', boxShadow: '0 0 24px rgba(79,70,229,0.4)',
              }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SWIPER ── */}
      {offerListings?.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto 16px', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className='section-label'>Offres en vedette</div>
              <h2 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Propriétés en promotion</h2>
            </div>
          </div>
          <Swiper navigation pagination={{ clickable: true }} autoplay={{ delay: 4000, disableOnInteraction: false }} loop={offerListings.length > 1}>
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <Link to={`/listing/${listing._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    height: '55vh', minHeight: '360px',
                    background: `url(${listing.imageUrls[0]}) center/cover no-repeat`,
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,14,23,0.85) 0%, rgba(15,14,23,0.3) 60%, transparent 100%)' }} />
                    <div style={{ position: 'absolute', bottom: '48px', left: '10%', maxWidth: '500px' }}>
                      <span className='badge badge-offer' style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <FaPercent size={10} /> Offre spéciale
                      </span>
                      <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.3rem, 3vw, 2rem)', lineHeight: 1.2, marginBottom: '6px' }}>{listing.name}</h3>
                      <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '10px' }}>{listing.address}</p>
                      <p style={{ color: '#c084fc', fontWeight: 800, fontSize: '1.5rem' }}>
                        ${listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* ── LISTINGS ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 40px' }}>

        {offerListings?.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div>
                <div className='section-label'>Promotions</div>
                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Offres récentes</h2>
              </div>
              <Link to='/search?offer=true' className='btn-outline' style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '9px 18px' }}>
                Voir tout <FaArrowRight size={11} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {offerListings.map((l) => <ListingItem key={l._id} listing={l} />)}
            </div>
          </section>
        )}

        {(offerListings?.length > 0 && (rentListings?.length > 0 || saleListings?.length > 0)) && (
          <div className='divider-glow' style={{ margin: '32px auto' }} />
        )}

        {rentListings?.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div>
                <div className='section-label'>Location</div>
                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Propriétés à louer</h2>
              </div>
              <Link to='/search?type=rent' className='btn-outline' style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '9px 18px' }}>
                Voir tout <FaArrowRight size={11} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {rentListings.map((l) => <ListingItem key={l._id} listing={l} />)}
            </div>
          </section>
        )}

        {(rentListings?.length > 0 && saleListings?.length > 0) && (
          <div className='divider-glow' style={{ margin: '32px auto' }} />
        )}

        {saleListings?.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div>
                <div className='section-label'>Vente</div>
                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Propriétés à vendre</h2>
              </div>
              <Link to='/search?type=sale' className='btn-outline' style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '9px 18px' }}>
                Voir tout <FaArrowRight size={11} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {saleListings.map((l) => <ListingItem key={l._id} listing={l} />)}
            </div>
          </section>
        )}
      </div>

      {/* ── FOOTER CTA ── */}
      <section style={{
        margin: '0 24px 40px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
        padding: 'clamp(36px, 6vw, 64px) clamp(24px, 5vw, 72px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <FaStar style={{ color: '#fcd34d' }} size={14} />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>Commencez dès aujourd'hui</span>
          </div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.3rem, 3vw, 2rem)', lineHeight: 1.25, maxWidth: '480px' }}>
            Prêt à trouver votre propriété idéale ?
          </h2>
        </div>
        <Link to='/search' style={{
          background: '#fff', color: '#4f46e5', fontWeight: 700,
          padding: '14px 28px', borderRadius: '50px', textDecoration: 'none',
          fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'all 0.3s ease', whiteSpace: 'nowrap', flexShrink: 0,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          Explorer maintenant <FaArrowRight size={13} />
        </Link>
      </section>
    </div>
  );
}
