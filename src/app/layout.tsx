import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme";
import { experience, site } from "@/content/site";
import "./globals.css";

const instrument = localFont({
  src: [
    { path: "./fonts/InstrumentSans.woff2", style: "normal" },
    { path: "./fonts/InstrumentSans-Italic.woff2", style: "italic" },
  ],
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
});

const jetbrains = localFont({
  src: "./fonts/JetBrainsMono.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

const description = `${site.name} — AI & Data Engineer in Berlin. LLM and RAG applications, machine learning, data analytics and data engineering. M.Sc. Data Science, ex-HCLTech software engineer.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI & Data Engineer`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "AI Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Data Engineer",
    "Data Analyst",
    "RAG",
    "LLM",
    "NLP",
    "Python",
    "Berlin",
    "Vinayak Donawad",
  ],
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: `${site.name} — AI & Data Engineer`,
    description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: `${site.name} — AI & Data Engineer`, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1220" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  alternateName: site.name,
  jobTitle: site.headline,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" },
  alumniOf: ["University of Europe for Applied Sciences", "KLE Technological University"],
  worksFor: undefined,
  knowsAbout: ["Large language models", "Retrieval-augmented generation", "Machine learning", "Data analytics", "Data engineering"],
  sameAs: [site.links.github, site.links.linkedin, site.links.kaggle],
  hasOccupation: experience.map((e) => ({ "@type": "Occupation", name: e.role })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${instrument.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
