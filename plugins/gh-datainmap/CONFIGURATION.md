Voordat Data In Map gebruikt kan worden moet deze worden geconfigureerd.

# Plugin instellingen

In het menu bij DataInMap -> Instellingen kunnen de algemene instellingen worden gevonden. De meeste instellingen zullen voor zich spreken.

Het belangrijkste zijn de instellingen van de kaart zelf, en dan specifiek het te gebruiken coördinaten systeem (kaartprojectie). Standaard wordt *EPSG:3857* ondersteund. Aanvullende projecties kunnen ook worden toegevoegd, zoals Rijksdriehoekscoördinaten (RD-coördinaten, ofwel *EPSG:28992*).

Bij de instelling *Centreer kaart op* is het van belang om te realizeren dat de opgegeven coördinaten voor de opgegeven projectie bedoeld zijn.

De zoekfunctie van Data In Map maakt gebruik van de zoekfunctie van PDOK. Deze moet overeenkomen met de *Kaart projectie*. De zoekfunctie is echter beperkt tot *Lon/Lat* (*EPSG:3857*) of *RD* (*EPSG:28992*).

Zoekresultaten kunnen beperkt worden tot enkel resultaten binnen een gemeente.

# Aanvullende projecties

Data In Map heeft standaard ondersteuning voor *EPSG:3857*. Aanvullende projecties kunnen worden toegevoegd. Het verwachte formaat is CSV, waarbij in kolom 1 de naam van de projectie staat, en in kolom 2 de werkelijke projectie voor proj4. Via [epsg.io](https://epsg.io/) kunnen aanvullende projecties worden opgevraagd, kies bij *Export* voor *Proj4js*.

Gebruik de volgende regel op bijvoorbeeld *RD* toe te voegen:

```
EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"
```

Wanneer een projectie is toegevoegd kan deze worden gebruikt als standaard kaartprojectie. Maar de projecties worden ook gebruikt bij lagen, bijvoorbeeld kaarten afkomstig van een GeoServer (WMTS service o.i.d.). Na het toevoegen van bovenstaande projectie is het mogelijk om bij de kaart én lagen om *EPSG:28992* in te vullen.

Ontbreekt een projectie? Dan kan een kaart of laag niet worden weergegeven.

# Eerste laag aanmaken

Om een kaart te kunnen tonen dient er eerst een laag aangemaakt te worden. Zonder verdere instellingen kan een laag aangemaakt worden met als type *OpenStreetMap*.

Een mooie kaart om te gebruiken is een afkomstig van PDOK. Vul bij de laag de volgende gegevens in:

```
Type: WMTS (+GetCapabilities)
URL: https://geodata.nationaalgeoregister.nl/tiles/service/wmts?request=GetCapabilities&service=WMTS
Laag naam: brtachtergrondkaart
Laag transparantie: 1.00
Matrixset: EPSG:3857
```

Na het aanmaken van de laag kan het ID gebruikt worden in de shortcode.

# Eigen stylesheet

Data In Map heeft een standaard stylesheet. Deze is er om snel te kunnen testen met de kaart, maar het is aan te raden om de plugin naar eigen wens vorm te geven. Zorg er voor dat wanneer de eigen stylesheet wordt gebruikt dat de standaard stylesheet bij instellingen wordt uitgeschakeld.

Vraag de broncode op om de stylesheet te bekijken. Ook de transities zoals openen en sluiten pop-up en zoekresultaten kunnen met CSS aangepast worden.