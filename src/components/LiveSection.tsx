import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Users, Clock, Star } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  seller: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
  scheduledTime?: string;
  rating: number;
}

const liveStreams: LiveStream[] = [
  {
    id: '1',
    title: 'Fresh Tomatoes & Vegetables - Best Prices!',
    seller: 'Mama Ama',
    viewers: 234,
    thumbnail: '/placeholder.svg',
    isLive: true,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Latest Phone Accessories & Electronics',
    seller: 'Tech Hub Ghana',
    viewers: 0,
    thumbnail: '/placeholder.svg',
    isLive: false,
    scheduledTime: '2:00 PM',
    rating: 4.6,
  },
  {
    id: '3',
    title: 'Traditional Kente & African Wear',
    seller: 'Kente Palace',
    viewers: 89,
    thumbnail: '/placeholder.svg',
    isLive: true,
    rating: 4.9,
  },
];

const LiveSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Makola Live</h2>
          <p className="text-gray-600">Watch live deals and discover new products</p>
        </div>
        <Button variant="outline">View All</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveStreams.map((stream) => (
          <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
              {stream.isLive ? (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  🔴 LIVE
                </Badge>
              ) : (
                <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {stream.scheduledTime}
                </Badge>
              )}
              {stream.isLive && (
                <Badge className="absolute top-2 right-2 bg-black bg-opacity-50 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  {stream.viewers}
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">{stream.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stream.seller}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{stream.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveSection;