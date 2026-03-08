import type { User } from '@supabase/supabase-js';

interface UserMenuProps {
  user: User;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const vorname = user.user_metadata?.vorname || '';
  const nachname = user.user_metadata?.nachname || '';
  const displayName = [vorname, nachname].filter(Boolean).join(' ') || user.email || '';

  return (
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{displayName}</span>
      <button
        onClick={onSignOut}
        style={{
          background: 'transparent',
          border: '1px solid #747480',
          color: '#A0A0A8',
          padding: '5px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          fontWeight: 600,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#FFE600';
          e.currentTarget.style.color = '#FFE600';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#747480';
          e.currentTarget.style.color = '#A0A0A8';
        }}
      >
        Abmelden
      </button>
    </div>
  );
}
