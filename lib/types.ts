export interface PoemComment {
  text: string;
  author: string;
}

export interface Poem {
  id: string;
  matla_en: string;
  summary_en: string;
  comment: PoemComment | null;
  full_poem_url: string;
}
