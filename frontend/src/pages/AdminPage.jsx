import { useEffect, useState } from 'react';
import AdminLeadsTable from '../components/AdminLeadsTable';
import { getLeads } from '../api/client';

export default function AdminPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchLeads() {
    setLoading(true);
    setError(null);
    getLeads()
      .then((data) => setLeads(data.leads))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(fetchLeads, []);

  return (
    <div className="card admin-page">
      <div className="admin-page__header">
        <h2>Partner Summary View</h2>
        <button type="button" className="btn btn-secondary" onClick={fetchLeads} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {error && <p className="field-error">Could not load leads: {error}</p>}
      {!error && <AdminLeadsTable leads={leads} />}
    </div>
  );
}
