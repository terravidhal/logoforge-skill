import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Logoforge Skill — Examples",
  description:
    "Six logo recipes built with the real brand components from the Logoforge registry.",
};

const themeScript = `
try {
  var stored = localStorage.getItem("theme");
  var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) document.documentElement.classList.add("dark");
} catch (error) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
