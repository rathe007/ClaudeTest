import { useState } from 'react';
import { supabase } from '../lib/supabase';

const KEYWORD_HASH = '59284f4ed8b7880cfeec0af875fb9bfe9f340b0ab1d7341ed7be09567c012d79';

async function hashKeyword(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const hash = await hashKeyword(keyword);
      if (hash !== KEYWORD_HASH) {
        setError('Ungültiges Schlüsselwort.');
        setSubmitting(false);
        return;
      }

      if (mode === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { vorname, nachname },
          },
        });
        if (signUpError) {
          setError(translateError(signUpError.message));
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(translateError(signInError.message));
          return;
        }
      }
    } catch {
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ background: '#FFE600', padding: '6px 12px', display: 'inline-block' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#2E2E38', letterSpacing: '0.02em' }}>EY</span>
          </div>
          <h2 style={{ margin: '16px 0 0', fontSize: '18px', fontWeight: 700, color: '#2E2E38' }}>
            {mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <input
                className="auth-input"
                type="text"
                placeholder="Vorname"
                value={vorname}
                onChange={e => setVorname(e.target.value)}
                required
              />
              <input
                className="auth-input"
                type="text"
                placeholder="Nachname"
                value={nachname}
                onChange={e => setNachname(e.target.value)}
                required
              />
            </>
          )}
          <input
            className="auth-input"
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Schlüsselwort"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            required
          />

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-button" type="submit" disabled={submitting}>
            {submitting
              ? 'Bitte warten...'
              : mode === 'login'
                ? 'Anmelden'
                : 'Registrieren'}
          </button>
        </form>

        <button
          className="auth-toggle"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
        >
          {mode === 'login'
            ? 'Noch kein Konto? Registrieren'
            : 'Bereits registriert? Anmelden'}
        </button>
      </div>
    </div>
  );
}

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Ungültige Anmeldedaten.';
  if (msg.includes('User already registered')) return 'Diese E-Mail ist bereits registriert.';
  if (msg.includes('Password should be')) return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
  if (msg.includes('Unable to validate email')) return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
  if (msg.includes('Email rate limit exceeded')) return 'Zu viele Versuche. Bitte versuchen Sie es später erneut.';
  return msg;
}
