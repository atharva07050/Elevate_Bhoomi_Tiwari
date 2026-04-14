import React from 'react';
import { BookOpen, PlayCircle, ChevronRight, PenTool, ClipboardList, ArrowLeft } from 'lucide-react';

export default function MentorPlan({ planData, onBack }) {
  if (!planData || planData.length === 0) {
    return (
      <div className="glass-panel text-center">
        <h3 className="text-gradient">No Weak Topics Identified!</h3>
        <p style={{ color: 'var(--text-secondary)' }}>This candidate has an excellent technical profile.</p>
        <button onClick={onBack} className="btn btn-secondary mt-4">
          <ArrowLeft size={18} /> Back to Report
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in delay-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <BookOpen size={32} color="#f472b6" />
          Personalized Mentor Plan
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Strategic study guide focusing on identified weak areas</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {planData.map((plan, index) => (
          <div key={index} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#818cf8', marginBottom: '0.5rem' }}>{index + 1}. {plan.topic}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span className={`badge ${plan.weaknessLevel?.toLowerCase() === 'high' ? 'badge-error' : plan.weaknessLevel?.toLowerCase() === 'medium' ? 'badge-warning' : 'badge-neutral'}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px' }}>
                  {plan.weaknessLevel} Risk
                </span>
            </div>
            
            <p style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
              <strong>Reason:</strong> {plan.reason}
            </p>

            <div className="mb-4">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6', marginBottom: '0.75rem' }}>
                <ClipboardList size={16} /> Recommended Resources
              </h4>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {plan.resources && plan.resources.map((res, rIdx) => {
                  let href = res.url || (typeof res === 'string' && res.startsWith('http') ? res : '#');
                  let text = res.title || res.name || res;
                  
                  if (typeof res === 'string') {
                    const urlMatch = res.match(/(https?:\/\/[^\s]+)/);
                    if (urlMatch) {
                      href = urlMatch[0].trim();
                      text = res.replace(href, '').replace(/:\s*$/, '').replace(/-/g, '').trim();
                    }
                  }

                  return (
                    <li key={rIdx} style={{ marginBottom: '0.25rem' }}>
                       <a href={href !== '#' ? href : undefined} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'underline', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#c084fc'} onMouseOut={(e) => e.target.style.color = '#818cf8'}>
                          {text || 'View Resource'}
                       </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={18} /> Return to Evaluation Card
        </button>
      </div>
    </div>
  );
}
