"use client"

import { useEffect, useState } from "react"
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Character } from "@/lib/types"
import CharacterPopup from "../timeline/character-pop"
import { motion } from "framer-motion"

// Fix Leaflet icon issues
import { useMobile } from "../hooks/use-mobile"

interface MapViewProps {
  selectedYear: number
  selectedCharacter: Character | null
  characters: Character[]
}

// Custom component to handle map centering and zoom
function MapController({
  selectedCharacter,
  bounds,
}: {
  selectedCharacter: Character | null
  bounds: L.LatLngBoundsExpression
}) {
  const map = useMap()

  useEffect(() => {
    if (selectedCharacter) {
      const { location } = selectedCharacter
      map.flyTo([location.lat, location.lng], 2)
    } else {
      map.fitBounds(bounds)
    }
  }, [selectedCharacter, map, bounds])

  return null
}

export default function MapView({ selectedYear, selectedCharacter, characters }: MapViewProps) {
  const isMobile = useIsMobile()
  const [mapLoaded, setMapLoaded] = useState(false)

  // Filter characters based on the selected year
  const filteredCharacters = characters.filter((character) => {
    if (!character.timeline) return true

    // Check if character is alive in the selected year
    const timelineEvents = character.timeline.filter((event) => event.year <= selectedYear)
    if (timelineEvents.length === 0) return false

    const lastEvent = timelineEvents[timelineEvents.length - 1]
    return lastEvent.status !== "deceased"
  })

  // Define map bounds
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [1000, 1000],
  ]

  // Custom marker icon
  const getMarkerIcon = (character: Character) => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-black bg-white flex items-center justify-center ${selectedCharacter?.id === character.id ? "ring-4 ring-red-500" : ""}">
          <img src="${character.avatar}" alt="${character.name}" class="w-full h-full object-cover" />
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    })
  }

  useEffect(() => {
    // Initialize Leaflet
    setMapLoaded(true)
  }, [])

  if (!mapLoaded) {
    return <div className="flex-1 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">Loading map...</div>
  }

  return (
    <motion.div
      className="flex-1 relative overflow-hidden border-2 border-black dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        center={[500, 500]}
        zoom={1}
        style={{ height: "100%", width: "100%" }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        zoomControl={!isMobile}
        attributionControl={false}
        minZoom={0}
        maxZoom={3}
      >
        <ImageOverlay bounds={bounds} url="/placeholder.svg?height=1000&width=1000" className="comic-map" />

        {filteredCharacters.map((character) => (
          <Marker
            key={character.id}
            position={[character.location.lat, character.location.lng]}
            icon={getMarkerIcon(character)}
          >
            <Popup>
              <CharacterPopup character={character} selectedYear={selectedYear} />
            </Popup>
          </Marker>
        ))}

        <MapController selectedCharacter={selectedCharacter} bounds={bounds} />
      </MapContainer>

      {/* Comic-style overlay elements */}
      <div className="absolute top-4 left-4 bg-yellow-300 dark:bg-yellow-600 p-2 border-2 border-black dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] z-[1000]">
        <h3 className="font-bold">Year: {selectedYear}</h3>
        <p className="text-sm">Characters: {filteredCharacters.length}</p>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-3 border-2 border-black dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] z-[1000]">
        <h3 className="font-bold mb-2">Locations</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-2"></div>
            <span>Earth</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 mr-2"></div>
            <span>Space</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 mr-2"></div>
            <span>Other Realms</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
