const credits = [
  { brand: 'Guinness', role: 'Director', year: '—' },
  { brand: 'Nike', role: 'Director', year: '—' },
  { brand: 'Adidas', role: 'Director', year: '—' },
  { brand: "The King's Trust", role: 'Director', year: '—' },
  { brand: 'Pringles', role: 'Director', year: '—' },
  { brand: 'HP', role: 'Director', year: '—' },
  { brand: 'The Mill', role: 'Director', year: '—' },
];

export default function Credits() {
  return (
    <section id="credits" className="bg-bg px-6 py-24 border-t border-neutral-900">
      <h2 className="text-muted text-xs tracking-widest uppercase mb-12">Selected Credits</h2>
      <ul className="space-y-3">
        {credits.map((c) => (
          <li key={c.brand} className="text-fg text-sm tracking-wide">
            {c.brand} &mdash; {c.role} &mdash; {c.year}
          </li>
        ))}
      </ul>
    </section>
  );
}
