# Ask Hafez

_Ask Hafez_ ("Oracle of the Nightingale") is a minimal Persian poetry oracle. Press a
button and receive a randomly drawn verse from a curated collection of classical Persian
poetry — Hafez, Rumi, Khayyam, and Ferdowsi.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Azure TTS credentials

Persian text-to-speech is optional — the app works fully without it, showing "Audio
unavailable" if it isn't configured.

1. Create an Azure Cognitive Services **Speech** resource.
2. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in the values:

   - `AZURE_TTS_KEY` — your Speech resource key
   - `AZURE_TTS_REGION` — the resource's region (e.g. `eastus`)
   - `AZURE_TTS_VOICE` — defaults to `fa-IR-DilaraNeural`; any Persian neural voice works
     (e.g. `fa-IR-FaridNeural`)

`.env.local` is gitignored and never committed. These credentials are only read by the
server-side `/api/tts` route and are never exposed to the client bundle.

## Where to add poems

Poems live in [`data/poems.json`](data/poems.json). Each entry follows this shape:

```json
{
  "id": "unique-id",
  "poet": "Poet name",
  "work": "Collection name",
  "fa": "Persian couplet, lines separated by \\n",
  "transliteration": "Latin transliteration, lines separated by \\n",
  "en_translation": "English translation, lines separated by \\n (optional — leave empty to hide)",
  "en_meaning_summary": "Plain-language meaning summary (always shown)",
  "source_note": "Citation note",
  "source_url": "Link to the source text",
  "commentary": {
    "context": "Historical/literary context paragraph",
    "why_it_speaks": "Why this verse resonates",
    "literary_notes": ["Note 1", "Note 2", "Note 3"]
  },
  "audio": {
    "tts_text_fa": "Persian text sent to TTS (punctuated for natural pacing)",
    "cache_key": "unique-cache-key"
  }
}
```

Poem text, translations, and transliterations are curated by hand — nothing in this file
should be generated or rewritten by an LLM.

App-wide copy (button labels, tagline, share text) lives in
[`data/config.json`](data/config.json).

## Notes on TTS voice options

Azure offers several Persian (`fa-IR`) neural voices, including `fa-IR-DilaraNeural`
(female) and `fa-IR-FaridNeural` (male). Set `AZURE_TTS_VOICE` to switch. Audio responses
are cached in-memory per server instance, keyed by each poem's `cache_key`, so repeat plays
of the same verse don't re-hit Azure within that instance's lifetime.

## Deployment

Deploy to [Vercel](https://vercel.com/new). Set `AZURE_TTS_KEY`, `AZURE_TTS_REGION`, and
`AZURE_TTS_VOICE` as environment variables in the project settings — TTS is disabled
gracefully if they're absent.
