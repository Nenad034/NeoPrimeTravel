import { NormalizationEngine, RawSupplierOffer } from '../src/modules/engine/NormalizationEngine';

async function runMappingTest() {
  console.log('--- 🗺️ MAPPING & NORMALIZATION SIMULATOR (DEO 7) ---');

  // Primer: Tri različita dobavljača šalju ponudu za ISTI Hotel
  const rawOffers: RawSupplierOffer[] = [
    { supplierId: 'EXPEDIA', supplierHotelCode: '9981', roomName: 'Double Deluxe Room', boardName: 'AI', netPrice: 780, currency: 'EUR' },
    { supplierId: 'WEBBEDS', supplierHotelCode: 'HT123', roomName: 'DLX DBL', boardName: 'All Incl', netPrice: 765, currency: 'EUR' },
    { supplierId: 'DIRECT',  supplierHotelCode: 'SOLPL', roomName: 'Standard', boardName: 'HB', netPrice: 720, currency: 'EUR' }
  ];

  console.log('\n--- 🔁 PROCES NORMALIZACIJE ---');
  
  const normalizedResults = rawOffers.map(raw => {
    const normalized = NormalizationEngine.normalize(raw);
    console.log(`  Dobavljač: ${raw.supplierId} | Soba u sistemu: ${raw.roomName} -> Normalizovano: ${normalized.room.displayName} (${normalized.room.boardCode})`);
    return { ...normalized, supplierId: raw.supplierId };
  });

  // Grupisanje po Master Hotel ID
  console.log('\n--- 🏨 MASTER HOTEL AGREGACIJA ---');
  const groups: Record<string, any[]> = {};
  
  normalizedResults.forEach(r => {
    if (!groups[r.masterHotelId]) groups[r.masterHotelId] = [];
    groups[r.masterHotelId].push(r);
  });

  Object.keys(groups).forEach(id => {
    console.log(`\nMASTER HOTEL: ${id}`);
    console.log(`-------------------------------------------`);
    groups[id].forEach(g => {
      console.log(`  [${g.supplierId}] Ponuda: ${g.room.displayName} | Board: ${g.room.boardCode} | Price: ${g.price} EUR`);
    });
  });

  console.log('\n--- ✅ TEST MAPIRANJA ZAVRŠEN ---');
}

runMappingTest();
