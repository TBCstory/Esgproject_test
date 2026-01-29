import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid two">
      <section className="card">
        <h1>Repository MVP</h1>
        <p>
          This workspace turns the AGENTS.md blueprint into a working MVP for ESG
          reporting workflows. Start by creating a project and report, then add
          sections, KPIs, requirements, and evidence links.
        </p>
        <div className="grid">
          <Link className="badge" href="/projects">
            Create a project
          </Link>
          <Link className="badge" href="/reports">
            Create a report
          </Link>
          <Link className="badge" href="/sections">
            Draft sections
          </Link>
        </div>
      </section>
      <section className="card">
        <h2>Workflow Snapshot</h2>
        <p>
          Draft → In Review → Revision Requested → Approved → Published. Each
          section keeps its own status while reports track overall progress.
        </p>
        <p className="note">
          Use the Coverage view to see how many requirements are mapped and
          backed by evidence.
        </p>
      </section>
      <section className="card">
        <h2>Key Modules</h2>
        <div className="grid two">
          <div>
            <strong>Authoring</strong>
            <p className="note">Section-based editor with KPI inserts.</p>
          </div>
          <div>
            <strong>Evidence</strong>
            <p className="note">Store documents and link to sections or KPIs.</p>
          </div>
          <div>
            <strong>Requirements</strong>
            <p className="note">Map disclosures to frameworks like GRI/TCFD.</p>
          </div>
          <div>
            <strong>Review</strong>
            <p className="note">Track status per section and per report.</p>
          </div>
        </div>
      </section>
      <section className="card">
        <h2>Next Steps</h2>
        <p>
          Connect Auth.js, add file uploads to S3/R2, and extend workflows with
          tasks and approval routing.
        </p>
      </section>
    </div>
  );
}
