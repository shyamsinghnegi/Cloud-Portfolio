export default function CertCover({ cert, size = "md" }) {
  return (
    <div className={`cert-cover cert-cover--${size}`}>
      <span className="cert-cover-frame" aria-hidden="true" />
      <img src={cert.cover} alt="" className="cert-cover-art" draggable={false} />
      <span className="cert-cover-tag">{cert.tag.toLowerCase()}</span>
    </div>
  )
}
