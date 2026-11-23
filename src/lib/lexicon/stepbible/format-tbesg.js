
/**
 * Great Books — Présentation du dictionnaire TBESG
 * Les données originales ne sont jamais modifiées.
 */

export function formatTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(/<BR\s*\/>/gi, '\n');
}
