import { renderLandingSectionBasedTemplate } from "./views/generated/landing-section-based/template";
import { renderVerificationPanel } from "./views/generated/verification";

const app = document.getElementById("app");

if (!app) {
  throw new Error("Missing #app mount.");
}

app.innerHTML = '<section class="sh-card"><h1>Shandapha starter</h1><p>Generated from the shared template asset catalog.</p></section>';
  const section1 = document.createElement("section");
  section1.className = "sh-card";
  app.appendChild(section1);
  renderLandingSectionBasedTemplate(section1);

const verification = document.createElement("section");
verification.className = "sh-card";
app.appendChild(verification);
renderVerificationPanel(verification);
