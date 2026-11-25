
/**
 * Great Books — Présentation du dictionnaire TBESG
 * Les données originales ne sont jamais modifiées.
 */

export function formatTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<lb\s*\/?>/gi, '\n');
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

  return extraireReferencesCompletesTBESG(texte).map((reference) => ({
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

  return texte
    .replace(/(\p{L})<author>(?=\p{L})/giu, '$1 ')
    .replace(/<\/?author>/gi, '');
}


export function formaterDefTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(/<\/?def>/gi, '');
}


export function formaterDateTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(/<\/?date>/gi, '');
}


export function formaterCorrTBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(
    /<corr>([\s\S]*?)<\/corr>/gi,
    (_, contenu) => `[${contenu}]`
  );
}


export function formaterATBESG(texte) {
  if (typeof texte !== 'string') return '';

  return texte.replace(
    /<a href="javascript:void\(0\)" title="([^"]+)">([\s\S]*?)<\/a>/gi,
    (_, titre, contenu) => `${contenu} (${titre})`
  );
}


export function formaterDefinitionCompleteTBESG(texte) {
  let resultat = formatTBESG(texte);

  resultat = formaterReferencesCompletesTBESG(resultat);
  resultat = formaterNotesTBESG(resultat);
  resultat = formaterReTBESG(resultat);
  resultat = formaterGreekTBESG(resultat);
  resultat = formaterAuthorTBESG(resultat);
  resultat = formaterDefTBESG(resultat);
  resultat = formaterDateTBESG(resultat);
  resultat = formaterCorrTBESG(resultat);
  resultat = formaterATBESG(resultat);
  resultat = formaterTypographieTBESG(resultat);

  return resultat;
}


export function extraireReferencesCompletesTBESG(texte) {
  if (typeof texte !== 'string') return [];

  const references = [];
  const pile = [];

  const balises = /<ref='([^']*)'>|<\/ref\s*>/gi;

  for (const balise of texte.matchAll(balises)) {
    if (balise[1] !== undefined) {
      const reference = {
        identifiant: balise[1],
        texte: ''
      };

      references.push(reference);

      pile.push({
        reference,
        debut: balise.index + balise[0].length
      });
    } else if (pile.length > 0) {
      const { reference, debut } = pile.pop();

      reference.texte = texte
        .slice(debut, balise.index)
        .replace(/<ref='[^']*'>|<\/ref\s*>/gi, '');
    }
  }

  return references;
}
