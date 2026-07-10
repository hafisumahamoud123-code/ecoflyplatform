'use client';
import { useState, useEffect } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  
  useEffect(() => {
    fetch(`${API}/marketplace/listings`).then(r => r.json()).then(setListings);
  }, []);

  const preorder = async (id) => {
    if (!confirm('Reserve this harvest?')) return;
    await fetch(`${API}/preorders/?listing_id=${id}`, { method: 'POST' });
    alert('🎉 Pre-order placed!');
    window.location.reload();
  };

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>📊 Marketplace</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        {listings.map(item => (
          <div key={item.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>{item.report.field.crop_type}</h3>
            <p>Health: {item.report.health_score}%</p>
            <p>Yield: {item.report.estimated_yield_kg}kg</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>${item.price_per_kg}/kg</p>
            <button onClick={() => preorder(item.id)} style={{ background: '#15803d', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>
              🔒 Pre-Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
