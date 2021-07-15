Een kaart kan op een pagina geplaatst worden met de `[datainmap]` shortcode. De shortcode moet minimaal één laag bevatten, dit is het ID-nummer van een laag.

`[datainmap layers=1]`

Het is mogelijk om meerdere lagen te plaatsen. De volgorde in de shortcode is bepalend voor de volgorde van de lagen. Maak eventueel gebruik van laagtransparantie wanneer meerdere lagen gebruikt worden in een kaart.

Om vervolgens locaties te tonen moet het `types` attribuut worden gebruikt. Dit is het ID-nummer van één of meerdere locatie types.

`[datainmap layers=1 types=1,2]`

Hoe locaties worden getoond is afhankelijk van de configuratie van een locatie type. Is deze geclusterd? Dan worden alle locaties van dat type geclusterd. Andere locatie types die niet zijn ingesteld om te worden geclusterd worden als losse locaties weergegeven. Het is mogelijk om alle locaties van verschillende locatie types te clusteren, maar alleen voor locaties van het type *Point*.

De instellingen `single_cluster` en `single_cluster_distance` bepalen dan hoe de gehele cluster wordt weergegeven.

`[datainmap layers=1 types=1,2 single_cluster=1 single_cluster_distance=60]`

Standaard worden de locaties die met `types` aangegeven zijn direct ingeladen in de pagina (op de content van de locatie na). Bij veel locaties of coördinaten (bijvoorbeeld polygonen) kan dit er voor zorgen dat de pagina erg groot wordt wat een negatief effect heeft op het laden van de pagina. Om dit te voorkomen is het mogelijk om locaties dynamisch te laden met `dynamic_loading=1`. Dit maakt de initiële page load sneller doordat niet alle coördinaten en styling in de HTML worden meegestuurd, maar via een AJAX verzoek worden opgevraagd.

`[datainmap layers=1 types=1,2 dynamic_loading=1]`

Locaties filteren is mogelijk door eigenschappen (tags) toe te kennen aan een locatie. Om filteren in te schakelen kan `enable_filter=1` toegevoegd worden aan de shortcode. Alle eigenschappen van de locaties worden standaard toegevoegd aan het filter. Hierdoor zullen er ook geen locatie eigenschappen in de lijst staan die niet voorkomen. Om de lijst met filters in te perken kan gebruik gemaakt worden van `filter_properties="<Naam>, <ID>, <slug>"` waarbij per locatie eigenschap de naam, het ID of de slug gebruikt kan worden. Dit werkt ook met `dynamic_loading` ingeschakeld. Met `filter_description` is het mogelijk om een specifieke omschrijving te tonen in het filterscherm. Deze waarde overschrijft de algemene instellingen. Met `filter_description=""` is het mogelijk om de omschrijving weg te laten.

`[datainmap layers=1 types=1,2 enable_filter=1 filter_description="Verfijn de resultaten door één of meerdere filters te kiezen."]`

`[datainmap layers=1 types=1,2 enable_filter=1 filter_properties="Woonservicezone 1, woonservicezone-2, 134"]`

Een lijstweergave van de gevonden locaties is standaard zichtbaar en met het oog op toegankelijkheid wordt ook aangeraden om deze geactiveerd te houden. Mocht er toch een reden zijn om deze te verbergen dan kan dit met `enable_features_listbox=0`.

Ook is het mogelijk om de standaard instellingen te wijzigen, zoals `zoom`, `min_zoom`, `max_zoom`, `center_x`, `center_y` en `projection`.

`[datainmap layers=1 types=1 zoom=12 min_zoom=8 max_zoom=14]`

De functionaliteiten van de kaart kunnen ook met de shortcode in- of uitgeschakeld worden. Standaard staan de zoekfunctie en de locatie content pop-up ingeschakeld. De tooltip staat standaard uit.

`[datainmap layers=1 types=1 enable_search=0 enable_feature_dialog=0 enable_tooltip=1]`

De layer toggler (voor het in- en uitschakelen van kaartlagen en locatielagen) is in te schakelen met `enable_toggler`. Standaard kunnen alle kaart- en locatielagen in/uitgeschakeld worden. Met `toggle_layers` en `toggle_types` is het mogelijk om dit te beperken.

`[datainmap layers=1,2 types=1,2 enable_toggler=1 toggle_layers=2 toggle_types=ALL]`

Om de container waar DataInMap wordt geplaatst te voorzien van een of meerdere CSS classes kan gebruik gemaakt worden van `css_class`, bijv. `[datainmap css_class="kaart-groot"]`. Deze CSS classes dienen in de stylesheet van het gebruikte thema te staan.