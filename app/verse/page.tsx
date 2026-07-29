"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/lib/config";
import type { Poem } from "@/lib/types";
import { useCascade } from "@/components/CascadeTransition";
import { Nightingale } from "@/components/Nightingale";
import styles from "./verse.module.css";

type AudioState = "idle" | "loading" | "playing" | "paused" | "error";

const PERSIAN_LINES_DELAY_MS = 1200;
const TRANSLATION_DELAY_MS = 3600;
const TRANSLIT_MEANING_DELAY_MS = 7200;
const REMAINING_DELAY_MS = 7200;

export default function VersePage() {
  const router = useRouter();
  const { navigateWithCascade } = useCascade();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFallback, setShareFallback] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // sessionStorage is only available client-side; reading it here (rather than
    // in the initializer) avoids an SSR/hydration mismatch.
    const raw = sessionStorage.getItem("faal-current-poem");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from sessionStorage on mount
      setPoem(JSON.parse(raw) as Poem);
    } catch {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  if (!poem) {
    return null;
  }

  async function handlePlay() {
    const audio = audioRef.current;
    if (!audio || !poem) return;

    if (audioUrlRef.current) {
      try {
        await audio.play();
        setAudioState("playing");
      } catch {
        setAudioState("error");
      }
      return;
    }

    setAudioState("loading");
    try {
      const res = await fetch(`/api/tts?id=${encodeURIComponent(poem.id)}`);
      if (!res.ok) throw new Error("tts failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      audio.src = url;
      await audio.play();
      setAudioState("playing");
    } catch {
      setAudioState("error");
    }
  }

  function handlePause() {
    audioRef.current?.pause();
    setAudioState("paused");
  }

  function handleAudioEnded() {
    setAudioState("paused");
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }

  async function handleShare() {
    if (!poem) return;
    const body = poem.en_translation || poem.en_meaning_summary;
    const text = `"${body}" — ${poem.poet}, ${config.shareSource}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShareFallback(null);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareFallback(text);
    }
  }

  function handleDrawAgain() {
    navigateWithCascade("/");
  }

  const persianLines = poem.fa.split("\n");
  const translationDelay = TRANSLATION_DELAY_MS;
  const translitMeaningDelay = TRANSLIT_MEANING_DELAY_MS;
  const remainingDelay = REMAINING_DELAY_MS;

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Nightingale variant="flight" tone="ink" className={styles.headerIllustration} />

        <p lang="fa" dir="rtl" className={styles.persian}>
          {persianLines.map((line, i) => (
            <span
              key={i}
              className={styles.persianLine}
              style={{ animationDelay: `${PERSIAN_LINES_DELAY_MS}ms` }}
            >
              {line}
            </span>
          ))}
        </p>

        <p className={styles.transliteration} style={{ animationDelay: `${translitMeaningDelay}ms` }}>
          {poem.transliteration.split("\n").map((line, i) => (
            <span key={i} className={styles.translitLine}>
              {line}
            </span>
          ))}
        </p>

        {poem.en_translation && (
          <div className={styles.translationBlock} style={{ animationDelay: `${translationDelay}ms` }}>
            {poem.en_translation.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        <p className={styles.meaning} style={{ animationDelay: `${translitMeaningDelay}ms` }}>
          {poem.en_meaning_summary}
        </p>

        {/* Audio player temporarily hidden — uncomment to re-enable.
        <div className={styles.audioRow} style={{ animationDelay: `${remainingDelay}ms` }}>
          {audioState !== "playing" ? (
            <button
              type="button"
              className={styles.audioButton}
              onClick={handlePlay}
              disabled={audioState === "loading"}
            >
              {audioState === "loading" ? "Loading…" : "▶ Play"}
            </button>
          ) : (
            <button type="button" className={styles.audioButton} onClick={handlePause}>
              ❚❚ Pause
            </button>
          )}
          {audioState === "error" && (
            <span className={styles.audioError}>Audio unavailable</span>
          )}
          <audio ref={audioRef} onEnded={handleAudioEnded} preload="none" />
        </div>
        */}

        <p className={styles.byline} style={{ animationDelay: `${remainingDelay}ms` }}>
          {poem.poet} — {poem.work}{" "}
          <a href={poem.source_url} target="_blank" rel="noopener noreferrer">
            Source
          </a>
        </p>

        <div className={styles.behindPoem} style={{ animationDelay: `${remainingDelay}ms` }}>
          <button
            type="button"
            className={styles.behindToggle}
            aria-expanded={expanded}
            aria-controls="behind-the-poem-panel"
            onClick={() => setExpanded((v) => !v)}
          >
            Behind the poem{" "}
            <span
              aria-hidden="true"
              className={`${styles.behindChevron} ${expanded ? styles.behindChevronOpen : ""}`}
            >
              ›
            </span>
          </button>
          <div
            id="behind-the-poem-panel"
            className={`${styles.behindPanel} ${expanded ? styles.behindPanelOpen : ""}`}
          >
            <div className={styles.behindPanelInner}>
              <p>{poem.commentary.context}</p>
              <p>{poem.commentary.why_it_speaks}</p>
              <ul>
                {poem.commentary.literary_notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.actions} style={{ animationDelay: `${remainingDelay}ms` }}>
          <button type="button" className={styles.shareButton} onClick={handleShare}>
            {copied ? "Copied!" : "Share"}
          </button>
          <button type="button" className={styles.drawAgainButton} onClick={handleDrawAgain}>
            {config.drawAgainCta}
          </button>
        </div>

        {shareFallback && (
          <input
            className={styles.shareFallbackInput}
            readOnly
            value={shareFallback}
            aria-label="Share text"
            onFocus={(e) => e.currentTarget.select()}
          />
        )}
      </div>
    </main>
  );
}
