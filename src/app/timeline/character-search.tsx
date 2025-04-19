"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Character } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface CharacterSearchProps {
  characters: Character[]
  onSelectCharacter: (character: Character | null) => void
  selectedYear: number
}

export default function CharacterSearch({ characters, onSelectCharacter, selectedYear }: CharacterSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Character[]>([])
  const [showResults, setShowResults] = useState(false)

  // Filter characters based on search query and selected year
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const filteredResults = characters.filter((character) => {
      // Check if character name matches search query
      const nameMatch = character.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Check if character is alive in the selected year
      if (!character.timeline) return nameMatch

      const timelineEvents = character.timeline.filter((event) => event.year <= selectedYear)
      if (timelineEvents.length === 0) return false

      const lastEvent = timelineEvents[timelineEvents.length - 1]
      return nameMatch && lastEvent.status !== "deceased"
    })

    setSearchResults(filteredResults)
  }, [searchQuery, characters, selectedYear])

  const handleSelectCharacter = (character: Character) => {
    onSelectCharacter(character)
    setSearchQuery(character.name)
    setShowResults(false)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    onSelectCharacter(null)
    setShowResults(false)
  }

  return (
    <div className="relative max-w-md mx-auto mt-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <Input
          type="text"
          placeholder="Search for a character..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-10 py-2 border-2 border-black dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)]"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={handleClearSearch}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] rounded-md max-h-60 overflow-auto"
          >
            <ul>
              {searchResults.map((character) => (
                <li key={character.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <button
                    className="flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                    onClick={() => handleSelectCharacter(character)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black mr-3">
                      <img
                        src={character.avatar || "/placeholder.svg"}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold">{character.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{character.location.name}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
