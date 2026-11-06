import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseSpanishVoice, isSpanishVoice } from '../spanish-src/src/spanishSpeech.js';

const voice = (name, lang, voiceURI = name) => ({ name, lang, voiceURI });

test('Spanish speech never falls back to an English voice', () => {
  const voices = [voice('English default', 'en-US')];
  assert.equal(chooseSpanishVoice(voices), null);
  assert.equal(isSpanishVoice(voices[0]), false);
});

test('natural Spanish voices take priority and the student can choose another', () => {
  const voices = [
    voice('English default', 'en-US'),
    voice('Spanish Compact', 'es-ES', 'compact'),
    voice('Google español', 'es-ES', 'google'),
    voice('Microsoft Elvira Online (Natural)', 'es-ES', 'elvira'),
  ];
  assert.equal(chooseSpanishVoice(voices).voiceURI, 'elvira');
  assert.equal(chooseSpanishVoice(voices, 'google').voiceURI, 'google');
  assert.equal(chooseSpanishVoice(voices, 'missing').voiceURI, 'elvira');
});
