export default function Home() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">ResumeOps 3.0</h1>
      <p className="text-gray-700 mb-8">
        AI-powered ATS resume optimization suite.
      </p>
      <a
        href="/resume"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Launch Resume Builder
      </a>
    </main>
  );
}
