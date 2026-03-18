import React from 'react';
import { 
  Waves, Sun, Thermometer, Wind, Bath, Hand, 
  UtensilsCrossed, Wine, Coffee, Bell, 
  Baby, Music, Film, Wifi, ParkingCircle, 
  Bus, Dumbbell, Bike, Mountain
} from 'lucide-react';

/**
 * Amenity Map - Povezuje ID-eve iz baze sa ikonama.
 * U budućnosti, ovde možemo dodati putanje do vaših generisanih .png ikona.
 */
const AMENITY_ICON_MAP: Record<string, { icon: React.ReactNode, label: string }> = {
  // Wellness
  'pool_indoor': { icon: <Waves size={20} />, label: 'Unutrašnji bazen' },
  'pool_outdoor': { icon: <Sun size={20} />, label: 'Spoljašnji bazen' },
  'pool_heated': { icon: <Thermometer size={20} />, label: 'Grejani bazen' },
  'sauna': { icon: <Wind size={20} />, label: 'Sauna i Parno kupatilo' },
  'spa_massage': { icon: <Hand size={20} />, label: 'Masaže i Tretmani' },
  'hamam': { icon: <Bath size={20} />, label: 'Hammam' },

  // Food & Drink
  'restaurant_main': { icon: <UtensilsCrossed size={20} />, label: 'Glavni restoran' },
  'restaurant_fine': { icon: <Wine size={20} />, label: 'Fine Dining' },
  'bar_lobby': { icon: <Coffee size={20} />, label: 'Lobby Bar' },
  'room_service': { icon: <Bell size={20} />, label: 'Room Service' },

  // Family & Service
  'kids_club': { icon: <Baby size={20} />, label: 'Dečiji klub' },
  'cinema': { icon: <Film size={20} />, label: 'Bioskop' },
  'wifi_free': { icon: <Wifi size={20} />, label: 'Besplatan Wi-Fi' },
  'parking': { icon: <ParkingCircle size={20} />, label: 'Parking' },
  'shuttle': { icon: <Bus size={20} />, label: 'Transfer' },

  // Sport & Special
  'gym': { icon: <Dumbbell size={20} />, label: 'Teretana' },
  'bike_rental': { icon: <Bike size={20} />, label: 'Rent-a-bike' },
  'ski_access': { icon: <Mountain size={20} />, label: 'Ski-In / Ski-Out' },
  'private_beach': { icon: <Sun size={20} />, label: 'Privatna plaža' },
};

interface HotelAmenitiesProps {
  amenityIds: string[];
  variant?: 'minimal' | 'detailed';
}

const AmenityItem: React.FC<{ item: any, variant: string }> = ({ item, variant }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: variant === 'minimal' ? '8px' : '12px 16px',
        background: variant === 'minimal' ? 'rgba(128,0,32,0.03)' : 'white',
        borderRadius: '10px',
        border: variant === 'minimal' ? '1px solid rgba(128,0,32,0.08)' : '1px solid rgba(0,0,0,0.05)',
        color: 'var(--bordo)',
        transition: 'all 0.2s ease',
        position: 'relative',
        cursor: 'default'
      }}
    >
      <div style={{ opacity: 0.8 }}>{item.icon}</div>
      {variant === 'detailed' && (
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#333' }}>{item.label}</span>
      )}

      {/* Custom Tooltip na hover */}
      {variant === 'minimal' && isHovered && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translate(-50%, -8px)',
          background: '#333',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          zIndex: 10,
          pointerEvents: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {item.label}
          {/* Mali strelica ispod tooltip-a */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: '#333 transparent transparent transparent'
          }} />
        </div>
      )}
    </div>
  );
};

export const HotelAmenities: React.FC<HotelAmenitiesProps> = ({ amenityIds, variant = 'minimal' }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: variant === 'minimal' ? '8px' : '16px' }}>
      {amenityIds.map(id => {
        const item = AMENITY_ICON_MAP[id];
        if (!item) return null;

        return <AmenityItem key={id} item={item} variant={variant} />;
      })}
    </div>
  );
};

