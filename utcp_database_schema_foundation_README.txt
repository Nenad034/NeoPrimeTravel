UTCP Database Schema Foundation

Ovaj paket sadrži development-ready SQL foundation za platformu.

Uključeno:
- logičke schema po domenima
- reprezentativne core tabele
- glavne FK veze
- osnovni indeksi
- regulatorni i treasury sloj
- security/control sloj

Napomena:
- ovo je foundation SQL scaffold
- sledeći korak je podela na migration fajlove po domenu i fazi
- za produkciju treba dalje dodati:
  * particionisanje velikih tabela
  * seed/reference data
  * materialized views
  * advanced constraints i trigger logiku
  * performance tuning po workload-u
