import React, { useState, useEffect } from 'react';
import ResourceCard from './ResourceCard';
import { Search, Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { resourceService, Resource, ResourceType } from '@/lib/api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

interface ResourceGridProps {
  onReservationComplete: () => void;
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ onReservationComplete }) => {
  const [filter, setFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const [resourcesResponse, typesResponse] = await Promise.all([
        resourceService.getResources(token),
        resourceService.getResourceTypes(token)
      ]);

      setResources(resourcesResponse.resources);
      setResourceTypes(typesResponse);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources');
      setLoading(false);
      toast.error('Failed to load resources');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReservationComplete = () => {
    fetchData(); // Refresh the resources list after a successful reservation
    onReservationComplete(); // Call the parent's onReservationComplete to refresh the table
  };

  const filteredResources = resources.filter(resource => {
    const matchesFilter = filter === 'All' || resource.type.type.toLowerCase() === filter.toLowerCase();
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.type.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Available Resources</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {['All', ...resourceTypes.map(type => type.type)].map((option) => (
          <Button
            key={option}
            onClick={() => setFilter(option)}
            className={`filter-btn ${filter === option ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            {option}
          </Button>
        ))}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              type={resource.type.type}
              title={resource.name}
              description={resource.description || ''}
              onReservationComplete={handleReservationComplete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              type={resource.type.type}
              title={resource.name}
              description={resource.description || ''}
              onReservationComplete={handleReservationComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceGrid;