import type { Character, TimelineEvent } from "../lib/types"

// Sample timeline events
export const timelineEvents: TimelineEvent[] = [
  {
    year: 1943,
    title: "Captain America: The First Avenger",
    description: "Steve Rogers becomes Captain America and fights against HYDRA during World War II.",
    characters: ["Steve Rogers", "Bucky Barnes", "Red Skull"],
  },
  {
    year: 1995,
    title: "Captain Marvel",
    description: "Carol Danvers becomes Captain Marvel and helps the Skrulls against the Kree.",
    characters: ["Carol Danvers", "Nick Fury", "Talos"],
  },
  {
    year: 2008,
    title: "Iron Man",
    description: "Tony Stark builds the first Iron Man suit and becomes a superhero.",
    characters: ["Tony Stark", "Pepper Potts", "James Rhodes"],
  },
  {
    year: 2010,
    title: "Thor",
    description: "Thor is banished to Earth and learns humility.",
    characters: ["Thor", "Loki", "Jane Foster"],
  },
  {
    year: 2012,
    title: "The Avengers",
    description: "The Avengers assemble for the first time to stop Loki and the Chitauri invasion.",
    characters: ["Tony Stark", "Steve Rogers", "Thor", "Bruce Banner", "Natasha Romanoff", "Clint Barton"],
  },
  {
    year: 2014,
    title: "Guardians of the Galaxy",
    description: "A group of misfits come together to stop Ronan from destroying Xandar.",
    characters: ["Peter Quill", "Gamora", "Drax", "Rocket", "Groot"],
  },
  {
    year: 2016,
    title: "Captain America: Civil War",
    description: "The Avengers split into two opposing factions over government oversight.",
    characters: ["Steve Rogers", "Tony Stark", "Bucky Barnes", "T'Challa"],
  },
  {
    year: 2018,
    title: "Avengers: Infinity War",
    description: "Thanos collects all six Infinity Stones and wipes out half of all life in the universe.",
    characters: ["Thanos", "Tony Stark", "Thor", "Steve Rogers"],
  },
  {
    year: 2023,
    title: "Avengers: Endgame",
    description: "The remaining Avengers travel through time to collect the Infinity Stones and undo Thanos' snap.",
    characters: ["Tony Stark", "Steve Rogers", "Thor", "Bruce Banner", "Natasha Romanoff", "Clint Barton"],
  },
  {
    year: 2023,
    title: "Spider-Man: Far From Home",
    description: "Peter Parker deals with the aftermath of Tony Stark's death and faces Mysterio.",
    characters: ["Peter Parker", "Mysterio", "Nick Fury"],
  },
  {
    year: 2023,
    title: "Loki (Season 1)",
    description: "Loki creates a nexus event and is captured by the TVA, leading to the multiverse.",
    characters: ["Loki", "Sylvie", "Mobius"],
  },
]

