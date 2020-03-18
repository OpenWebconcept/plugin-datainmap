Een kaart kan op een pagina geplaatst worden met de `[datainmap]` shortcode. De shortcode moet minimaal één laag bevatten, dit is het ID-nummer van een laag.

`[datainmap layers=1]`

Het is mogelijk om meerdere lagen te plaatsen. De volgorde in de shortcode is bepalend voor de volgorde van de lagen. Maak eventueel gebruik van laagtransparantie wanneer meerdere lagen gebruikt worden in een kaart.

Om vervolgens locaties te tonen moet het `types` attribuut worden gebruikt. Dit is het ID-nummer van één of meerdere locatie types.

`[datainmap layers=1 types=1,2]`

Hoe locaties worden getoond is afhankelijk van de configuratie van een locatie type. Is deze geclusterd? Dan worden alle locaties van dat type geclusterd. Andere locatie types die niet zijn ingesteld om te worden geclusterd worden als losse locaties weergegeven. Het is mogelijk om alle locaties van verschillende locatie types te clusteren, maar alleen voor locaties van het type *Point*.

De instellingen `single_cluster` en `single_cluster_distance` bepalen dan hoe de gehele cluster wordt weergegeven.

`[datainmap layers=1 types=1,2 single_cluster=1 single_cluster_distance=60]`

Ook is het mogelijk om de standaard instellingen te wijzigen, zoals `zoom`, `min_zoom`, `max_zoom`, `center_x`, `center_y` en `projection`.

`[datainmap layers=1 types=1 zoom=12 min_zoom=8 max_zoom=14]`

De functionaliteiten van de kaart kunnen ook met de shortcode in- of uitgeschakeld worden. Standaard staan de zoekfunctie en de locatie content pop-up ingeschakeld. De tooltip staat standaard uit.

`[datainmap layers=1 types=1 enable_search=0 enable_feature_dialog=0 enable_tooltip=1]`

Om de container waar DataInMap wordt geplaatst te voorzien van een of meerdere CSS classes kan gebruik gemaakt worden van `css_class`, bijv. `[datainmap css_class="kaart-groot"]`. Deze CSS classes dienen in je de stylesheet van het gebruikte thema te staan.