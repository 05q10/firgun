"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Search, Filter, Book, Tag, Palette } from "lucide-react";

interface Writing {
  id: string;
  title: string;
  summary: string;
  genre: string[];
  themes: string[];
  tags: string[];
  content: string;
}

const NarrativePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [writings, setWritings] = useState<Writing[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    genres: [] as string[],
    themes: [] as string[],
    tags: [] as string[]
  });



  // Collect all unique filter options
  const allGenres = Array.from(new Set(writings.flatMap(w => w.genre)));
  const allThemes = Array.from(new Set(writings.flatMap(w => w.themes)));
  const allTags = Array.from(new Set(writings.flatMap(w => w.tags)));

 useEffect(() => {
  fetch('http://localhost:5000/api/writings')
    .then(res => res.json())
    .then(data => setWritings(data))
    .catch(err => console.error('Error fetching writings:', err));
}, []);


  const toggleFilter = (type: 'genres' | 'themes' | 'tags', value: string) => {
    setSelectedFilters(prev => {
      const currentFilters = [...prev[type]];
      const index = currentFilters.indexOf(value);
      
      if (index >= 0) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(value);
      }
      
      return { ...prev, [type]: currentFilters };
    });
  };

  // Filter writings based on searchTerm and selected filters
  const filteredWritings = writings.filter((writing) => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      writing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      writing.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      writing.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
      writing.themes.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      writing.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Selected filters
    const matchesGenres = selectedFilters.genres.length === 0 || 
      writing.genre.some(g => selectedFilters.genres.includes(g));
    
    const matchesThemes = selectedFilters.themes.length === 0 || 
      writing.themes.some(t => selectedFilters.themes.includes(t));
    
    const matchesTags = selectedFilters.tags.length === 0 || 
      writing.tags.some(t => selectedFilters.tags.includes(t));
    
    return matchesSearch && matchesGenres && matchesThemes && matchesTags;
  });

 return (
  <div className="p-8">
    {/* Title */}
    <h1 className="text-4xl font-['Cormorant_Garamond'] text-amber-900 mb-4">
      Narrative Collection
    </h1>

    {/* Writing Cards - Displayed FIRST */}
    <div className="mb-8">
      <p className="text-lg font-['Lora'] text-amber-800 mb-4">
        Showing {filteredWritings.length} of {writings.length} writings
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWritings.map((writing) => (
          <div
            key={writing.id}
            className="bg-gradient-to-t from-yellow-100 to-pink-100 rounded-lg shadow p-6 transition hover:shadow-lg"
          >
            <div className="text-center text-3xl mb-4">✻</div>
            <h2 className="text-xl font-semibold text-amber-900 font-['Cormorant_Garamond'] mb-2">
              {writing.title}
            </h2>
            <p className="text-sm text-amber-700 font-['Lora'] mb-3">
              {writing.summary}
            </p>

            <div className="text-sm font-['Lora'] mb-2">
              <strong>Genre:</strong>{' '}
              {writing.genre.map((g, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-yellow-200 text-amber-800 px-2 py-1 rounded-full text-xs mr-1"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="text-sm font-['Lora'] mb-2">
              <strong>Themes:</strong>{' '}
              {writing.themes.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-pink-100 text-amber-800 px-2 py-1 rounded-full text-xs mr-1"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="text-sm font-['Lora']">
              <strong>Tags:</strong>{' '}
              {writing.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-orange-100 text-amber-800 px-2 py-1 rounded-full text-xs mr-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Filters - Displayed AFTER */}
    <div className="mt-10">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="bg-yellow-200 text-amber-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow font-['Lora']">
          {/* Add your genre, theme, tag filter UI here */}
        </div>
      )}
    </div>
  </div>
);

};

export default NarrativePage;