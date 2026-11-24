"use client";

import { useState } from "react";
import { Logo } from "@/app/components/brand/Logo";
import { LegalModal } from "@/app/components/legal/LegalModal";
import { ContactModal } from "@/app/components/contact/ContactModal";
import { LEGAL_DOCS, type LegalDocKey } from "@/app/data/legal";

const COPYRIGHT = "© 2026 Watch.fun - All rights reserved.";

type NavLink =
  | { label: string; doc: LegalDocKey }
  | { label: string; action: "contact" };

const NAV_LINKS: readonly NavLink[] = [
  { label: "Terms of Service", doc: "terms" },
  { label: "Privacy Policy", doc: "privacy" },
  { label: "Contact Us", action: "contact" },
];

const SOCIAL_LINKS = [
  { label: "discord", href: "https://discord.com/invite/uqr2R8NBMJ", Icon: DiscordIcon },
  { label: "twitter", href: "https://x.com/watchdotfun", Icon: TwitterIcon },
  { label: "telegram", href: "https://t.me/watchdotfun", Icon: TelegramIcon },
  { label: "tiktok", href: "https://www.tiktok.com/@watchdotfun", Icon: TikTokIcon },
  { label: "instagram", href: "https://www.instagram.com/watchdotfun/", Icon: InstagramIcon },
] as const;

/**
 * Sticky site footer (watch.fun). Three-up on desktop — [logo + copyright] /
 * [nav links] / [socials] — and a centered stack on mobile, mirroring the
 * brand site. Mounted as a flex sibling after the page content so it pins to
 * the bottom of the viewport on short pages.
 */
export function Footer() {
  const [openDoc, setOpenDoc] = useState<LegalDocKey | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
    <footer className="mt-auto w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-8 uppercase md:flex-row md:justify-between md:gap-8">
        {/* mobile: standalone logo */}
        <Logo size={32} className="md:hidden" />

        {/* far left: logo + copyright */}
        <div className="hidden items-center gap-3 md:flex">
          <Logo size={32} />
          <p className="text-sm tracking-brand text-[#8c8a91]">{COPYRIGHT}</p>
        </div>

        {/* middle: nav links */}
        <nav className="flex items-center gap-4">
          {NAV_LINKS.map((link, i) => (
            <div key={link.label} className="flex items-center gap-4">
              {i > 0 && <span className="h-4 w-px bg-line" aria-hidden="true" />}
              <button
                type="button"
                onClick={() =>
                  "doc" in link ? setOpenDoc(link.doc) : setContactOpen(true)
                }
                className="cursor-pointer text-sm uppercase tracking-brand text-white transition-colors hover:text-highlight"
              >
                {link.label}
              </button>
            </div>
          ))}
        </nav>

        {/* mobile: copyright */}
        <p className="text-sm tracking-brand text-[#8c8a91] md:hidden">
          {COPYRIGHT}
        </p>

        {/* far right: socials */}
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(229,227,232,0.15)] text-[#e5e3e8] no-underline transition-[background-color,color,transform] duration-200 ease-[ease] hover:bg-[rgba(157,92,255,0.2)] hover:text-[#c198ff] hover:[transform:scale(1.05)]"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>

    {openDoc && (
      <LegalModal
        title={LEGAL_DOCS[openDoc].title}
        html={LEGAL_DOCS[openDoc].html}
        onClose={() => setOpenDoc(null)}
      />
    )}

    {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 20 20",
  className: "h-4 w-4",
  style: { userSelect: "none", pointerEvents: "none" } as const,
  "aria-hidden": true,
};

function DiscordIcon() {
  return (
    <svg {...iconProps}>
      <mask
        id="footer-discord"
        width="20"
        height="20"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path
          d="M16.3634 4.18544C15.1589 3.63107 13.8873 3.23779 12.5811 3.01563C12.4024 3.33684 12.2406 3.66732 12.0966 4.0057C10.7053 3.79493 9.29036 3.79493 7.89902 4.0057C7.7549 3.66736 7.59318 3.33688 7.41451 3.01562C6.10749 3.23966 4.83505 3.63388 3.62932 4.18834C1.23564 7.74854 0.586752 11.2203 0.911196 14.6428C2.313 15.684 3.88201 16.4758 5.55004 16.9839C5.92563 16.4761 6.25798 15.9373 6.54356 15.3734C6.00114 15.1697 5.4776 14.9185 4.97901 14.6225C5.11023 14.5268 5.23857 14.4283 5.36258 14.3326C6.81335 15.0184 8.39679 15.3741 9.99998 15.3741C11.6032 15.3741 13.1866 15.0184 14.6374 14.3326C14.7628 14.4355 14.8912 14.5341 15.0209 14.6225C14.5214 14.9189 13.9969 15.1707 13.4535 15.3748C13.7387 15.9385 14.0711 16.4768 14.447 16.9839C16.1165 16.4778 17.6867 15.6864 19.0888 14.6442C19.4694 10.6753 18.4384 7.23538 16.3634 4.18544ZM6.95452 12.538C6.0504 12.538 5.30346 11.7132 5.30346 10.6985C5.30346 9.68374 6.02445 8.85168 6.95164 8.85168C7.87883 8.85168 8.62001 9.68374 8.60414 10.6985C8.58828 11.7132 7.87595 12.538 6.95452 12.538ZM13.0454 12.538C12.1399 12.538 11.3958 11.7132 11.3958 10.6985C11.3958 9.68374 12.1168 8.85168 13.0454 8.85168C13.9741 8.85168 14.7095 9.68374 14.6936 10.6985C14.6778 11.7132 13.9669 12.538 13.0454 12.538Z"
          fill="black"
        />
      </mask>
      <g mask="url(#footer-discord)">
        <rect width="20" height="20" fill="currentColor" />
      </g>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M14.5027 2.9165H16.9044L11.6575 8.91736L17.83 17.0832H12.997L9.21164 12.1306L4.88031 17.0832H2.47725L8.08924 10.6646L2.16797 2.9165H7.12366L10.5453 7.4433L14.5027 2.9165ZM13.6599 15.6447H14.9906L6.40056 4.27941H4.97251L13.6599 15.6447Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M1.31748 8.89962C6.46345 6.66537 9.89405 5.19227 11.6094 4.4806C16.5127 2.44838 17.5302 2.09543 18.1949 2.08361C18.341 2.08114 18.6664 2.11715 18.8788 2.2884C19.0553 2.43271 19.105 2.62788 19.1298 2.76477C19.1518 2.90166 19.1822 3.21366 19.1574 3.4572C18.8926 6.23903 17.7427 12.9896 17.158 16.1054C16.9126 17.4238 16.4244 17.8658 15.9528 17.909C14.927 18.003 14.1492 17.2339 13.1564 16.5854C11.6038 15.5702 10.7269 14.9385 9.21842 13.9481C7.47552 12.8035 8.60617 12.1743 9.59896 11.1462C9.85819 10.8771 14.3754 6.78275 14.4608 6.41138C14.4719 6.36492 14.483 6.19175 14.3782 6.10048C14.2761 6.00895 14.1244 6.04028 14.0141 6.06502C13.8569 6.10021 11.3776 7.73522 6.56812 10.9698C5.8649 11.4519 5.22787 11.6869 4.65426 11.6746C4.02549 11.6611 2.81216 11.3194 1.91037 11.0275C0.807272 10.6693 -0.0724949 10.4799 0.0047222 9.87161C0.0433308 9.55495 0.481884 9.23086 1.31748 8.89962Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg {...iconProps}>
      <mask
        id="footer-tiktok"
        width="20"
        height="20"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path
          d="M17.2618 8.51102C15.7787 8.51102 14.4057 8.0398 13.2844 7.23898V13.0604C13.2844 15.9725 10.9225 18.3332 8.00897 18.3332C6.92189 18.3332 5.9115 18.0046 5.07216 17.4413C3.66187 16.4949 2.73334 14.8857 2.73334 13.0603C2.73334 10.1484 5.0953 7.78769 8.00905 7.78775C8.2512 7.78763 8.49304 7.80408 8.73292 7.83685V8.4832L8.73278 10.7532C8.5019 10.6799 8.25576 10.6402 8.00039 10.6402C6.66754 10.6402 5.58725 11.7201 5.58725 13.0521C5.58725 13.9938 6.12724 14.8094 6.91468 15.2066C7.24119 15.3712 7.60993 15.4639 8.00042 15.4639C9.33053 15.4639 10.409 14.3884 10.4136 13.0603V1.6665H13.2844V2.03341C13.2945 2.1431 13.3091 2.25238 13.3281 2.36094C13.5273 3.49681 14.2068 4.46729 15.15 5.05555C15.7834 5.4507 16.5153 5.65959 17.2618 5.65846L17.2618 8.51102Z"
          fill="black"
        />
      </mask>
      <g mask="url(#footer-tiktok)">
        <rect width="20" height="20" fill="currentColor" />
      </g>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg {...iconProps}>
      <mask
        id="footer-instagram"
        width="20"
        height="20"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path
          d="M9.99998 3.50994C12.1137 3.50994 12.3642 3.51785 13.199 3.556C13.7009 3.56206 14.198 3.65432 14.6687 3.82876C15.0126 3.95568 15.3237 4.15808 15.5791 4.42107C15.8421 4.67647 16.0445 4.98757 16.1714 5.33149C16.3458 5.80212 16.4381 6.29923 16.4441 6.80111C16.4823 7.63596 16.4902 7.88641 16.4902 10.0002C16.4902 12.1139 16.4823 12.3644 16.4441 13.1992C16.4381 13.7011 16.3458 14.1982 16.1714 14.6688C16.0397 15.0103 15.8379 15.3205 15.5791 15.5793C15.3203 15.8381 15.0101 16.0399 14.6687 16.1716C14.198 16.346 13.7009 16.4383 13.199 16.4443C12.3642 16.4825 12.1137 16.4904 9.99998 16.4904C7.88623 16.4904 7.63577 16.4825 6.80093 16.4443C6.2988 16.4383 5.80144 16.3461 5.33059 16.1716C4.98692 16.0446 4.67608 15.8422 4.42089 15.5793C4.1579 15.3239 3.9555 15.0128 3.82858 14.6688C3.65414 14.1982 3.56187 13.7011 3.55581 13.1992C3.51767 12.3644 3.50975 12.1139 3.50975 10.0002C3.50975 7.88641 3.51767 7.63596 3.55581 6.80111C3.56187 6.29923 3.65414 5.80212 3.82858 5.33149C3.9555 4.98757 4.1579 4.67647 4.42089 4.42107C4.67628 4.15808 4.98738 3.95568 5.33131 3.82876C5.80194 3.65432 6.29904 3.56206 6.80093 3.556C7.63577 3.51785 7.88623 3.50994 9.99998 3.50994ZM9.99998 2.0835C7.85024 2.0835 7.58036 2.09285 6.73615 2.131C6.07944 2.1441 5.4297 2.26845 4.81456 2.49876C4.28606 2.69774 3.80736 3.00967 3.41187 3.41278C3.00912 3.80813 2.69744 4.28657 2.49858 4.81475C2.26851 5.42993 2.1444 6.07967 2.13153 6.73634C2.09195 7.58054 2.08331 7.85043 2.08331 10.0002C2.08331 12.1499 2.09267 12.4198 2.13081 13.264C2.14391 13.9207 2.26826 14.5704 2.49858 15.1856C2.69756 15.7141 3.00949 16.1928 3.41259 16.5883C3.80794 16.991 4.28639 17.3027 4.81456 17.5016C5.42975 17.7316 6.07948 17.8557 6.73615 17.8686C7.58036 17.9082 7.85024 17.9168 9.99998 17.9168C12.1497 17.9168 12.4196 17.9075 13.2638 17.8693C13.9205 17.8562 14.5703 17.7319 15.1854 17.5016C15.7115 17.2982 16.1892 16.9871 16.5881 16.5882C16.9869 16.1894 17.298 15.7117 17.5014 15.1856C17.7314 14.5704 17.8556 13.9207 17.8684 13.264C17.908 12.4198 17.9166 12.1499 17.9166 10.0002C17.9166 7.85043 17.9073 7.58054 17.8691 6.73634C17.856 6.07962 17.7317 5.42989 17.5014 4.81475C17.3024 4.28625 16.9905 3.80755 16.5874 3.41206C16.192 3.0093 15.7136 2.69762 15.1854 2.49876C14.5702 2.26869 13.9205 2.14459 13.2638 2.13172C12.4196 2.09213 12.1497 2.0835 9.99998 2.0835ZM9.99998 5.93459C9.19589 5.93459 8.40985 6.17304 7.74127 6.61977C7.07269 7.0665 6.5516 7.70145 6.24388 8.44434C5.93617 9.18722 5.85566 10.0047 6.01253 10.7933C6.1694 11.582 6.55661 12.3064 7.12519 12.875C7.69377 13.4435 8.41818 13.8307 9.20683 13.9876C9.99547 14.1445 10.8129 14.064 11.5558 13.7563C12.2987 13.4485 12.9336 12.9275 13.3804 12.2589C13.8271 11.5903 14.0655 10.8043 14.0655 10.0002C14.0655 8.92191 13.6372 7.88781 12.8748 7.12537C12.1123 6.36293 11.0782 5.93459 9.99998 5.93459ZM9.99998 12.6393C9.47801 12.6393 8.96776 12.4845 8.53376 12.1945C8.09976 11.9045 7.76149 11.4924 7.56174 11.0101C7.36199 10.5279 7.30973 9.99724 7.41156 9.48529C7.51339 8.97335 7.76475 8.50311 8.13383 8.13402C8.50292 7.76493 8.97317 7.51358 9.48511 7.41174C9.99705 7.30991 10.5277 7.36218 11.0099 7.56193C11.4922 7.76168 11.9043 8.09994 12.1943 8.53394C12.4843 8.96794 12.6391 9.47819 12.6391 10.0002C12.6391 10.7001 12.3611 11.3714 11.8661 11.8663C11.3712 12.3612 10.6999 12.6393 9.99998 12.6393ZM14.226 4.8241C14.0381 4.8241 13.8545 4.87982 13.6982 4.98421C13.542 5.08859 13.4203 5.23696 13.3484 5.41055C13.2765 5.58414 13.2576 5.77516 13.2943 5.95944C13.331 6.14372 13.4214 6.31299 13.5543 6.44585C13.6871 6.57871 13.8564 6.66919 14.0407 6.70585C14.225 6.7425 14.416 6.72369 14.5896 6.65179C14.7632 6.57988 14.9115 6.45812 15.0159 6.30189C15.1203 6.14567 15.176 5.96199 15.176 5.7741C15.176 5.52215 15.076 5.28051 14.8978 5.10235C14.7196 4.92419 14.478 4.8241 14.226 4.8241Z"
          fill="black"
        />
      </mask>
      <g mask="url(#footer-instagram)">
        <rect width="20" height="20" fill="currentColor" />
      </g>
    </svg>
  );
}
