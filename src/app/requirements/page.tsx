import { createFramework, createRequirement } from "@/lib/actions";
import { db } from "@/lib/db";

export default async function RequirementsPage() {
  const frameworks = await db.framework.findMany({ orderBy: { createdAt: "desc" } });
  const requirements = await db.requirement.findMany({
    orderBy: { createdAt: "desc" },
    include: { framework: true }
  });

  return (
    <div className="grid two">
      <section className="card">
        <div className="section-header">
          <h2>Frameworks</h2>
          <span className="badge">Library</span>
        </div>
        <form action={createFramework}>
          <label>
            Framework name
            <input name="name" placeholder="GRI" required />
          </label>
          <label>
            Version
            <input name="version" placeholder="2021" />
          </label>
          <button type="submit">Add framework</button>
        </form>
      </section>
      <section className="card">
        <h2>Framework List</h2>
        {frameworks.length === 0 ? (
          <p className="note">No frameworks added yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {frameworks.map((framework) => (
                <tr key={framework.id}>
                  <td>{framework.name}</td>
                  <td>{framework.version || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section className="card">
        <div className="section-header">
          <h2>Add Requirement</h2>
          <span className="badge">Mapping</span>
        </div>
        {frameworks.length === 0 ? (
          <p className="note">Add a framework before creating requirements.</p>
        ) : (
          <form action={createRequirement}>
            <label>
              Framework
              <select name="frameworkId" required>
                {frameworks.map((framework) => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name} {framework.version ?? ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Requirement code
              <input name="code" placeholder="GRI 302-1" required />
            </label>
            <label>
              Title
              <input name="title" placeholder="Energy consumption" required />
            </label>
            <label>
              Description
              <input name="text" placeholder="Total fuel and electricity use" />
            </label>
            <label>
              Tags (comma-separated)
              <input name="tags" placeholder="energy, emissions" />
            </label>
            <button type="submit">Add requirement</button>
          </form>
        )}
      </section>
      <section className="card">
        <h2>Requirements</h2>
        {requirements.length === 0 ? (
          <p className="note">No requirements defined.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Framework</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.id}>
                  <td>{req.code}</td>
                  <td>
                    {req.title}
                    <div className="note">{req.text || ""}</div>
                  </td>
                  <td>{req.framework.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
