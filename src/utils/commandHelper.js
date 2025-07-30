export const suggestCommands = (text) => {
  const commandSuggestions = {
    'open': ['open google', 'open youtube', 'open wikipedia'],
    'change': ['change theme to dark', 'change theme to light', 'change theme to blue'],
    'start': ['start listening'],
    'stop': ['stop listening'],
    'increase': ['increase text size'],
    'decrease': ['decrease text size'],
    'clear': ['clear'],
    'reset': ['reset'],
    'hello': ['hello'],
    'thank': ['thank you'],
    'history': ['show history'],
    'what': ['what can I say']
  };

  const words = text.toLowerCase().split(/\s+/);
  const suggestions = new Set();

  words.forEach(word => {
    if (commandSuggestions[word]) {
      commandSuggestions[word].forEach(cmd => suggestions.add(cmd));
    }
  });

  // Add some general suggestions if none found
  if (suggestions.size === 0 && text.trim().length > 3) {
    suggestions.add('start listening');
    suggestions.add('what can I say');
  }

  return Array.from(suggestions).slice(0, 5); // Return max 5 suggestions
};