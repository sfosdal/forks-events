// The city — every fact that makes this calendar Forks's rather than
// another town's, in one place (2026-10-11: a sister of lqa-events, built
// the way Chicago and Everett were). The browser (filter.js, app.js) and
// the build (scripts/*.mjs) both read it; nothing else names a venue or a
// team. The shared files (app.js, filter.js, styles.css bar its --v-* hues,
// scripts/*.mjs bar fetch-events.mjs and sources.mjs) are lqa-events' own,
// byte for byte — see README "Sister sites".
//
// Forks: pop. 3,500 on the West End of the Olympic Peninsula. The nearest
// ticketed rooms are an hour east in Port Angeles and Sequim, two hours
// down the coast at Ocean Shores, two and a half at Shelton; nothing in
// Forks itself sells through Ticketmaster.
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right. Forks has no club of its own on any
  // league feed (the Spartans are a high school), so the strip is Seattle's
  // six — the clubs the peninsula drives in for — as a Teams-view-only
  // list: their home grounds are not venues here and there is no `inject`,
  // so their games never enter the listing (the Everett pattern for its
  // Seattle clubs). Per team:
  //   re        the title match
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   espn      ESPN's sport/league/team id — the season, the form block,
  //             news and transactions (schedules.mjs); the Mariners' season
  //             comes from MLB's stats API and the Kraken's from the NHL's
  //   division  (baseball) the division rivals by the abbreviations the
  //             schedule carries, for the standings line
  //   club      the club's name on Ticketmaster; news the outlets' feeds;
  //             wiki the article; opens when the season usually starts
  // The entries are lqa-events' and everett-events' verbatim — keep them in
  // step (records, feeds, YouTube channels).
  var ST = function (s) { return ['https://www.seattletimes.com/sports/' + s + '/feed/', 'Seattle Times']; }; // the Seattle clubs' beat
  var TEAMS = [
    { slug: 'seahawks', label: 'Seahawks', re: /seahawks/i, sport: 'football', venue: 'Lumen Field', colors: ['#002244', '#69be28'],
      espn: { sport: 'football', league: 'nfl', id: '26' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', schedule: 'https://www.seahawks.com/schedule/',
      club: 'Seattle Seahawks', opens: 'September', wiki: { title: 'Seattle Seahawks', startYear: true },
      news: [ST('seahawks'), ['https://www.seahawks.com/rss/news', 'Seahawks.com'], ['https://www.fieldgulls.com/rss/current.xml', 'Field Gulls']],
      youtube: ['UCzkFCRiMcOBeef8xcaqipmw', 'UCDVYQ4Zhbm3S2dlz7P1GBDg'] }, // @Seahawks, @NFL
    { slug: 'mariners', label: 'Mariners', re: /mariners/i, sport: 'baseball', venue: 'T-Mobile Park', colors: ['#0c2c56', '#005c5c'],
      espn: { sport: 'baseball', league: 'mlb', id: '12' }, season: { kind: 'mlb', id: 136 }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sea.png', schedule: 'https://www.mlb.com/mariners/schedule',
      club: 'Seattle Mariners', opens: 'late March', wiki: { title: 'Seattle Mariners' },
      division: ['HOU', 'LAA', 'ATH', 'TEX'], // AL West, by the abbreviations the schedule carries (ATH since the Athletics left Oakland)
      news: [ST('mariners'), ['https://www.mlb.com/mariners/feeds/news/rss.xml', 'MLB.com'], ['https://www.lookoutlanding.com/rss/current.xml', 'Lookout Landing']],
      youtube: ['UCWWLs-O8JGYYcNea7AgumAA'] }, // @mariners (MLB's clips come from statsapi)
    { slug: 'kraken', label: 'Kraken', re: /kraken/i, sport: 'hockey', venue: 'Climate Pledge Arena', colors: ['#001628', '#99d9d9'],
      espn: { sport: 'hockey', league: 'nhl', id: '124292' }, season: { kind: 'nhl', abbrev: 'SEA' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/sea.png', schedule: 'https://www.nhl.com/kraken/schedule',
      club: 'Seattle Kraken', opens: 'early October', wiki: { title: 'Seattle Kraken' },
      news: [ST('kraken'), ['https://soundofhockey.com/feed/', 'Sound Of Hockey'], ['https://www.davyjoneslockerroom.com/rss/current.xml', "Davy Jones' Locker Room"]],
      youtube: ['UCxspiBq2xf5pLjz9_NMjoyw'] }, // @seattlekraken (the NHL's clips come from api-web)
    { slug: 'storm', label: 'Storm', re: /seattle storm/i, sport: 'basketball', venue: 'Climate Pledge Arena', colors: ['#2c5234', '#fee11a'],
      espn: { sport: 'basketball', league: 'wnba', id: '14' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/sea.png', schedule: 'https://storm.wnba.com/schedule/',
      club: 'Seattle Storm', opens: 'May', wiki: { title: 'Seattle Storm' },
      news: [ST('storm')],
      youtube: ['UCv4xLXLA_aElluuaTWXN1jA', 'UCO9a_ryN_l7DIDS-VIt-zmw'] }, // @SeattleStormOfficial, @WNBA
    { slug: 'reign', label: 'Reign', re: /reign fc|seattle reign/i, sport: 'soccer', venue: 'Lumen Field', colors: ['#0a2240', '#c5a05a'],
      espn: { sport: 'soccer', league: 'usa.nwsl', id: '15363' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/15363.png', schedule: 'https://www.reignfc.com/schedule',
      club: 'Seattle Reign', opens: 'March', wiki: { title: 'Seattle Reign FC' },
      news: [ST('reign')],
      youtube: ['UCokzki4ovbASTy0MGok5DpQ', 'UCL4xu08EDu0ZFZsBJUB0chw'] }, // @reignfc, @nwslsoccer
    { slug: 'sounders', label: 'Sounders', re: /sounders/i, sport: 'soccer', venue: 'Lumen Field', colors: ['#236192', '#5d9741'],
      espn: { sport: 'soccer', league: 'usa.1', id: '9726' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/9726.png', schedule: 'https://www.soundersfc.com/schedule/',
      club: 'Seattle Sounders', opens: 'late February', wiki: { title: 'Seattle Sounders FC' },
      news: [ST('sounders'), ['https://www.sounderatheart.com/feed', 'Sounder at Heart']],
      youtube: ['UCVhbRUhe_hfmgi-UN1gcQzw', 'UCSZbXT5TLLW_i-5W8FZpFsg'] }, // @SoundersFC, @MLS
  ];

  // The venues. Keys are the display names the feeds are folded to. Per venue:
  //   area     'town' = the rooms two hours and more down the coast (the
  //            panel's second group); unmarked = the Olympic Peninsula proper,
  //            an hour east of Forks on Highway 101
  //   capacity the Capacity rows' thresholds (the share-code 'cap' bits)
  //   type     the default event type when the feed names none
  //   cssVar   the hue in styles.css (light and dark values live there);
  //            color is the light one for the places that read it directly
  //   url      the room's own events page (the sheet's venue link)
  //   icon     the favicon, through Google's cache
  //   tm       the Ticketmaster venue id and the name test (every page is
  //            read; `match` is a lower-case substring of the venue's TM
  //            name); fallbackUrl when a listing has no link of its own
  //   alias    the other spellings the feeds use for it, folded to this name
  // Ticketmaster has almost nothing out here (2026-10-11: two events, both at
  // Little Creek); the rooms stay on the list because they carry the odd tour
  // date and a fair, and the site's weight is the Teams view.
  var VENUES = {
    // --- The Olympic Peninsula: Sequim, Port Angeles, Port Townsend ---
    '7 Cedars Casino': {
      capacity: 700,
      type: 'concert',
      cssVar: '--v-cedars',
      color: '#86ead9',
      url: 'https://www.7cedars.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.7cedars.com&sz=128',
      tm: { id: 'KovZpa3zXe', match: '7 cedars', fallbackUrl: 'https://www.7cedars.com/' },
      alias: /7 cedars|seven cedars/i,
    },
    'Clallam County Fairgrounds': {
      capacity: 3000,
      type: 'community',
      cssVar: '--v-clallam',
      color: '#c0ea86',
      url: 'https://www.clallamcountyfair.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.clallamcountyfair.com&sz=128',
      tm: { id: 'KovZpa98Ge', match: 'clallam county fairgrounds', fallbackUrl: 'https://www.clallamcountyfair.com/' },
      alias: /clallam county fair/i,
    },
    'Fort Worden': {
      capacity: 1200,
      type: 'concert',
      cssVar: '--v-worden',
      color: '#86a3ea',
      url: 'https://fortworden.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=fortworden.org&sz=128',
      tm: { id: 'KovZ917AhlB', match: 'fort worden', fallbackUrl: 'https://fortworden.org/events/' },
      alias: /fort worden|mccurdy pavilion|wheeler theat/i, // the Wheeler Theater (TM KovZpap9Ie, empty) is a 250-seat room on the same grounds
    },
    'Jefferson County Fairgrounds': {
      capacity: 2000,
      type: 'community',
      cssVar: '--v-jeffco',
      color: '#eabc86',
      url: 'https://www.jeffcofairgrounds.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.jeffcofairgrounds.com&sz=128',
      tm: { id: 'KovZ917At6j', match: 'jefferson county fairgrounds', fallbackUrl: 'https://www.jeffcofairgrounds.com/' },
      alias: /jefferson county fair/i,
    },
    // --- Down the coast: Ocean Shores and Shelton, two hours and more ---
    'Quinault Beach Resort': {
      area: 'town',
      capacity: 500,
      type: 'concert',
      cssVar: '--v-quinault',
      color: '#86c4ea',
      url: 'https://www.quinaultbeachresort.com/entertainment',
      icon: 'https://www.google.com/s2/favicons?domain=www.quinaultbeachresort.com&sz=128',
      tm: { id: 'KovZpZA1tllA', match: 'quinault beach', fallbackUrl: 'https://www.quinaultbeachresort.com/entertainment' },
      alias: /quinault beach/i,
    },
    'Ocean Shores Convention Center': {
      area: 'town',
      capacity: 2000,
      type: 'community',
      cssVar: '--v-osconv',
      color: '#ea86dd',
      url: 'https://www.oceanshoresconventioncenter.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.oceanshoresconventioncenter.com&sz=128',
      tm: { id: 'KovZpZA7enaA', match: 'ocean shores convention', fallbackUrl: 'https://www.oceanshoresconventioncenter.com/' },
      alias: /ocean shores convention/i,
    },
    'Little Creek Casino': {
      area: 'town',
      capacity: 1200,
      type: 'concert',
      cssVar: '--v-littlecreek',
      color: '#ea8686',
      url: 'https://www.little-creek.com/entertainment',
      icon: 'https://www.google.com/s2/favicons?domain=www.little-creek.com&sz=128',
      tm: { id: 'KovZpaG_ee', match: 'little creek', fallbackUrl: 'https://www.little-creek.com/entertainment' }, // Ticketmaster also has a 'Little Creek Casino Resort' (ZFr9jZkvAe), empty; `match` folds its listings here if any appear
      alias: /little creek|skookum creek event/i,
    },
  };

  // The filter panel's starting state: every room on, nothing off.
  var DEFAULT_ON = ['7 Cedars Casino', 'Clallam County Fairgrounds', 'Fort Worden', 'Jefferson County Fairgrounds', 'Quinault Beach Resort', 'Ocean Shores Convention Center', 'Little Creek Casino'];
  var DEFAULT_OFF = [];
  var PREFS_KNOWN_FROM = null; // no default-off venue yet, so nothing for saved prefs to be told about

  // The event types (the panel's Event Type rows; badges.mjs assigns them).
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — casino showrooms to the fair grandstand' },
    { key: 'sports', label: 'Sports', title: 'Rodeo, derbies and the odd exhibition game' },
    { key: 'arts', label: 'Arts & Theater', title: 'Theatre, comedy, dance' },
    { key: 'community', label: 'Community', title: 'The county fairs, festivals, family days' },
  ];
  var MOVIE_VENUE = null; // no cinema here

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 21 slots from the first build: five base-36 digits.
  var CODE_LENGTH = 5;
  var REGISTRY = [
    ['venue', '7 Cedars Casino'], ['venue', 'Clallam County Fairgrounds'], ['venue', 'Fort Worden'], ['venue', 'Jefferson County Fairgrounds'], ['venue', 'Quinault Beach Resort'], ['venue', 'Ocean Shores Convention Center'], ['venue', 'Little Creek Casino'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'seahawks'], ['team', 'mariners'], ['team', 'kraken'], ['team', 'storm'], ['team', 'reign'], ['team', 'sounders'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
  ];

  var WORDS = {
    teamCity: 'Seattle', // the board drops it from the clubs' names ("Seattle Kraken" → Kraken)
    presetDefault: 'Every room — the peninsula and the coast — every team and type',
    presetNeighborhood: 'The Olympic Peninsula rooms only — Sequim, Port Angeles, Port Townsend',
    presetBig: 'Only the places that hold 2,000 or more — the fairgrounds and the convention center',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing the Olympic Peninsula rooms only.', big: 'Showing the big rooms only — the fairgrounds and the convention center.' },
  };

  global.LQACity = {
    key: 'forks',
    name: 'Forks',
    site: 'https://forks.here.events/', // a city-wide site is <city>.here.events (Steve, 2026-10-11); not wired yet — the memory dir's deploy checklist
    userAgent: 'Mozilla/5.0 (compatible; forks-events/1.0; +https://forks.here.events/)',
    tz: 'America/Los_Angeles', tzName: 'Pacific', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    ics: { name: 'Forks Events', short: 'Forks Events', teams: 'Seattle home teams — every season', prodid: '-//here.events//forks-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Forks\\, WA — the Olympic Peninsula rooms and the coast\\, with the Seattle clubs\' seasons' },
    teams: TEAMS,
    venues: VENUES,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
