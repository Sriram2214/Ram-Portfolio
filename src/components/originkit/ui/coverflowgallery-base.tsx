// Originkit 3D Coverflow Gallery — Styled with Premium Off-White Playing Card Aesthetics
"use client"

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type CSSProperties,
} from "react"
const useIsStaticRenderer = () => false

export interface Slide {
    num: string
    suit: string
    suitColor: "suit-dark" | "suit-red"
    title: string
    desc: string
    badge: string
    techs: string[]
    hasSoundWave?: boolean
    url?: string
}

type AutoplayDir = "leftToRight" | "rightToLeft"

export interface Smooth3DSlideshowProps {
    slides?: Slide[]
    cardWidth?: number
    cardHeight?: number
    radius?: number
    tilt?: number
    sideTilt?: number
    gap?: number
    opacity?: number
    transition?: any
    autoplay?: boolean
    autoplayDirection?: AutoplayDir
    style?: CSSProperties
}

const PERSPECTIVE = 1600
const SCALE_STEP = 0.16
const MAX_VISIBLE = 2
const DEPTH = 220

function cssTransition(t: any): { dur: number; ease: string } {
    const dur = t && typeof t.duration === "number" ? t.duration : 0.6
    let ease = "cubic-bezier(0.22, 1, 0.36, 1)"
    const e = t?.ease
    if (Array.isArray(e) && e.length === 4) {
        ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`
    } else if (typeof e === "string") {
        const map: Record<string, string> = {
            linear: "linear",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
        }
        ease = map[e] || "ease"
    }
    return { dur, ease }
}

export function Smooth3DSlideshow(props: Smooth3DSlideshowProps) {
    const {
        slides = [],
        cardWidth = 420,
        cardHeight = 420,
        radius = 26,
        tilt = 18,
        sideTilt = 6,
        gap = 7.5,
        opacity = 50,
        transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        autoplay = false,
        autoplayDirection = "rightToLeft",
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const list = slides && slides.length ? slides : []
    const n = list.length

    const loop = true
    const [active, setActive] = useState(0)
    const lastTapRef = useRef<number>(0)

    useEffect(() => {
        setActive((a) => Math.max(0, Math.min(n - 1, a)))
    }, [n])

    const moveDur =
        transition && typeof transition.duration === "number"
            ? transition.duration
            : 0.6
    const lockRef = useRef(false)
    const lock = useCallback(() => {
        lockRef.current = true
        window.setTimeout(
            () => {
                lockRef.current = false
            },
            Math.max(50, moveDur * 1000)
        )
    }, [moveDur])

    const step = useCallback(
        (dir: number) => {
            if (lockRef.current) return
            lock()
            setActive((a) => (((a + dir) % n) + n) % n)
        },
        [n, lock]
    )

    useEffect(() => {
        if (isStatic || !autoplay || n < 2) return
        const dir = autoplayDirection === "leftToRight" ? -1 : 1
        const id = window.setInterval(() => step(dir), 3000)
        return () => window.clearInterval(id)
    }, [isStatic, autoplay, autoplayDirection, n, step])

    const handleCardClick = useCallback(
        (i: number) => {
            if (isStatic || autoplay || lockRef.current) return
            lock()
            setActive((a) => (i === a ? (a + 1) % n : i))
        },
        [isStatic, autoplay, n, lock]
    )

    const handleDoubleTap = () => {
        window.open("https://github.com/Sriram2214", "_blank", "noopener,noreferrer")
    }

    const handleTouchEnd = () => {
        const now = Date.now()
        if (now - lastTapRef.current < 350) {
            handleDoubleTap()
        }
        lastTapRef.current = now
    }

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                e.preventDefault()
                step(1)
            } else if (e.key === "ArrowLeft") {
                e.preventDefault()
                step(-1)
            }
        },
        [step]
    )

    const { dur, ease } = cssTransition(transition)
    const transitionCss = `transform ${dur}s ${ease}, opacity ${dur}s ${ease}, filter ${dur}s ${ease}, box-shadow ${dur}s ${ease}`

    const effectiveRadius = radius ?? 26
    const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100

    const rootStyle: CSSProperties = {
        ...(style || {}),
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: `${PERSPECTIVE}px`,
        overflow: "visible",
        outline: "none",
    }

    return (
        <div
            style={rootStyle}
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            onKeyDown={isStatic ? undefined : onKeyDown}
        >
            <div
                style={{
                    position: "relative",
                    width: cardWidth,
                    height: cardHeight,
                    transformStyle: "preserve-3d",
                }}
            >
                {list.map((slide, i) => {
                    let rel = i - active
                    if (loop) {
                        if (rel > n / 2) rel -= n
                        if (rel < -n / 2) rel += n
                    }
                    const ax = Math.abs(rel)
                    const visible = ax <= MAX_VISIBLE
                    const isActive = rel === 0
                    const sc = Math.max(0.4, 1 - ax * SCALE_STEP)
                    const tx = rel * (gap * 36)
                    const tz = -ax * DEPTH
                    const ry = -rel * tilt
                    const rz = rel * sideTilt

                    const cardStyle: CSSProperties = {
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: cardWidth,
                        height: cardHeight,
                        borderRadius: effectiveRadius,
                        transformStyle: "preserve-3d",
                        transformOrigin: "center center",
                        transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                        transition: transitionCss,
                        opacity: visible ? 1 : 0,
                        cursor: "pointer",
                        pointerEvents: visible && !isStatic ? "auto" : "none",
                        backgroundColor: isActive ? "#ffffff" : "#f5f6f0",
                        border: isActive ? "1px solid rgba(255, 255, 255, 0.9)" : "1px solid rgba(0, 0, 0, 0.08)",
                        boxShadow: isActive
                            ? "0 35px 90px rgba(0, 0, 0, 0.95), 0 0 45px rgba(255, 255, 255, 0.25)"
                            : "0 20px 50px rgba(0, 0, 0, 0.8)",
                        color: "#0f172a",
                        padding: "26px 24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        userSelect: "none",
                        overflow: "hidden",
                    }

                    return (
                        <div
                            key={i}
                            style={cardStyle}
                            onClick={isStatic ? undefined : () => handleCardClick(i)}
                            onDoubleClick={handleDoubleTap}
                            onTouchEnd={handleTouchEnd}
                            aria-label={slide.title}
                            aria-hidden={!visible}
                            className={`originkit-white-card ${isActive ? "active-white-card" : ""}`}
                        >
                            {/* Playing Card Top Bar: Number + Suit & Badge */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    <span
                                        style={{
                                            fontFamily: "Outfit, sans-serif",
                                            fontSize: "1.45rem",
                                            fontWeight: 900,
                                            lineHeight: 1,
                                            color: "#0f172a",
                                        }}
                                    >
                                        {slide.num}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: 900,
                                            lineHeight: 1,
                                            color: slide.suitColor === "suit-red" ? "#dc2626" : "#0f172a",
                                        }}
                                    >
                                        {slide.suit}
                                    </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    {slide.hasSoundWave && (
                                        <div className="voice-wave-indicator" style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <span className="wave-bar wb-1"></span>
                                            <span className="wave-bar wb-2"></span>
                                            <span className="wave-bar wb-3"></span>
                                            <span className="wave-bar wb-4"></span>
                                        </div>
                                    )}
                                    <span
                                        style={{
                                            fontFamily: "Montserrat, sans-serif",
                                            fontSize: "0.68rem",
                                            fontWeight: 700,
                                            padding: "4px 10px",
                                            borderRadius: 14,
                                            background: "rgba(0, 0, 0, 0.05)",
                                            color: "#334155",
                                            border: "1px solid rgba(0, 0, 0, 0.06)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {slide.badge}
                                    </span>
                                </div>
                            </div>

                            {/* Spacious Central Project Content Area: Title & Description */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    margin: "auto 0",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "1.15rem",
                                        fontWeight: 800,
                                        lineHeight: 1.35,
                                        color: "#0f172a",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {slide.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.85rem",
                                        lineHeight: 1.55,
                                        color: "#475569",
                                        fontWeight: 400,
                                    }}
                                >
                                    {slide.desc}
                                </p>
                            </div>

                            {/* Bottom Footer: Tech Tags List */}
                            <div
                                style={{
                                    borderTop: "1px solid rgba(0, 0, 0, 0.07)",
                                    paddingTop: 12,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 6,
                                }}
                            >
                                {slide.techs.map((tech, tIdx) => (
                                    <span
                                        key={tIdx}
                                        style={{
                                            fontFamily: "JetBrains Mono, monospace",
                                            fontSize: "0.65rem",
                                            fontWeight: 600,
                                            padding: "3px 10px",
                                            borderRadius: 12,
                                            background: "rgba(0, 0, 0, 0.04)",
                                            border: "1px solid rgba(0, 0, 0, 0.06)",
                                            color: "#334155",
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Dim overlay for inactive side cards to add 3D depth */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "#000000",
                                    opacity: isActive ? 0 : dim,
                                    transition: `opacity ${dur}s ${ease}`,
                                    pointerEvents: "none",
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Smooth3DSlideshow
