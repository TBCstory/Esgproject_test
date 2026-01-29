import { createKpi, createKpiValue } from "@/lib/actions";
import { db } from "@/lib/db";

export default async function KpisPage() {
  const kpis = await db.kpiCatalog.findMany({ orderBy: { createdAt: "desc" } });
  const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } });
  const values = await db.kpiValue.findMany({
    orderBy: { createdAt: "desc" },
    include: { kpi: true, project: true }
  });

  return (
    <div className="grid two">
      <section className="card">
        <div className="section-header">
          <h2>KPI Catalog</h2>
          <span className="badge">Metrics</span>
        </div>
        <form action={createKpi}>
          <label>
            KPI code
            <input name="code" placeholder="E1-01" required />
          </label>
          <label>
            KPI name
            <input name="name" placeholder="Scope 1 emissions" required />
          </label>
          <label>
            Unit
            <input name="unit" placeholder="tCO2e" />
          </label>
          <label>
            Definition
            <input name="definition" placeholder="Include owned assets" />
          </label>
          <button type="submit">Add KPI</button>
        </form>
      </section>
      <section className="card">
        <h2>Catalog List</h2>
        {kpis.length === 0 ? (
          <p className="note">No KPIs defined yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((kpi) => (
                <tr key={kpi.id}>
                  <td>{kpi.code}</td>
                  <td>{kpi.name}</td>
                  <td>{kpi.unit || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section className="card">
        <div className="section-header">
          <h2>Record KPI Value</h2>
          <span className="badge">Input</span>
        </div>
        {kpis.length === 0 || projects.length === 0 ? (
          <p className="note">Create a KPI and a project to input values.</p>
        ) : (
          <form action={createKpiValue}>
            <label>
              KPI
              <select name="kpiId" required>
                {kpis.map((kpi) => (
                  <option key={kpi.id} value={kpi.id}>
                    {kpi.code} - {kpi.name}
                  </option>
                ))}
              </select>
            </label>
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
              Period
              <input name="period" placeholder="FY2026" required />
            </label>
            <label>
              Value
              <input name="value" type="number" step="0.01" required />
            </label>
            <label>
              Note
              <input name="note" placeholder="Consolidated" />
            </label>
            <button type="submit">Save value</button>
          </form>
        )}
      </section>
      <section className="card">
        <h2>KPI Values</h2>
        {values.length === 0 ? (
          <p className="note">No KPI values recorded yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>KPI</th>
                <th>Project</th>
                <th>Period</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {values.map((value) => (
                <tr key={value.id}>
                  <td>
                    {value.kpi.code}
                    <div className="note">{value.kpi.name}</div>
                  </td>
                  <td>{value.project.name}</td>
                  <td>{value.period}</td>
                  <td>{value.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
