'use client';
import { useState, useEffect } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch(`${API}/fields/farmer/1`);
    setFields(await res.json());
  };
  useEffect(() => { load(); }, []);

  const scan = async (id) => {
    if (!confirm('Run drone scan?')) return;
    setLoading(true);
    const res = await fetch(`${API}/missions/run/${id}`, { method: 'POST' });
    const data = await res.json();
    alert(`✅ Health: ${data.report.health_score}% | Yield: ${data.report.estimated_yield_kg}kg`);
    load();
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>🚁 Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        {fields.map(f => (
          <div key={f.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>{f.name}</h3>
            <p>Crop: {f.crop_type}</p>
            <button onClick={() => scan(f.id)} disabled={loading} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>
              {loading ? 'Scanning...' : '🛸 Simulate Scan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
