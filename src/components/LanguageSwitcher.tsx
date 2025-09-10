import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAppContext();

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'tw', label: 'Twi', flag: '🇬🇭' },
    { value: 'pidgin', label: 'Pidgin', flag: '🇳🇬' }
  ];

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-32">
        <SelectValue>
          {languageOptions.find(lang => lang.value === language)?.flag} {' '}
          {languageOptions.find(lang => lang.value === language)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;