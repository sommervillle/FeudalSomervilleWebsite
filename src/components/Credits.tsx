/*
  Selected Credits — text only, no thumbnails, no case studies.
  Format: Brand — Role — Year.
*/
const credits = [
  { brand: 'Guinness',        role: 'Director' },
  { brand: 'Nike',            role: 'Director' },
  { brand: 'Adidas',          role: 'Director' },
  { brand: "The King's Trust",role: 'Director' },
  { brand: 'Pringles',        role: 'Director' },
  { brand: 'HP',              role: 'Director' },
  { brand: 'The Mill',        role: 'Director' },
];

export default function Credits() {
  return (
    <section
      id="credits"
      className="bg-bg border-t border-white/[0.06] px-6 md:px-10 py-24 md:py-32"
    >

      <p className="text-muted text-[11px] tracking-[0.28em] uppercase mb-16">
        Selected Credits
      </p>

      <ul className="space-y-5">
        {credits.map((c) => (
          <li
            key={c.brand}
            className="text-fg/60 text-sm md:text-base font-light tracking-wide"
          >
            {c.brand}
            <span className="text-white/20 mx-4">&mdash;</span>
            {c.role}
          </li>
        ))}
      </ul>

    </section>
  );
}
