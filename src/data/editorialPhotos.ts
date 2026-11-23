const commons = 'https://commons.wikimedia.org/wiki/File:';
const shareAlike = 'https://creativecommons.org/licenses/by-sa/4.0/';

export const EDITORIAL_PHOTOS = {
  'what-grassroots-football-needs-between-matches': {
    imageUrl: '/images/labadi-football-park.jpg',
    imageCaption: 'A community football pitch in La, Accra.',
    imageCredit: 'Kwabenabaop',
    category: 'Sports',
    source: commons + 'Labadi_Football_Park.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: shareAlike,
  },
  'what-a-match-report-owes-the-game': {
    imageUrl: '/images/accra-street-football.jpg',
    imageCaption: 'Players compete for the ball in a street football match in Accra.',
    imageCredit: 'Okero Nyagaka',
    category: 'Sports',
    source: commons + 'Accra_Street_Football.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: shareAlike,
  },
  'what-makes-a-good-live-music-room': {
    imageUrl: '/images/trigmatic-live-in-accra.jpg',
    imageCaption: 'Trigmatic performs at Alliance Française in Accra in 2019.',
    imageCredit: 'Akilnathan Logeswaran',
    category: 'Entertainment',
    source: commons + 'Concert_in_Accra,_Alliance_Francaise.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: shareAlike,
  },
  'how-local-films-find-their-audience': {
    imageUrl: '/images/movie-theater-seats.jpg',
    imageCaption: 'Rows of seats in a cinema.',
    imageCredit: 'Elijah Flores',
    category: 'Entertainment',
    source: commons + 'Movie_theater_seats_(Unsplash).jpg',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
};

export const EDITORIAL_PHOTO_LIBRARY = Object.values(EDITORIAL_PHOTOS);
