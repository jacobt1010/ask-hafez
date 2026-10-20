"use client";

import { config } from "@/lib/config";
import { getRandomPoem } from "@/lib/poems";
import { useCascade } from "@/components/CascadeTransition";
import { Nightingale } from "@/components/Nightingale";
import styles from "./pause.module.css";

export default function PausePage() {
  const { navigateWithCascade } = useCascade();

  function handleReveal() {
    const lastId = sessionStorage.getItem("faal-last-poem-id");
    const poem = getRandomPoem(lastId);
    sessionStorage.setItem("faal-last-poem-id", poem.id);
    navigateWithCascade(`/poem/${poem.id}`);
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Nightingale variant="perched" tone="accent" className={styles.illustration} />
        <h1 className={styles.title}>{config.pauseTitle}</h1>
        <p className={styles.body}>{config.pauseBody}</p>
        <button type="button" className={styles.revealButton} onClick={handleReveal}>
          {config.revealCta}
        </button>
      </div>
    </main>
  );
}
