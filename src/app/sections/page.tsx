import Link from "next/link";
import { createSection } from "@/lib/actions";
import { db } from "@/lib/db";

export default async function SectionsPage() {
  const reports = await db.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: true }
  });
  const sections = await db.section.findMany({
    orderBy: { createdAt: "desc" },
    include: { report: true }
  });

  return (
    <div className="grid two">
      <section className="card">
        <div className="section-header">
          <h2>Add Section</h2>
          <span className="badge">Editor</span>
        </div>
        {reports.length === 0 ? (
          <p className="note">Create a report first to add sections.</p>
        ) : (
          <form action={createSection}>
            <label>
              Report
              <select name="reportId" required>
                {reports.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.title} ({report.project.name})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Section title
              <input name="title" placeholder="Governance Overview" required />
            </label>
            <label>
              Section type
              <input name="type" placeholder="Policy / KPI / Narrative" />
            </label>
            <button type="submit">Add section</button>
          </form>
        )}
      </section>
      <section className="card">
        <h2>Sections</h2>
        {sections.length === 0 ? (
          <p className="note">No sections yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Report</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id}>
                  <td>
                    <Link href={`/sections/${section.id}`}>
                      <strong>{section.title}</strong>
                    </Link>
                    <div className="note">{section.type}</div>
                  </td>
                  <td>{section.report.title}</td>
                  <td>{section.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
