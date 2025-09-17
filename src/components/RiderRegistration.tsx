import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const VEHICLE_TYPES = ['Bicycle', 'Motorbike', 'Car', 'Van'];
const ZONES = ['Accra Central', 'Tema', 'Kumasi', 'Takoradi', 'Cape Coast', 'Tamale'];
const LANGUAGES = ['English', 'Twi', 'Ga', 'Ewe', 'Dagbani', 'Hausa'];

export default function RiderRegistration({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    baseLocation: '',
    vehicleType: '',
    serviceZones: [] as string[],
    languages: [] as string[],
    profilePhoto: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleZoneChange = (zone: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      serviceZones: checked 
        ? [...prev.serviceZones, zone]
        : prev.serviceZones.filter(z => z !== zone)
    }));
  };

  const handleLanguageChange = (lang: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      languages: checked 
        ? [...prev.languages, lang]
        : prev.languages.filter(l => l !== lang)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('riders')
        .insert([{
          name: formData.name,
          whatsapp: formData.whatsapp,
          base_location: formData.baseLocation,
          vehicle_type: formData.vehicleType,
          service_zones: formData.serviceZones,
          languages: formData.languages,
          profile_photo_url: formData.profilePhoto || null
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Registration Successful! 🎉",
        description: "Welcome to Everything Market Ghana Riders. Complete your onboarding to start earning."
      });

      // Store rider session
      localStorage.setItem('rider_session', JSON.stringify(data));
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">🚴 Become a Rider — Everything Market Ghana</CardTitle>
        <p className="text-center text-muted-foreground">Start earning with flexible delivery jobs</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+233..."
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Base Location *</Label>
              <Input
                id="location"
                value={formData.baseLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, baseLocation: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="vehicle">Vehicle Type *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Service Zones *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {ZONES.map(zone => (
                <div key={zone} className="flex items-center space-x-2">
                  <Checkbox
                    id={zone}
                    checked={formData.serviceZones.includes(zone)}
                    onCheckedChange={(checked) => handleZoneChange(zone, checked as boolean)}
                  />
                  <Label htmlFor={zone} className="text-sm">{zone}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Languages</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {LANGUAGES.map(lang => (
                <div key={lang} className="flex items-center space-x-2">
                  <Checkbox
                    id={lang}
                    checked={formData.languages.includes(lang)}
                    onCheckedChange={(checked) => handleLanguageChange(lang, checked as boolean)}
                  />
                  <Label htmlFor={lang} className="text-sm">{lang}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="photo">Profile Photo URL (Optional)</Label>
            <Input
              id="photo"
              type="url"
              value={formData.profilePhoto}
              onChange={(e) => setFormData(prev => ({ ...prev, profilePhoto: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Join Everything Market Ghana Riders 🚴"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
