/*
  LogoMark — inline SVG boxed logo mark.
  Thin-stroked square containing "F" over "S", matching the
  Alt&Co "ALT / —C" boxed-logo treatment.
  Uses currentColor so it inherits text-* classes from the parent.
*/

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 36, className = '' }: LogoMarkProps) {
  const font = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Feudal Somerville"
      role="img"
    >
      {/* Thin square border */}
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* F — upper half */}
      <text
        x="20"
        y="14"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={font}
        fontSize="10.5"
        fontWeight="300"
        fill="currentColor"
        letterSpacing="0.5"
      >
        F
      </text>

      {/* Hairline divider */}
      <line
        x1="9"
        y1="20.5"
        x2="31"
        y2="20.5"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.35"
      />

      {/* S — lower half */}
      <text
        x="20"
        y="28"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={font}
        fontSize="10.5"
        fontWeight="300"
        fill="currentColor"
        letterSpacing="0.5"
      >
        S
      </text>
    </svg>
  );
}
