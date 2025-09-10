import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingBag, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppContext } from '@/contexts/AppContext';
import { languages } from '@/lib/languages';
import LanguageSwitcher from './LanguageSwitcher';
import SellerOnboarding from './SellerOnboarding';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { language } = useAppContext();
  const t = languages[language];
  const [showSellerForm, setShowSellerForm] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Makola Online</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            <Dialog open={showSellerForm} onOpenChange={setShowSellerForm}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.registerAsSeller}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t.registerAsSeller}</DialogTitle>
                </DialogHeader>
                <SellerOnboarding />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;