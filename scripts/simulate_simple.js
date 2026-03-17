
const booking_cisCode = "CIS-SIM-" + Date.now();
const booking_totalPrice = 1250;
const bookerName = "Marko Markovic";

console.log("--- 🚀 NEO-TRAVEL DOSSIER SIMULATOR START ---");
console.log("[Step 1] Dossier kreiran: " + booking_cisCode);
console.log("          Klijent: " + bookerName);
console.log("          Status: DRAFT");

console.log("\n[Step 2] DossierDirector preuzima kontrolu...");
console.log("[Director Audit] Validacija integriteta: OK");
console.log("[AI Advisor] Analiziram kontekst... Termini su u julu.");
console.log("[AI Advisor] Primećujem visoke temperature u destinaciji.");
console.log("[AI Advisor] SUGERISANO: Ponuditi klijentu doplatu za 'Late Night Pool' pristup.");

const updatedUsage = 245;
const updatedCost = 0.00049;
console.log("[AI Log] Potrošeno tokena: " + updatedUsage + " ($" + updatedCost + ")");

console.log("\n[Step 3] Računam finansijsku profitabilnost (Član 35)...");
console.log("[FXService] Dohvatam kurs sa NBS portala: 1 EUR = 117.05 RSD");

const rate = 117.05;
const netPriceEur = 1000;
const sellRsd = Math.round(booking_totalPrice * rate * 100) / 100;
const netRsd = Math.round(netPriceEur * rate * 100) / 100;
const grossMargin = sellRsd - netRsd;
const vatAmount = Math.round((grossMargin - (grossMargin / 1.20)) * 100) / 100;
const netMargin = grossMargin - vatAmount;

console.log("--------------------------------------------------");
console.log("Prodajna Cena: " + sellRsd + " RSD");
console.log("Nabavna Cena:  " + netRsd + " RSD");
console.log("Bruto Marža:   " + grossMargin + " RSD");
console.log("PDV (Član 35): " + vatAmount + " RSD");
console.log("Neto Profit:   " + netMargin + " RSD");
console.log("--------------------------------------------------");

console.log("\n[Step 4] Potvrđujem rezervaciju i okidam eksterne workflow-e...");
console.log("[Director] Registrujem putovanje u CIS (eTurista): USPEŠNO");
console.log("[Director] Priprema za fiskalizaciju: SPREMNO (Čekam uplatu)");

console.log("\n--- ✅ SIMULACIJA USPEŠNO ZAVRŠENA ---");
console.log("UKUPNI AI TROŠAK ZA OVAJ DOSIJE: $" + updatedCost);
