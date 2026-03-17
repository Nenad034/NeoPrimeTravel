# 🏆 NeoTravel Project Master Blueprint (v2.0)
*Integralni pregled arhitekture, inteligencije i usklađenosti*

Ovaj dokument predstavlja finalni blueprint sistema koji spaja globalne standarde turističke industrije sa operativnim inovacijama iz OlympicHub projekta.

## 1. 🏗️ Arhitektonska Osnova (Hybrid Core)
Sistem je izgrađen na principima **Clean Architecture** i **Domain-Driven Design (DDD)**.
- **Globalna Skalabilnost:** Koriste se normalizovani SQL modeli za Property, RoomType i Offer identifikaciju (Fingerprinting).
- **Operativna Snaga:** Implementiran je napredni `RoomingRoom` sistem koji omogućava preciznu dodelu putnika sobama, rešavajući problem koji mnogi globalni sistemi ignorišu.
- **Persistence Layer:** Prisma ORM sa podrškom za SQLite (lokalni dev) i PostgreSQL/Supabase (produkcija).

## 2. 🧠 Inteligentni Sloj (SoftZone / Meka Zona)
Vaša vizija "Anđela Čuvara" je sada tehnička realnost.
- **DossierDirector:** Centralni radni proces (Orchestrator) koji koordinira validacije koda i savete AI agenata.
- **Intelligence Signals:** Sistem proaktivno prepoznaje:
  - Ekstremne vremenske uslove i nudi rešenja.
  - Negativan sentiment klijenta i alarmira menadžment.
  - Nedostatak transfera/usluga (Smart Bundling).
- **AI Audit:** Svaki dosije prati svoju potrošnju tokena (`aiTokenUsage`) i troškove (`aiCostAmount`).

## 3. ⚖️ Finansije i Regulativa (Trust & Compliance)
Sistem je "Zakon" za agencijsko poslovanje.
- **Član 35 (PDV na maržu):** Potpuno automatizovan obračun marže i unutrašnje stope 20/120.
- **NBS FX Integration:** Automatski dohvata kurseve za preračun u lokalnu valutu.
- **Regulatory Hooks:** Spremni adapteri za PFR (fiskalizaciju), eTurista (CIS) i SEF (e-fakture).

## 4. 🌐 Globalna Spremnost (i18n)
Sistem je od starta **Multijezičan**.
- **Translation Engine:** Svi izveštaji, AI poruke i sistemski nazivi su lokalizovani (`sr.json`, `en.json`).
- **AI Translation Port:** Dodavanje novih tržišta (jezika) se svodi na dodavanje jednog JSON fajla, bez promene koda.

## 5. 📂 Struktura Projekta
```text
src/
  ├── core/            # Error handling, Result tipovi, i18n
  ├── modules/
  │   ├── ai/          # SoftZone, Sentiment analysis
  │   ├── booking/     # DossierDirector, Entities, Repositories
  │   ├── finance/     # FXService, Margin calculation
  │   ├── operations/  # Rooming list, Passenger manifest
  │   └── regulatory/  # CIS, PFR, SEF adapters
prisma/                # Master Schema (Hybrid Model)
scripts/               # Simulatori i test skripte
```

---
**ZAKLJUČAK:** NeoTravel je sada platforma koja je stabilna kao globalni GDS, a pametna i agilna kao digitalna agencija budućnosti.
