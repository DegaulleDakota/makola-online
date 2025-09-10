import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, HelpCircle, Zap, BarChart3 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { languages } from '@/lib/languages';

const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useAppContext();
  const t = languages[language];

  const quickActions = [
    {
      icon: HelpCircle,
      title: 'How to boost my listing?',
      message: 'Hi! I need help boosting my product listing on Makola Marketplace.',
      link: '/help/boost'
    },
    {
      icon: Zap,
      title: 'Boost Page',
      message: 'I want to boost my products',
      link: '/boost'
    },
    {
      icon: BarChart3,
      title: 'Seller Dashboard',
      message: 'I want to see my seller analytics',
      link: '/dashboard'
    }
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.link.startsWith('/')) {
      // Internal link - would navigate in real app
      console.log('Navigate to:', action.link);
    } else {
      // WhatsApp message
      const message = encodeURIComponent(action.message);
      window.open(`https://wa.me/233123456789?text=${message}`, '_blank');
    }
    setIsOpen(false);
  };

  const handleDirectWhatsApp = () => {
    const message = encodeURIComponent('Hi! I need help with Makola Marketplace.');
    window.open(`https://wa.me/233123456789?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="mb-4 w-80 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Makola Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => handleQuickAction(action)}
                >
                  <action.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">{action.title}</span>
                </Button>
              ))}
              
              <Button
                onClick={handleDirectWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 mt-4"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with Support
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default FloatingWhatsApp;