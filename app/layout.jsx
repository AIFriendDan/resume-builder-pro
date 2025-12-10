export const metadata = {
  title: "ResumeOps 3.0",
  description: "AI-powered resume optimizer"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
