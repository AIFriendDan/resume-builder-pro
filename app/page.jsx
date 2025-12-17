export default function Home() {
  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <h1 style={styles.h1}>AI, explained like a human.</h1>

        <p style={styles.lead}>
          I help everyday people and small businesses use AI without the overwhelm.
        </p>

        <div style={styles.block}>
          <h2 style={styles.h2}>What I Do</h2>
          <ul style={styles.list}>
            <li>Make AI tools practical, not intimidating</li>
            <li>Help automate simple tasks and save time</li>
            <li>Translate tech speak into clear, usable steps</li>
          </ul>
        </div>

        <div style={styles.block}>
          <h2 style={styles.h2}>Who It’s For</h2>
          <ul style={styles.list}>
            <li>Professionals who feel behind on AI</li>
            <li>Small business owners who want leverage, not complexity</li>
            <li>Anyone tired of feeling dumb around technology</li>
          </ul>
        </div>

        <div style={styles.cta}>
          <p style={styles.ctaText}>Want to talk?</p>
          <a href="mailto:dan.garza@aifrienddan.com" style={styles.email}>
            dan.garza@aifrienddan.com
          </a>
        </div>
      </section>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    color: "#111111",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "2rem",
  },
  section: {
    maxWidth: "720px",
    width: "100%",
  },
  h1: {
    fontSize: "2.75rem",
    fontWeight: 700,
    marginBottom: "1rem",
    lineHeight: 1.2,
  },
  lead: {
    fontSize: "1.25rem",
    marginBottom: "2.5rem",
    color: "#444",
  },
  block: {
    marginBottom: "2rem",
  },
  h2: {
    fontSize: "1.4rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
  },
  list: {
    paddingLeft: "1.25rem",
    lineHeight: 1.7,
  },
  cta: {
    marginTop: "3rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #eee",
  },
  ctaText: {
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
  },
  email: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#000",
    textDecoration: "none",
  },
};
