import { useState } from 'react';
import LeadIntakePage from './pages/LeadIntakePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [view, setView] = useState('apply');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <svg
            className="app-header__logo"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 7h12l3 6-8.5 8L4 13l2-6Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          <span>Yellow Metal</span>
        </div>
        <nav className="app-header__nav">
          <button
            type="button"
            className={view === 'apply' ? 'nav-btn nav-btn--active' : 'nav-btn'}
            onClick={() => setView('apply')}
          >
            Apply
          </button>
          <button
            type="button"
            className={view === 'admin' ? 'nav-btn nav-btn--active' : 'nav-btn'}
            onClick={() => setView('admin')}
          >
            Partner Dashboard
          </button>
        </nav>
      </header>

      <main className="app-main">{view === 'apply' ? <LeadIntakePage /> : <AdminPage />}</main>
    </div>
  );
}
