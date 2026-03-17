import { NeoTravelMasterEngine } from '../src/modules/engine/NeoTravelMasterEngine';
import { DossierService } from '../src/modules/engine/DossierService';
import { RoomingService, RoomAssignment } from '../src/modules/engine/RoomingService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runRoomingDemo() {
  console.log('--- 🏨 ROOMING & MANIFEST INTELLIGENCE DEMO ---');

  // 1. Inicijalizacija Dosijea i Putnika
  const packageResult = await NeoTravelMasterEngine.processFullPackage({
    naturalQuery: "Kairo, dvoje odraslih i dete",
    channel: 'B2C'
  });

  const booking = await DossierService.createFromPackage({
    packageResult,
    customerName: "Jovan Jovanović",
    customerEmail: "jovan@example.com"
  });

  // Dodajemo putnike u bazu (Simulacija unosa podataka)
  const p1 = await prisma.passenger.create({
    data: { bookingId: booking.id, firstName: "Jovan", lastName: "Jovanović", type: "ADULT", isLead: true }
  });
  const p2 = await prisma.passenger.create({
    data: { bookingId: booking.id, firstName: "Milica", lastName: "Jovanović", type: "ADULT" }
  });
  const p3 = await prisma.passenger.create({
    data: { bookingId: booking.id, firstName: "Marko", lastName: "Jovanović", type: "CHILD", birthDate: new Date(2018, 5, 20) }
  });

  console.log(`\nDOSIJE: ${booking.cisCode} | Putnici kreirani.`);

  // 2. KREIRANJE SOBE (Room Type ID simulacija)
  // Prvo pravimo Property i RoomType u bazi da bi test radio
  const property = await prisma.property.create({
    data: { name: "Sol Plaza", slug: "sol-plaza", category: "5*", type: "HOTEL", address: "Hurghada", locationId: "EG-HRG" }
  });
  const roomType = await prisma.roomType.create({
    data: { propertyId: property.id, name: "Family Suite", maxAdults: 2, maxChildren: 2, maxOccupancy: 4 }
  });

  // 3. RASPODELA (Rooming Assignment)
  const assignments: RoomAssignment[] = [
    {
      roomTypeId: roomType.id,
      passengerIds: [p1.id, p2.id, p3.id] // Svi u jednu Family sobu
    }
  ];

  await RoomingService.createRoomingLayout(booking.id, assignments);

  // 4. GENERISANJE MANIFESTA
  console.log('\n--- 📋 GENERISANJE MANIFESTA ZA HOTEL ---');
  const manifest = await RoomingService.generateHotelManifest(booking.id);

  console.log(`  Hotel:    ${manifest.hotelName}`);
  console.log(`  Dosije:   ${manifest.cisCode}`);
  manifest.rooms?.forEach((r, idx) => {
    console.log(`  Soba ${idx + 1} [${r.type}]:`);
    r.passengers.forEach(p => console.log(`      👤 ${p}`));
  });

  console.log('\n--- ✅ ROOMING DEMO ZAVRŠEN ---');
  await prisma.$disconnect();
}

runRoomingDemo();
