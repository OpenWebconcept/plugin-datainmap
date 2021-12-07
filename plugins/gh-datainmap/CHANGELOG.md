- Documentatie wijziging, nieuwe URL voor standaard kaart.
- De zoom in/uit-knoppen hebben nu een `aria-label` waar de zichtbare tekst in voor komt.

**1.10.1 (2021-10-06)**

- Fix voor kaartweergave in de backend. Deze was namelijk niet zichtbaar.
- Fix voor jQuery deprecation van `ready()` in de backend.
- Oudere versies van ondersteunende software bibliotheken weer in gebruik genomen i.v.m. problemen in de backend.

**1.10.0 (2021-08-25)**

- Nieuwe versies van ondersteunende software bibliotheken in gebruik genomen.
- Mogelijkheid toegevoegd om lagen in/uit te schakelen door gebruik van shortcode instellingen `enable_toggler`, `toggle_layers`, `toggle_types`, `untoggled_layers` en `untoggled_types`. Met `filter_description="Uw eigen tekst"` is het mogelijk om per kaart de begeleidende tekst te wijzigen of onderdrukken. **Let op!** Bij gebruik eigen stylesheet moet de toggler van opmaak voorzien worden. Standaard staat de toggler uit. Meer informatie is te vinden in de shortcode documentatie.

**1.9.3 (2021-05-27)**

- Het `canvas`-element waar de kaart op wordt getekend voorzien van een `aria-label` en een `role=img` voor verbeterde toegankelijkheid.

**1.9.2 (2021-04-29)**

- Coderingsfix voor locatienaam. HTML entities werden bijvoorbeeld getoond in het overzicht met gevonden locaties. Dit is nu opgelost.

**1.9.1 (2021-02-25)**

- De locatietypes en -eigenschappen waren niet beschikbaar in Gutenberg. Dit is nu opgelost.

**1.9.0 (2021-02-25)**

- Na kiezen van loocatie met toetsenbord wordt de focus nu direct op het feature modal gezet.
- Focus blijft met tabben nu binnen feature modal totdat deze wordt gesloten.
- Zoomknoppen zijn nu voorzien van een `aria-label`.
- Het overzicht met layers geeft nu ook het type en de transparantie aan.
- Opmaak standaard stylesheet aangepast, deze voldeed niet en liet niet alle elementen goed zien. Door nu een goede basis te bieden moet het eenvoudiger zijn om in een eigen stylesheet enkel aanpassingen door te voeren. Al wordt het nog steeds aangeraden om een eigen stylesheet te gebruiken. Zie de broncode voor een voorbeeld.
- Gutenberg kan nu ook gebruikt worden voor de inhoud van de pop-ups.
- Nieuwe versies van ondersteunende software bibliotheken in gebruik genomen (React 17, OpenLayers 6.5 etc.).

**1.8.7 (2021-02-03)**

- Fix: inladen scripts nu in `init`-hook. Dit lost een probleem op bij sommige thema's waar de scripts tijdens het plaatsen van de shortcode niet werden geplaatst (Edwin Siebel).
- Mogelijkheid toegevoegd om bij een TileWMS layer het weergeven van de features pop-up uit te schakelen.

**1.8.6 (2021-01-12)**

- Fix: wijzigen van instellingen nu mogelijk bij `manage_options_gh-dim` capability.
- Fix: volgorde argumenten bij filter.

**1.8.5 (2020-11-19)**

- Fix: pre_get_posts alleen op main query uitvoeren.

**1.8.4 (2020-11-19)**

- Locatieoverzicht in beheer uitgebreid met extra kolommen (weergavetype locatie en content type).
- Locatieoverzicht in beheer kan nu gefilterd worden op locatie type.

**1.8.3 (2020-10-13)**

- Filters omgezet van een `aside`-element naar een `section`-element.

**1.8.2 (2020-09-23)**

- Kaart krijgt nu automatisch focus bij een mouseenter-event. Hierdoor hoeft bij gebruik van de muis niet eerst op de kaart geklikt te worden. Bij een mouseleave-event vervalt de focus weer.

**1.8.1 (2020-09-16)**

- Niet alle vereiste capabilities werden aangemaakt voor de beheerdersrol.

**1.8.0 (2020-09-16)**

- De rechten voor de custom post types zijn aangepast. Om gebruikers anders dan een beheerder toegang te geven dienen de juiste capabilities toegevoegd te worden aan een gebruikersrol. Hiermee is het mogelijk om toegang tot de onderdelen van de plugin per gebruikersrol zelf te bepalen. Waarbij `*_gh-dim-location-properties` slaat op de categorie _Locatie Eigenschappen_, `*_gh-dim-location-types` op de categorie _Locatie Types_, `*_gh-dim-layers` op de _Lagen_ en `*_gh-dim-locations` op de _Locaties_. **Let op:** De _capabilities_ voor het beheren van de categorieën en `manage_options_gh-dim` worden alleen aangemaakt en toegekend bij activatie van de plugin. Bij gebruik van een bestaande DataInMap installatie kunnen deze _capabilities_ handmatig via een plugin aangemaakt worden, of door de plugin eenmalig te deactiveren en weer te activeren. De volledige lijst is als volgt:
  - `assign_gh-dim-location-properties`
  - `assign_gh-dim-location-types`
  - `delete_gh-dim-layers`
  - `delete_gh-dim-location-properties`
  - `delete_gh-dim-location-types`
  - `delete_gh-dim-locations`
  - `delete_others_gh-dim-layers`
  - `delete_others_gh-dim-locations`
  - `delete_private_gh-dim-layers`
  - `delete_private_gh-dim-locations`
  - `delete_published_gh-dim-layers`
  - `delete_published_gh-dim-locations`
  - `edit_gh-dim-layers`
  - `edit_gh-dim-location-properties`
  - `edit_gh-dim-location-types`
  - `edit_gh-dim-locations`
  - `edit_others_gh-dim-layers`
  - `edit_others_gh-dim-locations`
  - `edit_private_gh-dim-layers`
  - `edit_private_gh-dim-locations`
  - `edit_published_gh-dim-layers`
  - `edit_published_gh-dim-locations`
  - `manage_gh-dim-location-properties`
  - `manage_gh-dim-location-types`
  - `manage_options_gh-dim` _voor de algemene instellingen van DataInMap, doorgaans alleen voor een beheerder._
  - `publish_gh-dim-layers`
  - `publish_gh-dim-locations`
  - `read_private_gh-dim-layers`
  - `read_private_gh-dim-locations`

**1.7.1 (2020-09-02)**

- User input sanitation voordat post- en term meta worden opgeslagen.
- save_post hook beperkt tot betreffende post types.
- Rechten aangepast zodat gebruikers met de rol Schrijver of hoger toegang hebben tot de diverse onderdelen.
- Menu positie DataInMap aangepast, staat nu na Reacties.

**1.7.0 (2020-08-11)**

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