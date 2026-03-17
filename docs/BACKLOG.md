# 📋 UTCP CORE BACKLOG & TODO LIST

Ovaj dokument služi za praćenje važnih zadataka i integracija.

---

## ✅ COMPLETED (Phase 1: Architecture, Finance & Intelligence)
- [x] **Hybrid Global Schema:** Combined global scalability with local operational needs (Rooming).
- [x] **DossierDirector Orchestrator:** Implemented the "Master Brain" of the system.
- [x] **Finance Operational Service:** Article 35 VAT logic, multi-currency support, and NBS integration.
- [x] **Operational Reports:** Automated Rooming List and Passenger Manifest.
- [x] **SoftZone AI Intelligence:** Integrated Weather, Sentiment, and Bundling signals.
- [x] **i18n Multi-Language:** Full support for SR/EN translations.
- [x] **Persistence Layer:** Prisma with local SQLite database and Simulation environment.
- [x] **AI Cost Auditing:** Real-time token and cost tracking per dossier.
- [x] **AI Search Engine:** Natural Language Query parsing (NLP).
- [x] **Supplier Ranking Engine:** B2C (Winner-takes-all) and B2B (Full Transparency) logic.
- [x] **Advanced Pricing Math:** Cancellation policies and occupancy-based child pricing.
- [x] **Mapping & Normalization Layer:** Master IDs, standardized room/board codes.
- [x] **Dossier Management:** Master Dossier (Booking Engine) for tracking multi-item reservations, passengers, and statuses.

## 🚀 CURRENT FOCUS (Phase 2: Advanced Motor & Automation)
- [ ] **Dynamic Packaging Engine:** Logic for bundling Flight + Hotel + Transfer with optimized pricing.
- [ ] **Advanced Pricing Math:** Cancellation policies, child occupancy rules, and seasonal markups.
- [ ] **Guardian Angel Messaging:** Event-driven notification system (WhatsApp/Viber) triggered by SoftZone signals.

## 🏛️ 1. REGULATIVA I DRŽAVNE INTEGRACIJE (Compliance)
*Ove stavke zahtevaju zvanične API ključeve i digitalne sertifikate.*

- [ ] **SEF API Adapter (e-Fakture):** Implementacija stvarnih poziva prema `efaktura.mfin.gov.rs`.
- [ ] **eTurista (CIS) Sync Agent:** Razvoj produkcione konekcije sa portalom za prijavu turista.
- [ ] **PFR Fiscal Driver:** Povezivanje sa lokalnim procesorom fiskalnih računa (L-PFR).

## ⚙️ 2. OPERATIVA I LOGISTIKA
- [ ] **Inventory Sync Engine:** Deep integration with Expedia/Amadeus API-jima.
- [ ] **Agent Desktop:** Unified interface for AI Search, Results, and Dossier Management (UI Phase).

---
*NAPOMENA: Stavke sa ove liste se prebacuju u razvoj tek nakon eksplicitnog odobrenja USER-a.*
