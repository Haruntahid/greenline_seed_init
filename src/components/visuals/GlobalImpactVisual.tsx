
import './GlobalImpactVisual.css'

function GlobalImpactVisual() {
  return (
    <div className="global-impact-visual" aria-hidden="true">
      <div className="global-visual-glow" />

      <div className="global-orbit global-orbit-one" />
      <div className="global-orbit global-orbit-two" />

      <div className="global-globe">
        <svg
          className="global-globe-svg"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="globeFill" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#2D805D" />
              <stop offset="55%" stopColor="#124D37" />
              <stop offset="100%" stopColor="#061C15" />
            </radialGradient>

            <linearGradient id="globeStroke" x1="80" y1="80" x2="420" y2="420">
              <stop offset="0%" stopColor="#A2FFD0" />
              <stop offset="100%" stopColor="#3AAB7A" />
            </linearGradient>

            <clipPath id="globeClip">
              <circle cx="250" cy="250" r="180" />
            </clipPath>

            <filter id="globeGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx="250"
            cy="250"
            r="190"
            fill="#75E3B1"
            opacity="0.035"
          />

          <circle
            cx="250"
            cy="250"
            r="180"
            fill="url(#globeFill)"
            stroke="url(#globeStroke)"
            strokeWidth="1.5"
          />

          <g
            clipPath="url(#globeClip)"
            stroke="#8BE7BA"
            strokeWidth="1"
            opacity="0.32"
          >
            <ellipse cx="250" cy="250" rx="180" ry="65" />
            <ellipse cx="250" cy="250" rx="180" ry="125" />
            <ellipse cx="250" cy="250" rx="65" ry="180" />
            <ellipse cx="250" cy="250" rx="125" ry="180" />

            <path d="M70 250H430" />
            <path d="M250 70V430" />
            <path d="M100 160C190 210 310 210 400 160" />
            <path d="M100 340C190 290 310 290 400 340" />
          </g>

          <g
            clipPath="url(#globeClip)"
            fill="#75E3B1"
            opacity="0.62"
          >
            <path d="M150 126L183 108L205 120L219 145L204 166L182 171L170 194L144 184L128 161Z" />
            <path d="M191 198L224 188L251 207L246 239L227 261L237 294L216 324L194 299L182 263L162 241L170 214Z" />
            <path d="M267 116L302 101L337 116L359 140L343 164L315 168L302 188L273 180L257 153Z" />
            <path d="M270 204L303 189L343 201L362 230L350 264L328 278L319 315L289 342L270 314L261 279L239 249Z" />
            <path d="M358 309L383 295L402 314L394 343L369 352Z" />
          </g>

          <g filter="url(#globeGlow)">
            <circle cx="181" cy="188" r="4" fill="#B9FFD9" />
            <circle cx="181" cy="188" r="10" stroke="#75E3B1" opacity="0.65" />
            <circle cx="322" cy="224" r="4" fill="#B9FFD9" />
            <circle cx="322" cy="224" r="10" stroke="#75E3B1" opacity="0.65" />
            <circle cx="270" cy="322" r="4" fill="#B9FFD9" />
          </g>

          <path
            d="M181 188L322 224L270 322"
            stroke="#9BF2C3"
            strokeWidth="1.2"
            strokeDasharray="5 7"
            opacity="0.7"
          />
        </svg>

        <span className="globe-location globe-location-one">
          <i />
          GLOBAL REACH
        </span>

        <span className="globe-location globe-location-two">
          <i />
          CONNECTING IDEAS
        </span>
      </div>

      <span className="global-particle particle-one" />
      <span className="global-particle particle-two" />
      <span className="global-particle particle-three" />
      <span className="global-particle particle-four" />
      <span className="global-particle particle-five" />
    </div>
  )
}

export default GlobalImpactVisual
