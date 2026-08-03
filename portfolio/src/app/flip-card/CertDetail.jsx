export default function CertDetail({ cert, onBack }) {
  return (
    <div className="cert-detail-body">
      <h2 className="detail-title">{cert.title}</h2>
      <p className="detail-desc">{cert.issuer}</p>
      <p className="detail-tags">{cert.tag.toLowerCase()} · {cert.year}</p>
      <button type="button" className="flip-btn detail-back" onClick={onBack}>
        ← certifications
      </button>
    </div>
  )
}
