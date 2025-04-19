"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

interface Writing {
  id: string;
  title: string;
  summary: string;
  genre: string[];
  themes: string[];
  tags: string[];
  content: string[];
}

const Narrative: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [writings, setWritings] = useState<Writing[]>([]);
  const [filteredWritings, setFilteredWritings] = useState<Writing[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genres: [] as string[],
    themes: [] as string[],
    tags: [] as string[]
  });

  // Fetch writings on component mount
  useEffect(() => {
    fetch('/writings.json')
      .then(response => response.json())
      .then((data: { writings: Writing[] }) => {
        setWritings(data.writings);
        setFilteredWritings(data.writings);
      })
      .catch(error => console.error('Error fetching writings:', error));
  }, []);

  // Get unique filter options
  const allGenres = [...new Set(writings.flatMap(w => w.genre || []))];
  const allThemes = [...new Set(writings.flatMap(w => w.themes || []))];
  const allTags = [...new Set(writings.flatMap(w => w.tags || []))];

  // Filter writings based on search term and filters
  useEffect(() => {
    let filtered = writings;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(writing => 
        writing.title.toLowerCase().includes(term) || 
        writing.summary.toLowerCase().includes(term) ||
        writing.genre?.some(g => g.toLowerCase().includes(term)) ||
        writing.themes?.some(t => t.toLowerCase().includes(term)) ||
        writing.tags?.some(t => t.toLowerCase().includes(term))
      );
    }

    if (filters.genres.length > 0) {
      filtered = filtered.filter(writing => 
        writing.genre?.some(g => filters.genres.includes(g))
      );
    }

    if (filters.themes.length > 0) {
      filtered = filtered.filter(writing => 
        writing.themes?.some(t => filters.themes.includes(t))
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(writing => 
        writing.tags?.some(t => filters.tags.includes(t))
      );
    }

    setFilteredWritings(filtered);
  }, [searchTerm, filters, writings]);

  const toggleFilter = (type: 'genres' | 'themes' | 'tags', value: string) => {
    setFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(value);
      
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      
      return { ...prev, [type]: current };
    });
  };

  return (
    <div style={{ width: '100vw', maxWidth: '100vw', margin: '0', padding: '0', position: 'absolute', left: '0' }} className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 overflow-hidden">
      {/* Header area - full width */}
      <div style={{ width: '100vw', maxWidth: '100vw' }} className="py-6 bg-amber-800/10 backdrop-blur-sm border-b border-amber-100">
        <div style={{ width: '100%', maxWidth: '100%', padding: '0 16px' }} className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl md:text-4xl text-amber-900 font-['Cormorant_Garamond'] font-light mb-4 md:mb-0">
            Narrative Collection
          </h1>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search for writings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-amber-200 border-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-amber-300 font-['Lora'] text-amber-900"
            />
            <Search className="absolute right-3 top-2 text-amber-400" size={20} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main style={{ width: '100vw', maxWidth: '100vw', padding: '0 16px' }}>
        <div className="flex justify-between items-center mb-6 pt-6">
          <p className="text-amber-800 font-['Lora']">
            Showing {filteredWritings.length} of {writings.length} writings
          </p>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-800 transition font-['Lora']"
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="mb-8 bg-white/70 rounded-lg p-4 backdrop-blur-sm border border-amber-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-amber-800 mb-3 font-['Cormorant_Garamond'] text-xl">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleFilter('genres', genre)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.genres.includes(genre) 
                          ? 'bg-amber-400 text-white' 
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-amber-800 mb-3 font-['Cormorant_Garamond'] text-xl">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {allThemes.map(theme => (
                    <button
                      key={theme}
                      onClick={() => toggleFilter('themes', theme)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.themes.includes(theme) 
                          ? 'bg-amber-400 text-white' 
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-amber-800 mb-3 font-['Cormorant_Garamond'] text-xl">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleFilter('tags', tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.tags.includes(tag) 
                          ? 'bg-amber-400 text-white' 
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
          {filteredWritings.length > 0 ? (
            filteredWritings.map((writing) => (
              <Link key={writing.id} href={`/writing/${writing.id}`} passHref>
                <div className="bg-white/80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 border border-amber-100 h-full flex flex-col cursor-pointer">
                  <div className="relative h-40 bg-gradient-to-r from-amber-200 to-rose-200">
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl font-thin">
                      ✽
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h2 className="text-xl mb-2 text-amber-900 font-['Cormorant_Garamond'] font-medium">{writing.title}</h2>
                    <p className="text-amber-800 mb-4 font-['Lora'] text-sm flex-grow">{writing.summary}</p>
                    <div className="space-y-2">
                      {writing.genre && writing.genre.length > 0 && (
                        <div>
                          <span className="text-xs text-amber-700 font-semibold">Genre:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {writing.genre.map(g => (
                              <span key={g} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {writing.themes && writing.themes.length > 0 && (
                        <div>
                          <span className="text-xs text-amber-700 font-semibold">Themes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {writing.themes.map(t => (
                              <span key={t} className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-xs">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {writing.tags && writing.tags.length > 0 && (
                        <div>
                          <span className="text-xs text-amber-700 font-semibold">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {writing.tags.map(t => (
                              <span key={t} className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-xs border border-orange-200">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-amber-800 font-['Lora']">
              <p className="text-xl mb-2">No writings found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Narrative;