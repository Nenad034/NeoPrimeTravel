# 🔌 Solvex (Master-Interlook) - API Integracija

Ovaj fajl služi za praćenje kompletnog ciklusa povezivanja sa Solvex (Bugarska) sistemom Master-Interlook.

## 📋 Osnovni Podaci o Dobavljaču
- **Naziv Dobavljača:** Solvex
- **Sistem / Tehnologija:** Megatec Master-Interlook
- **Tehnološki Protokol:** SOAP XML
- **Endpoint Test:** `https://evaluation.solvex.bg/iservice/integrationservice.asmx`
- **Login:** sol611s
- **Password:** En5AL535

## 🚀 Faze Integracije (Checklist)

### 1. Komercijalna Faza (Ugovaranje)
- [x] Održan prvi sastanak / Prvi kontakt emailom
- [x] Dogovoreni komercijalni uslovi
- [x] Zatražen pristup API specifikaciji

### 2. Tehnička Priprema (SandBox)
- [x] Dobijena kompletna API dokumentacija (Solvex.txt)
- [x] Dobijeni testni kredencijali (sol611s)
- [ ] Postavljena bezbednost - SOAP Klijent

### 3. Razvoj i Implementacija (Development)
- [x] Snimljena i testirana autentifikacija (Connect metoda - GUID dobijen)
- [ ] Testirana metoda pretrage (SearchHotelServicesMinHotel)
- [ ] Testiran proces kreiranja rezervacije (CreateReservation)
- [ ] Mapirani šifarnici (GetHotels, GetRoomType)

### 4. Puštanje u Produkciju
- [ ] TBD
