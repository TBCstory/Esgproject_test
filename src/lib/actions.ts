"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CoverageStatus, TargetType } from "@prisma/client";

const DEFAULT_ORG_SLUG = "demo";

async function ensureOrg() {
  const existing = await db.organization.findFirst();
  if (existing) {
    return existing;
  }

  return db.organization.create({
    data: {
      name: "Demo Organization",
      slug: DEFAULT_ORG_SLUG
    }
  });
}

function parseList(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const year = Number(formData.get("year") || new Date().getFullYear());
  const frameworks = parseList(formData.get("frameworks"));

  if (!name) {
    return;
  }

  const org = await ensureOrg();

  await db.project.create({
    data: {
      orgId: org.id,
      name,
      year,
      frameworksSelected: frameworks
    }
  });

  revalidatePath("/projects");
  revalidatePath("/reports");
}

export async function createReport(formData: FormData) {
  const projectId = String(formData.get("projectId") || "").trim();
  const title = String(formData.get("title") || "").trim();

  if (!projectId || !title) {
    return;
  }

  await db.report.create({
    data: {
      projectId,
      title,
      status: "DRAFT",
      versions: {
        create: {
          versionNo: 1,
          isCurrent: true
        }
      }
    }
  });

  revalidatePath("/reports");
  revalidatePath("/sections");
}

export async function createSection(formData: FormData) {
  const reportId = String(formData.get("reportId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const type = String(formData.get("type") || "Narrative").trim();

  if (!reportId || !title) {
    return;
  }

  await db.section.create({
    data: {
      reportId,
      title,
      type
    }
  });

  revalidatePath("/sections");
}

export async function updateSectionContent(formData: FormData) {
  const sectionId = String(formData.get("sectionId") || "").trim();
  const contentMd = String(formData.get("contentMd") || "");
  const status = String(formData.get("status") || "DRAFT");

  if (!sectionId) {
    return;
  }

  const section = await db.section.findUnique({
    where: { id: sectionId },
    include: {
      report: {
        include: {
          versions: true
        }
      }
    }
  });

  if (!section) {
    return;
  }

  const currentVersion = section.report.versions.find((version) => version.isCurrent);
  if (!currentVersion) {
    return;
  }

  await db.sectionContent.upsert({
    where: {
      sectionId_versionId: {
        sectionId,
        versionId: currentVersion.id
      }
    },
    update: {
      contentMd,
      status: status as "DRAFT" | "IN_REVIEW" | "REVISION_REQUESTED" | "APPROVED"
    },
    create: {
      sectionId,
      versionId: currentVersion.id,
      contentMd,
      status: status as "DRAFT" | "IN_REVIEW" | "REVISION_REQUESTED" | "APPROVED"
    }
  });

  await db.section.update({
    where: { id: sectionId },
    data: {
      status: status as "DRAFT" | "IN_REVIEW" | "REVISION_REQUESTED" | "APPROVED"
    }
  });

  revalidatePath("/sections");
  revalidatePath(`/sections/${sectionId}`);
}

export async function createKpi(formData: FormData) {
  const code = String(formData.get("code") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const unit = String(formData.get("unit") || "").trim();
  const definition = String(formData.get("definition") || "").trim();

  if (!code || !name) {
    return;
  }

  const org = await ensureOrg();

  await db.kpiCatalog.create({
    data: {
      orgId: org.id,
      code,
      name,
      unit: unit || null,
      definition: definition || null
    }
  });

  revalidatePath("/kpis");
}

export async function createKpiValue(formData: FormData) {
  const kpiId = String(formData.get("kpiId") || "").trim();
  const projectId = String(formData.get("projectId") || "").trim();
  const period = String(formData.get("period") || "").trim();
  const value = Number(formData.get("value"));
  const note = String(formData.get("note") || "").trim();

  if (!kpiId || !projectId || !period || Number.isNaN(value)) {
    return;
  }

  await db.kpiValue.create({
    data: {
      kpiId,
      projectId,
      period,
      value,
      note: note || null
    }
  });

  revalidatePath("/kpis");
}

export async function createFramework(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const version = String(formData.get("version") || "").trim();

  if (!name) {
    return;
  }

  await db.framework.create({
    data: {
      name,
      version: version || null
    }
  });

  revalidatePath("/requirements");
}

export async function createRequirement(formData: FormData) {
  const frameworkId = String(formData.get("frameworkId") || "").trim();
  const code = String(formData.get("code") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const tags = parseList(formData.get("tags"));

  if (!frameworkId || !code || !title) {
    return;
  }

  await db.requirement.create({
    data: {
      frameworkId,
      code,
      title,
      text: text || null,
      tags
    }
  });

  revalidatePath("/requirements");
  revalidatePath("/mappings");
}

export async function createMapping(formData: FormData) {
  const requirementId = String(formData.get("requirementId") || "").trim();
  const targetType = String(formData.get("targetType") || "").trim();
  const targetId = String(formData.get("targetId") || "").trim();
  const coverageStatus = String(formData.get("coverageStatus") || "").trim();

  if (!requirementId || !targetType || !targetId) {
    return;
  }

  await db.mapping.create({
    data: {
      requirementId,
      targetType: targetType as TargetType,
      targetId,
      coverageStatus: (coverageStatus as CoverageStatus) || "UNMAPPED"
    }
  });

  revalidatePath("/mappings");
  revalidatePath("/coverage");
}

export async function createEvidence(formData: FormData) {
  const filename = String(formData.get("filename") || "").trim();
  const mime = String(formData.get("mime") || "").trim();
  const issuedBy = String(formData.get("issuedBy") || "").trim();

  if (!filename) {
    return;
  }

  const org = await ensureOrg();

  await db.evidenceFile.create({
    data: {
      orgId: org.id,
      storageKey: randomUUID(),
      filename,
      mime: mime || null,
      issuedBy: issuedBy || null
    }
  });

  revalidatePath("/evidence");
}

export async function createEvidenceLink(formData: FormData) {
  const evidenceId = String(formData.get("evidenceId") || "").trim();
  const linkType = String(formData.get("linkType") || "").trim();
  const linkId = String(formData.get("linkId") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const pageRange = String(formData.get("pageRange") || "").trim();

  if (!evidenceId || !linkType || !linkId) {
    return;
  }

  await db.evidenceLink.create({
    data: {
      evidenceId,
      linkType: linkType as "SECTION" | "KPI" | "REQUIREMENT",
      linkId,
      note: note || null,
      pageRange: pageRange || null
    }
  });

  revalidatePath("/evidence");
}
