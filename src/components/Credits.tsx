/*
  Credits — inverted slab (cream/white background, dark text).
  Text only: Brand — Role. No thumbnails, no case studies.
*/
const credits = [
  { brand: 'Guinness',         role: 'Director' },
  { brand: 'Nike',             role: 'Director' },
  { brand: 'Adidas',           role: 'Director' },
  { brand: "The King's Trust", role: 'Director' },
  { brand: 'Pringles',         role: 'Director' },
  { brand: 'HP',               role: 'Director' },
  { brand: 'The Mill',         role: 'Director' },
];

export default function Credits() {
  return (
    <section
      id="credits"
      className="bg-fg px-6 md:px-10 py-24 md:py-32"
    >

      <p className="text-bg text-[10px] tracking-[0.28em] uppercase mb-16 font-medium">
        Selected Credits
      </p>

      <ul className="space-y-5">
        {credits.map((c) => (
          <li
            key={c.brand}
            className="text-bg/60 text-sm md:text-base font-light tracking-wide"
          >
            {c.brand}
            <span className="text-bg/25 mx-4">&mdash;</span>
            {c.role}
          </li>
        ))}
      </ul>

    </section>
  );
}
