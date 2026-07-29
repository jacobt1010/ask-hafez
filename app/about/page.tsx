import Link from "next/link";
import type { Metadata } from "next";
import { config } from "@/lib/config";
import { Nightingale } from "@/components/Nightingale";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: `About — ${config.appName}`,
};

const POET_URLS = {
  Hafez: "https://en.wikipedia.org/wiki/Hafez",
  Rumi: "https://en.wikipedia.org/wiki/Rumi",
  Khayyam: "https://en.wikipedia.org/wiki/Omar_Khayyam",
  Ferdowsi: "https://en.wikipedia.org/wiki/Ferdowsi",
} as const;

function PoetLink({ poet }: { poet: keyof typeof POET_URLS }) {
  return (
    <a
      href={POET_URLS[poet]}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.poetLink}
    >
      {poet}
    </a>
  );
}

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p>
          Faal e Bolbol (&ldquo;Oracle of the Nightingale&rdquo;) intends to authentically
          connect a Western, diaspora audience to classical Persian poetry while keeping the
          method of delivery relevant to the digital age.
        </p>
        <p>
          While the original Faal practice involves opening a book of <PoetLink poet="Hafez" />
          &apos;s poetry and interpreting a full poem as one&apos;s fortune, Faal e Bolbol opts to
          present a more digestible couplet while broadening the poems drawn to be among four
          famous Persian poets: <PoetLink poet="Hafez" />, <PoetLink poet="Rumi" />,{" "}
          <PoetLink poet="Khayyam" />, and <PoetLink poet="Ferdowsi" />.
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
