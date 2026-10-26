(() => {
  'use strict';

  const heroSection = document.getElementById('fhComedyHero');
  const heroDots = document.getElementById('fhComedyHeroDots');
  const topWatchedTrack = document.getElementById('fhComedyTopWatchedTrack');
  const gridEl = document.getElementById('fhComedyGrid');
  const sortWrap = document.getElementById('fhComedySort');
  const directorTrack = document.getElementById('fhComedyDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = {
    currentHero: 0,
    heroTimer: null,
    activeSort: 'popular'
  };

  const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=900';
  const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2000';

  let COMEDY_MOVIES = [
    { id: 701, title: "The Grand Budapest Hotel", subgenre: "Whimsical Comedy", genres: ["comedy","drama"], views: 48000, release: "2014-03-28", rating: "8.1", runtime: "1h 39m",
      img: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9Ce8JI0Hwwc0AdbNLZUAeKqYU2N.jpg",
      desc: "A legendary concierge and his lobby boy become embroiled in the theft of a priceless painting and a battle over an enormous family fortune.",
      director: "Wes Anderson",
      cast: [
        { name: "Ralph Fiennes", img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Ralph_Fiennes_2011.jpg" },
        { name: "Tony Revolori", img: "" },
        { name: "Saoirse Ronan", img: "https://upload.wikimedia.org/wikipedia/commons/8/87/Saoirse_Ronan_in_2019.jpg" }
      ],
      language: "EN" },
    { id: 702, title: "Superbad", subgenre: "Teen Comedy", genres: ["comedy"], views: 46000, release: "2007-08-17", rating: "7.6", runtime: "1h 53m",
      img: "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8g3i2av6O2r4aJmHCqE7wZ0Kd3V.jpg",
      desc: "Two high school friends plan one last night of partying before they graduate and go their separate ways.",
      director: "Greg Mottola",
      cast: [
        { name: "Jonah Hill", img: "https://upload.wikimedia.org/wikipedia/commons/1/13/Jonah_Hill-4936.jpg" },
        { name: "Michael Cera", img: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Michael_Cera_at_SXSW_2018_%28cropped%29.jpg" },
        { name: "Emma Stone", img: "https://upload.wikimedia.org/wikipedia/commons/3/32/Emma_Stone_at_the_2024_New_York_Film_Festival_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 703, title: "The Big Lebowski", subgenre: "Cult Comedy", genres: ["comedy","crime"], views: 44000, release: "1998-03-06", rating: "8.1", runtime: "1h 57m",
      img: "https://image.tmdb.org/t/p/w500/9mprbw31MGdd66LR0AQKoDMoFRv.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/4UxNx1WqQ5o7IBlZLaLwJ4FxAEx.jpg",
      desc: "Jeff 'The Dude' Lebowski, a Los Angeles slacker, is mistaken for a millionaire and becomes entangled in a kidnapping case.",
      director: "Joel & Ethan Coen",
      cast: [
        { name: "Jeff Bridges", img: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Jeff_Bridges_by_Gage_Skidmore_2.jpg" },
        { name: "John Goodman", img: "https://upload.wikimedia.org/wikipedia/commons/c/cd/John_Goodman_2014.jpg" },
        { name: "Julianne Moore", img: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Julianne_Moore_2018.jpg" }
      ],
      language: "EN" },
    { id: 704, title: "Anchorman: The Legend of Ron Burgundy", subgenre: "Satirical Comedy", genres: ["comedy"], views: 43000, release: "2004-07-09", rating: "7.1", runtime: "1h 34m",
      img: "https://image.tmdb.org/t/p/w500/h2JqLZSmwqo7IBlZLaLwJ4FxAEx.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
      desc: "A 1970s San Diego news anchor's world is turned upside down when a female reporter joins the all-male news team.",
      director: "Adam McKay",
      cast: [
        { name: "Will Ferrell", img: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Will_Ferrell_2013.jpg" },
        { name: "Christina Applegate", img: "" },
        { name: "Paul Rudd", img: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Paul_Rudd_2018.jpg" }
      ],
      language: "EN" },
    { id: 705, title: "Groundhog Day", subgenre: "Time-Loop Comedy", genres: ["comedy","fantasy","romance"], views: 45000, release: "1993-02-12", rating: "8.0", runtime: "1h 41m",
      img: "https://image.tmdb.org/t/p/w500/2Rl5BWTEyQ1XlRkpHqLmDdqxLQh.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/qCD9Hk3gO4iV5P6YqKZl5WV3cHk.jpg",
      desc: "A cynical TV weatherman finds himself reliving the same day over and over again when he goes on location to cover the annual Groundhog Day event.",
      director: "Harold Ramis",
      cast: [
        { name: "Bill Murray", img: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Bill_Murray_2014.jpg" },
        { name: "Andie MacDowell", img: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Andie_MacDowell_2015.jpg" },
        { name: "Chris Elliott", img: "" }
      ],
      language: "EN" },
    { id: 706, title: "Knives Out", subgenre: "Mystery Comedy", genres: ["comedy","crime","mystery"], views: 47000, release: "2019-11-27", rating: "7.9", runtime: "2h 10m",
      img: "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6uV1G0wLj0LdXEWRn5znJ7z2nBv.jpg",
      desc: "A detective investigates the death of a patriarch of an eccentric, combative family after his 85th birthday party.",
      director: "Rian Johnson",
      cast: [
        { name: "Daniel Craig", img: "https://upload.wikimedia.org/wikipedia/commons/1/12/Daniel_Craig_2019.jpg" },
        { name: "Ana de Armas", img: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Ana_de_Armas_2018.jpg" },
        { name: "Chris Evans", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/Chris_Evans_at_the_2020_Sundance_Film_Festival.jpg" }
      ],
      language: "EN" },
    { id: 707, title: "Step Brothers", subgenre: "Buddy Comedy", genres: ["comedy"], views: 39000, release: "2008-07-25", rating: "6.9", runtime: "1h 38m",
      img: "https://image.tmdb.org/t/p/w500/nvz3Uw7Ck4Nf3sV3aB7rL6hX0Yt.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/jXy4m7cW9LZ0jGk7cW5rT8nZ2sV.jpg",
      desc: "Two aimless middle-aged men still living at home are forced to become step-brothers when their parents marry.",
      director: "Adam McKay", cast: ["Will Ferrell","John C. Reilly","Mary Steenburgen"], language: "EN" },
    { id: 708, title: "Deadpool", subgenre: "Superhero Comedy", genres: ["comedy","action"], views: 50000, release: "2016-02-12", rating: "8.0", runtime: "1h 48m",
      img: "https://image.tmdb.org/t/p/w500/inVq3FRqcYIRl2la8iZCKdgL07k.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/en971MEXui9diirXlogOrPKVMYI.jpg",
      desc: "A wisecracking mercenary gets experimental treatments for cancer that leave him with accelerated healing powers and a twisted sense of humor.",
      director: "Tim Miller", cast: ["Ryan Reynolds","Morena Baccarin","T.J. Miller"], language: "EN" },
    { id: 709, title: "The Hangover", subgenre: "Buddy Comedy", genres: ["comedy"], views: 42000, release: "2009-06-05", rating: "7.7", runtime: "1h 40m",
      img: "https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63X9VHCLWDAYP.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9XjTl6d3tQ0H6a7nkwM8U4Td6WG.jpg",
      desc: "Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the bachelor missing.",
      director: "Todd Phillips", cast: ["Bradley Cooper","Ed Helms","Zach Galifianakis"], language: "EN" },
    { id: 710, title: "Borat", subgenre: "Mockumentary", genres: ["comedy"], views: 36000, release: "2006-11-03", rating: "7.4", runtime: "1h 24m",
      img: "https://image.tmdb.org/t/p/w500/kfXdP7vEPn4t4Md3zTk3F9D4T7L.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/qXnL3L3p8bXmHF3Tk7L0bT9L4s.jpg",
      desc: "Kazakhstani TV reporter Borat travels across the US to make a documentary, offending nearly everyone he meets.",
      director: "Larry Charles", cast: ["Sacha Baron Cohen","Ken Davitian","Luenell"], language: "EN" },
    { id: 711, title: "Bridesmaids", subgenre: "Female-Led Comedy", genres: ["comedy","romance"], views: 35000, release: "2011-05-13", rating: "6.8", runtime: "2h 5m",
      img: "https://image.tmdb.org/t/p/w500/5Q4oL4mZk8lF4pV7nF5j7T2vT5H.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8bX4sT9L7WzN5vGk8mF3tW2zQ9X.jpg",
      desc: "Competition between the maid of honor and a bridesmaid over who is the bride's best friend escalates in unexpected ways.",
      director: "Paul Feig", cast: ["Kristen Wiig","Maya Rudolph","Rose Byrne"], language: "EN" },
    { id: 712, title: "Ghostbusters", subgenre: "Supernatural Comedy", genres: ["comedy","fantasy","action"], views: 41000, release: "1984-06-08", rating: "7.8", runtime: "1h 45m",
      img: "https://image.tmdb.org/t/p/w500/7CB33kEM2B7ZBq5Uv3d7w6B9kZP.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9nBVY7zB3mZ8kF2pL6vW5tH4nJq.jpg",
      desc: "Three parapsychologists start a ghost-catching business in New York City and uncover a supernatural conspiracy.",
      director: "Ivan Reitman", cast: ["Bill Murray","Dan Aykroyd","Harold Ramis"], language: "EN" },
    { id: 713, title: "Monty Python and the Holy Grail", subgenre: "Sketch Comedy", genres: ["comedy","adventure","fantasy"], views: 38000, release: "1975-05-25", rating: "8.2", runtime: "1h 31m",
      img: "https://image.tmdb.org/t/p/w500/7jFd4K9L3sT5V0p8Wk2rQ6nX9Fb.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8kM3pT7W9sL5vQ2nF6tB4jW0zHr.jpg",
      desc: "King Arthur and his Knights of the Round Table embark on a surreal search for the Holy Grail.",
      director: "Terry Gilliam & Terry Jones", cast: ["Graham Chapman","John Cleese","Terry Gilliam"], language: "EN" },
    { id: 714, title: "Airplane!", subgenre: "Parody Comedy", genres: ["comedy"], views: 37000, release: "1980-07-02", rating: "7.7", runtime: "1h 28m",
      img: "https://image.tmdb.org/t/p/w500/3zE4qT1W9sB5vN2kF8wQ6nH7zLb.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/5tW2nL9sV7bQ4kF3mT8pW2rJ9Xz.jpg",
      desc: "A former pilot must overcome his fear of flying when the crew of his flight falls ill from food poisoning.",
      director: "Jim Abrahams, David Zucker, Jerry Zucker", cast: ["Robert Hays","Julie Hagerty","Leslie Nielsen"], language: "EN" },
    { id: 715, title: "This Is Spinal Tap", subgenre: "Mockumentary", genres: ["comedy","music"], views: 32000, release: "1984-03-02", rating: "7.9", runtime: "1h 22m",
      img: "https://image.tmdb.org/t/p/w500/7XzL3pT9sV5nQ2kF8mW6tH4rJ1b.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9kF3mT7sV5nQ2pL6wH4rB8jW0zJ.jpg",
      desc: "A rockumentary following the fictional heavy metal band Spinal Tap on their disastrous American tour.",
      director: "Rob Reiner", cast: ["Christopher Guest","Michael McKean","Harry Shearer"], language: "EN" },
    { id: 716, title: "The 40-Year-Old Virgin", subgenre: "Romantic Comedy", genres: ["comedy","romance"], views: 34000, release: "2005-08-19", rating: "7.1", runtime: "1h 56m",
      img: "https://image.tmdb.org/t/p/w500/7sF4K9L3T5V0p8Wk2rQ6nX9Fb5T.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8mT3pL7W9sV5nQ2kF6wB4jH0rJz.jpg",
      desc: "Goaded by his buddies, a nerdy guy who's never 'done the deed' only finds the pressure mounting when he meets a single mother.",
      director: "Judd Apatow", cast: ["Steve Carell","Catherine Keener","Paul Rudd"], language: "EN" },
    { id: 717, title: "Mean Girls", subgenre: "Teen Comedy", genres: ["comedy"], views: 40000, release: "2004-04-30", rating: "7.1", runtime: "1h 37m",
      img: "https://image.tmdb.org/t/p/w500/6iZ3K9L5sT7V2p0Wk4rQ8nX3Fb1.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7nF3mT9sV5kQ2pL6wH4rB8jW0zJ1.jpg",
      desc: "A young girl is thrown into the wild world of high school cliques when she moves from Africa to Illinois.",
      director: "Mark Waters", cast: ["Lindsay Lohan","Rachel McAdams","Tina Fey"], language: "EN" },
    { id: 718, title: "Legally Blonde", subgenre: "Romantic Comedy", genres: ["comedy","romance"], views: 38000, release: "2001-07-13", rating: "6.5", runtime: "1h 36m",
      img: "https://image.tmdb.org/t/p/w500/5zF4K8L2sT6V1p9Wk3rQ7nX0Fb4.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6mF2nT8sV4kQ1pL5wH3rB7jW9zJ0.jpg",
      desc: "Elle Woods, a fashionable sorority queen, is dumped by her boyfriend and decides to follow him to law school.",
      director: "Robert Luketic", cast: ["Reese Witherspoon","Luke Wilson","Selma Blair"], language: "EN" },
    { id: 719, title: "Clueless", subgenre: "Teen Comedy", genres: ["comedy","romance"], views: 36000, release: "1995-07-19", rating: "6.9", runtime: "1h 37m",
      img: "https://image.tmdb.org/t/p/w500/4yF3K7L1sT5V0p8Wk2rQ6nX9Fb3.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/5mE2nT8sV4kQ1pL5wH3rB7jW9zJ1.jpg",
      desc: "A rich high school student tries to boost a new pupil's popularity but reckons without affairs of the heart getting in the way.",
      director: "Amy Heckerling", cast: ["Alicia Silverstone","Brittany Murphy","Paul Rudd"], language: "EN" },
    { id: 720, title: "Zoolander", subgenre: "Satirical Comedy", genres: ["comedy"], views: 33000, release: "2001-09-28", rating: "6.5", runtime: "1h 29m",
      img: "https://image.tmdb.org/t/p/w500/3zF4K8L2sT6V1p9Wk3rQ7nX0Fb2.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/4mF2nT8sV4kQ1pL5wH3rB7jW9zJ2.jpg",
      desc: "A dim-witted male model is brainwashed to assassinate the Prime Minister of Malaysia, but his friends try to stop him.",
      director: "Ben Stiller", cast: ["Ben Stiller","Owen Wilson","Christine Taylor"], language: "EN" },
    { id: 721, title: "Shaun of the Dead", subgenre: "Horror Comedy", genres: ["comedy","horror"], views: 35000, release: "2004-04-09", rating: "7.9", runtime: "1h 39m",
      img: "https://image.tmdb.org/t/p/w500/2zF4K8L2sT6V1p9Wk3rQ7nX0Fb1.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/3mF2nT8sV4kQ1pL5wH3rB7jW9zJ3.jpg",
      desc: "A man decides to turn his moribund life around by winning back his ex-girlfriend and reconciling with his mother while dealing with a zombie apocalypse.",
      director: "Edgar Wright", cast: ["Simon Pegg","Nick Frost","Kate Ashfield"], language: "EN" },
    { id: 722, title: "Hot Fuzz", subgenre: "Buddy Cop Comedy", genres: ["comedy","action","crime"], views: 37000, release: "2007-02-14", rating: "7.8", runtime: "2h 1m",
      img: "https://image.tmdb.org/t/p/w500/1zF4K8L2sT6V1p9Wk3rQ7nX0Fb0.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/2mF2nT8sV4kQ1pL5wH3rB7jW9zJ4.jpg",
      desc: "A skilled London police officer is transferred to a small town with a dark secret.",
      director: "Edgar Wright", cast: ["Simon Pegg","Nick Frost","Jim Broadbent"], language: "EN" },
    { id: 723, title: "What We Do in the Shadows", subgenre: "Mockumentary", genres: ["comedy","horror"], views: 31000, release: "2014-02-13", rating: "7.6", runtime: "1h 26m",
      img: "https://image.tmdb.org/t/p/w500/0zF4K8L2sT6V1p9Wk3rQ7nX0Fb9.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/1mF2nT8sV4kQ1pL5wH3rB7jW9zJ5.jpg",
      desc: "A documentary team follows the nightly lives of a group of vampires living together in a flat in Wellington.",
      director: "Taika Waititi & Jemaine Clement", cast: ["Taika Waititi","Jemaine Clement","Jonathan Brugh"], language: "EN" },
    { id: 724, title: "Napoleon Dynamite", subgenre: "Quirky Comedy", genres: ["comedy"], views: 29000, release: "2004-08-27", rating: "6.9", runtime: "1h 36m",
      img: "https://image.tmdb.org/t/p/w500/9yF4K8L2sT6V1p9Wk3rQ7nX0Fb8.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/0mF2nT8sV4kQ1pL5wH3rB7jW9zJ6.jpg",
      desc: "A listless and alienated teenager decides to help his new friend win the class presidency in their small town high school.",
      director: "Jared Hess", cast: ["Jon Heder","Efren Ramirez","Jon Gries"], language: "EN" },
    { id: 725, title: "Dumb and Dumber", subgenre: "Buddy Comedy", genres: ["comedy"], views: 34000, release: "1994-12-16", rating: "7.3", runtime: "1h 47m",
      img: "https://image.tmdb.org/t/p/w500/8yF4K8L2sT6V1p9Wk3rQ7nX0Fb7.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9mF2nT8sV4kQ1pL5wH3rB7jW9zJ7.jpg",
      desc: "Two dim-witted friends take a cross-country trip to return a briefcase full of money to its rightful owner.",
      director: "Peter Farrelly", cast: ["Jim Carrey","Jeff Daniels","Lauren Holly"], language: "EN" },
    { id: 726, title: "National Lampoon's Vacation", subgenre: "Road Comedy", genres: ["comedy","adventure"], views: 30000, release: "1983-07-29", rating: "7.4", runtime: "1h 38m",
      img: "https://image.tmdb.org/t/p/w500/7yF4K8L2sT6V1p9Wk3rQ7nX0Fb6.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8mF2nT8sV4kQ1pL5wH3rB7jW9zJ8.jpg",
      desc: "The Griswold family's cross-country drive to the Walley World theme park proves to be much more arduous than they ever anticipated.",
      director: "Harold Ramis", cast: ["Chevy Chase","Beverly D'Angelo","Imogene Coca"], language: "EN" },
    { id: 727, title: "Trading Places", subgenre: "Satirical Comedy", genres: ["comedy"], views: 32000, release: "1983-06-08", rating: "7.5", runtime: "1h 56m",
      img: "https://image.tmdb.org/t/p/w500/6yF4K8L2sT6V1p9Wk3rQ7nX0Fb5.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7mF2nT8sV4kQ1pL5wH3rB7jW9zJ9.jpg",
      desc: "A snobbish investor and a wily street con artist find their positions reversed as part of a bet by two callous millionaires.",
      director: "John Landis", cast: ["Eddie Murphy","Dan Aykroyd","Jamie Lee Curtis"], language: "EN" },
    { id: 728, title: "Coming to America", subgenre: "Romantic Comedy", genres: ["comedy","romance"], views: 33000, release: "1988-06-29", rating: "7.0", runtime: "1h 57m",
      img: "https://image.tmdb.org/t/p/w500/5yF4K8L2sT6V1p9Wk3rQ7nX0Fb4.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6mF2nT8sV4kQ1pL5wH3rB7jW9zK0.jpg",
      desc: "An African prince goes to Queens, New York City to find a wife whom he can respect for her intelligence and will.",
      director: "John Landis", cast: ["Eddie Murphy","Arsenio Hall","James Earl Jones"], language: "EN" },
    { id: 729, title: "Best in Show", subgenre: "Mockumentary", genres: ["comedy"], views: 28000, release: "2000-09-29", rating: "7.4", runtime: "1h 30m",
      img: "https://image.tmdb.org/t/p/w500/4yF4K8L2sT6V1p9Wk3rQ7nX0Fb3.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/5mF2nT8sV4kQ1pL5wH3rB7jW9zK1.jpg",
      desc: "A behind-the-scenes look at the colorful and eccentric owners and handlers competing at a prestigious dog show.",
      director: "Christopher Guest", cast: ["Christopher Guest","Parker Posey","Michael McKean"], language: "EN" },
    { id: 730, title: "Wayne's World", subgenre: "Buddy Comedy", genres: ["comedy","music"], views: 31000, release: "1992-02-14", rating: "7.0", runtime: "1h 34m",
      img: "https://image.tmdb.org/t/p/w500/3yF4K8L2sT6V1p9Wk3rQ7nX0Fb2.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/4mF2nT8sV4kQ1pL5wH3rB7jW9zK2.jpg",
      desc: "Two slacker friends try to promote their public-access cable show while dealing with a shady sponsor.",
      director: "Penelope Spheeris", cast: ["Mike Myers","Dana Carvey","Rob Lowe"], language: "EN" }
  ];

  const HERO_IDS = [701, 702, 703, 704, 705, 706];
  const HERO_MOVIES = HERO_IDS.map(id => COMEDY_MOVIES.find(m => m.id === id)).filter(Boolean);

  const DIRECTORS = [
    { name: "Wes Anderson",        films: "The Grand Budapest Hotel · Rushmore", tag: "Whimsical Auteur" },
    { name: "Joel & Ethan Coen",   films: "The Big Lebowski · Raising Arizona",  tag: "Dark Comedy" },
    { name: "Harold Ramis",        films: "Groundhog Day · Vacation",            tag: "Comedy Legend" },
    { name: "Adam McKay",          films: "Anchorman · Step Brothers",           tag: "Improvised Chaos" },
    { name: "Edgar Wright",        films: "Shaun of the Dead · Hot Fuzz",        tag: "Genre Blender" },
    { name: "Judd Apatow",         films: "The 40-Year-Old Virgin · Superbad",   tag: "Modern American" },
    { name: "Rian Johnson",        films: "Knives Out",                          tag: "Mystery + Wit" },
    { name: "John Landis",         films: "Trading Places · Coming to America",  tag: "80s Icon" },
    { name: "Taika Waititi",       films: "What We Do in the Shadows",           tag: "Deadpan Genius" },
    { name: "Christopher Guest",   films: "Best in Show · Spinal Tap",           tag: "Mockumentary King" }
  ];

  function initialsOf(name) {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/);
    let out = '';
    for (const p of parts) { if (p) out += p[0]; if (out.length >= 2) break; }
    return out.toUpperCase();
  }
  function castName(c) { return typeof c === 'string' ? c : (c && c.name) || ''; }
  function castImg(c) { return typeof c === 'object' && c && c.img ? c.img : ''; }
  function castAvatarHTML(c, large) {
    const cls = large ? 'fh-hero__cast-avatar' : 'fh-drawer__cast-avatar';
    const name = castName(c);
    const img = castImg(c);
    if (img) {
      return `<div class="${cls} ${cls}--photo"><img src="${img}" alt="${name}" loading="lazy" draggable="false" onerror="this.style.display='none';this.parentElement.textContent='${initialsOf(name)}';this.parentElement.classList.remove('${cls}--photo');"></div>`;
    }
    return `<div class="${cls}">${initialsOf(name)}</div>`;
  }

  function initHero() {
    HERO_MOVIES.forEach((m, i) => {
      const castHTML = m.cast.map(c => `
        <div class="fh-hero__cast-member">
          ${castAvatarHTML(c, 'large')}
          <div class="fh-hero__cast-name">${castName(c)}</div>
        </div>`).join('');

      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg">
          <img src="${m.backdrop}" alt="${m.title}" onerror="this.onerror=null;this.src='${FALLBACK_BACKDROP}';">
        </div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">${i === 0 ? 'Comedy Spotlight' : 'Featured Comedy'}</span>
            <h1 class="fh-hero__title">${m.title}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--rating"><i class="fas fa-star"></i> ${m.rating}</span>
              <span class="fh-hero__pill"><i class="fas fa-calendar"></i> ${m.release.slice(0,4)}</span>
              <span class="fh-hero__pill"><i class="fas fa-clock"></i> ${m.runtime}</span>
              <span class="fh-hero__pill">${m.subgenre}</span>
              <span class="fh-hero__pill fh-hero__pill--laugh"><i class="fas fa-face-laugh-squint"></i> LAUGH OUT LOUD</span>
              <span class="fh-hero__pill fh-hero__pill--hd">HD</span>
            </div>
            <p class="fh-hero__desc">${m.desc}</p>
            <div class="fh-hero__cast hide-scrollbar">${castHTML}</div>
            <div class="fh-hero__actions">
              <button class="fh-hero__btn fh-hero__btn--primary" data-open="${m.id}">
                <i class="fas fa-play"></i> Watch Now
              </button>
              <button class="fh-hero__btn fh-hero__btn--ghost" data-open="${m.id}">
                <i class="fas fa-circle-info"></i> More Info
              </button>
            </div>
          </div>
        </div>`;
      heroSection.appendChild(slide);

      const dot = document.createElement('div');
      dot.className = 'fh-hero__dot' + (i === 0 ? ' is-active' : '');
      dot.addEventListener('click', () => showHeroSlide(i));
      heroDots.appendChild(dot);
    });

    heroSection.addEventListener('click', e => {
      const btn = e.target.closest('[data-open]');
      if (btn) openMovieDetails(Number(btn.dataset.open));
    });

    state.heroTimer = setInterval(() => showHeroSlide((state.currentHero + 1) % HERO_MOVIES.length), 6500);
  }

  function showHeroSlide(index) {
    const slides = heroSection.querySelectorAll('.fh-hero__slide');
    const dots = heroDots.querySelectorAll('.fh-hero__dot');
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => {
      d.classList.remove('is-active');
      if (i === index) { void d.offsetWidth; d.classList.add('is-active'); }
    });
    state.currentHero = index;
  }

  function initTopWatched() {
    const items = [...COMEDY_MOVIES].sort((a,b) => b.views - a.views).slice(0, 14);
    const html = items.map(m => `
      <div class="fh-marquee__card" data-open="${m.id}">
        <img src="${m.img}" alt="${m.title}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${m.title}</h3>
          <div class="fh-marquee__meta">
            <span>${m.release.slice(0,4)}</span>
            <span>·</span>
            <span>${m.subgenre}</span>
          </div>
        </div>
      </div>`).join('');
    topWatchedTrack.className = 'fh-marquee__track';
    topWatchedTrack.innerHTML = html + html;
    attachHandlers(topWatchedTrack);
  }

  function initGrid() {
    renderGrid(state.activeSort);
    if (sortWrap) {
      sortWrap.addEventListener('click', e => {
        const btn = e.target.closest('.fh-comedy-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-comedy-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...COMEDY_MOVIES];
    if (sortKey === 'popular') list.sort((a,b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a,b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a,b) => a.title.localeCompare(b.title));
    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);
    const cards = gridEl.querySelectorAll('.fh-comedy-card');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('is-visible'), delay);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    cards.forEach((c, i) => { c.dataset.delay = String((i % 5) * 60); obs.observe(c); });
  }

  function renderCard(m) {
    return `
      <article class="fh-comedy-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${m.title}">
        <span class="fh-comedy-card__subgenre">${m.subgenre}</span>
        <span class="fh-comedy-card__funny">LAUGH</span>
        <div class="fh-comedy-card__media">
          <img src="${m.img}" alt="${m.title}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
          <span class="fh-comedy-card__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        </div>
        <div class="fh-comedy-card__body">
          <h3 class="fh-comedy-card__title">${m.title}</h3>
          <div class="fh-comedy-card__meta">
            <span>${m.release.slice(0,4)}</span>
            <span>${m.genres[0].toUpperCase()}</span>
          </div>
        </div>
      </article>`;
  }

  function attachHandlers(container) {
    container.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', () => openMovieDetails(Number(el.dataset.open)));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMovieDetails(Number(el.dataset.open));
        }
      });
    });
  }

  function initDirectors() {
    const html = DIRECTORS.map(d => {
      const initials = initialsOf(d.name);
      return `
        <div class="fh-comedy-director-card">
          <div class="fh-comedy-director-card__avatar">${initials}</div>
          <div class="fh-comedy-director-card__body">
            <div class="fh-comedy-director-card__name">${d.name}</div>
            <div class="fh-comedy-director-card__films">${d.films}</div>
            <span class="fh-comedy-director-card__tag"><i class="fas fa-face-laugh"></i> ${d.tag}</span>
          </div>
        </div>`;
    }).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = COMEDY_MOVIES.find(x => x.id === movieId);
    if (!m) return;
    const related = COMEDY_MOVIES.filter(x => x.id !== m.id && x.genres.some(g => m.genres.includes(g))).slice(0, 6);

    drawerBody.innerHTML = `
      <div class="fh-drawer__hero">
        <img src="${m.backdrop}" alt="${m.title}" onerror="this.onerror=null;this.src='${FALLBACK_BACKDROP}';">
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${m.title}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${m.rating}</span>
            <span><i class="fas fa-calendar"></i> ${m.release}</span>
            <span><i class="fas fa-clock"></i> ${m.runtime}</span>
            <span><i class="fas fa-globe"></i> ${m.language}</span>
            <span><i class="fas fa-face-laugh"></i> ${m.subgenre}</span>
          </div>
          <div class="fh-drawer__actions">
            <button class="fh-drawer__btn fh-drawer__btn--primary"><i class="fas fa-play"></i> Watch Now</button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost"><i class="fas fa-film"></i> Trailer</button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost" aria-label="Add to list"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
      <div class="fh-drawer__content">
        <div>
          <h3 class="fh-drawer__section-title">Overview</h3>
          <p class="fh-drawer__desc">${m.desc}</p>
          <h3 class="fh-drawer__section-title">Top Cast</h3>
          <div class="fh-drawer__cast hide-scrollbar">
            ${m.cast.map(c => `<div class="fh-drawer__cast-member">${castAvatarHTML(c)}<div class="fh-drawer__cast-name">${castName(c)}</div></div>`).join('')}
          </div>
        </div>
        <div class="fh-drawer__info-card">
          <h3 class="fh-drawer__section-title">Details</h3>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Director</span><span class="fh-drawer__info-value">${m.director}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Release</span><span class="fh-drawer__info-value">${m.release}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Genres</span><span class="fh-drawer__info-value">${m.genres.join(', ')}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Language</span><span class="fh-drawer__info-value">${m.language}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Views</span><span class="fh-drawer__info-value">${m.views.toLocaleString()}</span></div>
        </div>
      </div>
      <div class="fh-drawer__content" style="grid-template-columns:1fr;padding-top:0">
        <div>
          <h3 class="fh-drawer__section-title">More Like This</h3>
          <div class="fh-marquee__track" id="fhComedyDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhComedyDrawerRelated');
    rel.innerHTML = related.map(r => `
      <div class="fh-marquee__card" data-open="${r.id}" style="flex:0 0 auto">
        <img src="${r.img}" alt="${r.title}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${r.rating}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${r.title}</h3>
          <div class="fh-marquee__meta"><span>${r.release.slice(0,4)}</span></div>
        </div>
      </div>`).join('');
    attachHandlers(rel);

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function initDrawer() {
    if (!drawer) return;
    drawer.querySelectorAll('[data-drawer-close]').forEach(el => el.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  function initSearch() {
    const searchWrap = document.getElementById('fhSearchWrap');
    const searchInput = document.getElementById('fhSearchInput');
    const searchResults = document.getElementById('fhSearchResults');
    if (!searchWrap || !searchInput) return;
    const openResults = () => searchWrap.classList.add('is-open');
    const closeResults = () => searchWrap.classList.remove('is-open');

    function render(list, q) {
      if (!list.length) { searchResults.innerHTML = `<div class="fh-search-results__empty">No results for "${q}"</div>`; return; }
      searchResults.innerHTML = list.map(m => `
        <div class="fh-search-results__item" data-open="${m.id}">
          <img src="${m.img}" alt="${m.title}" onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
          <div class="fh-search-results__info">
            <div class="fh-search-results__title">${m.title}</div>
            <div class="fh-search-results__meta">${m.release.slice(0,4)} · ${m.subgenre}</div>
            <div class="fh-search-results__meta">★ ${m.rating}</div>
          </div>
        </div>`).join('');
      attachHandlers(searchResults);
      searchResults.querySelectorAll('[data-open]').forEach(el => {
        el.addEventListener('click', () => { closeResults(); searchInput.blur(); });
      });
    }
    function query(q) {
      const s = q.toLowerCase();
      return COMEDY_MOVIES.filter(m =>
        m.title.toLowerCase().includes(s) ||
        m.genres.some(g => g.includes(s)) ||
        m.director.toLowerCase().includes(s) ||
        m.cast.some(c => castName(c).toLowerCase().includes(s))
      ).slice(0, 12);
    }
    searchInput.addEventListener('focus', () => {
      openResults();
      const q = searchInput.value.trim();
      if (!q) render(COMEDY_MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(COMEDY_MOVIES.slice(0, 6), 'popular'); return; }
      render(query(q), q);
    });
    document.addEventListener('click', e => { if (!searchWrap.contains(e.target)) closeResults(); });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); searchInput.focus(); searchInput.select();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur(); closeResults();
      }
    });
  }

  function initSideCount() {
    if (sideCountEl) sideCountEl.textContent = COMEDY_MOVIES.length + '+';
  }

  function init() {
    initHero();
    initTopWatched();
    initGrid();
    initDirectors();
    initDrawer();
    initSearch();
    initSideCount();
  }

  async function loadBackendCatalog() {
    try {
      if (!window.FHApi || !window.FHApi.catalog) return;
      var category = 'movies';
      if (category === '__PATH__') {
        category = window.location.pathname.indexOf('tv-shows') !== -1 ? 'tv-shows' : 'movies';
      }
      var rows = await window.FHApi.catalog(category === 'all' ? null : category);
      if (Array.isArray(rows) && rows.length) COMEDY_MOVIES = rows;
    } catch (e) {
      console.warn('Fan Hub backend catalog fallback:', e);
    }
  }

  async function boot() {
    await loadBackendCatalog();
    init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();