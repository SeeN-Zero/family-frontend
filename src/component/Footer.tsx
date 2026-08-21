type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  copyrightText?: string;
  links?: FooterLink[];
};

export default function Footer({
  copyrightText = "©2026 SEEN FAMILY",
  links = [],
}: FooterProps) {
  return (
    <footer className="fixed bottom-0 w-full border-t border-dotted border-outline bg-background text-primary font-label-caps text-label-caps flex justify-between items-center px-margin-mobile md:px-margin-desktop py-3 md:py-4 z-40">
      <div className="truncate">{copyrightText}</div>

      {links.length > 0 && (
        <nav className="hidden md:flex gap-4">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="whitespace-nowrap">
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </footer>
  );
}