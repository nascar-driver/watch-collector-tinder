import type { Watch } from "@/app/lib/types";

/**
 * Flip to `true` once real transparent-background PNGs exist in /public/watches.
 * Until then we render a branded "watch dial" placeholder so layouts look
 * intentional rather than broken.
 */
const HAS_REAL_IMAGES = true;

/** A small, elegant watch-dial placeholder built in CSS. */
function WatchDial({ brand }: { brand: string }) {
  const monogram = brand.charAt(0).toUpperCase();
  return (
    <div className="relative grid aspect-square w-2/3 max-w-[220px] place-items-center">
      {/* outer brand ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 140deg, #7032cf, #c198ff, #9d5cff, #7032cf, #c198ff)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))",
          opacity: 0.85,
        }}
      />
      {/* dial face */}
      <div className="absolute inset-[10%] grid place-items-center rounded-full bg-gradient-to-br from-[#1a1720] to-black shadow-[inset_0_2px_20px_rgba(0,0,0,0.8)]">
        <span className="text-brand-gradient text-6xl font-normal">{monogram}</span>
      </div>
      {/* hour ticks */}
      {[0, 90, 180, 270].map((deg) => (
        <span
          key={deg}
          className="absolute h-2 w-[2px] rounded bg-brand/60"
          style={{ transform: `rotate(${deg}deg) translateY(calc(-50% + 6px))` }}
        />
      ))}
    </div>
  );
}

export function WatchImage({ watch }: { watch: Watch }) {
  return (
    <div className="pointer-events-none grid h-full w-full select-none place-items-center">
      {HAS_REAL_IMAGES ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={watch.image}
          alt={`${watch.brand} ${watch.model}`}
          draggable={false}
          className="max-h-full max-w-full select-none object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] [-webkit-user-drag:none]"
        />
      ) : (
        <WatchDial brand={watch.brand} />
      )}
    </div>
  );
}
