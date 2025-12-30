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
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}