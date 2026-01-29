import { createMapping } from "@/lib/actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MappingsPage() {
  const requirements = await db.requirement.findMany({
    orderBy: { createdAt: "desc" },
    include: { framework: true }
  });
  const mappings = await db.mapping.findMany({
    orderBy: { createdAt: "desc" },
    include: { requirement: true }
  });

  return (
    <div className="grid two">
      <section className="card">
        <div className="section-header">
          <h2>Create Mapping</h2>
          <span className="badge">Coverage</span>
        </div>
        {requirements.length === 0 ? (
          <p className="note">Add requirements first.</p>
        ) : (
          <form action={createMapping}>
            <label>
              Requirement
              <select name="requirementId" required>
                {requirements.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.code} - {req.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Target type
              <select name="targetType" required>
                <option value="SECTION">Section</option>
                <option value="KPI">KPI</option>
                <option value="TABLE">Table</option>
                <option value="REQUIREMENT">Requirement</option>
              </select>
            </label>
            <label>
              Target ID
              <input name="targetId" placeholder="Section or KPI ID" required />
            </label>
            <label>
              Coverage status
              <select name="coverageStatus" defaultValue="UNMAPPED">
                <option value="UNMAPPED">Unmapped</option>
                <option value="MAPPED">Mapped</option>
                <option value="NEEDS_EVIDENCE">Needs evidence</option>
                <option value="COMPLETE">Complete</option>
              </select>
            </label>
            <button type="submit">Add mapping</button>
          </form>
        )}
      </section>
      <section className="card">
        <h2>Mappings</h2>
        {mappings.length === 0 ? (
          <p className="note">No mappings yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Target</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td>
                    {mapping.requirement.code}
                    <div className="note">{mapping.requirement.title}</div>
                  </td>
                  <td>
                    {mapping.targetType} • {mapping.targetId}
                  </td>
                  <td>{mapping.coverageStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
