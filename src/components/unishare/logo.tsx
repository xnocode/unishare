export function UniShareLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="UniShare logo"
      role="img"
    >
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 8.5 19 13h-6l3-4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.5v-3.5M22 18.5v-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 18.5c0 2.8 2.7 4.5 6 4.5s6-1.7 6-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="19.5" r="2.1" fill="currentColor" />
      <circle cx="22" cy="19.5" r="2.1" fill="currentColor" />
      <circle cx="16" cy="24" r="2.1" fill="currentColor" />
    </svg>
  );
}
