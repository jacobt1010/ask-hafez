import Link from "next/link";
import type { Metadata } from "next";
import { config } from "@/lib/config";
import { Nightingale } from "@/components/Nightingale";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: `About — ${config.appName}`,
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p>
          Ask Hafez brings the Persian tradition of Fal-e Hafez to English speakers. Traditionally,
          one holds a question in mind, opens the Divan of{" "}
          <a
            href="https://en.wikipedia.org/wiki/Hafez"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.poetLink}
          >
            Hafez
          </a>{" "}
          at random, and reads the poem as a message from fate.
        </p>
        <p>
          Each poem here is shown through its fal-friendly summary, translated into English, with a
          comment from an Iranian and a link to the full poem.
        </p>
        <p>
          The bolbol (nightingale) is a common symbol in Persian poetry, typically representing a
          lover singing endlessly for an unattainable rose.
        </p>
        <Link href="/" className={styles.homeButton}>
          {config.homeCta}
        </Link>
        <Nightingale variant="perched" tone="accent" className={styles.illustration} />
      </div>
    </main>
  );
}
