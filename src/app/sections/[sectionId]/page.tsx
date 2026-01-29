import { notFound } from "next/navigation";
import { updateSectionContent } from "@/lib/actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SectionDetailPage({
  params
}: {
  params: { sectionId: string };
}) {
  const section = await db.section.findUnique({
    where: { id: params.sectionId },
    include: {
      report: {
        include: {
          versions: true
        }
      },
      contents: true
    }
  });

  if (!section) {
    notFound();
  }

  const currentVersion = section.report.versions.find((version) => version.isCurrent);
  const currentContent = section.contents.find(
    (content) => content.versionId === currentVersion?.id
  );

  return (
    <div className="grid">
      <section className="card">
        <div className="section-header">
          <div>
            <h2>{section.title}</h2>
            <p className="note">
              {section.report.title} • {section.type}
            </p>
          </div>
          <span className="badge">{section.status}</span>
        </div>
        <form action={updateSectionContent}>
          <input type="hidden" name="sectionId" value={section.id} />
          <label>
            Content (Markdown)
            <textarea
              name="contentMd"
              defaultValue={currentContent?.contentMd ?? ""}
              placeholder="Write section narrative, tables, or KPI references."
            />
          </label>
          <label>
            Status
            <select name="status" defaultValue={currentContent?.status ?? section.status}>
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="REVISION_REQUESTED">Revision Requested</option>
              <option value="APPROVED">Approved</option>
            </select>
          </label>
          <button type="submit">Save section</button>
        </form>
      </section>
    </div>
  );
}
