# 📜 ZAJEDNIČKA PRAVILA KOMUNIKACIJE (GROUND RULES)

Ovaj dokument je obavezan "kontrolni punkt" za AI asistenta pre početka bilo kog zadatka.

### 1. Uvek proveri "Knjigu Istine" (Dokumentaciju)
- Pre pisanja bilo kog dela koda, AI mora pretražiti fajlove u `d:\NeoTravelUniqueDocs` da li već postoji zapis o toj logici ili bazi.
- Nikada ne pretpostavljaj nešto što je već definisano u TXT/PDF dokumentima korisnika.

### 2. Obavezna Konsultacija i Predlog (Documentation-First Proposal)
- Pre početka rada na bilo kom modulu, AI mora dubinski proučiti svu dokumentaciju koja se odnosi na taj modul.
- AI je u OBAVEZI da prvo pošalje detaljan **Predlog implementacije** koji sadrži:
    - Šta će se raditi (funkcionalnosti).
    - Kako će se raditi (tehnički pristup).
    - Moja zapažanja i konkretni predlozi za unapređenje (da li može bolje/modernije).
- Rad na kodu ili daljem dizajnu počinje TEK nakon što korisnik eksplicitno odobri taj predlog.

### 3. Arhitektonska Čistota (The Spine)
- Sav kod se MORA oslanjati na "kičmu" (Result pattern, Event-driven komunikacija, Security Provider).
- Nema "prečica" koje kvare stabilnost sistema zarad brzine.

### 4. AI Štednja (Token Efficiency)
- Sve što može da uradi "čisti kod" (TypeScript), radi kod.
- AI se koristi samo za kompleksnu analizu, "shvatanje" ljudskog inputa ili vizuelne elemente.

### 5. Transparentnost Greške
- Ako AI pogreši ili naiđe na kontradikciju u dokumentima, mora to odmah prijaviti korisniku bez pokušaja da "sakrije" problem.

---
**AI POTVRDA:** Pročitao sam i usvojio ova pravila. Ona su sada deo mog operativnog sistema za ovaj projekat.

### 6. Neprikosnovenost Odobrenih Celina (Immutable Approved Zones)
- Kada se određeni deo koda, logike ili CSS-a završi i dobije finalno **odobrenje od korisnika**, on postaje "zamrznut".
- AI ne sme da menja te delove dok radi na drugim povezanim modulima, čak i ako misli da bi neka promena bila "bolja".
- Bilo kakva izmena već odobrenog koda/dizajna mora biti eksplicitno predložena i **ponovo odobrena** od strane korisnika.
- Cilj je sprečavanje "domino efekta" gde popravljanje jedne stvari kvari drugu koja je već stabilna.

### 7. Dnevnik Razgovora i GitHub Arhiviranje (Conversation Logging)
- Svaki naš razgovor (sesija) mora biti dokumentovan i sačuvan na GitHub-u.
- AI će redovno kreirati kratke opise (Summaries) obavljenog posla i donetih odluka u okviru posebnog foldera u repozitorijumu (npr. `docs/conversations/`).
- Na taj način, čitava istorija razvoja i razmišljanja iza svake linije koda ostaje trajno sačuvana uz sam projekat.
