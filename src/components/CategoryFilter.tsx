import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Shirt, Home, Car, Utensils, Gamepad2, Book, Heart } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const categories: Category[] = [
  { id: 'all', name: 'All', icon: <Heart className="w-4 h-4" />, count: 1247 },
  { id: 'electronics', name: 'Electronics', icon: <Smartphone className="w-4 h-4" />, count: 324 },
  { id: 'fashion', name: 'Fashion', icon: <Shirt className="w-4 h-4" />, count: 189 },
  { id: 'home', name: 'Home & Garden', icon: <Home className="w-4 h-4" />, count: 156 },
  { id: 'automotive', name: 'Automotive', icon: <Car className="w-4 h-4" />, count: 87 },
  { id: 'food', name: 'Food & Drinks', icon: <Utensils className="w-4 h-4" />, count: 234 },
  { id: 'sports', name: 'Sports & Games', icon: <Gamepad2 className="w-4 h-4" />, count: 98 },
  { id: 'books', name: 'Books & Media', icon: <Book className="w-4 h-4" />, count: 67 },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            <span>{category.name}</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;