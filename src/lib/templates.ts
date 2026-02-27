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

// Church ownership verification types
interface TemplateVerificationResult {
  success: boolean;
  error?: string;
}

// Allowed roles that can manage church templates
const ALLOWED_CHURCH_ROLES = ["church_admin", "pastor", "staff_admin"] as const;

/**
 * Verifies that a user has proper role and church affiliation to manage templates for a church.
 */
function verifyTemplateChurchOwnership(
  userChurchId: string | undefined,
  userRole: string | undefined,
  targetChurchId: string
): TemplateVerificationResult {
  if (!userChurchId) {
    return {
      success: false,
      error: "User is not affiliated with any church",
    };
  }

  if (!userRole || !ALLOWED_CHURCH_ROLES.includes(userRole as typeof ALLOWED_CHURCH_ROLES[number])) {
    return {
      success: false,
      error: "User does not have permission to manage church templates",
    };
  }

  if (userChurchId !== targetChurchId) {
    return {
      success: false,
      error: "User is not authorized to manage templates for this church",
    };
  }

  return { success: true };
}

/**
 * Verifies that a user can manage a specific template.
 */
function verifyTemplateOwnership(
  userChurchId: string | undefined,
  userRole: string | undefined,
  templateId: string
): TemplateVerificationResult {
  const template = getTemplateById(templateId);

  if (!template) {
    return {
      success: false,
      error: "Template not found",
    };
  }

  return verifyTemplateChurchOwnership(userChurchId, userRole, template.churchId);
}

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

export function saveTemplate(
  input: SaveTemplateInput,
  userChurchId?: string,
  userRole?: string
): JobTemplate | null {
  // Verify ownership if user context is provided
  if (userChurchId !== undefined || userRole !== undefined) {
    const verification = verifyTemplateChurchOwnership(userChurchId, userRole, input.churchId);
    if (!verification.success) {
      console.error("Template save verification failed:", verification.error);
      return null;
    }
  }

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
  updates: Partial<Omit<JobTemplate, "id" | "churchId" | "createdAt">>,
  userChurchId?: string,
  userRole?: string
): JobTemplate | undefined {
  // Verify ownership if user context is provided
  if (userChurchId !== undefined || userRole !== undefined) {
    const verification = verifyTemplateOwnership(userChurchId, userRole, templateId);
    if (!verification.success) {
      console.error("Template update verification failed:", verification.error);
      return undefined;
    }
  }

  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === templateId);

  if (index === -1) return undefined;

  templates[index] = { ...templates[index], ...updates };
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));

  return templates[index];
}

export function deleteTemplate(
  templateId: string,
  userChurchId?: string,
  userRole?: string
): boolean {
  // Verify ownership if user context is provided
  if (userChurchId !== undefined || userRole !== undefined) {
    const verification = verifyTemplateOwnership(userChurchId, userRole, templateId);
    if (!verification.success) {
      console.error("Template deletion verification failed:", verification.error);
      return false;
    }
  }

  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === templateId);

  if (index === -1) return false;

  templates.splice(index, 1);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));

  return true;
}
