import type { Article } from '../types';
import { EDITORIAL_PHOTOS } from './editorialPhotos';

type ArchiveStory = Pick<Article, 'slug' | 'title' | 'deck' | 'category' | 'publishedAt' | 'content'>
  & Partial<Pick<Article, 'imageUrl' | 'imageCaption' | 'imageCredit'>>;

const stories: ArchiveStory[] = [
  {
    slug: 'what-a-local-budget-should-tell-residents',
    title: 'What a local budget should tell residents',
    deck: 'A public budget should help people trace a promise from the meeting room to their street.',
    category: 'Politics',
    publishedAt: '2023-11-16T09:00:00Z',
    content: [
      'A resident who wants to know when a market drain will be cleared can find a spending figure and still come away without an answer. The budget may group drainage, road repairs and other works into a single line. The resident needs the location, the planned work and the date they can expect to see progress.',
      'A short project summary beside each major allocation would help. It could identify the community served, the office responsible and the next decision that affects delivery. When a project slips, an updated summary could show what changed and when the next update is due.',
      'It matters whether the money has been proposed, approved, released or spent. A budget that shows those stages gives residents a way to ask the right question at a public meeting. They can ask why work has stalled, when a payment is due or what the assembly plans to do differently next year.',
    ],
  },
  {
    slug: 'how-to-follow-a-campaign-promise',
    title: 'How to follow a campaign promise after polling day',
    deck: 'Keep the original wording, then follow the budget, the timetable and the decisions that turn a pledge into policy.',
    category: 'Politics',
    publishedAt: '2024-08-22T09:00:00Z',
    content: [
      'A campaign promise is easiest to track when you write down the exact words before the election. Save the date and where it was made. If a candidate promises to repair a road, note whether the promise covers the entire road or a particular stretch, and whether it gives a deadline.',
      'After polling day, ask which office has authority to act. A repair might require a budget allocation, a contract and coordination with officials who oversee utilities or adjoining roads. Each decision provides a point in time when residents can ask for a public update.',
      'Keep the record open as plans change. A postponed tender, a revised scope and a completed first phase tell different stories about delivery. A simple timeline with links to the original pledge and subsequent decisions gives readers enough evidence to judge progress for themselves.',
    ],
  },
  {
    ...EDITORIAL_PHOTOS['what-grassroots-football-needs-between-matches'],
    slug: 'what-grassroots-football-needs-between-matches',
    title: 'What grassroots football needs between matches',
    deck: 'A dependable pitch and a predictable fixture list can make the difference between a one-off tournament and a league people return to.',
    category: 'Sports',
    publishedAt: '2024-06-20T09:00:00Z',
    content: [
      'A lively final can bring a neighbourhood together for an afternoon. The harder work begins the following week, when coaches need somewhere to train and players need to know whether Saturday’s match will go ahead. Regular access to a pitch matters as much as the condition of the surface.',
      'A fixture list made in consultation with teams lets players plan around work, school and transport. A pitch schedule can also give girls’ teams and younger age groups reliable practice hours. Giving one person responsibility for communicating changes helps everyone avoid a wasted trip.',
      'Teams and sponsors can judge the season by how many fixtures took place, how many players returned each week and how often someone had to stay home because transport fell through. Those answers can guide spending on the next season, from basic equipment to a shared transport arrangement.',
    ],
  },
  {
    ...EDITORIAL_PHOTOS['what-makes-a-good-live-music-room'],
    slug: 'what-makes-a-good-live-music-room',
    title: 'What makes a good room for live music?',
    deck: 'The details that make a small venue worth returning to, for people on both sides of the stage.',
    category: 'Entertainment',
    publishedAt: '2024-12-12T09:00:00Z',
    content: [
      'At a small gig, the audience is close enough to notice when a singer backs away from the microphone or a drummer softens a beat. Those details come through when the sound is balanced. A sound check with someone listening from the back of the room can reveal problems the band cannot hear from the stage.',
      'A published running order helps people decide when to arrive and how to get home. Clear sightlines, an unobstructed entrance and advance information about seating or steps make the evening easier to plan. These details matter especially for first-time visitors who have never seen the room.',
      'Artists notice how the venue handles the ordinary parts of the booking. A written agreement that covers the fee, set length, equipment and payment date lets each act prepare. When the show ends, a prompt settlement is one of the best reasons to book another date together.',
    ],
  },
  {
    ...EDITORIAL_PHOTOS['what-a-match-report-owes-the-game'],
    slug: 'what-a-match-report-owes-the-game',
    title: 'What a football match report owes the game',
    deck: 'The score settles the result. The report should explain the decisions and moments that shaped it.',
    category: 'Sports',
    publishedAt: '2025-05-15T09:00:00Z',
    content: [
      'A match report usually begins with the score and the decisive goal. From there, the reader wants to know what made the opening possible. Perhaps one side kept sending its full-back forward, or a late substitution gave the other team a quicker route out of defence.',
      'Take notes on where moves begin and which players make room for others. A midfielder who drops to receive under pressure may shape the match without appearing in the highlights. Describing two or three specific passages of play lets readers see how the pattern developed.',
      'A disputed incident also calls for care. Say what you could see from your position, check the official decision and attribute any account you received afterward. That gives the reader a clear picture of both the controversy and the football played on either side of it.',
    ],
  },
  {
    ...EDITORIAL_PHOTOS['how-local-films-find-their-audience'],
    slug: 'how-local-films-find-their-audience',
    title: 'How local films find their audience beyond opening night',
    deck: 'A premiere brings people together once. A wider screening run gives a film time to travel by word of mouth.',
    category: 'Entertainment',
    publishedAt: '2025-09-18T09:00:00Z',
    content: [
      'A premiere can fill a room with friends, collaborators and the people who helped make a film. The next audience may discover it through a campus screening, a local arts centre or a conversation with someone who saw it a week earlier. Each stop needs enough notice for that recommendation to turn into a ticket.',
      'A screening listing should tell people where to go, what it costs, how long the film runs and which subtitles are available. The same information helps a local host plan a discussion around it, while a short trailer and accessible programme notes give audiences a reason to try a film whose cast they may not know.',
      'A longer run gives filmmakers better feedback about when and where people can attend. If an evening slot is quiet but a weekend matinee draws a crowd, the next venue can build on that experience. Over time, a dependable screening calendar helps the audience find the next film as well.',
    ],
  },
];

export const ARCHIVE_STORIES: Article[] = stories.map((story) => ({
  imageUrl: '',
  imageCaption: '',
  imageCredit: '',
  ...story,
  id: `archive-${story.slug}`,
  articleType: 'Opinion',
  status: 'Published',
  featured: false,
  author: { name: 'Critical Eye Editorial', role: 'Editorial' },
  readTime: '2 min read',
  isBlogPost: true,
}));
