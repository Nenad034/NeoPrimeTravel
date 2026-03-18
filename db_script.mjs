import fs from 'fs';

const url = 'https://yqqztdlkrxrwuvpolmin.supabase.co/rest/v1/hotel_catalog?on_conflict=hotel_name';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxcXp0ZGxrcnhyd3V2cG9sbWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjIzNDEsImV4cCI6MjA4OTMzODM0MX0.AIlvGgth3AsHqsFZBNhRJKAN3qrqokTg5Q9W4mu25f4';

const data = [
  {
    "hotel_name": "Hotel Palas",
    "stars": 4,
    "location": "Petrovac",
    "intro_description": "Otkrijte luksuzan porodični odmor u srcu Petrovca, savršeno stopljen sa tradicijom Budvanske rivijere.",
    "description": "Hotel Palas predstavlja vrhunski izbor za istinske ljubitelje pravog odmora, luksuza i mora. Lociran direktno na peščanoj obali Petrovca, opremljen je fantastičnim wellness & spa centrom i modernim sobama. Ton PrimeClick stila, izuzetni kulinarski specijaliteti i vrhunsko gostoprimstvo garantuju vama i vašoj porodici uspomene na nezaboravno letovanje.",
    "meta_title": "Hotel Palas 4* Petrovac | Leto 2026 PrimeClick",
    "meta_description": "Fantastičan odmor u Crnoj Gori! Rezervišite Hotel Palas 4* u Petrovcu uz PrimeClick i uživajte u prelepom moru i vrhunskom spa centru. Vaše letovanje iz snova!",
    "ai_search_optimization": {
      "wifi": "free",
      "parking": "available",
      "beach": "peščana",
      "distance": "beachfront",
      "family": "friendly"
    },
    "amenities": ["WiFi", "Plaža", "Bazen", "Restoran", "Spa centar", "Dečiji klub"],
    "main_image_url": "https://www.hgbudvanskarivijera.com/images/hotel-palas/plaza/plaza-(24).jpg",
    "image_urls": [
      "https://www.hgbudvanskarivijera.com/images/hotel-palas/plaza/plaza-(24).jpg",
      "https://www.hgbudvanskarivijera.com/images/hotel-palas/palas01.jpg",
      "https://www.hgbudvanskarivijera.com/images/hotel-palas/palas02.jpg",
      "https://www.hgbudvanskarivijera.com/images/hotel-palas/palas03.jpg",
      "https://www.hgbudvanskarivijera.com/images/hotel-palas/palas04.jpg"
    ]
  },
  {
    "hotel_name": "Hotel Aleksandar",
    "stars": 4,
    "location": "Budva",
    "intro_description": "Vaš idealan i atraktivan porodični kutak, preplavljen suncem Budve i osvežavajućim aktivnostima.",
    "description": "Potpuno integrisan u savršen pejzaž turističke metropole Budve, Hotel Aleksandar zrači energijom i gostoprimstvom. Kao deo PrimeClick selekcije, nudi moderni stil soba, neverovatnu animaciju, slane bazene i opušten porodični koncept neposredno kraj slavne Slovenske plaže. Ako volite dinamiku, komfor i blizinu mora, ovo je izbor bez greške.",
    "meta_title": "Hotel Aleksandar 4* Budva | Leto 2026 PrimeClick",
    "meta_description": "Uživajte u aktivnom odmoru uz sjajna iznenađenja! Hotel Aleksandar 4* Budva nudi porodičnu zabavu i odmor koji se pamti. Rezervišite letovanje na vreme!",
    "ai_search_optimization": {
      "wifi": "free",
      "parking": "available",
      "pool": "outdoor",
      "animation": "yes",
      "beach": "slovenska_plaza"
    },
    "amenities": ["WiFi", "Parking", "Otvoreni bazen", "Bar", "Dečija igraonica", "Animacija"],
    "main_image_url": "https://www.hgbudvanskarivijera.com/images/budvanska-rivijera/slajder/03-aleksandar.jpg",
    "image_urls": [
      "https://www.hgbudvanskarivijera.com/images/budvanska-rivijera/slajder/03-aleksandar.jpg",
      "https://www.hgbudvanskarivijera.com/images/aleksandar/01.jpg",
      "https://www.hgbudvanskarivijera.com/images/aleksandar/02.jpg",
      "https://www.hgbudvanskarivijera.com/images/aleksandar/03.jpg",
      "https://www.hgbudvanskarivijera.com/images/aleksandar/04.jpg",
      "https://www.hgbudvanskarivijera.com/images/aleksandar/05.jpg"
    ]
  },
  {
    "hotel_name": "Slovenska Plaza Resort",
    "stars": 4,
    "location": "Budva",
    "intro_description": "Najpoznatiji crnogorski mediteranski grad-hotel. Doživite potpuni mir u prelepom parku Slovenske plaže.",
    "description": "Turističko naselje Slovenska Plaža je ikonični simbol Budve i najveći resort svoje vrste. Okruženo hiljadama mediteranskih biljaka, ono predstavlja pravi mali grad prepun događaja, sportskih terena, butika restorana i bazen-oaza. Bilo da ste željni relaksacije u zelenilu ili urbane prestonice letnjeg ritma, Slovenska Plaža isporučuje standard PrimeClick odmora.",
    "meta_title": "Slovenska Plaza Resort 4* Budva | Leto 2026 PrimeClick",
    "meta_description": "Posetite čuveni kompleks Slovenska Plaza Resort 4* u Budvi. Bazen, tereni, prelepa plaža i bujno zelenilo za vaš savršen odmor. Obezbedite mesto već danas!",
    "ai_search_optimization": {
      "wifi": "free",
      "resort": "large",
      "nature": "parks",
      "sports": "tennis",
      "beach": "nearby"
    },
    "amenities": ["WiFi", "Bazen", "Teniski tereni", "Restoran", "Tržni centar", "Park"],
    "main_image_url": "https://www.hgbudvanskarivijera.com/images/budvanska-rivijera/slajder/04-slovenska.jpg",
    "image_urls": [
      "https://www.hgbudvanskarivijera.com/images/budvanska-rivijera/slajder/04-slovenska.jpg",
      "https://www.hgbudvanskarivijera.com/images/slovenska-plaza/01.jpg",
      "https://www.hgbudvanskarivijera.com/images/slovenska-plaza/02.jpg",
      "https://www.hgbudvanskarivijera.com/images/slovenska-plaza/03.jpg",
      "https://www.hgbudvanskarivijera.com/images/slovenska-plaza/04.jpg"
    ]
  }
];

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': apiKey,
    'Authorization': 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
  },
  body: JSON.stringify(data)
})
.then(async res => {
  const text = await res.text();
  console.log("Status Code:", res.status);
  console.log("Response:", text);
})
.catch(err => {
  console.error(err);
});
