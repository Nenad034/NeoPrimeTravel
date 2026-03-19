# 🎫 Modul za Pretragu Letova — Kompletan Pregled i Specifikacija

Ovaj dokument objedinjuje sve relevantne informacije o modulu za pretragu i upravljanje letovima u sklopu **Unified Travel Commerce Platform (UTCP)**, preuzete iz master tehničke dokumentacije.

---

## 1. 🏗️ Arhitektura i Položaj u Sistemu

Pretraga letova je sastavni deo **Domena 4 (Search & Offer Engine)** i usko je povezana sa modulom za čarter operacije (**Domain 14**).

*   **Identifikacija:** Domain 4 — SEARCH & OFFER ENGINE
*   **Namena:** Omogućava pretragu redovnih i čarter avio linija, formiranje ponuda i snapshota sa TTL-om (Time-To-Live).
*   **Slojevi:**
    *   **Presentation Layer:** B2C sajt, B2B portal, Admin UI.
    *   **Application Layer:** Core Business Services (Search logic, Pricing, Ranking).
    *   **Infrastructure Layer:** Integracije sa avio API-jima i GDS sistemima.

---

## 2. 🔍 Tipovi Pretrage (Search Types)

Sistem razlikuje sledeće pretrage koje uključuju letove (kodovi se koriste u `search_type_code` koloni):

1.  **Hotel Search:** Samo smeštaj.
2.  **Flight Search:** Samo avio karte.
3.  **Package Search:** Dinamičko paketiranje (Let + Hotel + Transfer).
4.  **Tour Program Search:** Grupna putovanja sa uključenim letom.
5.  **Charter Search:** Specifične serije čarter letova zakupljenih od strane turoperatora.

---

## 3. 🌐 API Specifikacija

Svi endpoint-i prate `standard response model` (success, data, meta, errors) i verzionisani su kao `/api/v1/`.

### 3.1 Public Website API (B2C)
*   **Pretraga:** `POST /api/v1/public/search`
*   **Request Primer:**
    ```json
    {
      "search_type": "flight",
      "origin": "BEG",
      "destination": "AYT",
      "start_date": "2026-07-15",
      "end_date": "2026-07-22",
      "filters": {
        "direct_flights_only": true
      }
    }
    ```
*   **Detalji Ponude:** `GET /api/v1/public/offers/{offer_reference}`

### 3.2 B2B Partner API
*   **Pretraga:** `POST /api/v1/b2b/search`
*   **Dodatni podaci (B2B):** Provizija (commission), neto/prodajna cena, status kreditne sposobnosti agencije.

### 3.3 Admin / Operations API
*   **Upravljanje Čarterima:**
    *   `GET/POST /api/v1/admin/charters/seasons`
    *   `POST /api/v1/admin/charters/flights/{id}/manifest` (Generisanje spiska putnika)
    *   `POST /api/v1/admin/charters/flights/{id}/release` (Oslobađanje blokova sedišta)

---

## 4. 🗄️ Model Podataka (Data Model)

Ključne tabele i polja relevantni za letove:

### Tabela: `search_requests`
Loguje svaku korisničku pretragu.
*   `origin_code` (npr. BEG)
*   `destination_code` (npr. TUN)
*   `direct_flights_only` (BOOLEAN)

### Tabela: `charter_flights`
Kičma čarter modula.
*   `flight_date`
*   `route_id`
*   `seat_inventory`
*   `status_code` (`confirmed`, `delayed`, `cancelled`)

### Povezani Entiteti:
*   **`airports`**: IATA kodovi (BEG, ATH, DXB), gradovi i koordinate.
*   **`flight_offers`**: Privremeni zapisi sa rokom trajanja (TTL ~10 min).
*   **`product_supplier_maps`**: Mapiranje letova prema eksternim API-jima (npr. Air Serbia, TravelgateX).

---

## 5. ✈️ Charter Management (Domen 14)

Ovaj modul upravlja specifičnim zakupljenim kapacitetima:
*   **Series Management:** Upravljanje serijama letova kroz sezonu.
*   **Seat Inventory:** Praćenje prodatih vs slobodnih sedišta na čarteru.
*   **Hotel Allotments:** Povezivanje letova sa zakupljenim hotelskim sobama za Paket aranžmane (7/10/14 noćenja).

---

## 6. 🔌 Integracije i AI Sinergija

*   **Supplier Connectors:** Integracija sa `flight APIs`, payment gateway-ima i messaging provajderima.
*   **Flight Aggregator:** Logika koja kombinuje statičke čartere sa dinamičkim cenama sa GDS-a.
*   **AI Search Intelligence:** Pomaže korisniku u NLP pretrazi (npr. *"Pronađi mi let za Antaliju u julu ispod 300 EUR"*).

---

**Izvorna dokumentacija:** 
*   [Tehnicka dokumentacija Neo Travel.txt](file:///d:/NeoTravelUniqueDocs/docs/reference/Tehnicka%20dokumentacija%20Neo%20Travel.txt)
*   [Detailed Data Model.txt](file:///d:/NeoTravelUniqueDocs/docs/reference/Detailed%20Data%20Model.txt)
*   [API STRUKTURA PO DOMENU.txt](file:///d:/NeoTravelUniqueDocs/docs/reference/API%20STRUKTURA%20PO%20DOMENU.txt)

*Dokument kreiran: 19. Mart 2026.*
