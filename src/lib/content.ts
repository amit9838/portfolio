import { getCollection, getEntry } from 'astro:content';
import { compactCount } from './format';

/** Typed, pre-sorted access to every collection. Pages and BaseLayout use these, never raw getCollection. */

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getProfile() {
  const entry = await getEntry('profile', 'me');
  if (!entry) throw new Error('src/content/profile.yaml must have an entry with id "me"');
  return entry.data;
}

/** Stats split into "At work" and "Open source · <project>" groups, in order. */
export async function getStatGroups() {
  const stats = (await getCollection('stats')).map((e) => e.data).sort(byOrder);
  const resolved = await Promise.all(
    stats.map(async ({ value, project, metric, label, group, source }) => {
      if (value) return { group, value, label, source };
      const p = await getEntry('projects', project!);
      const n = p?.data[metric];
      if (!n) throw new Error(`stats.yaml: project "${project}" has no ${metric}`);
      const format = { stars: `★${n}`, downloads: compactCount(n), distroRepos: `${n}+` };
      return { group, value: format[metric], label, source, project: p.data.name };
    }),
  );
  const oss = resolved.filter((s) => s.group === 'oss');
  const ossProject =
    oss.length && oss.every((s) => s.project === oss[0]!.project) ? oss[0]!.project : '';
  return [
    { title: 'At work', items: resolved.filter((s) => s.group === 'work') },
    { title: ossProject ? `Open source · ${ossProject}` : 'Open source', items: oss },
  ].filter((g) => g.items.length > 0);
}

export const getSkillGroups = async () =>
  (await getCollection('skills')).map((e) => e.data).sort(byOrder);

export const getAchievements = async () =>
  (await getCollection('achievements')).map((e) => e.data).sort(byOrder);

/** Newest first. */
export const getExperience = async () =>
  (await getCollection('experience'))
    .map((e) => e.data)
    .sort((a, b) => b.start.getTime() - a.start.getTime());

/** Newest first. */
export const getEducation = async () =>
  (await getCollection('education')).map((e) => e.data).sort((a, b) => b.end - a.end);

export async function getProjects() {
  const all = (await getCollection('projects')).map((e) => e.data).sort(byOrder);
  return {
    flagship: all.filter((p) => p.tier === 'flagship'),
    compact: all.filter((p) => p.tier === 'compact'),
  };
}
