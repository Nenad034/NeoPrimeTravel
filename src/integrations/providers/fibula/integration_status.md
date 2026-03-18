# 🔌 Fibula Travel - API Integracija

Ovaj fajl služi za praćenje kompletnog ciklusa povezivanja sa Fibula Travel dobavljačem do potpunog puštanja u produkciju na platformi **NeoTravel**.

## 📋 Osnovni Podaci o Dobavljaču
- **Naziv Dobavljača:** Fibula Travel
- **Web Stranica:** https://www.fibula.rs/
- **Tip Dobavljača:** Touroperator / DMC (Turska, Egipat, Grčka)
- **Sistem / Tehnologija:** Peakwork (Player Hub Technology)
- **Tehnološki Protokol:** REST JSON (Uz x.509 obostranu sertifikaciju) / EDF Format

## 👤 Kontakt Osobe (B2B / IT)
- **Komercijalni Kontakt:** TBD
- **IT / Tehnička Podrška:** TBD

---

## 🚀 Faze Integracije (Checklist)

### 1. Komercijalna Faza (Ugovaranje)
- [ ] Održan prvi sastanak / Prvi kontakt emailom
- [ ] Dogovoreni komercijalni uslovi (Provizija, Net cene)
- [ ] Potpisan B2B ugovor o saradnji
- [ ] Zatražen pristup Peakwork API specifikaciji dokumentaciji

### 2. Tehnička Priprema (SandBox)
- [ ] Dobijena kompletna API dokumentacija (Peakwork Player Hub, EDF Format)
- [ ] Dobijeni testni kredencijali (SandBox Environment)
- [ ] Generisan CSR i dobijen potpisani **Mutual TLS v1.2+ Sertifikat**
- [ ] Zatražena i sprovedena IP Whitelist-ing provera (dodavanje IP adresa NeoTravel servera na listu dozvoljenih)

### 3. Razvoj i Implementacija (Development)
- [ ] Snimljena i testirana autentifikacija (Login / Token generacija preko mTLS-a)
- [ ] Mapirani osnovni šifarnici (Destinacije, Gradovi, Hoteli u Turskoj)
- [ ] Testirana metoda pretrage (Search API) - povlačenje dostupnih cena preko EDF keširanja
- [ ] Testirana kalkulacija penala za otkaz (Cancellation Policies)
- [ ] Kreirano mapiranje sadržaja (Slike hotela, Sobe, Usluge)
- [ ] Testiran proces kreiranja rezervacije (Create Booking) u SandBox-u
- [ ] Povezan `DynamicPackagingEngine` na podatke iz Peakwork-a (kombinovanje letova i hotela)

### 4. Puštanje u Produkciju (Go-Live)
- [ ] Uspešno izvršena sertifikacija / Odobrenje od strane Fibula/Peakwork tehničkog tima
- [ ] Dobijeni Live / Produkcijski sertifikati i ključevi
- [ ] Konfigurisani `.env` parametri za produkciju 
- [ ] Lansirano Fibula ponuda na zvaničnoj NeoTravel platformi

---

## 📝 Beleške sa integracije
- **Arhitektura Peakworka**: Omogućava spajanje direktnih zakupljenih hotela (Fibula DMC Turska) sa GDS (Sabre) i čarter letovima. Podaci se keširaju kroz *Enterprise Data Format* (EDF) za veliku brzinu pretrage.
- **Autorizacija**: Obavezno iskomunicirati na vreme generisanje x.509 sertifikata jer to često traje najduže kod B2B partnera koji koriste mTLS.
