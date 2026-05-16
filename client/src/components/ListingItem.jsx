import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaHeart, FaKey, FaTag, FaFire } from 'react-icons/fa';
import { useState } from 'react';

export default function ListingItem({ listing }) {
  const [liked, setLiked] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const isRent = listing.type === 'rent';
  const price = listing.offer
    ? listing.discountPrice.toLocaleString('en-US')
    : listing.regularPrice.toLocaleString('en-US');

  return (
    <div
      className='listing-card'
      style={{ width: '100%', maxWidth: '330px', cursor: 'pointer' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
      >
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'}
            alt={listing.name}
            style={{
              width: '100%', height: '220px', objectFit: 'cover',
              transform: imgHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(15,14,23,0.9) 100%)',
          }} />
        </Link>

        {/* Badge type */}
        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
          <span className={`badge badge-${isRent ? 'rent' : 'sale'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            {isRent ? <><FaKey size={10} /> Location</> : <><FaTag size={10} /> Vente</>}
          </span>
        </div>

        {/* Offer badge */}
        {listing.offer && (
          <div style={{ position: 'absolute', top: '14px', right: '52px' }}>
            <span className='badge badge-offer' style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaFire size={10} /> Offre</span>
          </div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: liked ? 'rgba(239,68,68,0.9)' : 'rgba(15,14,23,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%', width: '34px', height: '34px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
          }}
        >
          <FaHeart style={{ color: liked ? '#fff' : '#a8a5c0', fontSize: '13px' }} />
        </button>

        {/* Price overlay on image bottom */}
        <div style={{ position: 'absolute', bottom: '14px', left: '14px' }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.3rem',
            color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}>
            ${price}
            {isRent && <span style={{ fontSize: '0.75rem', fontWeight: 500, marginLeft: '4px', color: '#d1d5db' }}>/mois</span>}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className='listing-card-body'>
        <Link to={`/listing/${listing._id}`} style={{ textDecoration: 'none' }}>
          <p style={{
            color: '#f8f8ff', fontWeight: 700, fontSize: '1rem',
            marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {listing.name}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <MdLocationOn style={{ color: '#818cf8', fontSize: '15px', flexShrink: 0 }} />
            <p style={{
              color: '#a8a5c0', fontSize: '0.82rem',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {listing.address}
            </p>
          </div>

          <p style={{
            color: '#6b6882', fontSize: '0.82rem', lineHeight: '1.5',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            marginBottom: '14px',
          }}>
            {listing.description}
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '16px', paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaBed style={{ color: '#818cf8', fontSize: '13px' }} />
              <span style={{ color: '#a8a5c0', fontSize: '0.82rem', fontWeight: 600 }}>
                {listing.bedrooms} {listing.bedrooms > 1 ? 'Chambres' : 'Chambre'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaBath style={{ color: '#818cf8', fontSize: '12px' }} />
              <span style={{ color: '#a8a5c0', fontSize: '0.82rem', fontWeight: 600 }}>
                {listing.bathrooms} {listing.bathrooms > 1 ? 'Bains' : 'Bain'}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}