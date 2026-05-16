import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      // ✅ corrigé
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    // ✅ corrigé
    const res = await fetch(`${import.meta.env.VITE_API_URL}/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row' style={{ background: 'var(--surface)', minHeight: '100vh', paddingTop: '72px' }}>
      {/* Sidebar */}
      <div className='p-7 md:w-[320px] md:min-h-screen' style={{ background: 'var(--surface-2)', borderRight: '1px solid var(--glass-border)' }}>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          
          <div className='flex flex-col gap-3'>
            <label className='font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-xs'>
              Recherche
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Rechercher...'
              className='w-full rounded-lg p-3 outline-none transition-all duration-300'
              style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(129,140,248,0.5)'; e.target.style.background = 'rgba(79,70,229,0.08)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.background = 'var(--glass)' }}
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-3'>
            <label className='font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-xs'>Type d'annonce</label>
            <div className='flex flex-wrap gap-3'>
              <label className='flex items-center gap-2 cursor-pointer text-[var(--text-primary)] text-sm font-medium'>
                <input type='checkbox' id='all' className='w-4 h-4 accent-[#818cf8]' onChange={handleChange} checked={sidebardata.type === 'all'} />
                Tous
              </label>
              <label className='flex items-center gap-2 cursor-pointer text-[var(--text-primary)] text-sm font-medium'>
                <input type='checkbox' id='rent' className='w-4 h-4 accent-[#818cf8]' onChange={handleChange} checked={sidebardata.type === 'rent'} />
                Location
              </label>
              <label className='flex items-center gap-2 cursor-pointer text-[var(--text-primary)] text-sm font-medium'>
                <input type='checkbox' id='sale' className='w-4 h-4 accent-[#818cf8]' onChange={handleChange} checked={sidebardata.type === 'sale'} />
                Vente
              </label>
              <label className='flex items-center gap-2 cursor-pointer text-[var(--text-primary)] text-sm font-medium'>
                <input type='checkbox' id='offer' className='w-4 h-4 accent-[#818cf8]' onChange={handleChange} checked={sidebardata.offer} />
                Offre spéciale
              </label>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <label className='font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-xs'>Équipements</label>
            <div className='flex flex-wrap gap-4'>
              <label className='flex items-center gap-2 cursor-pointer text-[var(--text-primary)] text-sm font-medium'>
                <input type='checkbox' id='parking' className='w-4 h-4 accent-[#818cf8]' onChange={handleChange} checked={sidebardata.parking} />
                Parking
              </label>
              <label className='flex items-center gap-2 cursor-pointer text-[var(--text-primary)] text-sm font-medium'>
                <input type='checkbox' id='furnished' className='w-4 h-4 accent-[#818cf8]' onChange={handleChange} checked={sidebardata.furnished} />
                Meublé
              </label>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <label className='font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-xs'>Trier par</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='w-full rounded-lg p-3 outline-none transition-all duration-300 cursor-pointer'
              style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
            >
              <option value='regularPrice_desc' className='bg-[#1a1828] text-white'>Prix décroissant</option>
              <option value='regularPrice_asc' className='bg-[#1a1828] text-white'>Prix croissant</option>
              <option value='createdAt_desc' className='bg-[#1a1828] text-white'>Plus récent</option>
              <option value='createdAt_asc' className='bg-[#1a1828] text-white'>Plus ancien</option>
            </select>
          </div>

          <button className='btn-primary w-full mt-4 py-4 text-base tracking-wide'>
            Rechercher
          </button>
        </form>
      </div>
      
      {/* Results */}
      <div className='flex-1'>
        <h1 className='text-3xl font-bold p-7 mt-5 text-[var(--text-primary)]' style={{ borderBottom: '1px solid var(--glass-border)' }}>
          Résultats de recherche :
        </h1>
        <div className='p-7 flex flex-wrap gap-6'>
          {!loading && listings.length === 0 && (
            <div className='w-full text-center py-12'>
              <p className='text-xl text-[var(--text-muted)]'>Aucune annonce trouvée avec ces critères.</p>
            </div>
          )}
          {loading && (
            <div className='w-full text-center py-12'>
              <p className='text-xl text-[var(--primary-light)] font-medium animate-pulse'>Chargement des résultats...</p>
            </div>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <div className='w-full flex justify-center mt-8'>
              <button
                onClick={onShowMoreClick}
                className='btn-outline'
              >
                Afficher plus de résultats
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
