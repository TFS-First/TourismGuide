export function isSpanishVoice(voice) {
  return /^es(?:-|_)/i.test(voice?.lang || "");
}

export function rankSpanishVoice(voice) {
  const name = (voice.name || "").toLowerCase();
  let score = 0;
  if (/neural|natural|premium|enhanced/.test(name)) score += 100;
  if (/google|microsoft|siri/.test(name)) score += 35;
  if (/mónica|monica|jorge|paulina|juan|luciana/.test(name)) score += 20;
  if (/^es-es$/i.test(voice.lang || "")) score += 5;
  if (/compact|novelty|whisper|organ|bells/.test(name)) score -= 100;
  return score;
}

export function chooseSpanishVoice(voices, preferredUri = "") {
  const spanishVoices = voices.filter(isSpanishVoice);
  if (preferredUri) {
    const preferred = spanishVoices.find(voice => voice.voiceURI === preferredUri);
    if (preferred) return preferred;
  }
  return spanishVoices.sort((a, b) => rankSpanishVoice(b) - rankSpanishVoice(a))[0] || null;
}
