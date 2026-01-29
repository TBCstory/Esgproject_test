import Link from "next/link";
import { createProject } from "@/lib/actions";
import { db } from "@/lib/db";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { reports: true }
  });

  return (
    <div className="grid two">
      <section className="card">
        <div className="section-header">
          <h2>Create Project</h2>
          <span className="badge">Draft</span>
        </div>
        <form action={createProject}>
          <label>
            Project name
            <input name="name" placeholder="2026 Sustainability Report" required />
          </label>
          <label>
            Year
            <input name="year" type="number" placeholder="2026" required />
          </label>
          <label>
            Frameworks (comma-separated)
            <input name="frameworks" placeholder="GRI 2021, TCFD" />
          </label>
          <button type="submit">Create project</button>
        </form>
      </section>
      <section className="card">
        <h2>Projects</h2>
        {projects.length === 0 ? (
          <p className="note">No projects yet. Create one to get started.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Year</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong>{project.name}</strong>
                    <div className="note">{project.frameworksSelected.join(", ") || "No frameworks"}</div>
                  </td>
                  <td>{project.year}</td>
                  <td>
                    {project.reports.length} report(s)
                    {project.reports.length > 0 && (
                      <div>
                        <Link className="note" href="/reports">
                          Manage reports
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
