import { JobCategory, EmploymentType, WorkArrangement } from "@/types/job";

export interface JobTemplate {
  id: string;
  churchId: string;
  name: string;
  data: {
    title: string;
    category: string;
    employmentType: string;
    workArrangement: string;
    description: string;
    qualifications: string;
    responsibilities: string;
  };
  createdAt: string;
}

const TEMPLATES_KEY = "soapbox_job_templates";

export function getTemplates(): JobTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getChurchTemplates(churchId: string): JobTemplate[] {
  return getTemplates().filter((t) => t.churchId === churchId);
}

export function getTemplateById(templateId: string): JobTemplate | undefined {
  return getTemplates().find((t) => t.id === templateId);
}

export interface SaveTemplateInput {
  churchId: string;
  name: string;
  data: {
    title: string;
    category: string;
    employmentType: string;
    workArrangement: string;
    description: string;
    qualifications: string;
    responsibilities: string;
  };
}

export function saveTemplate(input: SaveTemplateInput): JobTemplate {
  const templates = getTemplates();

  const newTemplate: JobTemplate = {
    id: `template-${Date.now()}`,
    churchId: input.churchId,
    name: input.name,
    data: input.data,
    createdAt: new Date().toISOString(),
  };

  templates.push(newTemplate);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));

  return newTemplate;
}

export function updateTemplate(
  templateId: string,
  updates: Partial<Omit<JobTemplate, "id" | "churchId" | "createdAt">>
): JobTemplate | undefined {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === templateId);

  if (index === -1) return undefined;

  templates[index] = { ...templates[index], ...updates };
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));

  return templates[index];
}

export function deleteTemplate(templateId: string): boolean {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === templateId);

  if (index === -1) return false;

  templates.splice(index, 1);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));

  return true;
}
