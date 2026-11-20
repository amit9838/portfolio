import type { Loader, LoaderContext } from 'astro/loaders';

/**
 * Wraps another loader and refreshes live numbers at build time:
 * - `stars` / `forks` from the GitHub API, for entries with `repo` ("owner/name");
 * - `downloads` from Flathub's stats API, for entries with `flathub` (an app ID).
 * On any failure the values from the source file are kept, so the build never depends
 * on either service being reachable. Uses GITHUB_TOKEN when present (GitHub Actions)
 * to avoid the 60 req/h anonymous limit.
 */
export function projectStats(inner: Loader): Loader {
  return {
    name: 'project-stats',
    load: async (context) => {
      await inner.load(context);
      const { store, generateDigest } = context;

      await Promise.all(
        store.values().map(async (entry) => {
          const data = { ...entry.data };
          const [github, flathub] = await Promise.all([
            typeof data.repo === 'string' ? fetchGitHub(data.repo, context) : undefined,
            typeof data.flathub === 'string' ? fetchFlathub(data.flathub, context) : undefined,
          ]);
          if (!github && !flathub) return;
          Object.assign(data, github, flathub);
          store.set({ ...entry, data, digest: generateDigest(data) });
        }),
      );
    },
  };
}

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function fetchGitHub(repo: string, { logger }: LoaderContext) {
  const token = process.env.GITHUB_TOKEN;
  try {
    const json = await getJson<{ stargazers_count: number; forks_count: number }>(
      `https://api.github.com/repos/${repo}`,
      {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    );
    return { stars: json.stargazers_count, forks: json.forks_count };
  } catch (err) {
    logger.warn(`Keeping fallback stars for ${repo}: ${(err as Error).message}`);
  }
}

async function fetchFlathub(appId: string, { logger }: LoaderContext) {
  try {
    const json = await getJson<{ installs_total: number }>(
      `https://flathub.org/api/v2/stats/${appId}`,
    );
    return { downloads: json.installs_total };
  } catch (err) {
    logger.warn(`Keeping fallback downloads for ${appId}: ${(err as Error).message}`);
  }
}
