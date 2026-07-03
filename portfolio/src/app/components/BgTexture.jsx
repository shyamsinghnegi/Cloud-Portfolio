"use client"
import { useEffect, useRef } from "react"
import { CONSTELLATIONS } from "./constellations"

const NUM_BG_STARS = 700
const NUM_GIANT_STARS = 12
const NUM_GALAXIES = 5
const NUM_NEBULAS = 5
const MAX_LIVE = 3

function rand(min, max) { return min + Math.random() * (max - min) }

export default function BgTexture({ variant = "home" }) {
  const canvasRef = useRef(null)
  const variantRef = useRef(variant)
  variantRef.current = variant

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = null
    let width = 0, height = 0, dpr = 1

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const bgStars = Array.from({ length: NUM_BG_STARS }, () => ({
      x: rand(-0.5, 1.5),
      y: rand(-0.5, 1.5),
      r: 0.3 + Math.random() * Math.random() * 0.9,
      phase: rand(0, Math.PI * 2),
      speed: rand(0.4, 1.1),
      base: rand(0.16, 0.5),
      driftAngle: rand(0, Math.PI * 2),
      driftMul: rand(0.7, 1.3),
    }))

    const MIN_GIANT_DIST = 0.5
    const giantPositions = []
    for (let i = 0; i < NUM_GIANT_STARS; i++) {
      let best = null
      for (let attempt = 0; attempt < 20; attempt++) {
        const gx = rand(-0.3, 1.3)
        const gy = rand(-0.3, 1.3)
        const collides = giantPositions.some(p => Math.hypot(p.x - gx, p.y - gy) < MIN_GIANT_DIST)
        if (!collides) { best = { x: gx, y: gy }; break }
        if (!best) best = { x: gx, y: gy }
      }
      giantPositions.push(best)
    }

    const GIANT_COLORS = ["255,120,110", "130,170,255", "255,210,110"]
    const giantStars = Array.from({ length: NUM_GIANT_STARS }, (_, gi) => {
      const color = GIANT_COLORS[Math.floor(Math.random() * GIANT_COLORS.length)]
      return {
        x: giantPositions[gi].x,
        y: giantPositions[gi].y,
        r: rand(0.4, 0.7),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.25, 0.5),
        base: rand(0.5, 0.85),
        color,
        _glow: null,
        driftAngle: rand(0, Math.PI * 2),
        driftMul: rand(0.7, 1.3),
      }
    })

    const GALAXY_COLORS = [
      "190,150,255", // violet
      "255,150,170", // rose
      "150,210,255", // cyan-blue
      "255,190,120", // amber
      "150,255,200", // teal-green
      "255,140,220", // magenta
    ]
    const galaxyPositions = []
    const MIN_GALAXY_DIST = 0.35
    for (let i = 0; i < NUM_GALAXIES; i++) {
      let best = null
      for (let attempt = 0; attempt < 20; attempt++) {
        const gx = rand(-0.4, 1.4)
        const gy = rand(-0.4, 1.4)
        const collides = galaxyPositions.some(p => Math.hypot(p.x - gx, p.y - gy) < MIN_GALAXY_DIST)
        if (!collides) { best = { x: gx, y: gy }; break }
        if (!best) best = { x: gx, y: gy }
      }
      galaxyPositions.push(best)
    }

    const galaxies = Array.from({ length: NUM_GALAXIES }, (_, gi) => {
      const w = rand(45, 85)
      const sprite = document.createElement("canvas")
      sprite.width = w
      sprite.height = w
      const sctx = sprite.getContext("2d")
      const color = GALAXY_COLORS[Math.floor(Math.random() * GALAXY_COLORS.length)]
      const cx = w / 2, cy = w / 2
      sctx.translate(cx, cy)
      sctx.rotate(rand(0, Math.PI))
      sctx.scale(1, rand(0.32, 0.5))

      // irregular disc: overlapping offset blobs instead of one clean ellipse
      const blobCount = 5
      for (let i = 0; i < blobCount; i++) {
        const bAngle = rand(0, Math.PI * 2)
        const bDist = rand(0, w * 0.22)
        const bx = Math.cos(bAngle) * bDist
        const by = Math.sin(bAngle) * bDist
        const br = rand(w * 0.28, w * 0.5)
        const grad = sctx.createRadialGradient(bx, by, 0, bx, by, br)
        grad.addColorStop(0, `rgba(${color},${rand(0.14, 0.26)})`)
        grad.addColorStop(0.35, `rgba(${color},0.09)`)
        grad.addColorStop(0.7, `rgba(${color},0.025)`)
        grad.addColorStop(1, `rgba(${color},0)`)
        sctx.fillStyle = grad
        sctx.beginPath()
        sctx.arc(bx, by, br, 0, Math.PI * 2)
        sctx.fill()
      }

      // bright core, dimming outward into the disc
      const core = sctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.22)
      core.addColorStop(0, `rgba(255,252,245,0.75)`)
      core.addColorStop(0.25, `rgba(255,250,240,0.4)`)
      core.addColorStop(0.55, `rgba(${color},0.22)`)
      core.addColorStop(1, `rgba(${color},0)`)
      sctx.fillStyle = core
      sctx.beginPath()
      sctx.arc(0, 0, w * 0.22, 0, Math.PI * 2)
      sctx.fill()

      return {
        x: galaxyPositions[gi].x,
        y: galaxyPositions[gi].y,
        w,
        sprite,
        driftMul: rand(0.15, 0.35),
        driftAngle: rand(0, Math.PI * 2),
      }
    })

    const NEBULA_COLORS = [
      "150,90,200",  // deep violet
      "200,80,110",  // dusky rose
      "70,110,200",  // steel blue
      "80,160,150",  // sea green
    ]
    const nebulaPositions = []
    const MIN_NEBULA_DIST = 0.45
    for (let i = 0; i < NUM_NEBULAS; i++) {
      let best = null
      for (let attempt = 0; attempt < 20; attempt++) {
        const nx = rand(-0.3, 1.3)
        const ny = rand(-0.3, 1.3)
        const collides = nebulaPositions.some(p => Math.hypot(p.x - nx, p.y - ny) < MIN_NEBULA_DIST)
        if (!collides) { best = { x: nx, y: ny }; break }
        if (!best) best = { x: nx, y: ny }
      }
      nebulaPositions.push(best)
    }

    const nebulas = Array.from({ length: NUM_NEBULAS }, (_, ni) => {
      const w = rand(500, 1300)
      const sprite = document.createElement("canvas")
      sprite.width = w
      sprite.height = w
      const sctx = sprite.getContext("2d")
      const baseColor = NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)]
      const cx = w / 2, cy = w / 2

      const blobCount = 3
      for (let i = 0; i < blobCount; i++) {
        const bx = cx + rand(-w * 0.22, w * 0.22)
        const by = cy + rand(-w * 0.22, w * 0.22)
        const br = rand(w * 0.22, w * 0.34)
        const color = i === 0 ? baseColor : NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)]
        const grad = sctx.createRadialGradient(bx, by, 0, bx, by, br)
        grad.addColorStop(0, `rgba(${color},0.16)`)
        grad.addColorStop(0.4, `rgba(${color},0.08)`)
        grad.addColorStop(0.75, `rgba(${color},0.02)`)
        grad.addColorStop(1, `rgba(${color},0)`)
        sctx.fillStyle = grad
        sctx.beginPath()
        sctx.arc(bx, by, br, 0, Math.PI * 2)
        sctx.fill()
      }

      return {
        x: nebulaPositions[ni].x,
        y: nebulaPositions[ni].y,
        w,
        sprite,
        driftMul: rand(0.05, 0.12),
        driftAngle: rand(0, Math.PI * 2),
      }
    })

    let frameCount = 0

    const DRIFT_PX_PER_SEC = 6
    const DRIFT_SPAN = 2

    let live = []
    let nextSpawn = 0

    let comets = []
    let nextComet = rand(8, 14)

    let drifters = []
    let nextDrifterCheck = rand(150, 240)

    function spawnDrifter(t) {
      const fromLeft = Math.random() < 0.5
      const y0 = rand(0.1, 0.45) * height
      const speed = rand(60, 90)
      const dirX = fromLeft ? 1 : -1
      const bob = rand(0.3, 0.6)
      const bobAmp = rand(6, 14)
      const size = rand(13, 18)
      drifters.push({
        start: t,
        duration: (width + size * 4) / speed,
        x0: fromLeft ? -size * 2 : width + size * 2,
        y0,
        vx: speed * dirX,
        dirX,
        bob,
        bobAmp,
        size,
      })
    }

    function spawnComet(t) {
      const fromLeft = Math.random() < 0.5
      const y0 = rand(0.05, 0.5) * height
      const descentAngle = rand(0.08, 0.18) * Math.PI
      const speed = rand(350, 550)
      const dirX = fromLeft ? 1 : -1
      const travel = Math.hypot(width, height * 0.5)
      comets.push({
        start: t,
        duration: travel / speed + 0.6,
        x0: fromLeft ? -60 : width + 60,
        y0,
        vx: Math.cos(descentAngle) * speed * dirX,
        vy: Math.sin(descentAngle) * speed,
        len: rand(70, 110),
      })
    }

    function boundingRadius(def, size) {
      let maxD = 0
      def.stars.forEach(([nx, ny]) => {
        const dx = (nx - 0.5) * size
        const dy = (ny - 0.5) * size
        const d = Math.hypot(dx, dy)
        if (d > maxD) maxD = d
      })
      return maxD
    }

    function spawnConstellation(t) {
      const usedNames = new Set(live.map(c => c.def.name))
      const choices = CONSTELLATIONS.filter(c => !usedNames.has(c.name))
      if (choices.length === 0) return
      const def = choices[Math.floor(Math.random() * choices.length)]
      const isMobile = width < 640
      const size = isMobile ? rand(140, 220) : rand(150, 260)
      const radius = boundingRadius(def, size)

      let best = null
      for (let attempt = 0; attempt < 12; attempt++) {
        const originX = rand(0.12, 0.84) * width
        const originY = rand(0.12, 0.78) * height
        const collides = live.some(c => {
          const dx = c.originXFrac * width - originX
          const dy = c.originY - originY
          return Math.hypot(dx, dy) < (c.radius + radius + 60)
        })
        if (!collides) { best = { originX, originY }; break }
        if (!best) best = { originX, originY }
      }

      live.push({
        def,
        size,
        radius,
        originXFrac: best.originX / width,
        originY: best.originY,
        driftAngle: rand(0, Math.PI * 2),
        start: t,
        fadeIn: 2.6,
        hold: rand(5, 8),
        fadeOut: 3,
      })
    }

    const start = performance.now()
    let animating = false

    function draw(now) {
      frameCount++
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "#05050b"
      ctx.fillRect(0, 0, width, height)

      const driftMag = (t * DRIFT_PX_PER_SEC / width) % DRIFT_SPAN

      function driftPos(obj, speedMul) {
        const dist = driftMag * speedMul
        const x = ((obj.x + Math.cos(obj.driftAngle) * dist + 0.5) % DRIFT_SPAN + DRIFT_SPAN) % DRIFT_SPAN - 0.5
        const y = ((obj.y + Math.sin(obj.driftAngle) * dist + 0.5) % DRIFT_SPAN + DRIFT_SPAN) % DRIFT_SPAN - 0.5
        return { x, y }
      }

      nebulas.forEach(n => {
        const p = driftPos(n, n.driftMul)
        ctx.drawImage(n.sprite, p.x * width - n.w / 2, p.y * height - n.w / 2)
      })

      galaxies.forEach(g => {
        const p = driftPos(g, g.driftMul)
        ctx.drawImage(g.sprite, p.x * width - g.w / 2, p.y * height - g.w / 2)
      })

      bgStars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase)
        const alpha = s.base * (0.6 + 0.4 * tw)
        const p = driftPos(s, s.driftMul)
        ctx.beginPath()
        ctx.fillStyle = `rgba(230,230,255,${alpha.toFixed(3)})`
        ctx.arc(p.x * width, p.y * height, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      const refreshGlow = frameCount % 3 === 0
      giantStars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase)
        const alpha = s.base * (0.7 + 0.3 * tw)
        const p = driftPos(s, s.driftMul)
        let x = p.x * width
        const y = p.y * height
        const glowR = s.r * 5
        if (refreshGlow || !s._glow) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR)
          glow.addColorStop(0, `rgba(${s.color},${(alpha * 0.55).toFixed(3)})`)
          glow.addColorStop(1, `rgba(${s.color},0)`)
          s._glow = glow
        }
        ctx.fillStyle = s._glow
        ctx.fillRect(x - glowR, y - glowR, glowR * 2, glowR * 2)

        ctx.beginPath()
        ctx.fillStyle = `rgba(${s.color},${alpha.toFixed(3)})`
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      if (t >= nextComet) {
        spawnComet(t)
        nextComet = t + rand(8, 14)
      }
      comets = comets.filter(c => (t - c.start) <= c.duration)
      comets.forEach(c => {
        const age = t - c.start
        const p = age / c.duration
        const fade = p < 0.15 ? p / 0.15 : p > 0.75 ? Math.max(0, 1 - (p - 0.75) / 0.25) : 1
        const x = c.x0 + c.vx * age
        const y = c.y0 + c.vy * age
        const speedMag = Math.hypot(c.vx, c.vy) || 1
        const tx = x - (c.vx / speedMag) * c.len
        const ty = y - (c.vy / speedMag) * c.len

        const grad = ctx.createLinearGradient(x, y, tx, ty)
        grad.addColorStop(0, `rgba(255,255,255,${(0.85 * fade).toFixed(3)})`)
        grad.addColorStop(0.4, `rgba(200,210,255,${(0.4 * fade).toFixed(3)})`)
        grad.addColorStop(1, "rgba(200,210,255,0)")
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(tx, ty)
        ctx.stroke()

        const headGlow = ctx.createRadialGradient(x, y, 0, x, y, 5)
        headGlow.addColorStop(0, `rgba(255,255,255,${fade.toFixed(3)})`)
        headGlow.addColorStop(1, "rgba(255,255,255,0)")
        ctx.fillStyle = headGlow
        ctx.fillRect(x - 5, y - 5, 10, 10)

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${fade.toFixed(3)})`
        ctx.arc(x, y, 1.3, 0, Math.PI * 2)
        ctx.fill()
      })

      if (t >= nextDrifterCheck && drifters.length === 0) {
        spawnDrifter(t)
        nextDrifterCheck = t + rand(150, 240)
      }
      drifters = drifters.filter(d => (t - d.start) <= d.duration)
      drifters.forEach(d => {
        const age = t - d.start
        const p = age / d.duration
        const fade = p < 0.08 ? p / 0.08 : p > 0.9 ? Math.max(0, 1 - (p - 0.9) / 0.1) : 1
        const x = d.x0 + d.vx * age
        const y = d.y0 + Math.sin(age * d.bob) * d.bobAmp
        const a = fade * 0.55

        ctx.save()
        ctx.translate(x, y)
        ctx.globalAlpha = a
        ctx.fillStyle = "#c8caf0"
        ctx.strokeStyle = "#c8caf0"

        const s = d.size
        ctx.rotate(d.dirX > 0 ? -0.5 : 0.5)

        // dish
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(0, 0, s * 0.36, s * 0.36, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-s * 0.3, -s * 0.14)
        ctx.lineTo(s * 0.3, s * 0.14)
        ctx.stroke()

        // body, behind the dish
        ctx.beginPath()
        ctx.roundRect(-s * 0.1, s * 0.28, s * 0.2, s * 0.22, 1.5)
        ctx.fill()

        // angled booms
        ctx.lineWidth = 0.9
        ctx.beginPath()
        ctx.moveTo(-s * 0.06, s * 0.32)
        ctx.lineTo(-s * 0.5, s * 0.7)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(s * 0.06, s * 0.32)
        ctx.lineTo(s * 0.5, s * 0.7)
        ctx.stroke()

        // trailing magnetometer boom
        ctx.globalAlpha = a * 0.6
        ctx.beginPath()
        ctx.moveTo(0, s * 0.5)
        ctx.lineTo(s * 1.6, s * 1.9)
        ctx.stroke()

        ctx.restore()
      })

      if (variantRef.current === "home") {
        if (t >= nextSpawn && live.length < MAX_LIVE) {
          spawnConstellation(t)
          nextSpawn = t + rand(4, 8)
        }
      } else {
        live = []
      }

      live = live.filter(c => {
        const age = t - c.start
        const total = c.fadeIn + c.hold + c.fadeOut
        return age <= total
      })

      live.forEach(c => {
        const age = t - c.start
        let alpha
        if (age < c.fadeIn) alpha = age / c.fadeIn
        else if (age < c.fadeIn + c.hold) alpha = 1
        else alpha = Math.max(0, 1 - (age - c.fadeIn - c.hold) / c.fadeOut)

        const driftDist = (t - c.start) * DRIFT_PX_PER_SEC
        const originX = c.originXFrac * width + Math.cos(c.driftAngle) * driftDist
        const originY = c.originY + Math.sin(c.driftAngle) * driftDist
        const pts = c.def.stars.map(([nx, ny]) => [
          originX + (nx - 0.5) * c.size,
          originY + (ny - 0.5) * c.size,
        ])

        ctx.strokeStyle = `rgba(185,166,255,${(alpha * 0.32).toFixed(3)})`
        ctx.lineWidth = 0.7
        c.def.lines.forEach(([a, b], i) => {
          const lineProgress = Math.min(1, Math.max(0, (age - c.fadeIn * (i / c.def.lines.length)) / (c.fadeIn * 0.6)))
          if (age >= c.fadeIn) {
            ctx.beginPath()
            ctx.moveTo(pts[a][0], pts[a][1])
            ctx.lineTo(pts[b][0], pts[b][1])
            ctx.stroke()
          } else if (lineProgress > 0) {
            const [x1, y1] = pts[a]
            const [x2, y2] = pts[b]
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x1 + (x2 - x1) * lineProgress, y1 + (y2 - y1) * lineProgress)
            ctx.strokeStyle = `rgba(185,166,255,${(alpha * 0.32 * lineProgress).toFixed(3)})`
            ctx.stroke()
          }
        })

        pts.forEach(([x, y], i) => {
          const tw = 0.7 + 0.3 * Math.sin(t * 2.2 + i * 1.3)
          const a = alpha * tw * 0.65
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 6)
          glow.addColorStop(0, `rgba(255,255,255,${(a * 0.9).toFixed(3)})`)
          glow.addColorStop(1, "rgba(255,255,255,0)")
          ctx.fillStyle = glow
          ctx.fillRect(x - 6, y - 6, 12, 12)

          ctx.beginPath()
          ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
          ctx.arc(x, y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      if (animating && !reduceMotion) raf = requestAnimationFrame(draw)
    }

    draw(performance.now()) // paint one static frame immediately, no blank flash

    let startTimeout = null
    if (!reduceMotion) {
      startTimeout = setTimeout(() => {
        animating = true
        raf = requestAnimationFrame(draw)
      }, 200)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (startTimeout) clearTimeout(startTimeout)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  )
}
