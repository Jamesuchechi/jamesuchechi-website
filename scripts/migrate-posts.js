const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

async function migrate() {
  const dirs = ['writing', 'garden'];
  
  for (const dir of dirs) {
    const dirPath = path.join(CONTENT_ROOT, dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
    
    for (const filename of files) {
      const slug = filename.replace(/\.mdx?$/, '');
      const raw = fs.readFileSync(path.join(dirPath, filename), 'utf-8');
      const { data: frontmatter, content } = matter(raw);

      console.log(`Migrating ${dir}/${slug}...`);

      const date = frontmatter.date ? new Date(frontmatter.date) : new Date();

      await prisma.post.upsert({
        where: { slug },
        update: {
          title: frontmatter.title || slug,
          description: frontmatter.description || null,
          content: content,
          type: dir,
          category: frontmatter.type || null,
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          published: !frontmatter.draft,
          date: date,
        },
        create: {
          title: frontmatter.title || slug,
          slug: slug,
          description: frontmatter.description || null,
          content: content,
          type: dir,
          category: frontmatter.type || null,
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          published: !frontmatter.draft,
          date: date,
        },
      });
    }
  }
  console.log('Migration complete!');
}

migrate()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
