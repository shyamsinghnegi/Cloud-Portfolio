import ScreenshotStack from "../components/ScreenshotStack"
import { GithubIcon } from "./SocialIcons"

const ExtIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </svg>
)

export default function ProjectDetail({ project }) {
  return (
    <div className="detail-view">
      <h2 className="detail-title detail-title--top">{project.name}</h2>

      <div className="detail-media">
        <ScreenshotStack screenshots={project.screenshots} layout={project.screenshotLayout} />
      </div>

      <div className="detail-links">
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="flip-btn">
            view project <ExtIcon />
          </a>
        )}
        {project.gh && (
          <a href={project.gh} target="_blank" rel="noopener noreferrer" className="flip-btn">
            <GithubIcon /> source
          </a>
        )}
      </div>

      <p className="detail-desc">{project.desc}</p>

      {project.stack && (
        <div className="stack-section">
          <div className="section-label section-label--center">tech stack</div>
          <p className="detail-tags detail-tags--center">
            {project.stack.map((row) => row.tech).join(" · ").toLowerCase()}
          </p>
        </div>
      )}

      {project.features && (
        <div className="features-section">
          <div className="section-label section-label--center">features</div>
          <div className="feature-graph">
            {project.features.map((f, i) => (
              <div className="feature-node-wrap" key={f.title}>
                <div className="feature-node">
                  <span className="feature-node-title">{f.title}</span>
                  <span className="feature-node-body">{f.body}</span>
                </div>
                {i < project.features.length - 1 && <span className="feature-node-link" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
