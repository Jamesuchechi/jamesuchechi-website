import Fuse from 'fuse.js';
import { getAllPosts } from './content';
import { prisma }      from './prisma';

/** Build the search index from all content */
export function buildSearchIndex() {
  const writing = getAllPosts('writing').map(p => ({
    slug:        p.slug,
    title:       p.title,
    description: p.description || '',
    tags:        (p.tags || []).join(' '),
    type:        p.type || '',
    section:     'writing',
    href:        `/writing/${p.slug}`,
  }));

  const garden = getAllPosts('garden').map(p => ({
    slug:        p.slug,
    title:       p.title,
    description: p.description || '',
    tags:        (p.tags || []).join(' '),
    stage:       p.stage || '',
    section:     'garden',
    href:        `/garden/${p.slug}`,
  }));

  const pages = [
    { slug: 'now',    title: 'Now',     description: "What I'm currently working on", section: 'page', href: '/now'    },
    { slug: 'garden', title: 'Garden',  description: 'Notes and ideas in progress',   section: 'page', href: '/garden' },
    { slug: 'uses',   title: 'Uses',    description: 'My tools, stack, and setup',    section: 'page', href: '/uses'   },
  ];

  return { writing, garden, pages };
}

/** Build the complete index including DB content */
export async function getSearchItems() {
  const { writing, garden, pages } = buildSearchIndex();

  try {
    const projects = (await prisma.project.findMany({ where: { published: true } })).map(p => ({
      slug:        p.slug,
      title:       p.title,
      description: p.summary || '',
      tags:        (p.techStack || []).join(' '),
      section:     'projects',
      href:        `/projects`,
    }));

    const albums = (await prisma.galleryAlbum.findMany({ where: { published: true } })).map(a => ({
      slug:        a.slug,
      title:       a.title,
      description: a.description || '',
      section:     'gallery',
      href:        `/gallery/${a.slug}`,
    }));

    const bookmarks = (await prisma.bookmark.findMany({ where: { published: true } })).map(b => ({
      slug:        b.id,
      title:       b.title,
      description: b.description || b.note || '',
      tags:        (b.tags || []).join(' '),
      section:     'bookmarks',
      href:        `/bookmarks`,
    }));

    return [...writing, ...garden, ...pages, ...projects, ...albums, ...bookmarks];
  } catch (err) {
    console.error('Search index DB fetch error:', err);
    return [...writing, ...garden, ...pages];
  }
}

/** Run a search query, returns top 8 results */
export function search(query, items) {
  if (!query?.trim()) return [];

  const fuse = new Fuse(items, {
    keys: [
      { name: 'title',       weight: 0.6 },
      { name: 'description', weight: 0.3 },
      { name: 'tags',        weight: 0.1 },
    ],
    threshold:         0.35,
    includeScore:      true,
    ignoreLocation:    true,
    minMatchCharLength: 2,
  });

  return fuse
    .search(query)
    .slice(0, 8)
    .map(r => r.item);
}
