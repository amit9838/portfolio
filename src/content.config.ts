import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectStats } from './lib/project-stats';

// strictObject everywhere: an unexpected key (e.g. `phone`) fails the build.

const link = z.strictObject({ label: z.string(), url: z.url() });

const profile = defineCollection({
  loader: file('src/content/profile.yaml'),
  schema: z.strictObject({
    name: z.string(),
    /** Text after the amber ~ in the header logo, e.g. `/home` for `~/home`. */
    logoText: z.string().min(1),
    title: z.string(),
    tagline: z.string(),
    city: z.string(),
    openToRemote: z.boolean(),
    timezone: z.string(),
    email: z.email(),
    socials: z.array(
      z.strictObject({
        name: z.string(),
        url: z.url(),
        icon: z.string(),
        inHeader: z.boolean().default(false),
      }),
    ),
  }),
});

const stats = defineCollection({
  loader: file('src/content/stats.yaml'),
  schema: z
    .strictObject({
      value: z.string().optional(),
      /** A project id: the value comes from that project's live `metric`. */
      project: z.string().optional(),
      metric: z.enum(['stars', 'downloads', 'distroRepos']).default('stars'),
      label: z.string(),
      /** `work` stats name their company in `source`; `oss` stats come from one project. */
      group: z.enum(['work', 'oss']),
      source: z.string().optional(),
      order: z.number(),
    })
    .refine((s) => Boolean(s.value) !== Boolean(s.project), 'Set exactly one of value or project'),
});

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.strictObject({
    title: z.string(),
    order: z.number(),
    items: z.array(z.string()).min(1),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.strictObject({
    role: z.string(),
    company: z.string(),
    url: z.url().optional(),
    place: z.string(),
    type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    about: z.string(),
    points: z.array(z.string()).min(1),
  }),
});

const education = defineCollection({
  loader: file('src/content/education.yaml'),
  schema: z.strictObject({
    degree: z.string(),
    school: z.string(),
    start: z.number(),
    end: z.number(),
    gpa: z.string().optional(),
  }),
});

const achievements = defineCollection({
  loader: file('src/content/achievements.yaml'),
  schema: z.strictObject({ text: z.string(), order: z.number() }),
});

const projects = defineCollection({
  loader: projectStats(file('src/content/projects.yaml')),
  schema: ({ image }) =>
    z.strictObject({
      name: z.string(),
      /** App icon shown beside the name on flagship cards. */
      icon: image().optional(),
      tier: z.enum(['flagship', 'compact']),
      order: z.number(),
      desc: z.string(),
      stack: z.array(z.string()).min(1),
      links: z.array(link).min(1),
      repo: z
        .string()
        .regex(/^[\w.-]+\/[\w.-]+$/)
        .optional(), // owner/name
      stars: z.number().int().nonnegative().optional(), // fallback; replaced at build time
      forks: z.number().int().nonnegative().optional(),
      /** Flathub app ID: `downloads` is refreshed from Flathub at build time. */
      flathub: z.string().optional(),
      downloads: z.number().int().nonnegative().optional(), // fallback
      /** Number of distro repositories packaging it (from Repology). */
      distroRepos: z.number().int().positive().optional(),
      /** A short verbatim quote from a review. */
      quote: z
        .strictObject({ text: z.string().max(160), source: z.string(), url: z.url() })
        .optional(),
      /** Outlets that covered the project. */
      featuredBy: z
        .array(
          z.strictObject({
            name: z.string(),
            url: z.url(),
            /** Brand colour for the underline and icon. */
            brand: z.enum(['youtube', 'omgubuntu', 'linuxlinks']).optional(),
          }),
        )
        .optional(),
      /** A claim shown on the card, backed by a screenshot that opens in a dialog. */
      evidence: z
        .strictObject({
          text: z.string(),
          button: z.string(),
          image: image(),
          alt: z.string(),
          caption: z.string(),
        })
        .optional(),
    }),
});

export const collections = {
  profile,
  stats,
  skills,
  experience,
  education,
  achievements,
  projects,
};
