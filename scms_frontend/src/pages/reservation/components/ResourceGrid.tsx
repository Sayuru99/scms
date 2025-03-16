import React, { useState } from 'react';
import ResourceCard from './ResourceCard';
import { Search, Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

interface Resource {
  id: string;
  type: 'Lecture Hall' | 'Equipment' | 'Labs';
  title: string;
  description: string;
}

const ResourceGrid: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');

  
  const resources: Resource[] = [
    {
      id: '1',
      type: 'Lecture Hall',
      title: 'Hall A-101',
      description: 'Capacity 120 - Projector available - A/C - White board available',
    },
    {
      id: '2',
      type: 'Lecture Hall',
      title: 'Hall B-101',
      description: 'Capacity 120 - Projector available - A/C - White board available',
    },
    {
      id: '3',
      type: 'Equipment',
      title: 'Laptop 32',
      description: '8GB RAM - 120GB SSD - ACER Brand - Charger available',
    },
    {
      id: '4',
      type: 'Labs',
      title: 'Computer Lab C2',
      description: 'Capacity 120 - Projector available - A/C - White board available',
    },
  ];

  const handleReserve = (resource: Resource) => {
    toast.success(`Reserved ${resource.title}`);
  };

  
  const filteredResources = resources.filter((resource) => {
    const matchesFilter = filter === 'All' || resource.type === filter;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Available Resources</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search resources..."
              className="search-input pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="view-toggle rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'view-toggle-active' : ''}`}
              aria-label="Grid view"
            >
              <Grid2X2 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'view-toggle-active' : ''}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Lecture Hall', 'Labs', 'Equipment'].map((option) => (
          <Button
            key={option}
            onClick={() => setFilter(option)}
            className={`filter-btn ${filter === option ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            type={resource.type}
            title={resource.title}
            description={resource.description}
            onReserve={() => handleReserve(resource)}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourceGrid;