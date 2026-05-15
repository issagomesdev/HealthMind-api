function normalizeBase(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20)
}

export async function generateUniqueUsername(
  name: string,
  findByUsername: (username: string) => Promise<unknown | null>,
): Promise<string> {
  const base = normalizeBase(name) || 'user'

  if (!(await findByUsername(base))) return base

  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = Math.floor(Math.random() * 9000) + 1000
    const candidate = `${base.slice(0, 20)}${suffix}`
    if (!(await findByUsername(candidate))) return candidate
  }

  // fallback determinístico: não deve chegar aqui na prática
  return `${base.slice(0, 14)}${Date.now().toString().slice(-6)}`
}
