export interface Location {
    name: string
    lat: number
    lng: number
    type: "earth" | "space" | "realm"
  }
  
  export interface TimelineEvent {
    year: number
    title: string
    description: string
    characters?: string[]
  }
  
  export interface CharacterTimelineEvent {
    year: number
    description: string
    status: "alive" | "deceased" | "unknown"
  }
  
  export interface Character {
    id: string
    name: string
    description: string
    avatar: string
    location: Location
    timeline?: CharacterTimelineEvent[]
  }
  