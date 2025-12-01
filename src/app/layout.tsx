import "./globals.css";

// Root layout is a simple pass-through.
// The actual HTML structure is provided by [locale]/layout.tsx for internationalized routes.
// This layout only imports global CSS to ensure styles are available.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
