
/**
 * Great Books — STEPBible TBESG
 * Source : Tyndale House / STEPBible
 * Licence : CC BY 4.0
 *
 * Les données lexicales originales restent inchangées.
 */

export function getTBESGEntries(entries, strongNumber) {
  return entries.filter(
    (entry) => entry.eStrong === strongNumber
  );
}


export async function loadTBESG() {
  const response = await fetch('/lexicons/tbesg-complet.json');

  if (!response.ok) {
    throw new Error(`Chargement TBESG impossible : ${response.status}`);
  }

  return await response.json();
}
