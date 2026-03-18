# 🔌 Šablon za Novu API Integraciju

Ovaj folder služi za praćenje kompletnog ciklusa povezivanja sa B2B dobavljačima i touroperatorima, od prvog kontakta do potpunog puštanja u produkciju na platformi **NeoTravel**.

Kada započinjete novu integraciju (npr. Wayout, Fibula, Solvex), kopirajte ovaj šablon i preimenujte folder prema imenu dobavljača.

## 📋 Osnovni Podaci o Dobavljaču
- **Naziv Dobavljača:** [Ime]
- **Web Stranica:** [URL]
- **Tip Dobavljača:** [DMC / Touroperator / Bedbank / Avio Kompanija]
- **Sistem / Tehnologija:** [npr. Master-Interlook, Peakwork, TravelgateX]
- **Tehnološki Protokol:** [REST JSON / SOAP XML]

## 👤 Kontakt Osobe (B2B / IT)
- **Komercijalni Kontakt:** (Ime i Email osobe zadužene za ugovor)
- **IT / Tehnička Podrška:** (Ime i Email osobe zadužene za API ključeve i dokumentaciju)

---

## 🚀 Faze Integracije (Checklist)

### 1. Komercijalna Faza (Ugovaranje)
- [ ] Održan prvi sastanak / Prvi kontakt emailom
- [ ] Dogovoreni komercijalni uslovi (Provizija, Net cene)
- [ ] Potpisan B2B ugovor o saradnji
- [ ] Zatražen pristup API specifikaciji dokumentaciji

### 2. Tehnička Priprema (SandBox)
- [ ] Dobijena kompletna API dokumentacija (WSDL, Postman kolekcija, Swagger)
- [ ] Dobijeni testni kredencijali (SandBox Environment)
- [ ] Postavljena bezbednost (npr. X.509 Sertifikati ili Tokeni)
- [ ] Zatražena i sprovedena IP Whitelist-ing provera (dodavanje IP adresa NeoTravel servera na listu dozvoljenih)

### 3. Razvoj i Implementacija (Development)
- [ ] Snimljena i testirana autentifikacija (Login / Token generacija)
- [ ] Mapirani osnovni šifarnici (Destinacije, Gradovi, Hoteli)
- [ ] Testirana metoda pretrage (Search API) - povlačenje dostupnih cena
- [ ] Testirana kalkulacija penala za otkaz (Cancellation Policies)
- [ ] Kreirano mapiranje sadržaja (Amenities, Slike, Opisi)
- [ ] Testiran proces kreiranja rezervacije (Create Booking) u SandBox-u
- [ ] Povezan "DynamicPackagingEngine" na nove podatke

### 4. Puštanje u Produkciju (Go-Live)
- [ ] Uspešno izvršena sertifikacija / Odobrenje od strane dobavljača (ako postoji test mod)
- [ ] Dobijeni Live / Produkcijski kredencijali
- [ ] Konfigurisani `.env` parametri za produkciju (bez postavljanja sirovih ključeva u kod)
- [ ] Uspostavljen sistem za praćenje grešaka prilagođen novom API-ju
- [ ] Lansirano na zvaničnoj NeoTravel platformi

---

## 📂 Štačuvati u ovom folderu?
U folderu za konkretnog dobavljača smestite sledeće materijale:
1. `integration_status.md` - Kopiran ovaj fajl za aktivno praćenje statusa.
2. `docs/` - Originalni fajlovi dokumentacije (PDF, WSDL, Word dokumenti).
3. `postman/` - API kolekcije za testiranje i primeri JSON/XML odgovora.
4. `credentials.md` - Sigurnosne napomene (Samo reference, nikako prave šifre!).
5. `mappers/` - TypeScript/JSON definicije koje mapiraju njihove ID-eve u vaše.
