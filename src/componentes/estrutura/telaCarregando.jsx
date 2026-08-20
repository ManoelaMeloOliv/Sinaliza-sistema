export function TelaCarregando() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f5f4f9' }}>
      <div className="tc-spinner" />
      <style>{`
        .tc-spinner{width:40px;height:40px;border-radius:50%;border:3px solid #e8e4ee;border-top-color:#6938ef;animation:tc-girar .7s linear infinite}
        @keyframes tc-girar{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  )
}