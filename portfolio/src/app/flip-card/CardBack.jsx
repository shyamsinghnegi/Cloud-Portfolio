"use client"
import { useState } from "react"
import { PROJECTS } from "../projects/data"
import ProjectList from "./ProjectList"
import ProjectDetail from "./ProjectDetail"
import ProjectCover from "./ProjectCover"
import "../styles/cert-list.css"
import "../styles/project-row.css"

export default function CardBack({ onFlip }) {
  const [activeSlug, setActiveSlug] = useState(null)
  const [hoverSlug, setHoverSlug] = useState(null)
  const activeProject = PROJECTS.find((p) => p.slug === activeSlug)
  const activeIndex = PROJECTS.findIndex((p) => p.slug === activeSlug)
  const sleeveProject = PROJECTS.find((p) => p.slug === hoverSlug) || PROJECTS[0]

  return (
    <>
      <div className="card-header">
        {activeProject ? (
          <button
            type="button"
            className="mark-row mark-row--back"
            onClick={() => setActiveSlug(null)}
            aria-label="back to projects"
          >
            <span className="mark-back-icon">‹</span>
            <span className="mark-avatar">
              <img src="/dither.png" alt="" />
            </span>
            <span className="mark-name">shyam</span>
          </button>
        ) : (
          <span className="mark-row">
            <span className="mark-avatar">
              <img src="/dither.png" alt="" />
            </span>
            <span className="mark-name">shyam</span>
          </span>
        )}
        <span className="corner-label">
          {activeProject
            ? `project ${String(activeIndex + 1).padStart(2, "0")}/${String(PROJECTS.length).padStart(2, "0")}`
            : `${String(PROJECTS.length).padStart(2, "0")} projects`}
        </span>
      </div>

      <div className="card-scroll">
        <div className="detail-pane">
          {activeProject ? (
            <div key="project-detail" className="pane-content">
              <ProjectDetail project={activeProject} />
            </div>
          ) : (
            <>
              {/* Desktop: thumbnail fixed left, heading + list on the right */}
              <div key="project-list-desktop" className="pane-content workshop-row front-desktop-only">
                <div className="workshop-sleeve-col">
                  <div className="workshop-sleeve">
                    <ProjectCover project={sleeveProject} size="lg" />
                  </div>
                  <p className="sleeve-caption">{sleeveProject.tagline}</p>
                </div>
                <div className="workshop-list-col">
                  <h1 className="workshop-heading">the workshop.</h1>
                  <ProjectList projects={PROJECTS} onSelect={setActiveSlug} onHover={setHoverSlug} compact />
                </div>
              </div>

              {/* Mobile: heading -> thumbnail -> list, stacked and centered */}
              <div key="project-list-mobile" className="pane-content workshop-col front-mobile-only">
                <h1 className="workshop-heading">the workshop.</h1>
                <div className="workshop-sleeve-col">
                  <div className="workshop-sleeve">
                    <ProjectCover project={sleeveProject} size="lg" />
                  </div>
                  <p className="sleeve-caption">{sleeveProject.tagline}</p>
                </div>
                <div className="workshop-list-col">
                  <ProjectList projects={PROJECTS} onSelect={setActiveSlug} onHover={setHoverSlug} compact />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {!activeProject && (
        <div className="card-footer card-footer--end">
          <button type="button" className="flip-btn flip-btn--specular" onClick={onFlip} aria-label="flip back to about me">
            back
          </button>
        </div>
      )}
    </>
  )
}
