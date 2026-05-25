export default function Footer() {
  return (
    <footer id="contact" className="bg-bg px-6 py-24 border-t border-neutral-900">
      <div className="flex flex-col gap-6">
        <a
          href="mailto:FeudalProtocol@protonmail.com"
          className="text-fg text-sm tracking-wide hover:text-muted transition-colors"
        >
          FeudalProtocol@protonmail.com
        </a>
        <div className="flex gap-6">
          <a href="#" className="text-muted text-xs tracking-widest uppercase hover:text-fg transition-colors">
            Instagram
          </a>
          <a href="#" className="text-muted text-xs tracking-widest uppercase hover:text-fg transition-colors">
            Vimeo
          </a>
          <a href="#" className="text-muted text-xs tracking-widest uppercase hover:text-fg transition-colors">
            YouTube
          </a>
        </div>
        <div className="mt-8">
          <img src="/assets/monogram.svg" alt="" width={32} height={32} className="opacity-40" />
        </div>
      </div>
    </footer>
  );
}
