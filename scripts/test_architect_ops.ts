import { NeoTravelMasterEngine } from '../src/modules/engine/NeoTravelMasterEngine';
import { DossierService } from '../src/modules/engine/DossierService';
import { RoomingService } from '../src/modules/engine/RoomingService';
import { ReservationArchitectService } from '../src/modules/engine/ReservationArchitectService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runArchitectDemo() {
  console.log('--- 🏗️ RESERVATION ARCHITECT (DRAG & DROP) DEMO ---');

  // 1. Priprema Dosijea
  const packageResult = await NeoTravelMasterEngine.processFullPackage({
    naturalQuery: "Paris, decembar, 2 odraslih",
    channel: 'B2C'
  });

  const booking = await DossierService.createFromPackage({
    packageResult,
    customerName: "Marko Arhitekta",
    customerEmail: "marko.arch@example.com"
  });

  // 2. Priprema Soba i Putnika
  const p1 = await prisma.passenger.create({ data: { bookingId: booking.id, firstName: "Marko", lastName: "Arh", type: "ADULT" } });
  const p2 = await prisma.passenger.create({ data: { bookingId: booking.id, firstName: "Ivana", lastName: "Arh", type: "ADULT" } });

  const property = await prisma.property.create({ data: { name: "City Lights Hotel", slug: "city-lights", category: "4*", type: "HOTEL", address: "Paris", locationId: "FR-PAR" } });
  const roomType = await prisma.roomType.create({ data: { propertyId: property.id, name: "Luxury Double", maxAdults: 2, maxChildren: 0, maxOccupancy: 2 } });

  const roomingSet = await prisma.roomingSet.create({ data: { bookingId: booking.id, label: "Visual Setup" } });
  
  // Kreiramo dve sobe da bismo testirali premeštanje
  const roomA = await prisma.roomingRoom.create({ data: { roomingSetId: roomingSet.id, roomTypeId: roomType.id, status: 'EMPTY' } });
  const roomB = await prisma.roomingRoom.create({ data: { roomingSetId: roomingSet.id, roomTypeId: roomType.id, status: 'EMPTY' } });

  // Početno stanje: Marko je u Room A
  await prisma.passenger.update({ where: { id: p1.id }, data: { roomingRoomId: roomA.id } });

  console.log(`\nInicijalno: Marko je u Sobi A (${roomA.id})`);

  // --- TEST 1: DRAG & DROP PUTNIKA (MOVE) ---
  console.log('\n--- 🖱️ DRAG & DROP: PREMEŠTANJE PUTNIKA ---');
  await ReservationArchitectService.movePassenger(p1.id, roomB.id);
  console.log(`  ✅ Uspeh: Marko je prebačen u Sobu B (${roomB.id})`);

  // --- TEST 2: DRAG & DROP KALENDAR (RESCHEDULE) ---
  console.log('\n--- 📅 DRAG & DROP: PROMENA TERMINA NA KALENDARU ---');
  const hotelItem = booking.items.find(i => i.type === 'HOTEL');
  if (hotelItem) {
    const newStart = new Date(2026, 11, 25);
    const newEnd = new Date(2027, 0, 1);
    await ReservationArchitectService.rescheduleItem(hotelItem.id, newStart, newEnd);
    console.log(`  ✅ Uspeh: Termin za "${hotelItem.description}" pomeren na ${newStart.toLocaleDateString()}`);
  }

  // 3. Provera Timeline-a
  const fullDossier = await DossierService.getFullDossier(booking.id);
  console.log('\n--- 📂 TIMELINE PROVERA (Audit Trail) ---');
  fullDossier?.activities.forEach(act => {
    console.log(`    [${act.type}] ${act.description}`);
  });

  console.log('\n--- ✅ ARCHITECT DEMO ZAVRŠEN ---');
  await prisma.$disconnect();
}

runArchitectDemo();
