"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import TimelineSidebar from "@/components/timeline-sidebar"
import MapView from "@/components/map-view"
import CharacterSearch from "@/components/character-search"
import type { Character } from "@/lib/types"
import { characters, timelineEvents } from "@/lib/sample-data"

export default function Home() {
  const [selectedYear, setSelectedYear] = useState<number>(2023)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
  }

  const handleCharacterSelect = (character: Character | null) => {
    setSelectedCharacter(character)
  }

  return (
    <main className="min-h-screen bg-[#f8f7f2] dark:bg-gray-900 overflow-hidden">
      <SidebarProvider>
        <div className="flex h-screen">
          <TimelineSidebar
            timelineEvents={timelineEvents}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-black border-2 bg-yellow-100 dark:bg-gray-800 dark:border-gray-700">
              <h1 className="text-4xl font-bold text-center comic-title">MCUverse: The Multiversal Tracker</h1>
              <CharacterSearch
                characters={characters}
                onSelectCharacter={handleCharacterSelect}
                selectedYear={selectedYear}
              />
            </div>
            <MapView selectedYear={selectedYear} selectedCharacter={selectedCharacter} characters={characters} />
          </div>
        </div>
      </SidebarProvider>
    </main>
  )
}
