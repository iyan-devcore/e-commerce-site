/**
 * Improved lexicon-based sentiment analyzer.
 * Handles typos/common misspellings and gives stronger weight to star ratings.
 */

const POSITIVE_WORDS = new Set([
    // Core positives
    'good','great','excellent','amazing','awesome','fantastic','wonderful','best',
    'perfect','love','loved','like','liked','happy','pleased','satisfied',
    'outstanding','superb','brilliant','incredible','top','recommend','recommended',
    'quality','fast','quick','smooth','easy','nice','beautiful','impressive',
    'reliable','durable','helpful','value','affordable','worth','sturdy',
    'exceptional','delightful','premium','comfortable','efficient','accurate',
    'solid','clean','responsive','flawless','gorgeous','elegant',
    // Extended
    'fabulous','magnificent','marvelous','phenomenal','spectacular','tremendous',
    'terrific','superb','stellar','splendid','proud','thrilled','excited',
    'convenient','innovative','powerful','sleek','stylish','lightweight',
    'well','better','best','improved','upgrade',
]);

const POSITIVE_TYPOS = new Map([
    ['vary',   'very'],   // "vary good" → treated as "very good"
    ['realy',  'really'],
    ['reall',  'really'],
    ['amazng',  'amazing'],
    ['awsome',  'awesome'],
    ['excelent','excellent'],
    ['perfet',  'perfect'],
    ['beutiful','beautiful'],
    ['wonderfull','wonderful'],
    ['hapyy',  'happy'],
    ['lovly',  'lovely'],
    ['greate', 'great'],
    ['favourit','favourite'],
    ['pritty', 'pretty'],
    ['nicee',  'nice'],
]);

const NEGATIVE_WORDS = new Set([
    'bad','terrible','awful','horrible','worst','hate','hated','dislike','disliked',
    'disappointed','disappointing','poor','broken','defective','cheap','useless',
    'slow','difficult','hard','ugly','boring','annoying','frustrating','waste',
    'overpriced','expensive','fake','damaged','refund','return','stopped','failed',
    'problem','issue','never','wrong','missing','late','delay','delayed',
    'fragile','flimsy','uncomfortable','unreliable','inaccurate','dirty','loose',
    'cracked','scratched','defect','faulty','stuck','unstable','unusable','inferior',
    'broke','breaking','disappoint','scam','misleading','fraud','refunded',
    'regret','regretted','terrible','pathetic','useless','garbage','junk',
]);

const INTENSIFIERS = new Set([
    'very','really','extremely','absolutely','totally','completely','super',
    'quite','so','too','much','highly','incredibly','immensely','exceptionally',
]);

const NEGATIONS = new Set([
    'not','no','never','nor','neither','without','hardly','barely','cant',
    "can't","isn't","isn't",'isnt','wasnt','dont',"don't","doesn't",'doesnt',
]);

/**
 * Normalize word — correct common typos and remove non-alpha characters
 */
function normalize(word) {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
    return POSITIVE_TYPOS.get(cleaned) || cleaned;
}

/**
 * Core sentiment analysis.
 * Returns { sentiment, sentimentScore, flagged }
 */
export function analyzeSentiment(text, rating) {
    const rawWords = text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/);
    const words = rawWords.map(normalize);

    let score = 0;
    let wordCount = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const prev  = words[i - 1] || '';
        const prev2 = words[i - 2] || '';

        const isNegated     = NEGATIONS.has(prev) || NEGATIONS.has(prev2);
        const isIntensified = INTENSIFIERS.has(prev) || INTENSIFIERS.has(prev2);
        const multiplier    = isIntensified ? 1.6 : 1.0;

        if (POSITIVE_WORDS.has(word)) {
            score += isNegated ? -1 * multiplier : 1 * multiplier;
            wordCount++;
        } else if (NEGATIVE_WORDS.has(word)) {
            score += isNegated ?  1 * multiplier : -1 * multiplier;
            wordCount++;
        }
    }

    // Rating signal: 1→-1.0, 2→-0.5, 3→0, 4→+0.5, 5→+1.0
    const ratingScore = (rating - 3) / 2;

    // Normalize text score (-1 to +1)
    const textScore = wordCount > 0
        ? Math.max(-1, Math.min(1, score / Math.max(wordCount, 2)))
        : 0;

    // Weighted blend: 70% rating (stronger signal), 30% text
    const finalScore = parseFloat((0.70 * ratingScore + 0.30 * textScore).toFixed(3));

    let sentiment;
    if (finalScore >= 0.15)       sentiment = 'positive';
    else if (finalScore <= -0.15) sentiment = 'negative';
    else                           sentiment = 'neutral';

    // Flag if highly negative
    const flagged = finalScore <= -0.45;

    return { sentiment, sentimentScore: finalScore, flagged };
}
