"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { config } from "@/lib/config";
import { getRandomPoem } from "@/lib/poems";
import { useCascade } from "@/components/CascadeTransition";
import { Nightingale } from "@/components/Nightingale";
import styles from "./page.module.css";

const cormorantGaramond = Cormorant_Garamond({
  weight: "600",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const { navigateWithCascade } = useCascade();

  function handleDraw() {
    const lastId = sessionStorage.getItem("faal-last-poem-id");
    const poem = getRandomPoem(lastId);
    sessionStorage.setItem("faal-current-poem", JSON.stringify(poem));
    sessionStorage.setItem("faal-last-poem-id", poem.id);
    navigateWithCascade("/verse");
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={`${styles.title} ${cormorantGaramond.className}`}>{config.appName}</h1>
        <Image
          src="/images/faal_bolbol_calligraphy.png"
          alt=""
          aria-hidden="true"
          width={2172}
          height={724}
          className={styles.calligraphy}
        />
        <p className={styles.description}>{config.description}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={handleDraw}>
            {config.drawCta}
          </button>
          <Link href="/about" className={styles.secondaryButton}>
            {config.aboutCta}
          </Link>
        </div>
        <Nightingale variant="perched" tone="accent" className={styles.illustration} />
      </div>
    </main>
  );
}
