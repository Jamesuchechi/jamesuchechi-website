import fs   from 'fs';
import path  from 'node:path';
import matter from 'gray-matter';
import { prisma } from '@/lib/prisma';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

/**
 * Get all posts from the database (or content directory as fallback)
 * @param {'writing' | 'garden'} type
 */
export async function getAllPosts(type = 'writing') {
  try {
    const posts = await prisma.post.findMany({
      where:   { type, published: true },
      orderBy: { date: 'desc' },
    });

    return posts.map(p => ({
      ...p,
      date: p.date.toISOString(),
      readingTime: Math.max(1, Math.ceil(p.content.split(/\s+/).length / 200)),
    }));
  } catch (err) {
    console.error(`Error fetching posts for ${type}:`, err);
    // Fallback to file system if DB fails (optional)
    return getLocalPosts(type);
  }
}

function getLocalPosts(dir = 'writing') {
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
 * Get a single post by slug from the database
 */
export async function getPostBySlug(slug, type = 'writing') {
  try {
    const post = await prisma.post.findUnique({
      where: { slug, type },
    });

    if (post) {
      return {
        ...post,
        date: post.date.toISOString(),
        readingTime: Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)),
      };
    }
  } catch (err) {
    console.error(`Error fetching post ${slug}:`, err);
  }

  // Fallback to file system
  return getLocalPostBySlug(slug, type);
}

function getLocalPostBySlug(slug, dir = 'writing') {
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
export async function getAllTags(dir = 'writing') {
  const posts = await getAllPosts(dir);
  const tagSet = new Set();
  posts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/**
 * Get posts by type (essay | tutorial | til)
 */
export async function getPostsByType(type) {
  const posts = await getAllPosts('writing');
  return posts.filter((p) => p.type === type);
}

/**
 * Get garden notes by stage
 */
export async function getGardenByStage(stage) {
  const posts = await getAllPosts('garden');
  return posts.filter((p) => p.stage === stage);
}
