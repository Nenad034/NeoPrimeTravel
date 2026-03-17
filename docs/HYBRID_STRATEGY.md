# 🏗️ NeoTravel Hybrid Architecture Strategy

Ovaj dokument definiše strategiju spajanja globalnih industrijskih standarda i inovacija iz OlympicHub AI-Lab projekta.

## 1. STRUKTURALNI STUB (Od Globalnih Igrača)
*Infrastruktura koja garantuje skalabilnost.*

- **Data Models:** Preuzimamo DB šemu za `search_requests`, `offer_groups` i `inventory_allotments`. Ovi modeli su optimizovani za milione transakcija.
- **API Standards:** Implementacija UBL 2.1 formata za razmenu podataka (vaučeri, fakture) kako bi sistem bio kompatibilan sa svetom.
- **Offer Identity:** Stroga pravila za poređenje soba i usluga (Unique Fingerprinting) kako bi pretraga bila 100% precizna.

## 2. OPERATIVNI MOZAK (Iz OlympicHub projekta)
*Logika koja donosi profit i usklađenost.*

- **Financial Safety Switch:** Implementacija atomskih transakcija (PFR -> Baza) koja je razvijena u OlympicHub-u.
- **Tax Logic (Član 35):** Specifična balkanska poreska logika se implementira prema vašem proverenom modelu.
- **Smart Pricing Engine:** Pravila za decu, kreveti i periodični popusti se zasnivaju na vašoj realnoj agencijskoj praksi.

## 3. INTELIGENCE LAYER (Inovacija)
*Ono što vas izdvaja na tržištu.*

- **Meka Zona (Soft Zone):** AI sloj koji prati vremensku prognozu, vesti i trendove (softZoneService.ts).
- **Consultative Search:** AI savetnik koji kupcu objašnjava *zašto* je neka ponuda bolja (ne samo jeftinija).
- **Master Orchestrator:** Koordinacija više AI agenata za različite dionice prodaje.

---
**CILJ:** Sistem koji je stabilan kao Expedia, a pametan i agilan kao vaš najbolji agent prodaje.
