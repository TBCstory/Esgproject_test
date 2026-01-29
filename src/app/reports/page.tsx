import { createReport } from "@/lib/actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } });
  const reports = await db.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: true, versions: true }
  });

  return (
    <div className="grid two">
      <section className="card">
        <div className="section-header">
          <h2>Create Report</h2>
          <span className="badge">Workflow</span>
        </div>
        {projects.length === 0 ? (
          <p className="note">Create a project first to attach a report.</p>
        ) : (
          <form action={createReport}>
            <label>
              Project
              <select name="projectId" required>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.year})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Report title
              <input name="title" placeholder="ESG Report" required />
            </label>
            <button type="submit">Create report</button>
          </form>
        )}
      </section>
      <section className="card">
        <h2>Reports</h2>
        {reports.length === 0 ? (
          <p className="note">No reports created yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.title}</strong>
                    <div className="note">Versions: {report.versions.length}</div>
                  </td>
                  <td>{report.project.name}</td>
                  <td>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
