import { GraphData } from './types';

export const GRAPH_DATA: GraphData = {
  "metadata": {
    "title": "Baza Wiedzy o Endecji (Narodowej Demokracji)",
    "description": "Kompleksowa baza wiedzy dla edukacyjnej aplikacji demitologizującej propagandę sowiecką o Endecji",
    "version": "1.0",
    "created": "2025-11-23T18:18:22.108291",
    "sources_count": 26,
    "nodes_count": 67,
    "edges_count": 110,
    "myths_count": 7,
    "timeline_count": 33,
    "updated": "2025-11-23",
    "language": "polski",
    "encoding": "UTF-8"
  },
  "nodes": [
    {
      "id": "dmowski_roman",
      "label": "Roman Dmowski",
      "type": "person",
      "dates": "1864-1939",
      "birth_date": "1864",
      "death_date": "1939-01-02",
      "description": "Założyciel i główny ideolog Endecji. Twórca Ligi Narodowej (1893), przywódca Komitetu Narodowego Polskiego na konferencji pokojowej w Paryżu (1919). Sygnatariusz Traktatu Wersalskiego. Autor 'Myśli nowoczesnego Polaka' (1903) i koncepcji piastowskiej.",
      "roles": ["ideolog", "polityk", "dyplomata", "pisarz"],
      "importance": 1.0,
      "sources": [
        { "title": "Myśli nowoczesnego Polaka", "author": "Roman Dmowski", "year": 1903 },
        { "title": "Polityka polska i odbudowanie państwa", "author": "Roman Dmowski", "year": 1925 }
      ]
    },
    {
      "id": "poplawski_jan",
      "label": "Jan Ludwik Popławski",
      "type": "person",
      "dates": "1854-1908",
      "description": "Współzałożyciel Ligi Narodowej i główny teoretyk polskiego nacjonalizmu. Redaktor 'Przeglądu Wszechpolskiego'.",
      "roles": ["teoretyk", "publicysta", "redaktor"],
      "importance": 0.9
    },
    {
      "id": "balicki_zygmunt",
      "label": "Zygmunt Balicki",
      "type": "person",
      "dates": "1858-1916",
      "description": "Ideolog egoizmu narodowego i współzałożyciel Ligi Narodowej. Autor 'Egoizmu narodowego wobec etyki' (1902).",
      "roles": ["ideolog", "socjolog", "publicysta"],
      "importance": 0.85
    },
    {
      "id": "pilsudski_jozef",
      "label": "Józef Piłsudski",
      "type": "person",
      "dates": "1867-1935",
      "description": "RYWAL Dmowskiego. Przywódca obozu sanacyjnego po zamachu majowym 1926. Propagował federalizm.",
      "roles": ["marszałek", "polityk", "wojskowy"],
      "importance": 0.95
    },
    {
      "id": "liga_narodowa",
      "label": "Liga Narodowa",
      "type": "organization",
      "dates": "1893-1928",
      "description": "Tajna organizacja założona przez Dmowskiego, Popławskiego i Balickiego. Pierwsza nowoczesna polska organizacja nacjonalistyczna.",
      "importance": 1.0
    },
    {
      "id": "stronnictwo_narodowe",
      "label": "Stronnictwo Narodowe",
      "type": "organization",
      "dates": "1928-1939",
      "description": "Partia Narodowa. Zreformowana po zamachu majowym Piłsudskiego. Opozycja wobec reżimu sanacyjnego.",
      "importance": 0.85
    },
    {
      "id": "owp",
      "label": "Obóz Wielkiej Polski",
      "type": "organization",
      "dates": "1926-1933",
      "description": "Organizacja założona przez Romana Dmowskiego w grudniu 1926 roku. Miała charakter masowego ruchu narodowego.",
      "importance": 0.8
    },
    {
      "id": "onr",
      "label": "Obóz Narodowo-Radykalny",
      "type": "organization",
      "dates": "1934-1939",
      "description": "Radykalna organizacja narodowa, odłam młodych działaczy niezadowolonych z umiarkowanej polityki starszego pokolenia.",
      "importance": 0.65
    },
    {
      "id": "konferencja_paryska",
      "label": "Konferencja Pokojowa w Paryżu",
      "type": "event",
      "dates": "1919",
      "description": "Dmowski reprezentował Polskę. Zabezpieczył zachodnie granice w Traktacie Wersalskim.",
      "importance": 1.0
    },
    {
      "id": "zamach_majowy",
      "label": "Zamach Majowy",
      "type": "event",
      "dates": "1926-05",
      "description": "Piłsudski przejął władzę. ND sprzeciwiło się zamachowi i późniejszemu autorytarnemu reżimowi sanacji.",
      "importance": 0.9
    },
    {
      "id": "mysli_polaka",
      "label": "Myśli nowoczesnego Polaka",
      "type": "publication",
      "dates": "1903",
      "description": "Dzieło fundamentalne Dmowskiego. Nakreślił egoizm narodowy i koncepcję piastowską.",
      "importance": 1.0
    },
    {
      "id": "egoizm_narodowy_concept",
      "label": "Egoizm Narodowy",
      "type": "concept",
      "description": "Podstawowa filozofia ND autorstwa Balickiego. Narody powinny dążyć do racjonalnego interesu własnego.",
      "importance": 0.9
    },
    {
      "id": "koncepcja_piastowska",
      "label": "Koncepcja Piastowska",
      "type": "concept",
      "description": "Wizja Dmowskiego: Polska powinna być budowana na historycznie polskich ziemiach.",
      "importance": 0.85
    },
    {
      "id": "mlodziez_wszechpolska",
      "label": "Młodzież Wszechpolska",
      "type": "organization",
      "dates": "1922-1939",
      "description": "Organizacja młodzieżowa ruchu narodowego na uniwersytetach.",
      "importance": 0.75
    },
    {
      "id": "mosdorf_jan",
      "label": "Jan Mosdorf",
      "type": "person",
      "dates": "1904-1943",
      "description": "Działacz narodowy młodego pokolenia. Zginął w Auschwitz.",
      "importance": 0.65
    },
    {
      "id": "rybarski_roman",
      "label": "Roman Rybarski",
      "type": "person",
      "dates": "1887-1942",
      "description": "Ekonomista i polityk narodowy. Zginął w Auschwitz.",
      "importance": 0.7
    },
    {
      "id": "grabski_wladyslaw",
      "label": "Władysław Grabski",
      "type": "person",
      "dates": "1874-1938",
      "description": "Ekonomista i polityk narodowo-demokratyczny. Twórca reformy walutowej.",
      "importance": 0.75
    }
  ],
  "edges": [
    { "source": "dmowski_roman", "target": "liga_narodowa", "relationship": "założył" },
    { "source": "poplawski_jan", "target": "liga_narodowa", "relationship": "współzałożył" },
    { "source": "balicki_zygmunt", "target": "liga_narodowa", "relationship": "współzałożył" },
    { "source": "dmowski_roman", "target": "egoizm_narodowy_concept", "relationship": "propagował" },
    { "source": "dmowski_roman", "target": "koncepcja_piastowska", "relationship": "opracował" },
    { "source": "dmowski_roman", "target": "konferencja_paryska", "relationship": "reprezentował Polskę" },
    { "source": "dmowski_roman", "target": "mysli_polaka", "relationship": "napisał" },
    { "source": "dmowski_roman", "target": "owp", "relationship": "założył" },
    { "source": "pilsudski_jozef", "target": "zamach_majowy", "relationship": "przeprowadził" },
    { "source": "stronnictwo_narodowe", "target": "zamach_majowy", "relationship": "sprzeciwiło się" },
    { "source": "onr", "target": "stronnictwo_narodowe", "relationship": "odłączył się" },
    { "source": "mlodziez_wszechpolska", "target": "owp", "relationship": "organ młodzieżowy" },
    { "source": "mosdorf_jan", "target": "mlodziez_wszechpolska", "relationship": "kierował" },
    { "source": "dmowski_roman", "target": "pilsudski_jozef", "relationship": "rywalizował" }
  ],
  "myths": [
    {
      "id": "mit1",
      "title": "Endecja była faszystowska",
      "claim": "Narodowa Demokracja była organizacją faszystowską",
      "truth": "Liga Narodowa została założona w 1893 roku, 29 lat przed Marszem na Rzym Mussoliniego. Endecja popierała demokrację parlamentarną. Faszyzm wymaga totalitaryzmu i kultu wodza.",
      "sources": ["Brian Porter, 'When Nationalism Began to Hate'"],
      "severity": "wysoka",
      "relatedNodes": ["dmowski_roman", "liga_narodowa"],
      "category": "ideologia"
    },
    {
      "id": "mit2",
      "title": "Dmowski współpracował z Hitlerem",
      "claim": "Roman Dmowski kolaborował z nazistowskimi Niemcami",
      "truth": "Dmowski zmarł 2 stycznia 1939, przed wybuchem II wojny. Całe życie ostrzegał przed zagrożeniem niemieckim. W Wersalu występował przeciw interesom niemieckim.",
      "sources": ["Polityka polska i odbudowanie państwa (1925)", "Akt zgonu 1939"],
      "severity": "wysoka",
      "relatedNodes": ["dmowski_roman", "konferencja_paryska"],
      "category": "współpraca"
    },
    {
      "id": "mit3",
      "title": "Endecja sprzeciwiała się niepodległości",
      "claim": "ND była przeciwna polskiej niepodległości",
      "truth": "ND dążyła do niepodległości drogą dyplomatyczną. Dmowski w Wersalu zabezpieczył granice.",
      "sources": ["Traktat Wersalski"],
      "severity": "wysoka",
      "relatedNodes": ["dmowski_roman", "konferencja_paryska"],
      "category": "niepodległość"
    },
    {
      "id": "mit6",
      "title": "Endecja planowała Holokaust",
      "claim": "ND była odpowiedzialna za planowanie Holokaustu",
      "truth": "Holokaust był dziełem nazistowskich Niemiec. Antysemityzm ND był ekonomiczno-kulturowy, nie rasowo-biologiczny. Wielu narodowców zginęło w Auschwitz.",
      "sources": ["Historiografia Holokaustu"],
      "severity": "krytyczna",
      "relatedNodes": ["dmowski_roman", "rybarski_roman", "mosdorf_jan"],
      "category": "odpowiedzialność historyczna"
    }
  ],
  "timeline": [
    { "year": 1893, "label": "Założenie Ligi Narodowej", "nodeId": "liga_narodowa", "description": "Dmowski, Popławski i Balicki zakładają tajną Ligę." },
    { "year": 1903, "label": "Myśli nowoczesnego Polaka", "nodeId": "mysli_polaka", "description": "Publikacja manifestu ideowego." },
    { "year": 1919, "label": "Konferencja Wersalska", "nodeId": "konferencja_paryska", "description": "Dmowski walczy o granice Polski." },
    { "year": 1926, "label": "Powstanie OWP", "nodeId": "owp", "description": "Reakcja na Zamach Majowy." },
    { "year": 1939, "label": "Śmierć Dmowskiego", "nodeId": "dmowski_roman", "description": "Koniec epoki ojców założycieli." }
  ]
};