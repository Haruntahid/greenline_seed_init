
import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps'
import './GlobalReachMap.css'

const geoUrl = '/data/world-countries.json'

const locations = [
  {
    name: 'Dhaka',
    country: 'Bangladesh',
    coordinates: [90.4125, 23.8103] as [number, number],
    description: 'Our presence in South Asia.',
  },
  {
    name: 'London',
    country: 'United Kingdom',
    coordinates: [-0.1276, 51.5072] as [number, number],
    description: 'Connecting ideas across Europe.',
  },
  {
    name: 'New York',
    country: 'United States',
    coordinates: [-74.006, 40.7128] as [number, number],
    description: 'Building opportunities in North America.',
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    coordinates: [103.8198, 1.3521] as [number, number],
    description: 'Connecting with Southeast Asia.',
  },
]

function GlobalReachMap() {
  const [activeLocation, setActiveLocation] = useState(locations[0])

  return (
    <section className="global-reach-section" id="global-reach">
      <div className="global-reach-container">
        <div className="global-reach-heading">
          <span>OUR GLOBAL PRESENCE</span>
          <h2>Connecting Ideas.<br />Creating Impact.</h2>
          <p>
            Explore the locations that represent our global
            vision and growing network of connections.
          </p>
        </div>

        <div className="global-reach-map-wrapper">
          <ComposableMap
            projectionConfig={{
              scale: 145,
            }}
            width={900}
            height={460}
            style={{
              width: '100%',
              height: 'auto',
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#163B2D"
                    stroke="#477B60"
                    strokeWidth={0.45}
                    style={{
  outline: 'none',
  transition: 'fill 0.3s ease',
}}
                  />
                ))
              }
            </Geographies>

            {locations.slice(1).map((location) => (
              <Line
                key={location.name}
                from={locations[0].coordinates}
                to={location.coordinates}
                stroke="#75E3B1"
                strokeWidth={1.3}
                strokeLinecap="round"
                strokeDasharray="4 5"
                opacity={0.65}
              />
            ))}

            {locations.map((location) => (
              <Marker
                key={location.name}
                coordinates={location.coordinates}
                onClick={() => setActiveLocation(location)}
              >
                <circle
                  r={9}
                  fill="#75E3B1"
                  opacity={0.18}
                />
                <circle
                  r={4}
                  fill="#75E3B1"
                  stroke="#FFFFFF"
                  strokeWidth={1.2}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            ))}
          </ComposableMap>

          <div className="global-reach-location-card">
            <span>EXPLORE LOCATION</span>
            <h3>{activeLocation.name}</h3>
            <p>{activeLocation.country}</p>
            <div>{activeLocation.description}</div>
          </div>
        </div>

        <div className="global-reach-location-list">
          {locations.map((location) => (
            <button
              type="button"
              key={location.name}
              className={
                activeLocation.name === location.name
                  ? 'global-location-button active'
                  : 'global-location-button'
              }
              onClick={() => setActiveLocation(location)}
            >
              <span className="global-location-dot" />
              {location.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GlobalReachMap
