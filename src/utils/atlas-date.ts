// src/utils/atlas-date.ts
export type AtlasUpdate = { iso: string; label: string };
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
/**
 * Prépare l'affichage de la date de dernière mise à jour de l'atlas.
 * Retourne `null` si la date est absente ou invalide (rien n'est alors affiché).
 * Le libellé est en anglais (lang="en" de la page), fuseau UTC pour éviter tout décalage de jour.
 */
export function formatAtlasUpdate(value: unknown): AtlasUpdate | null {
  if (typeof value !== 'string') return null;
  const match = ISO_DAY.exec(value);
  if (!match) return null;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    return null;
  const label = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  return { iso: value, label };
}
