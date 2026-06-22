import type { Watch } from "@/app/lib/types";

/**
 * Flip to `true` once real transparent-background PNGs exist in /public/watches.
 * Until then we render a branded "watch dial" placeholder so layouts look
 * intentional rather than broken.
 */
const HAS_REAL_IMAGES = false;

/** A small, elegant watch-dial placeholder built in CSS. */
function WatchDial({ brand }: { brand: string }) {
  const monogram = brand.charAt(0).toUpperCase();
  return (
    <div className="relative grid aspect-square w-2/3 max-w-[220px] place-items-center">
      {/* outer gold ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 140deg, #a7855b, #ebcc99, #d7a874, #a7855b, #ebcc99)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))",
          opacity: 0.85,
        }}
      />
      {/* dial face */}
      <div className="absolute inset-[10%] grid place-items-center rounded-full bg-gradient-to-br from-[#1a1016] to-black shadow-[inset_0_2px_20px_rgba(0,0,0,0.8)]">
        <span className="text-gold-gradient text-6xl font-normal">{monogram}</span>
      </div>
      {/* hour ticks */}
      {[0, 90, 180, 270].map((deg) => (
        <span
          key={deg}
          className="absolute h-2 w-[2px] rounded bg-gold/60"
          style={{ transform: `rotate(${deg}deg) translateY(calc(-50% + 6px))` }}
        />
      ))}
    </div>
  );
}

export function WatchImage({ watch }: { watch: Watch }) {
  return (
    <div className="grid h-full w-full place-items-center">
      {HAS_REAL_IMAGES ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={watch.image}
          alt={`${watch.brand} ${watch.model}`}
          className="max-h-full max-w-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        />
      ) : (
        <WatchDial brand={watch.brand} />
      )}
    </div>
  );
}
