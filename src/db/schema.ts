import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =============================================================================
// Enums
// =============================================================================

export const userRoleEnum = pgEnum("user_role", ["job_seeker", "church_admin"]);

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "contract",
  "volunteer",
  "internship",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "draft",
  "active",
  "closed",
  "filled",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "reviewing",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
  "hired",
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "entry",
  "mid",
  "senior",
  "executive",
]);

// =============================================================================
// Users Table (synced from SoapBox SSO)
// =============================================================================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  soapboxUserId: varchar("soapbox_user_id", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: userRoleEnum("role").default("job_seeker").notNull(),
  churchId: integer("church_id").references(() => churches.id),
  profilePhoto: text("profile_photo"),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  bio: text("bio"),
  ministryStatement: text("ministry_statement"),
  resumeUrl: text("resume_url"),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  skills: jsonb("skills").$type<string[]>().default([]),
  experience: jsonb("experience").$type<
    Array<{
      title: string;
      organization: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description?: string;
    }>
  >(),
  education: jsonb("education").$type<
    Array<{
      degree: string;
      institution: string;
      year: string;
      field?: string;
    }>
  >(),
  ssoAuthenticated: boolean("sso_authenticated").default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =============================================================================
// Churches/Organizations Table
// =============================================================================

export const churches = pgTable("churches", {
  id: serial("id").primaryKey(),
  soapboxCommunityId: varchar("soapbox_community_id", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  description: text("description"),
  denomination: varchar("denomination", { length: 100 }),
  logoUrl: text("logo_url"),
  coverImageUrl: text("cover_image_url"),
  website: varchar("website", { length: 500 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: varchar("address", { length: 500 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  country: varchar("country", { length: 100 }).default("USA"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  memberCount: integer("member_count"),
  weeklyAttendance: integer("weekly_attendance"),
  yearFounded: integer("year_founded"),
  missionStatement: text("mission_statement"),
  cultureDescription: text("culture_description"),
  benefitsDescription: text("benefits_description"),
  socialLinks: jsonb("social_links").$type<{
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  }>(),
  verified: boolean("verified").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =============================================================================
// Jobs Table
// =============================================================================

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  churchId: integer("church_id")
    .references(() => churches.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 300 }).unique(),
  description: text("description").notNull(),
  responsibilities: text("responsibilities"),
  qualifications: text("qualifications"),
  benefits: text("benefits"),
  type: jobTypeEnum("type").default("full_time").notNull(),
  status: jobStatusEnum("status").default("draft").notNull(),
  experienceLevel: experienceLevelEnum("experience_level").default("entry"),
  department: varchar("department", { length: 100 }),
  category: varchar("category", { length: 100 }),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryType: varchar("salary_type", { length: 50 }).default("yearly"),
  showSalary: boolean("show_salary").default(true),
  location: varchar("location", { length: 255 }),
  remote: boolean("remote").default(false),
  hybridAllowed: boolean("hybrid_allowed").default(false),
  requiredSkills: jsonb("required_skills").$type<string[]>().default([]),
  preferredSkills: jsonb("preferred_skills").$type<string[]>().default([]),
  educationRequired: varchar("education_required", { length: 255 }),
  ministryExperienceRequired: boolean("ministry_experience_required").default(
    false
  ),
  backgroundCheckRequired: boolean("background_check_required").default(true),
  applicationDeadline: timestamp("application_deadline"),
  startDate: timestamp("start_date"),
  applicationCount: integer("application_count").default(0),
  viewCount: integer("view_count").default(0),
  featured: boolean("featured").default(false),
  urgent: boolean("urgent").default(false),
  postedBy: integer("posted_by").references(() => users.id),
  publishedAt: timestamp("published_at"),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =============================================================================
// Job Applications Table
// =============================================================================

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .references(() => jobs.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  status: applicationStatusEnum("status").default("pending").notNull(),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  additionalDocuments: jsonb("additional_documents").$type<
    Array<{ name: string; url: string }>
  >(),
  answers: jsonb("answers").$type<
    Array<{ question: string; answer: string }>
  >(),
  notes: text("notes"),
  rating: integer("rating"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  interviewDate: timestamp("interview_date"),
  offerDate: timestamp("offer_date"),
  offerDetails: jsonb("offer_details").$type<{
    salary?: number;
    startDate?: string;
    notes?: string;
  }>(),
  rejectionReason: text("rejection_reason"),
  withdrawnReason: text("withdrawn_reason"),
  hiredAt: timestamp("hired_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =============================================================================
// Saved Jobs Table
// =============================================================================

export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  jobId: integer("job_id")
    .references(() => jobs.id)
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =============================================================================
// Messages Table
// =============================================================================

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  recipientId: integer("recipient_id")
    .references(() => users.id)
    .notNull(),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  readAt: timestamp("read_at"),
  attachments: jsonb("attachments").$type<
    Array<{ name: string; url: string; type: string }>
  >(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =============================================================================
// Job Categories Table
// =============================================================================

export const jobCategories = pgTable("job_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =============================================================================
// Notifications Table
// =============================================================================

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  data: jsonb("data"),
  read: boolean("read").default(false),
  readAt: timestamp("read_at"),
  actionUrl: varchar("action_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =============================================================================
// Relations
// =============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  church: one(churches, {
    fields: [users.churchId],
    references: [churches.id],
  }),
  applications: many(applications),
  savedJobs: many(savedJobs),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "recipient" }),
  notifications: many(notifications),
  postedJobs: many(jobs),
}));

export const churchesRelations = relations(churches, ({ many }) => ({
  users: many(users),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  church: one(churches, {
    fields: [jobs.churchId],
    references: [churches.id],
  }),
  postedBy: one(users, {
    fields: [jobs.postedBy],
    references: [users.id],
  }),
  applications: many(applications),
  savedBy: many(savedJobs),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [applications.reviewedBy],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  user: one(users, {
    fields: [savedJobs.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [savedJobs.jobId],
    references: [jobs.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  application: one(applications, {
    fields: [messages.applicationId],
    references: [applications.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: "recipient",
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// =============================================================================
// Types
// =============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Church = typeof churches.$inferSelect;
export type NewChurch = typeof churches.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

export type SavedJob = typeof savedJobs.$inferSelect;
export type NewSavedJob = typeof savedJobs.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type JobCategory = typeof jobCategories.$inferSelect;
export type NewJobCategory = typeof jobCategories.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
