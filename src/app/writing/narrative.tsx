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

const NarrativePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [writings, setWritings] = useState<Writing[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('/writings.json')
      .then(response => response.json())
      .then((data: { writings: Writing[] }) => {
        setWritings(data.writings);
      })
      .catch(error => console.error('Error fetching writings:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 to-amber-400">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl text-center text-amber-900 mb-6 font-['Cormorant_Garamond'] font-light">
          Narrative Collection
        </h1>
        
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for writings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-lg border-amber-200 border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-300 font-['Lora'] text-amber-900"
            />
            <Search className="absolute right-3 top-3 text-amber-400" size={24} />
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-800 transition font-['Lora']"
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Writing List */}
        <div className="space-y-6">
          {writings.map((writing) => (
            <Link key={writing.id} href={`/writing/${writing.id}`} passHref>
              <div className="cursor-pointer p-4 bg-white shadow-md rounded-lg hover:bg-amber-100 transition">
                <h2 className="text-xl font-semibold text-amber-900">{writing.title}</h2>
                <p className="text-sm text-gray-600">{writing.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NarrativePage;
