import Template1 from "./pages/generated/dashboard-home/index";
import VerificationPage from "./pages/generated/shandapha-verification";

export default function App() {
  return (
    <main className="sh-shell">
      <section className="sh-card">
        <h1>Shandapha starter</h1>
        <p>Generated from the shared template asset catalog.</p>
      </section>
      <section className="sh-card">
        <h2>dashboard-home</h2>
        <Template1 />
      </section>
      <section className="sh-card">
        <VerificationPage />
      </section>
    </main>
  );
}
