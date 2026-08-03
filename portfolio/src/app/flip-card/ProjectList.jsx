export default function ProjectList({ projects, onSelect, onHover, compact }) {
  return (
    <ul className={`tracklist tracklist--bleed${compact ? " tracklist--compact" : ""}`} onMouseLeave={() => onHover?.(null)}>
      {projects.map((p, i) => (
        <li key={p.slug}>
          <button
            type="button"
            className="tracklist-row"
            onClick={() => onSelect(p.slug)}
            onMouseEnter={() => onHover?.(p.slug)}
          >
            <span className="tracklist-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="tracklist-name">{p.name}</span>
            <span className="tracklist-tag">{p.tags[0]?.toLowerCase()}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
