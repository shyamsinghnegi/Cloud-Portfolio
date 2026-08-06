export default function CertList({ certs, onSelect, onHover }) {
  return (
    <ul className="tracklist tracklist--compact" onMouseLeave={() => onHover?.(null)}>
      {certs.map((c, i) => (
        <li key={c.title}>
          <button
            type="button"
            className="tracklist-row"
            onClick={() => onSelect(i)}
            onMouseEnter={() => onHover?.(i)}
          >
            <span className="tracklist-name">{c.title}</span>
            <span className="tracklist-tag">{c.tag.toLowerCase()}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
