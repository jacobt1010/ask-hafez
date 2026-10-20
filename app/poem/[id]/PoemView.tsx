"use client";

import { useState } from "react";
import { config } from "@/lib/config";
import type { Poem } from "@/lib/types";
import { useCascade } from "@/components/CascadeTransition";
import { Nightingale } from "@/components/Nightingale";
import styles from "./poem.module.css";

const SUMMARY_DELAY_MS = 1200;
const REMAINING_DELAY_MS = 2400;

export function PoemView({ poem }: { poem: Poem }) {
  const { navigateWithCascade } = useCascade();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFallback, setShareFallback] = useState<string | null>(null);

  async function handleShare() {
    const text = `Poem ${poem.id}, Divan of Hafez — ${config.shareSource}\n${window.location.href}`;
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
    navigateWithCascade("/pause");
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Nightingale variant="flight" tone="ink" className={styles.headerIllustration} />

        <h1 className={styles.source} style={{ animationDelay: `${SUMMARY_DELAY_MS}ms` }}>
          Poem {poem.id}
          <span className={styles.sourceLine}>Divan of Hafez</span>
        </h1>

        <div className={styles.summary} style={{ animationDelay: `${SUMMARY_DELAY_MS}ms` }}>
          {poem.summary_en.split("\n").map((line, i) => (
            <p key={i}>{i === 0 ? <strong>{line}</strong> : line}</p>
          ))}
        </div>

        {poem.comment && (
          <section className={styles.comment} style={{ animationDelay: `${REMAINING_DELAY_MS}ms` }}>
            <h2>Comments from an Iranian</h2>
            <p>{poem.comment.text}</p>
            <p className={styles.commentAuthor}>– {poem.comment.author}</p>
          </section>
        )}

        <div className={styles.behindPoem} style={{ animationDelay: `${REMAINING_DELAY_MS}ms` }}>
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
              <ul>
                <li>
                  The opening couplet (matla) for this poem is:{" "}
                  <strong>{poem.matla_en.split("\n").join(" / ")}</strong>
                </li>
                <li>
                  The full poem can be found{" "}
                  <a href={poem.full_poem_url} target="_blank" rel="noopener noreferrer">
                    here
                  </a>
                  .
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.actions} style={{ animationDelay: `${REMAINING_DELAY_MS}ms` }}>
          <button type="button" className={styles.shareButton} onClick={handleShare}>
            {copied ? "Copied!" : "Share"}
          </button>
          <button type="button" className={styles.drawAgainButton} onClick={handleDrawAgain}>
            {config.drawAgainCta}
          </button>
          <button type="button" className={styles.homeButton} onClick={() => navigateWithCascade("/")}>
            {config.homeCta}
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
