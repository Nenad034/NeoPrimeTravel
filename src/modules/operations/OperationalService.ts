import { BookingEntity } from '../booking/BookingEntity';
import { PassengerEntity } from '../booking/PassengerEntity';
import { RoomingRoomEntity } from '../booking/RoomingRoomEntity';

export interface RoomingListReport {
  propertyId: string;
  propertyName: string;
  cisCode: string;
  rooms: {
    roomType: string;
    passengers: string[];
    specialRequests?: string;
  }[];
}

export interface PassengerManifest {
  tripCode: string;
  totalPassengers: number;
  passengers: {
    name: string;
    birthDate?: string;
    passportNo?: string;
    roomLabel?: string;
  }[];
}

/**
 * OperationalService - Srce operativnog izveštavanja.
 * Generiše izveštaje poput Rooming Listi i Manifesta.
 */
export class OperationalService {
  /**
   * Generiše Rooming Listu za konkretan objekat i rezervaciju.
   */
  public static generateRoomingList(
    booking: BookingEntity, 
    rooms: RoomingRoomEntity[], 
    passengers: PassengerEntity[]
  ): RoomingListReport {
    console.log(`[OperationalService] Generišem Rooming Listu za Dossier: ${booking.cisCode}`);

    return {
      propertyId: 'PROP-001', // Primer
      propertyName: 'Hotel Splendid', // Primer (ovo bi došlo iz baze)
      cisCode: booking.cisCode,
      rooms: rooms.map(room => {
        const roomPax = passengers
          .filter(p => p.roomingRoomId === room.id)
          .map(p => p.fullName);
          
        return {
          roomType: room.roomTypeId === 'RT-STD' ? 'Standard Room' : 'Superior Room',
          roomNumber: room.providerRoomId || 'TBD', // Optional room number
          passengers: roomPax,
          specialRequests: 'None' // Primer logic
        };
      })
    };
  }

  /**
   * Generiše Manifest Putnika (Passenger Manifest).
   */
  public static generateManifest(
    booking: BookingEntity, 
    passengers: PassengerEntity[]
  ): PassengerManifest {
    console.log(`[OperationalService] Generišem Manifest za Dossier: ${booking.cisCode}`);

    return {
      tripCode: booking.cisCode,
      totalPassengers: passengers.length,
      passengers: passengers.map(p => ({
        name: p.fullName,
        birthDate: 'N/A', // Primer formatiranja
        passportNo: 'N/A', // Osetljivi podaci
        roomLabel: 'TBD'
      }))
    };
  }
}
