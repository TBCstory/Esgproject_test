import { createEvidence, createEvidenceLink } from "@/lib/actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EvidencePage() {
  const evidence = await db.evidenceFile.findMany({
    orderBy: { createdAt: "desc" }
  });
  const links = await db.evidenceLink.findMany({
    orderBy: { createdAt: "desc" },
    include: { evidence: true }
  });

  return (
    <div className="grid two">
      <section className="card">
        <div className="section-header">
          <h2>Evidence Library</h2>
          <span className="badge">Documents</span>
        </div>
        <form action={createEvidence}>
          <label>
            Filename
            <input name="filename" placeholder="2026_energy_audit.pdf" required />
          </label>
          <label>
            MIME type
            <input name="mime" placeholder="application/pdf" />
          </label>
          <label>
            Issued by
            <input name="issuedBy" placeholder="Internal Audit" />
          </label>
          <button type="submit">Save evidence</button>
        </form>
      </section>
      <section className="card">
        <h2>Evidence Files</h2>
        {evidence.length === 0 ? (
          <p className="note">No evidence uploaded.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>File</th>
                <th>Issued by</th>
              </tr>
            </thead>
            <tbody>
              {evidence.map((file) => (
                <tr key={file.id}>
                  <td>
                    {file.filename}
                    <div className="note">{file.mime || "-"}</div>
                  </td>
                  <td>{file.issuedBy || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section className="card">
        <div className="section-header">
          <h2>Link Evidence</h2>
          <span className="badge">Traceability</span>
        </div>
        {evidence.length === 0 ? (
          <p className="note">Add evidence before linking.</p>
        ) : (
          <form action={createEvidenceLink}>
            <label>
              Evidence
              <select name="evidenceId" required>
                {evidence.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.filename}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Link type
              <select name="linkType" required>
                <option value="SECTION">Section</option>
                <option value="KPI">KPI</option>
                <option value="REQUIREMENT">Requirement</option>
              </select>
            </label>
            <label>
              Link target ID
              <input name="linkId" placeholder="Section or KPI ID" required />
            </label>
            <label>
              Note
              <input name="note" placeholder="Page reference or context" />
            </label>
            <label>
              Page range
              <input name="pageRange" placeholder="pp. 12-14" />
            </label>
            <button type="submit">Add link</button>
          </form>
        )}
      </section>
      <section className="card">
        <h2>Evidence Links</h2>
        {links.length === 0 ? (
          <p className="note">No links yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Evidence</th>
                <th>Linked to</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td>{link.evidence.filename}</td>
                  <td>
                    {link.linkType} • {link.linkId}
                    <div className="note">{link.note || ""}</div>
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
