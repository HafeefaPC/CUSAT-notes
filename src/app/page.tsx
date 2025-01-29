'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterSection from '@/components/FilterSection';
import { FilterOptions, StudyMaterial } from '@/types';
import { ModeToggle } from '@/components/mode-toggle';
import { MaterialsGrid } from '@/components/MaterialsGrid';
import { getFilesFromGroup, sendTestMessage } from '@/lib/telegram';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    department: '',
    semester: '',
    subject: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/materials');
        if (!response.ok) throw new Error('Failed to fetch materials');
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter materials based on search query
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestBot = async () => {
    const result = await sendTestMessage();
    console.log('Test message result:', result);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            Study Material Repository
          </h1>
          <ModeToggle />
        </div>
        
        <div className="flex flex-col items-center gap-8">
          <SearchBar onSearch={handleSearch} />
          <FilterSection onFilterChange={handleFilterChange} />
        </div>

        <div className="mt-12">
          <MaterialsGrid 
            materials={filteredMaterials} 
            filters={filters}
            loading={loading}
          />
        </div>

        <Button onClick={handleTestBot} className="mb-4">
          Test Bot Connection
        </Button>
      </div>
    </main>
  );
}
