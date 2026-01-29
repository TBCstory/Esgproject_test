import { db } from "@/lib/db";
import { CoverageStatus } from "@prisma/client";

export default async function CoveragePage() {
  const coverage = await db.mapping.groupBy({
    by: ["coverageStatus"],
    _count: { _all: true }
  });
  const totalRequirements = await db.requirement.count();
  const mappedRequirements = await db.requirement.count({
    where: { mappings: { some: {} } }
  });

  const coverageMap = new Map(coverage.map((row) => [row.coverageStatus, row._count._all]));

  return (
    <div className="grid two">
      <section className="card">
        <h2>Coverage Overview</h2>
        <p className="note">
          Track how requirements are mapped to sections and KPIs. Add evidence
          links to move items toward completion.
        </p>
        <div className="grid two">
          <div className="card">
            <strong>Total requirements</strong>
            <h2>{totalRequirements}</h2>
          </div>
          <div className="card">
            <strong>Mapped requirements</strong>
            <h2>{mappedRequirements}</h2>
          </div>
        </div>
      </section>
      <section className="card">
        <h2>Mapping Status</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {([
              "UNMAPPED",
              "MAPPED",
              "NEEDS_EVIDENCE",
              "COMPLETE"
            ] as CoverageStatus[]).map((status) => (
              <tr key={status}>
                <td>{status}</td>
                <td>{coverageMap.get(status) ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
