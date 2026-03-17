import { Result, ok, fail } from '../../core/error/Result';
import { BookingDossier } from './BookingDossier';
import { RoomingRoomEntity } from './RoomingRoomEntity';

/**
 * OperationalListService - Generator operativnih listi (Rooming, Manifest, Transfer).
 * Pravilo: Konsultacija sa dokumentacijom o formatu Rooming liste (Deo 9).
 */
export class OperationalListService {
  
  /**
   * Generiše Rooming Listu za hotel.
   * Sadrži: Imena gostiju, Tip sobe, Board, Nacionalnost.
   */
  async generateRoomingList(dossier: BookingDossier): Promise<Result<any, Error>> {
    const roomingData = dossier.items
      .filter(item => item.type === 'HOTEL')
      .map(item => ({
        hotelName: (item as any).props.supplierId, // Ovde bi išao join sa Supplier tabelom
        arrival: (item as any).props.serviceStartDate,
        departure: (item as any).props.serviceEndDate,
        rooms: dossier.passengers.map(p => ({
            guestName: p.fullName,
            roomType: (item as any).props.itemTypeCode,
            nationality: 'SRB' // Mock podataka radi primera
        }))
      }));

    console.log(`[OpsService] Generisana rooming lista za ${dossier.header.reference}`);
    return ok(roomingData);
  }

  /**
   * Generiše Putnu Listu (Passenger Manifest).
   * Koristi se za prevoz i osiguranje.
   */
  async generatePassengerManifest(dossier: BookingDossier): Promise<Result<any, Error>> {
    const manifest = dossier.passengers.map(p => ({
      name: p.fullName,
      passport: (p as any).props.passportNumber,
      dob: (p as any).props.dateOfBirth
    }));

    console.log(`[OpsService] Generisan manifest za ${dossier.header.reference}`);
    return ok(manifest);
  }

  /**
   * Generiše listu za prevoz (Transfer List).
   * Pravilo: Mora uključiti broj prtljaga (Max Bags).
   */
  async generateTransferList(dossier: BookingDossier): Promise<Result<any, Error>> {
    const transferItems = dossier.items.filter(item => item.type === 'TRANSFER');
    // Logika za spajanje putnika i vozila...
    return ok(transferItems);
  }
}
