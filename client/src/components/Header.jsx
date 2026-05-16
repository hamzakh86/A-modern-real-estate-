import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
    setMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const t = urlParams.get('searchTerm');
    if (t) setSearchTerm(t);
  }, [location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-400 ease-in-out ${
        scrolled ? 'bg-[rgba(15,14,23,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] shadow-[0_4px_30px_rgba(0,0,0,0.3)]' : 'bg-transparent border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <Link to='/' className="flex items-center gap-2 no-underline z-50">
          <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[18px]" style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            boxShadow: '0 0 20px rgba(79,70,229,0.5)',
          }}>🏠</div>
          <span className="font-['Outfit'] font-extrabold text-xl tracking-tight hidden sm:block">
            <span className="text-[#818cf8]">Hamza</span>
            <span className="text-[#f8f8ff]">Estate</span>
          </span>
        </Link>

        {/* Search - Desktop */}
        <form onSubmit={handleSubmit} className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300" style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
        }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
        >
          <input
            type='text'
            placeholder='Rechercher...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-[#f8f8ff] text-sm font-['Outfit'] w-[150px] lg:w-[260px]"
          />
          <button type='submit' className="bg-none border-none cursor-pointer flex items-center">
            <FaSearch className="text-[#818cf8] text-sm" />
          </button>
        </form>

        {/* Nav links - Desktop */}
        <nav className="hidden md:flex items-center gap-2">
          {[
            { to: '/', label: 'Accueil' },
            { to: '/about', label: 'À propos' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="text-[#a8a5c0] no-underline font-medium text-sm px-4 py-2 rounded-full transition-all duration-200 hover:text-[#f8f8ff] hover:bg-[rgba(255,255,255,0.06)]">
              {label}
            </Link>
          ))}

          <Link to='/profile' className="no-underline ml-2">
            {currentUser ? (
              <img src={currentUser.avatar} alt='profile' className="w-[38px] h-[38px] rounded-full object-cover border-2 border-[rgba(79,70,229,0.7)] shadow-[0_0_12px_rgba(79,70,229,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.7)]" />
            ) : (
              <span className="text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)]" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                Connexion
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center text-[#f8f8ff] z-50 text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-[rgba(15,14,23,0.95)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] md:hidden flex flex-col items-center py-6 gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 rounded-full w-[80%]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <input
              type='text'
              placeholder='Rechercher...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[#f8f8ff] text-sm font-['Outfit'] w-full"
            />
            <button type='submit' className="bg-none border-none cursor-pointer flex items-center"><FaSearch className="text-[#818cf8]" /></button>
          </form>

          <Link to='/' onClick={() => setMenuOpen(false)} className="text-[#f8f8ff] no-underline font-semibold text-lg">Accueil</Link>
          <Link to='/about' onClick={() => setMenuOpen(false)} className="text-[#f8f8ff] no-underline font-semibold text-lg">À propos</Link>
          <Link to='/profile' onClick={() => setMenuOpen(false)} className="no-underline mt-2">
            {currentUser ? (
              <img src={currentUser.avatar} alt='profile' className="w-[48px] h-[48px] rounded-full object-cover border-2 border-[rgba(79,70,229,0.7)]" />
            ) : (
              <span className="text-white font-semibold px-6 py-3 rounded-full inline-block" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>Connexion</span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}