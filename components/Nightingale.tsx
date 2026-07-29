type NightingaleProps = {
  variant: "perched" | "flight";
  tone: "accent" | "ink";
  className?: string;
};

const SRC_BY_VARIANT: Record<NightingaleProps["variant"], string> = {
  perched: "/images/bolbol_perched.png",
  flight: "/images/bolbol_flight.png",
};

export function Nightingale({ variant, tone, className }: NightingaleProps) {
  const src = SRC_BY_VARIANT[variant];
  const toneClass = tone === "accent" ? "bolbol-accent" : "bolbol-ink";

  return (
    <div
      aria-hidden="true"
      className={["bolbol", toneClass, className].filter(Boolean).join(" ")}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
      }}
    />
  );
}
