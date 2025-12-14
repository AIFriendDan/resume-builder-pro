import Script from "next/script";
import "../styles/globals.css";

export const metadata = {
  title: "Resume Builder Pro",
  description:
    "Build tailored, ATS-friendly resumes and companion cover letters with collaborative AI tooling.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Script id="tailwind-theme" strategy="beforeInteractive">
          {`tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#1d4ed8',
                  accent: '#0ea5e9'
                }
              }
            }
          }`}
        </Script>
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}