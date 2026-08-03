export default function ProjectCover({ project, size = "md" }) {
  return (
    <div className={`cert-cover cert-cover--${size}`}>
      <span className="cert-cover-frame" aria-hidden="true" />
      <img src={project.cover} alt="" className="cert-cover-art" draggable={false} />
      <span className="cert-cover-tag">{project.status === "live" ? "live" : "in progress"}</span>
    </div>
  )
}
