import "./globals.css";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* No-flicker theme injection: reads localStorage before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('omniai_theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased overflow-x-hidden" style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
        <AnimatedBackground />
        <div className="mesh-bg opacity-30" />
        <div className="scanline opacity-5" />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
