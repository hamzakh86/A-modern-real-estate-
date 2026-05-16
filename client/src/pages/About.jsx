import { FiMapPin, FiUsers, FiTrendingUp, FiShield, FiStar, FiHome } from 'react-icons/fi';
import { MdApartment, MdVilla } from 'react-icons/md';

const values = [
  {
    icon: <FiShield size={24} />,
    title: 'Confiance',
    desc: 'Chaque propriété est vérifiée et certifiée par notre équipe d\'experts pour garantir votre sécurité.',
  },
  {
    icon: <FiTrendingUp size={24} />,
    title: 'Excellence',
    desc: 'Nous sélectionnons uniquement les meilleures propriétés dans les quartiers les plus prisés.',
  },
  {
    icon: <FiUsers size={24} />,
    title: 'Proximité',
    desc: 'Notre équipe dédiée vous accompagne à chaque étape de votre projet immobilier.',
  },
];

const team = [
  { name: 'Hamza Khalef', role: 'Fondateur & Directeur', icon: <FiStar size={20} /> },
  { name: 'Sarah Amrani', role: 'Responsable Ventes', icon: <FiHome size={20} /> },
  { name: 'Karim Idrissi', role: 'Expert Immobilier', icon: <MdVilla size={20} /> },
];

export default function About() {
  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingTop: '72px' }}>

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', overflow: 'hidden' }}>
        <div className='blob' style={{ width: '500px', height: '500px', background: '#4f46e5', top: '-150px', right: '-100px', opacity: 0.2 }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className='section-label' style={{ justifyContent: 'center', marginBottom: '20px' }}>
            <FiMapPin size={12} /> À propos de nous
          </div>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15,
            letterSpacing: '-0.03em', marginBottom: '24px',
          }}>
            L'immobilier premium,{' '}
            <span className='gradient-text'>réinventé</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '640px', margin: '0 auto' }}>
            Hamza Estate est une agence immobilière de référence spécialisée dans l'aide à l'achat, la vente et la location de propriétés dans les quartiers les plus recherchés. Notre équipe d'agents expérimentés s'engage à offrir un service exceptionnel.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div className='glass-card' style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          padding: '40px 32px', gap: '0',
        }}>
          {[
            { icon: <FiHome size={20} />, value: '12K+', label: 'Propriétés' },
            { icon: <FiUsers size={20} />, value: '8K+', label: 'Clients' },
            { icon: <FiStar size={20} />, value: '95%', label: 'Satisfaction' },
            { icon: <FiMapPin size={20} />, value: '150+', label: 'Villes' },
          ].map((s, i, arr) => (
            <div key={i} style={{
              textAlign: 'center', padding: '16px 24px',
              borderRight: i < arr.length - 1 ? '1px solid var(--glass-border)' : 'none',
            }}>
              <div style={{ color: '#818cf8', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{
                fontWeight: 900, fontSize: '2rem', lineHeight: 1,
                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <div className='section-label' style={{ marginBottom: '16px' }}>Notre mission</div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '20px' }}>
              Vous aider à réaliser votre <span className='gradient-text'>projet immobilier</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
              Notre mission est d'accompagner nos clients dans la réalisation de leurs objectifs immobiliers grâce à des conseils d'experts, un service personnalisé et une connaissance approfondie du marché local.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Que vous souhaitiez acheter, vendre ou louer, nous sommes là à chaque étape pour rendre l'expérience aussi simple et agréable que possible.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {values.map((v, i) => (
              <div key={i} className='glass-card' style={{ display: 'flex', gap: '16px', padding: '24px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', boxShadow: '0 0 20px rgba(79,70,229,0.3)',
                }}>
                  {v.icon}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>{v.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 100px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className='section-label' style={{ justifyContent: 'center' }}><FiUsers size={12} /> Notre équipe</div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.02em' }}>
            Des experts à votre <span className='gradient-text'>service</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {team.map((member, i) => (
            <div key={i} className='glass-card' style={{ padding: '36px 24px', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px',
                background: `linear-gradient(${135 + i * 45}deg, #4f46e5, #db2777)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '28px',
                boxShadow: '0 0 30px rgba(79,70,229,0.4)',
              }}>
                {member.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>{member.name}</h3>
              <p style={{ color: 'var(--primary-light)', fontSize: '0.82rem', fontWeight: 600 }}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}