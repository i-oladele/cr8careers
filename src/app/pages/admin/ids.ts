// Collision-resistant id generator. Date.now() alone collides when several items
// are created within the same millisecond (e.g. rapid clicks), so prefer crypto.randomUUID.
export function uid(prefix: string): string {
  const rand = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${rand}`;
}
