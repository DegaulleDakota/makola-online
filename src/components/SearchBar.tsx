import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, Camera, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onVoiceSearch: () => void;
  onImageSearch: (file: File) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onVoiceSearch,
  onImageSearch,
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    onVoiceSearch();
    // Simulate voice search completion
    setTimeout(() => setIsListening(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      onImageSearch(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products, sellers, or speak your request..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-24 py-3 text-lg"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleVoiceSearch}
              className={`p-2 ${isListening ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-2 text-gray-400"
                asChild
              >
                <span>
                  <Camera className="w-4 h-4" />
                </span>
              </Button>
            </label>
          </div>
        </div>
      </form>
      
      {selectedImage && (
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Camera className="w-3 h-3" />
            Image search: {selectedImage.name}
            <X
              className="w-3 h-3 cursor-pointer ml-1"
              onClick={clearImage}
            />
          </Badge>
        </div>
      )}
      
      {isListening && (
        <div className="mt-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <Mic className="w-3 h-3" />
            Listening...
          </Badge>
        </div>
      )}
    </div>
  );
};

export { SearchBar };
export default SearchBar;