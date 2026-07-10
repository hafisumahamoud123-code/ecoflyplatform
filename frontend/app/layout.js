export const metadata = { title: 'Eco-Fly Marketplace', description: 'Smart Agriculture Platform' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f3f4f6' }}>
        <nav style={{ background: '#15803d', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0 }}>🌾 Eco-Fly</h1>
          <div>
            <a href="/dashboard" style={{ color: 'white', marginRight: '16px' }}>Dashboard</a>
            <a href="/marketplace" style={{ color: 'white' }}>Marketplace</a>
          </div>
        </nav>
        <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>{children}</main>
      </body>
    </html>
  );
}
