import Fuse from 'fuse.js';
import { getAllPosts } from './content';

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

  return [...writing, ...garden, ...pages];
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
