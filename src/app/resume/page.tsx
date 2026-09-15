import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume — Rene Marino",
  description: "Rene Marino's resume: Technical Product Manager for AI and API platforms.",
};

const colors = {
  paper: "#F5F6F8",
  ink: "#0A0A0C",
  ultramarine: "#2B3BFF",
  bodyGrey: "#4A4E5C",
  rule: "#D9DBE2",
};

const skills: [string, string][] = [
  [
    "Product & Project Management",
    "Agile, Scrum, Stakeholder Engagement, Scope Management, Requirement Gathering, Roadmap Planning, Risk Mitigation, CSPO",
  ],
  ["Technical", "HTML, CSS, JavaScript (ES6/ES7), Python 3, TypeScript, React, Angular, Vue, Node.js, Express, Flask"],
  ["Tools & Platforms", "Azure DevOps, AWS (Lambda, EC2, S3, DynamoDB), Git, GitHub, REST APIs, SQL & NoSQL Databases"],
  [
    "Communication & Leadership",
    "Client-Facing Communication, Cross-Functional Team Coordination, Presentation & Documentation, Risk & Issue Resolution",
  ],
];

const experience = [
  {
    org: "Humana",
    role: "Product Manager",
    when: "June 2025 – Present",
    bullets: [
      "Led the vision, roadmap and delivery of self-service Model Context Protocol (MCP) server functionality within the enterprise API catalog, covering 4,000+ internal APIs.",
      "Replaced manual MCP server provisioning with a self-service workflow, eliminating internal support requests for setup.",
      "Partnered with architecture, governance and security teams to build approval workflows for safe use of MCP servers and internal APIs.",
      "Led delivery across up to 3 concurrent engineering teams (~12–13 engineers), coordinating offshore and onshore developers, architects and scrum leadership.",
    ],
  },
  {
    org: "Dark Matter Technologies (Black Knight Financial)",
    role: "Software Engineer",
    when: "Dec 2022 – Apr 2025",
    bullets: [
      "Led software development projects from planning to execution, coordinating cross-functional teams to deliver AI-driven solutions.",
      "Designed and implemented RESTful APIs using Node.js for front-end and third-party integrations.",
      "Practiced Test-Driven Development to ensure code quality and efficient deployment.",
      "Managed sprint planning and backlog refinement; reported project status, risks and milestones to senior leadership.",
    ],
  },
  {
    org: "Coding Dojo",
    role: "Software Teaching Assistant",
    when: "Aug 2022 – Dec 2022",
    bullets: [
      "Guided students through coding best practices, debugging methodology and full-stack project development.",
      "Conducted code reviews with actionable feedback on structure, efficiency and maintainability.",
      "Led workshops on Agile principles and software lifecycle best practices.",
    ],
  },
  {
    org: "SAM Artist Management",
    role: "Stage Manager — International",
    when: "Aug 2017 – Dec 2020",
    bullets: [
      "Stage-managed international tours for Nine Inch Nails, Foo Fighters, and The Lonely Island, overseeing crews of 15+ across international locations.",
      "Built and maintained project schedules, logistics and risk management plans for live productions.",
      "Served as primary liaison between artists, technical teams and production management.",
    ],
  },
];

export default function Resume() {
  return (
    <div style={{ background: colors.paper, minHeight: "100vh" }}>
      <style>{`@media print { .no-print { display: none !important; } body { background: #fff !important; } }`}</style>

      <div className="no-print flex items-center justify-between px-[5vw] py-6">
        <a href="/" className="text-[15px] font-medium" style={{ color: colors.ink }}>
          ← Back to site
        </a>
        <a
          href="/resume.pdf"
          download
          className="inline-flex items-center h-[42px] px-5 rounded-full text-[15px] font-bold"
          style={{ background: colors.ink, color: "#fff" }}
        >
          Download PDF
        </a>
      </div>

      <main className="mx-auto max-w-[760px] px-[5vw] pb-24">
        <h1
          className="font-display"
          style={{ fontSize: 56, lineHeight: 1, fontWeight: 800, letterSpacing: "-0.03em", color: colors.ink, margin: 0 }}
        >
          Rene Marino
        </h1>
        <p className="font-display" style={{ marginTop: 10, fontSize: 22, fontWeight: 600, color: colors.ultramarine }}>
          Technical Product Manager — AI &amp; API Platforms
        </p>
        <p className="font-mono" style={{ marginTop: 14, fontSize: 13, letterSpacing: 0.5, color: colors.bodyGrey }}>
          Orange County, CA · linkedin.com/in/rene-marino-597b2665 · github.com/thewaffle99
        </p>

        <section style={{ marginTop: 44 }}>
          <h2 className="font-mono" style={{ fontSize: 13, letterSpacing: 1.5, color: colors.bodyGrey, margin: 0 }}>
            SKILLS
          </h2>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {skills.map(([label, list]) => (
              <div key={label}>
                <span style={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{label}: </span>
                <span style={{ fontSize: 15, lineHeight: 1.6, color: colors.bodyGrey }}>{list}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 44 }}>
          <h2 className="font-mono" style={{ fontSize: 13, letterSpacing: 1.5, color: colors.bodyGrey, margin: 0 }}>
            EXPERIENCE
          </h2>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 32 }}>
            {experience.map((job) => (
              <div key={job.org} style={{ borderTop: `1px solid ${colors.rule}`, paddingTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <span className="font-display" style={{ fontSize: 20, fontWeight: 700, color: colors.ink }}>
                    {job.org} <span style={{ fontWeight: 500, color: colors.bodyGrey }}>— {job.role}</span>
                  </span>
                  <span className="font-mono" style={{ fontSize: 12, color: colors.bodyGrey, whiteSpace: "nowrap" }}>
                    {job.when}
                  </span>
                </div>
                <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                  {job.bullets.map((b) => (
                    <li key={b} style={{ fontSize: 15, lineHeight: 1.6, color: colors.bodyGrey }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 44 }}>
          <h2 className="font-mono" style={{ fontSize: 13, letterSpacing: 1.5, color: colors.bodyGrey, margin: 0 }}>
            EDUCATION &amp; CERTIFICATIONS
          </h2>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: colors.bodyGrey, margin: 0 }}>
              <strong style={{ color: colors.ink }}>California State University, Fullerton</strong> — Bachelor of
              Arts, Communications
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: colors.bodyGrey, margin: 0 }}>
              <strong style={{ color: colors.ink }}>Coding Dojo</strong> — MERN &amp; Python Full Stack Engineer
              Certificates
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: colors.bodyGrey, margin: 0 }}>
              <strong style={{ color: colors.ink }}>Scrum Alliance</strong> — Certified Scrum Product Owner (CSPO)
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: colors.bodyGrey, margin: 0 }}>
              <strong style={{ color: colors.ink }}>Anthropic</strong> — Claude Academy: Claude Code, Claude
              Platform, Claude Cowork
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
