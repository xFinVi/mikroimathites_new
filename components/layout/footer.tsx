import Link from "next/link";
import { Youtube, Instagram, Facebook, Music } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com",
      color: "hover:text-red-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "TikTok",
      icon: Music,
      href: "https://tiktok.com",
      color: "hover:text-black",
    },
  ];

  return (
    <footer className="bg-[#1a1f3a] text-white">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Μικροί Μαθητές
              </h3>
              <p className="text-sm text-white/80">
                Parent Hub για γονείς με παιδιά 0-6 ετών
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Σύνδεσμοι</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link href="/" className="hover:text-accent-yellow transition-colors">
                    Αρχική
                  </Link>
                </li>
                <li>
                  <Link href="/gia-goneis" className="hover:text-accent-yellow transition-colors">
                    Για Γονείς
                  </Link>
                </li>
                <li>
                  <Link href="/drastiriotites" className="hover:text-accent-yellow transition-colors">
                    Δραστηριότητες
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Πληροφορίες</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <Link href="/sxetika" className="hover:text-accent-yellow transition-colors">
                    Σχετικά
                  </Link>
                </li>
                <li>
                  <Link href="/epikoinonia" className="hover:text-accent-yellow transition-colors">
                    Επικοινωνία
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Ακολουθήστε μας</h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-white/80 transition-colors ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm hidden sm:inline">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/60">
            <p>© {currentYear} Μικροί Μαθητές. Όλα τα δικαιώματα κατοχυρωμένα.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

