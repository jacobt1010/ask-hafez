export interface PoemCommentary {
  context: string;
  why_it_speaks: string;
  literary_notes: string[];
}

export interface PoemAudio {
  tts_text_fa: string;
  cache_key: string;
}

export interface Poem {
  id: string;
  poet: string;
  work: string;
  fa: string;
  transliteration: string;
  en_translation: string;
  en_meaning_summary: string;
  source_note: string;
  source_url: string;
  commentary: PoemCommentary;
  human_commentary: string[];
  audio: PoemAudio;
}
