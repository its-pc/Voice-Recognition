export const spellCheck = (text) => {
  const commonCorrections = {
    'teh': 'the',
    'wat': 'what',
    'wats': "what's",
    'wen': 'when',
    'wher': 'where',
    'howz': "how's",
    'helo': 'hello',
    'sory': 'sorry',
    'plz': 'please',
    'thx': 'thanks',
    'u': 'you',
    'r': 'are',
    'bt': 'but',
    'coz': 'because',
    'fav': 'favorite',
    'lite': 'light',
    'bak': 'back',
    'gr8': 'great',
    'luv': 'love',
    'nite': 'night',
    'omg': 'oh my god',
    'tho': 'though',
    'txt': 'text',
    'wanna': 'want to',
    'gonna': 'going to',
    'kinda': 'kind of',
    'sorta': 'sort of',
    'outta': 'out of',
    'dunno': "don't know",
    'lemme': 'let me',
    'gimme': 'give me',
    'init': 'isn\'t it',
    'innit': 'isn\'t it',
    'shoulda': 'should have',
    'coulda': 'could have',
    'woulda': 'would have',
    'mighta': 'might have',
    'musta': 'must have',
    'oughta': 'ought to',
    'needa': 'need to',
    'hafta': 'have to',
    'hasta': 'has to',
    'supposeta': 'supposed to',
    'tryna': 'trying to',
    'prolly': 'probably',
    'def': 'definitely',
    'abs': 'absolutely',
    'obvs': 'obviously',
    'totes': 'totally',
    'sitch': 'situation',
    'convo': 'conversation',
    'preggers': 'pregnant',
    'veggies': 'vegetables',
    'fave': 'favorite',
    'obvi': 'obviously',
    'tbh': 'to be honest',
    'imo': 'in my opinion',
    'smh': 'shaking my head',
    'irl': 'in real life',
    'btw': 'by the way',
    'idk': "I don't know",
    'jk': 'just kidding',
    'lol': 'laugh out loud',
    'omw': 'on my way',
    'ttyl': 'talk to you later',
    'brb': 'be right back',
    'gtg': 'got to go',
    'fyi': 'for your information',
    'np': 'no problem',
    'yw': "you're welcome",
    'nm': 'not much',
    'wdym': 'what do you mean',
    'hbu': 'how about you',
    'ikr': 'I know, right',
    'ofc': 'of course',
    'ppl': 'people',
    'srsly': 'seriously',
    'thru': 'through',
    'til': 'until',
    'w/o': 'without',
    'w/': 'with',
    'yolo': 'you only live once',
    'fomo': 'fear of missing out'
  };

  // Correct common phrases
  let correctedText = text.toLowerCase();
  
  // Replace common misrecognitions
  Object.keys(commonCorrections).forEach(mistake => {
    const regex = new RegExp(`\\b${mistake}\\b`, 'gi');
    correctedText = correctedText.replace(regex, commonCorrections[mistake]);
  });

  // Capitalize first letter of sentences
  correctedText = correctedText.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());

  // Fix common punctuation
  correctedText = correctedText
    .replace(/\s+([,.!?])/g, '$1') // Remove space before punctuation
    .replace(/([,.!?])(\w)/g, '$1 $2'); // Add space after punctuation

  return correctedText;
};