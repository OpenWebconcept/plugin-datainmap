- Deze release zet zich in op toegankelijkheid volgens WCAG 2. DataInMap is nu volledig met toetsenbord te bedienen en biedt een alternatief voor de weergave van locaties middels een lijstweergave.
- Filters <aside> voorzien van een label.
- Toetsenbord navigatie voor zoekresultaten, filters, kaart en feature modal.
- Volgorde van componenten aangepast zodat zoom knoppen gefocussed worden na de filters i.p.v. voor het zoeken.
- De zichtbare locaties worden nu ook in een lijstweergave getoond. Dit is een nieuw onderdeel welke apart gestyled dient te worden (voorzien in meegeleverde CSS).
- Zoekfunctie weer zichtbaar in beheeromgeving.
- De kaart omgezet naar een landmark zodat deze eenvoudiger gevonden kan worden.
- Ref gebruik in kaart omgezet van named refs naar React.createRef().

**1.6.5 (2020-07-21)**

- Filters gegroepeerd (role=group) voor toegankelijkheid.

**1.6.4 (2020-07-15)**

- Aria labels voor zoekformulier ingevuld.

**1.6.3 (2020-06-03)**

- Er kan nu een callback worden uitgevoerd bij het openen van een feature pop-up, bijvoorbeeld om het aantal views van een feature te tracken. Met het filter `datainmap_shortcode_script_contents` kan het Javascript object `GHDataInMap` ondervangen worden en uitgebreid worden met een `featureCallback`. Bij het aanroepen wordt de feature meegegeven.

**1.6.2 (2020-05-13)**

- Bugfix: location picker in backend niet zichtbaar door ontbreken component.

**1.6.1 (2020-05-07)**

- Filter reset knop toegevoegd.
- Het filtermenu wordt nu verborgen als deze is ingeschakeld maar er geen filters zijn om uit te kiezen.

**1.6.0 (2020-04-29)**

- Locaties kunnen nu dynamisch worden ingeladen door `dynamic_loading=1` aan de shortcode toe te voegen. Dit maakt de initiële page load sneller doordat niet alle coördinaten en styling in de HTML worden meegestuurd, maar via een AJAX verzoek worden opgevraagd.
- Locaties kunnen nu op hun eigenschappen gefilterd worden. Filteren kan worden ingeschakeld met `enable_filter=1` en met `filter_properties="Naam, ID, slug"` is het mogelijk om het aantal filters te beperken. Met `filter_description="Uw eigen tekst"` is het mogelijk om per kaart de begeleidende tekst te wijzigen of onderdrukken.

**1.5.0 (2020-04-08)**

- Check voor weergave pointer cursor aangepast.
- User Interface tweaks (backend).
- Features van een TileWMS layer zijn nu ook aanklikbaar. De HTML afkomstig van de Geoserver wordt in de pop-up weergegeven.
- Een locatie heeft nu een content type: post of redirect.
- Redirect content type toegevoegd om bij het klikken op een locatie door te sturen naar een andere URL.
- Check toegevoegd die voorkomt dat een 'undefined' tooltip wordt getoond.
- Update naar OpenLayers 2.6.1, proj4 6.3.1.

**1.4.0 (2020-03-26)**

- Mogelijkheid om bij instellingen de startlocatie te selecteren via een kaart.

**1.3.5 (2020-03-18)**

- Mogelijkheid om via de shortcode een class attribuut toe te kennen.

**1.3.4 (2020-03-12)**

- Handleiding pagina toegevoegd.
- Composer in gebruik genomen voor installatie PHP libraries.

**1.3.3 (2020-03-04)**

- Taalbestanden werden niet ingeladen.
- Code toegevoegd voor controleren op plugin updates.

**1.3.2 (2020-03-03)**

- Encoding fix voor titel in feature pop-up.
- Documentatie toegevoegd.
- Voorbereiding voor publicatie plugin met update systeem.
- Uitgegeven onder EUPL licentie.