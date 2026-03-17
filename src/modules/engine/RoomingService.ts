import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RoomAssignment {
  roomTypeId: string;
  label?: string;
  passengerIds: string[];
}

/**
 * RoomingService
 * 
 * Modul za inteligentnu raspodelu putnika po sobama (Rooming List).
 * Implementira logiku iz DOMAIN 9 vaše dokumentacije.
 */
export class RoomingService {

  /**
   * Kreira Rooming Set i raspoređuje putnike.
   */
  public static async createRoomingLayout(bookingId: string, assignments: RoomAssignment[]) {
    console.log(`[RoomingService] Kreiram layout soba za dosije: ${bookingId}...`);

    // 1. Kreiranje Master Rooming Seta
    const roomingSet = await prisma.roomingSet.create({
      data: {
        bookingId: bookingId,
        label: "Standard Rooming Distribution"
      }
    });

    // 2. Kreiranje pojedinačnih soba i povezivanje putnika
    for (const assign of assignments) {
      const room = await prisma.roomingRoom.create({
        data: {
          roomingSetId: roomingSet.id,
          roomTypeId: assign.roomTypeId,
          status: 'ASSIGNED'
        }
      });

      // Povezivanje putnika sa ovom sobom
      for (const pId of assign.passengerIds) {
        await prisma.passenger.update({
          where: { id: pId },
          data: { roomingRoomId: room.id }
        });
      }
    }

    // 3. Logovanje u Timeline (Proaktivna AI komponenta)
    await prisma.dossierActivity.create({
      data: {
        bookingId: bookingId,
        type: 'PASSENGER_MOD',
        description: `Završen raspored putnika po sobama (Rooming List kreiran).`,
        userId: 'SYSTEM_AI'
      }
    });

    console.log(`[RoomingService] Uspešno kreiran Rooming Set: ${roomingSet.id}`);
    return roomingSet;
  }

  /**
   * Generiše MANIFEST putnika za hotel (Sekcija 9.16)
   */
  public static async generateHotelManifest(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        passengers: true,
        roomingSets: {
          include: {
            rooms: {
              include: {
                roomType: true,
                passengers: true
              }
            }
          }
        }
      }
    });

    if (!booking) throw new Error('Dosije nije pronađen');

    // Formatiranje manifesta za štampu/slanje hotelu
    const manifest = {
      cisCode: booking.cisCode,
      hotelName: "Hotel Sol Plaza Beach Resort", // MOCK - u realnosti iz item-a
      rooms: booking.roomingSets[0]?.rooms.map(r => ({
        type: r.roomType.name,
        passengers: r.passengers.map(p => `${p.firstName} ${p.lastName} (${p.type})`)
      }))
    };

    return manifest;
  }
}
