import fs   from 'fs';
import path  from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

/**
 * Get all posts from a content directory
 * @param {'writing' | 'garden'} dir
 */
export function getAllPosts(dir = 'writing') {
  const dirPath = path.join(CONTENT_ROOT, dir);

  if (!fs.existsSync(dirPath)) return [];

  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((filename) => {
      const slug    = filename.replace(/\.mdx?$/, '');
      const raw     = fs.readFileSync(path.join(dirPath, filename), 'utf-8');
      const { data: frontmatter, content } = matter(raw);

      // Rough reading time (200 wpm)
      const words       = content.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(words / 200));

      return {
        slug,
        content,
        readingTime,
        ...frontmatter,
        // Ensure date is a string for serialization
        date: frontmatter.date
          ? new Date(frontmatter.date).toISOString()
          : new Date().toISOString(),
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug, dir = 'writing') {
  const dirPath  = path.join(CONTENT_ROOT, dir);
  const mdxPath  = path.join(dirPath, `${slug}.mdx`);
  const mdPath   = path.join(dirPath, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);
  const words       = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return {
    slug,
    content,
    readingTime,
    ...frontmatter,
    date: frontmatter.date
      ? new Date(frontmatter.date).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Get all unique tags across a content dir
 */
export function getAllTags(dir = 'writing') {
  const posts = getAllPosts(dir);
  const tagSet = new Set();
  posts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/**
 * Get posts by type (essay | tutorial | til)
 */
export function getPostsByType(type) {
  return getAllPosts('writing').filter((p) => p.type === type);
}

/**
 * Get garden notes by stage
 */
export function getGardenByStage(stage) {
  return getAllPosts('garden').filter((p) => p.stage === stage);
}
