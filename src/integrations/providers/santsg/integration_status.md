# 🔌 San TSG / TourVisio API Integracija

Ovaj folder na platformi **NeoTravel** služi za integraciju prema jednom od najvećih ekosistema u turskom turizmu – **San TSG**. Preko njega dobijamo pristup gigantima koji koriste ovaj softver, prvenstveno **Filip Travel**-u i **Big Blue**-u.

## 📋 Osnovni Podaci o Ekosistemu
- **Softver Provider:** San Tourism Software Group (San TSG)
- **Glavni Proizvodi:** TourVisio (B2B/B2C rezervacije), Sejour (DMC back-office), Paximum (Global Bedbank)
- **Klient Agencije (Srbija):** Filip Travel, Big Blue
- **Tehnološki Protokol:** XML (SOAP) / JSON (REST) preko Paximum Global Marketplace-a
- **Tip Dobavljača:** Touroperatori (Turska, Egipat, Grčka) sa sopstvenim čarter letovima

## 👤 Vaši B2B Kontakti
- **Filip Travel B2B Odsek:** (Unesite ovde kontakte kada dogovorite) / Email: b2b@filiptravel.rs
- **Big Blue B2B Odsek:** (Unesite ovde kontakte kada dogovorite)

---

## 🚀 Faze Integracije (Checklist)

### 1. Komercijalna Faza (Ugovaranje sa Agencijama)
- [ ] Održan sastanak sa Filip Travel i Big Blue "B2B / Sektor za prodaju"
- [ ] Zatražen zvanični pristup API-ju ("API credentials for B2B Sub-Agents")
- [ ] Dogovoren iznos provizije i odobreni net ugovori (NET rates vs Commission)
- [ ] Zatražena zvanična **TourVisio API Dokumentacija** (ili Paximum JSON API) u zavisnosti na kom nivou vam otvaraju gateway.

### 2. Tehnička Priprema
- [ ] Dobijena PDF dokumentacija od TSG tima (struktura `GetPriceList`, `SetReservation` komandi)
- [ ] Dobijeni testni (SandBox) Auth ključevi (API Key, AgencyToken, UserToken)
- [ ] Mapirani šifarnici preko lokalne baze (Turska kod njih ima drugačiji RegionID nego na TravelgateX-u).

### 3. Razvoj i Implementacija
- [ ] Kreiran osnovni Auth model u NeoTravel-u (autentifikacija po TSG standardu)
- [ ] Testiran Search (slanje datuma, tip sobe, pax broj) -> Parsovan XML/JSON odgovor u NeoTravel JSON standard.
- [ ] Integrisan Pricing Rule (da li se povlači NET ili Bruto cena sa uračunatom provizijom).

### 4. Puštanje u Produkciju
- [ ] Dobijeni Live Auth Tokens od Filip Travela i Big Blue-a
- [ ] Upisani podaci u produkcijski `.env` 

---

## 💡 Arhitekturni Predlog i Preporuka za NeoTravel:
**Preporuka:**
Obavezno tražite Paximum JSON REST API ako ga nude. Paximum je novija (od iste TSG grupacije) i daleko modernija brza varijanta. Ako vam ustupe standardni matori TourVisio (baziran na SOAP XML-u), onda obavezno zahtevajte **Delta XML fajlove** kako biste vukli cene u sopstvenu Cloud bazu preko noći (Data dump), umesto da svaku pretragu na interfejsu puštamo ka njihovom sporom serveru. San TSG je poznat po ogromnim katalozima hotela (preko 900.000 u globalu preko Paximuma).