// Sample characters
export const characters: Character[] = [
  {
    id: "tony-stark",
    name: "Tony Stark / Iron Man",
    description: "Genius, billionaire, playboy, philanthropist who created the Iron Man suit.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "New York, Earth",
      lat: 400,
      lng: 500,
      type: "earth",
    },
    timeline: [
      {
        year: 2008,
        description: "Built the first Iron Man suit",
        status: "alive",
      },
      {
        year: 2018,
        description: "Survived Thanos' snap",
        status: "alive",
      },
      {
        year: 2023,
        description: "Sacrificed himself to defeat Thanos",
        status: "deceased",
      },
    ],
  },
  {
    id: "steve-rogers",
    name: "Steve Rogers / Captain America",
    description: "Super soldier and leader of the Avengers.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "Brooklyn, Earth",
      lat: 410,
      lng: 510,
      type: "earth",
    },
    timeline: [
      {
        year: 1943,
        description: "Became Captain America",
        status: "alive",
      },
      {
        year: 2011,
        description: "Awakened from ice",
        status: "alive",
      },
      {
        year: 2023,
        description: "Returned to the past to live with Peggy Carter",
        status: "alive",
      },
    ],
  },
  {
    id: "thor",
    name: "Thor Odinson",
    description: "God of Thunder and former king of Asgard.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "New Asgard, Earth",
      lat: 300,
      lng: 600,
      type: "earth",
    },
    timeline: [
      {
        year: 2010,
        description: "Banished to Earth",
        status: "alive",
      },
      {
        year: 2018,
        description: "Failed to kill Thanos",
        status: "alive",
      },
      {
        year: 2023,
        description: "Joined the Guardians of the Galaxy",
        status: "alive",
      },
    ],
  },
  {
    id: "natasha-romanoff",
    name: "Natasha Romanoff / Black Widow",
    description: "Former Russian spy and member of the Avengers.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "Avengers Compound, Earth",
      lat: 420,
      lng: 480,
      type: "earth",
    },
    timeline: [
      {
        year: 2012,
        description: "Joined the Avengers",
        status: "alive",
      },
      {
        year: 2018,
        description: "Survived Thanos' snap",
        status: "alive",
      },
      {
        year: 2023,
        description: "Sacrificed herself on Vormir to obtain the Soul Stone",
        status: "deceased",
      },
    ],
  },
  {
    id: "peter-parker",
    name: "Peter Parker / Spider-Man",
    description: "Teenager with spider-like abilities who protects New York City.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "Queens, Earth",
      lat: 405,
      lng: 505,
      type: "earth",
    },
    timeline: [
      {
        year: 2016,
        description: "Gained spider powers and became Spider-Man",
        status: "alive",
      },
      {
        year: 2018,
        description: "Vanished in Thanos' snap",
        status: "deceased",
      },
      {
        year: 2023,
        description: "Returned after the Blip",
        status: "alive",
      },
    ],
  },
  {
    id: "carol-danvers",
    name: "Carol Danvers / Captain Marvel",
    description: "Former Air Force pilot with cosmic powers.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "Deep Space",
      lat: 700,
      lng: 300,
      type: "space",
    },
    timeline: [
      {
        year: 1995,
        description: "Gained cosmic powers and became Captain Marvel",
        status: "alive",
      },
      {
        year: 2018,
        description: "Responded to Nick Fury's pager",
        status: "alive",
      },
      {
        year: 2023,
        description: "Helped defeat Thanos",
        status: "alive",
      },
    ],
  },
  {
    id: "loki",
    name: "Loki Laufeyson",
    description: "God of Mischief and Thor's adopted brother.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "TVA Headquarters",
      lat: 800,
      lng: 200,
      type: "realm",
    },
    timeline: [
      {
        year: 2010,
        description: "Discovered his true heritage as a Frost Giant",
        status: "alive",
      },
      {
        year: 2018,
        description: "Killed by Thanos",
        status: "deceased",
      },
      {
        year: 2023,
        description: "Variant created when 2012 Loki escaped with the Tesseract",
        status: "alive",
      },
    ],
  },
  {
    id: "wanda-maximoff",
    name: "Wanda Maximoff / Scarlet Witch",
    description: "Enhanced individual with reality-altering powers.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "Westview, Earth",
      lat: 450,
      lng: 450,
      type: "earth",
    },
    timeline: [
      {
        year: 2015,
        description: "Gained powers from the Mind Stone",
        status: "alive",
      },
      {
        year: 2018,
        description: "Vanished in Thanos' snap",
        status: "deceased",
      },
      {
        year: 2023,
        description: "Created the Hex around Westview",
        status: "alive",
      },
    ],
  },
  {
    id: "tchalla",
    name: "T'Challa / Black Panther",
    description: "King of Wakanda and the Black Panther.",
    avatar: "/placeholder.svg?height=100&width=100",
    location: {
      name: "Wakanda, Earth",
      lat: 350,
      lng: 350,
      type: "earth",
    },
    timeline: [
      {
        year: 2016,
        description: "Became King of Wakanda and the Black Panther",
        status: "alive",
      },
      {
        year: 2018,
        description: "Vanished in Thanos' snap",
        status: "deceased",
      },
      {
        year: 2023,
        description: "Returned after the Blip",
        status: "alive",
      },
    ],
  },
]
