
/**
 * Great Books — Présentation du dictionnaire TBESG
 * Les données originales ne sont jamais modifiées.
 */

export function formatTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte
    .replace(/<BR\s*\/>/gi, '\n')
    .replace(/<lb\s*\/>/gi, '\n');
}



export function echapperHTML(texte) {
  if (typeof texte !== 'string') return '';

  return texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


export function formaterTypographieTBESG(texte) {
  if (typeof texte !== 'string') return '';

  const balises = /(<\/?(?:b|i)>)/gi;
  const morceaux = texte.split(balises);

  return morceaux.map((morceau) => {
    const balise = morceau.toLowerCase();

    if (balise === '<b>' || balise === '</b>' ||
        balise === '<i>' || balise === '</i>') {
      return morceau;
    }

    return echapperHTML(morceau);
  }).join('');
}


export function formaterReferenceTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(
    /<ref='[^']*'>(.*?)<\/ref>/gi,
    (_, contenu) => contenu
  );
}


export function extraireReferencesTBESG(texte) {
  if (typeof texte !== 'string') return [];

  return [...texte.matchAll(/<ref='([^']*)'>(.*?)<\/ref>/gi)]
    .map((resultat) => ({
      identifiant: resultat[1],
      texte: resultat[2]
    }));
}


export function preparerReferencesTBESG(texte) {
  return extraireReferencesTBESG(texte).map((reference) => ({
    identifiant: reference.identifiant,
    texte: reference.texte,
    cliquable: false
  }));
}


export function formaterNotesTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(
    /<note>([\s\S]*?)<\/note>/gi,
    (_, contenu) => ` [${contenu}] `
  );
}


export function formaterReferencesCompletesTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte
    .replace(/<ref='[^']*'>/gi, '')
    .replace(/<\/ref\s*>/gi, '');
}


export function formaterReTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(/<\/?re>/gi, '');
}


export function formaterGreekTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(/<\/?greek>/gi, '');
}

export function formaterAuthorTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(/<\/?author>/gi, '');
}


export function formaterDefTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(/<\/?def>/gi, '');
}
