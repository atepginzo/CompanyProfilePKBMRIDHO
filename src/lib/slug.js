export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function generateUniqueSlug(text, model, prisma, excludeId = null) {
  let slug = generateSlug(text);
  let counter = 0;
  let candidateSlug = slug;

  while (true) {
    const where = { slug: candidateSlug };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const existing = await model.findFirst({ where });
    if (!existing) break;

    counter++;
    candidateSlug = `${slug}-${counter}`;
  }

  return candidateSlug;
}
