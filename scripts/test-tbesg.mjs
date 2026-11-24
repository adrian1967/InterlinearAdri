
import { readFileSync, readdirSync } from 'node:fs';

const dossier = 'data-local';

const fichier = readdirSync(dossier).find(
  (nom) => nom.startsWith('TBESG') && nom.endsWith('.txt')
);

if (!fichier) {
  throw new Error('Fichier TBESG introuvable.');
}

const contenu = readFileSync(`${dossier}/${fichier}`, 'utf8');
const lignes = contenu.split(/\r?\n/);

console.log('Dictionnaire :', fichier);
console.log('Nombre de lignes :', lignes.length);
console.log('Première ligne :', lignes[0]);


const motsTests = ['G3056', 'G0746', 'G1722'];

for (const numero of motsTests) {
  const resultats = lignes.filter((ligne) =>
    ligne.split('\t')[0] === numero
  );

  console.log(`\n=== ${numero} : ${resultats.length} entrée(s) ===`);

  for (const ligne of resultats) {
    const colonnes = ligne.split('\t');

    console.log('Grec :', colonnes[3]);
    console.log('Translittération :', colonnes[4]);
    console.log('Grammaire :', colonnes[5]);
    console.log('Sens court :', colonnes[6]);
    console.log('Définition complète :', colonnes[7]);
  }
}

function convertirEntree(ligne) {
  const colonnes = ligne.split('\t');

  if (colonnes.length !== 8) {
    throw new Error(`Nombre de colonnes inattendu : ${colonnes.length}`);
  }

  return {
    eStrong: colonnes[0],
    dStrong: colonnes[1],
    uStrong: colonnes[2],
    grec: colonnes[3],
    translitteration: colonnes[4],
    morphologie: colonnes[5],
    sensCourt: colonnes[6],
    definitionOriginale: colonnes[7]
  };
}

const ligneTest = lignes.find(
  (ligne) => ligne.split('\t')[0] === 'G0746'
);

const entreeTest = convertirEntree(ligneTest);

console.log('\n=== TEST DES 8 CHAMPS ===');
console.log('Champs :', Object.keys(entreeTest));
console.log('Grec :', entreeTest.grec);
console.log('Sens court :', entreeTest.sensCourt);
console.log('Longueur de la définition :', entreeTest.definitionOriginale.length);


const definitionSource = ligneTest.split('\t')[7];

console.log(
  'Définition strictement identique :',
  entreeTest.definitionOriginale === definitionSource
);


import { writeFileSync } from 'node:fs';

const numerosTests = ['G3056', 'G0746', 'G1722'];

const entreesJSON = lignes
  .filter((ligne) => numerosTests.includes(ligne.split('\t')[0]))
  .map(convertirEntree);

writeFileSync(
  'data-local/tbesg-test.json',
  JSON.stringify(entreesJSON, null, 2),
  'utf8'
);

console.log('JSON créé :', entreesJSON.length, 'entrées');


const jsonRelu = JSON.parse(
  readFileSync('data-local/tbesg-test.json', 'utf8')
);

const identique = JSON.stringify(jsonRelu) ===
  JSON.stringify(entreesJSON);

console.log('JSON relu :', jsonRelu.length, 'entrées');
console.log('Données intégralement conservées :', identique);


const lignesLexicales = lignes.filter((ligne) =>
  /^G\d+/.test(ligne)
);

const lignesInvalides = lignesLexicales.filter(
  (ligne) => ligne.split('\t').length !== 8
);

console.log('\n=== CONTRÔLE DU DICTIONNAIRE COMPLET ===');
console.log('Lignes lexicales :', lignesLexicales.length);
console.log('Lignes avec un nombre de colonnes incorrect :', lignesInvalides.length);


const champsVides = lignesLexicales.filter((ligne) => {
  const colonnes = ligne.split('\t');

  return (
    !colonnes[0].trim() ||
    !colonnes[3].trim() ||
    !colonnes[7].trim()
  );
});

console.log('Entrées avec champ essentiel vide :', champsVides.length);


for (const ligne of champsVides) {
  const colonnes = ligne.split('\t');

  console.log('\n=== ENTRÉE À EXAMINER ===');
  console.log('Identifiant :', colonnes[0]);
  console.log('Mot grec :', colonnes[3]);
  console.log('Sens court :', colonnes[6]);
  console.log('Longueur de définition :', colonnes[7].length);
}


const entrees2199 = lignesLexicales
  .filter((ligne) => ligne.split('\t')[0] === 'G2199')
  .map(convertirEntree);

for (const entree of entrees2199) {
  console.log(
    entree.eStrong,
    entree.dStrong,
    entree.grec || '[champ grec vide]',
    entree.sensCourt
  );
}


const entreesCompletes = lignesLexicales.map(convertirEntree);

const identifiants = entreesCompletes.map(
  (entree) => entree.dStrong.split(' ')[0]
);

const identifiantsVides = identifiants.filter(
  (id) => !id
);

const doublons = identifiants.filter(
  (id, index) => identifiants.indexOf(id) !== index
);

console.log('\n=== CONTRÔLE DES IDENTIFIANTS ===');
console.log('Entrées :', entreesCompletes.length);
console.log('Identifiants détaillés vides :', identifiantsVides.length);
console.log('Identifiants détaillés répétés :', doublons.length);


writeFileSync(
  'data-local/tbesg-complet.json',
  JSON.stringify(entreesCompletes, null, 2),
  'utf8'
);

const jsonCompletRelu = JSON.parse(
  readFileSync('data-local/tbesg-complet.json', 'utf8')
);

console.log('\n=== EXPORT COMPLET TBESG ===');
console.log('Entrées exportées :', jsonCompletRelu.length);
console.log(
  'Données identiques :',
  JSON.stringify(jsonCompletRelu) ===
    JSON.stringify(entreesCompletes)
);


const { getTBESGEntries } = await import(
  '../src/lib/lexicon/stepbible/tbesg.js'
);

const resultats2199 = getTBESGEntries(
  jsonCompletRelu,
  'G2199'
);

console.log('\n=== TEST DU MODULE TBESG ===');
console.log('Entrées G2199 trouvées :', resultats2199.length);

for (const entree of resultats2199) {
  console.log(
    entree.dStrong,
    entree.grec || '[champ grec vide]',
    entree.sensCourt
  );
}


console.log('\n=== TEST DES TROIS MOTS ===');

for (const numero of ['G3056', 'G0746', 'G1722']) {
  const resultats = getTBESGEntries(jsonCompletRelu, numero);

  console.log(
    numero,
    resultats.length,
    resultats.map((entree) => entree.grec).join(', ')
  );
}


const { formatTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const texteEssai = 'Première ligne<BR />Deuxième ligne';

const resultatFormatage = formatTBESG(texteEssai);

console.log('\n=== TEST DU FORMATAGE TBESG ===');
console.log('Résultat correct :',
  resultatFormatage === 'Première ligne\nDeuxième ligne'
);


const texteTypographie =
  '<b>Mot important</b><BR /><i>Note en italique</i>';

const resultatTypographie = formatTBESG(texteTypographie);

console.log('\n=== TEST TYPOGRAPHIE TBESG ===');

console.log(
  'Gras conservé :',
  resultatTypographie.includes('<b>Mot important</b>')
);

console.log(
  'Italique conservé :',
  resultatTypographie.includes('<i>Note en italique</i>')
);

console.log(
  'Retour à la ligne correct :',
  resultatTypographie.includes('\n')
);


const entreeLogos = getTBESGEntries(jsonCompletRelu, 'G3056')[0];

const balisesLogos = [
  ...new Set(
    [...entreeLogos.definitionOriginale.matchAll(/<\/?([a-zA-Z]+)\b[^>]*>/g)]
      .map((resultat) => resultat[1].toLowerCase())
  )
];

console.log('\n=== BALISES DE LA DÉFINITION LOGOS ===');
console.log(balisesLogos);


const toutesLesBalises = new Set();

for (const entree of jsonCompletRelu) {
  const texte = entree.definitionOriginale || '';

  for (const resultat of texte.matchAll(/<\/?([a-zA-Z]+)\b[^>]*>/g)) {
    toutesLesBalises.add(resultat[1].toLowerCase());
  }
}

console.log('\n=== BALISES DU DICTIONNAIRE COMPLET ===');
console.log([...toutesLesBalises].sort());


console.log('\n=== EXEMPLES DE BALISES PARTICULIÈRES ===');

for (const balise of [
  'a', 'author', 'corr', 'date',
  'def', 'greek', 'lb', 'note', 're'
]) {
  const entree = jsonCompletRelu.find((item) =>
    new RegExp(`<${balise}(?=[\\s>])`, 'i')
      .test(item.definitionOriginale || '')
  );

  if (!entree) {
    console.log(balise, ': aucun exemple trouvé');
    continue;
  }

  const texte = entree.definitionOriginale;
  const position = texte.search(
    new RegExp(`<${balise}(?=[\\s>])`, 'i')
  );

  console.log(
    balise,
    entree.dStrong,
    texte.slice(position, position + 180)
  );
}

const compteBalises = {};

for (const entree of jsonCompletRelu) {
  const texte = entree.definitionOriginale || '';

  for (const resultat of texte.matchAll(/<\/?([a-zA-Z]+)\b[^>]*>/g)) {
    const nom = resultat[1].toLowerCase();
    compteBalises[nom] = (compteBalises[nom] || 0) + 1;
  }
}

console.log('\n=== FRÉQUENCE DES BALISES TBESG ===');
console.table(compteBalises);


const { echapperHTML } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const texteSecurite = '<b>λόγος</b> & "Parole"';

const resultatSecurite = echapperHTML(texteSecurite);

console.log('\n=== TEST SÉCURITÉ HTML ===');

console.log(
  'Échappement correct :',
  resultatSecurite ===
    '&lt;b&gt;λόγος&lt;/b&gt; &amp; &quot;Parole&quot;'
);

console.log('Résultat :', resultatSecurite);


const { formaterTypographieTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const texteTest57 =
  '<b>λόγος</b> et <i>Parole</i> & <script>test</script>';

const resultatTest57 = formaterTypographieTBESG(texteTest57);

console.log('\n=== TEST TYPOGRAPHIE SÉCURISÉE ===');

console.log(
  'Résultat correct :',
  resultatTest57 ===
    '<b>λόγος</b> et <i>Parole</i> &amp; &lt;script&gt;test&lt;/script&gt;'
);

console.log('Résultat :', resultatTest57);


const resultatReel58 = formaterTypographieTBESG(
  entreeLogos.definitionOriginale
);

console.log('\n=== TEST RÉEL TBESG ===');

console.log(
  'Gras présent :',
  resultatReel58.includes('<b>')
);

console.log(
  'Italique présent :',
  resultatReel58.includes('<i>')
);

console.log(
  'Références protégées :',
  resultatReel58.includes('&lt;ref')
);

console.log(
  'Texte original inchangé :',
  entreeLogos.definitionOriginale.includes('<ref')
);


console.log('\n=== TEST TYPOGRAPHIE DES TROIS MOTS ===');

for (const numero of ['G3056', 'G0746', 'G1722']) {
  const entree = getTBESGEntries(jsonCompletRelu, numero)[0];

  const resultat = formaterTypographieTBESG(
    entree.definitionOriginale
  );

  console.log(
    numero,
    'Définition présente :',
    resultat.length > 0,
    'Original inchangé :',
    entree.definitionOriginale.length > 0
  );
}


const texteTest60 =
  '<b>λόγος</b> <ref="Jn.1.1">Jean 1:1</ref>';

const resultatTest60 = formaterTypographieTBESG(texteTest60);

console.log('\n=== TEST RÉFÉRENCE BIBLIQUE ===');

console.log(
  'Gras conservé :',
  resultatTest60.includes('<b>λόγος</b>')
);

console.log(
  'Référence protégée :',
  resultatTest60.includes('&lt;ref=')
);

console.log(
  'Référence textuelle conservée :',
  resultatTest60.includes('Jean 1:1')
);


const { formaterReferenceTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const referenceTest62 =
  "<ref='Jn.1.1'>Jean 1:1</ref>";

const resultatTest62 = formaterReferenceTBESG(referenceTest62);

console.log('\n=== TEST RÉFÉRENCE TBESG ===');

console.log(
  'Référence correctement formatée :',
  resultatTest62 === 'Jean 1:1'
);

console.log(
  'Texte original conservé :',
  referenceTest62 === "<ref='Jn.1.1'>Jean 1:1</ref>"
);


const original63 = entreeLogos.definitionOriginale;

const resultat63 = formaterReferenceTBESG(original63);

console.log('\n=== TEST RÉEL DES RÉFÉRENCES TBESG ===');

console.log(
  'Références présentes dans l’original :',
  original63.includes('<ref=')
);

console.log(
  'Références formatées :',
  !resultat63.includes('<ref=')
);

console.log(
  'Définition originale inchangée :',
  entreeLogos.definitionOriginale === original63
);


console.log('\n=== TEST DE CONSERVATION TBESG ===');

console.log(
  'Grec conservé :',
  resultat63.includes('λόγος')
);

console.log(
  'Gras conservé :',
  resultat63.includes('<b>')
);

console.log(
  'Italique conservé :',
  resultat63.includes('<i>')
);

console.log(
  'Longueur du texte :',
  resultat63.length
);


console.log('\n=== VÉRIFICATION DU GREC ===');

console.log(
  'Grec dans original :',
  /[\u0370-\u03FF\u1F00-\u1FFF]/u.test(original63)
);

console.log(
  'Grec dans résultat :',
  /[\u0370-\u03FF\u1F00-\u1FFF]/u.test(resultat63)
);


const extraireGrec66 = (texte) =>
  (texte.match(/[\u0370-\u03FF\u1F00-\u1FFF]/gu) || []).join('');

console.log('\n=== COMPARAISON INTÉGRALE DU GREC ===');

console.log(
  'Tous les caractères grecs identiques :',
  extraireGrec66(original63) === extraireGrec66(resultat63)
);

console.log(
  'Nombre de caractères grecs originaux :',
  extraireGrec66(original63).length
);

console.log(
  'Nombre de caractères grecs formatés :',
  extraireGrec66(resultat63).length
);


const references67 = [
  ...original63.matchAll(/<ref='([^']*)'>(.*?)<\/ref>/gi)
];

console.log('\n=== CONTRÔLE DES RÉFÉRENCES ===');

console.log(
  'Nombre de références originales :',
  references67.length
);

console.log(
  'Tous les textes de référence conservés :',
  references67.every((reference) =>
    resultat63.includes(reference[2])
  )
);


console.log('\n=== IDENTIFIANTS DES RÉFÉRENCES ===');

console.log(
  'Nombre de références :',
  references67.length
);

console.log(
  'Identifiants vides :',
  references67.filter((reference) =>
    reference[1].trim() === ''
  ).length
);

console.log(
  'Exemples des cinq premières références :',
  references67.slice(0, 5).map((reference) => ({
    identifiant: reference[1],
    texte: reference[2]
  }))
);


const referencesMultiples69 = references67.filter(
  (reference) => reference[1].includes(',')
);

console.log('\n=== RÉFÉRENCES MULTIPLES TBESG ===');

console.log(
  'Nombre de références avec virgule :',
  referencesMultiples69.length
);

console.log(
  'Exemples :',
  referencesMultiples69.slice(0, 5).map(
    (reference) => reference[1]
  )
);


console.log('\n=== CONSERVATION DES RÉFÉRENCES MULTIPLES ===');

for (const reference of referencesMultiples69) {
  console.log(
    reference[1],
    'Texte conservé :',
    resultat63.includes(reference[2])
  );
}


const { extraireReferencesTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const references72 = extraireReferencesTBESG(
  entreeLogos.definitionOriginale
);

console.log('\n=== TEST EXTRACTION DES RÉFÉRENCES ===');

console.log(
  '104 références retrouvées :',
  references72.length === 104
);

console.log(
  'Identifiants conservés :',
  references72.every((ref) => ref.identifiant.length > 0)
);

console.log(
  'Textes conservés :',
  references72.every((ref, index) =>
    ref.texte === references67[index][2]
  )
);


const referencesMultiples73 = references72.filter(
  (reference) => reference.identifiant.includes(',')
);

console.log('\n=== EXTRACTION DES RÉFÉRENCES MULTIPLES ===');

console.log(
  'Quatre références retrouvées :',
  referencesMultiples73.length === 4
);

console.log(
  'Identifiants et textes identiques à la source :',
  referencesMultiples73.every((reference, index) =>
    reference.identifiant === referencesMultiples69[index][1] &&
    reference.texte === referencesMultiples69[index][2]
  )
);


console.log('\n=== RÉFÉRENCES DES TROIS MOTS ===');

for (const numero of ['G3056', 'G0746', 'G1722']) {
  const entree = getTBESGEntries(jsonCompletRelu, numero)[0];

  const references = extraireReferencesTBESG(
    entree.definitionOriginale
  );

  console.log(
    numero,
    'Références :', references.length,
    'Identifiants présents :',
    references.every((ref) => ref.identifiant.length > 0)
  );
}


const { preparerReferencesTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

console.log('\n=== TEST PRÉPARATION DES RÉFÉRENCES ===');

for (const numero of ['G3056', 'G0746', 'G1722']) {
  const entree = getTBESGEntries(jsonCompletRelu, numero)[0];

  const references = preparerReferencesTBESG(
    entree.definitionOriginale
  );

  const originales = extraireReferencesTBESG(
    entree.definitionOriginale
  );

  console.log(
    numero,
    'Nombre correct :',
    references.length === originales.length,
    'Données préservées :',
    references.every((ref, index) =>
      ref.identifiant === originales[index].identifiant &&
      ref.texte === originales[index].texte &&
      ref.cliquable === false
    )
  );
}

const { formaterNotesTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const noteTest84 =
  '<note>Abbott-Smith has ὑμῖν.</note>';

const resultatTest84 = formaterNotesTBESG(noteTest84);

console.log('\n=== TEST DES NOTES TBESG ===');

console.log(
  'Formatage correct :',
  resultatTest84.trim() === '[Abbott-Smith has ὑμῖν.]'
);

console.log(
  'Grec conservé :',
  resultatTest84.includes('ὑμῖν')
);

console.log(
  'Texte original inchangé :',
  noteTest84 === '<note>Abbott-Smith has ὑμῖν.</note>'
);


const texteTest88 = 'λόγος<BR />ἀρχή<lb />ἐν';

const resultatTest88 = formatTBESG(texteTest88);

console.log('\n=== TEST DES RETOURS À LA LIGNE ===');

console.log(
  'Balise BR correctement traitée :',
  resultatTest88.includes('λόγος\nἀρχή')
);

console.log(
  'Balise lb correctement traitée :',
  resultatTest88.includes('ἀρχή\nἐν')
);

console.log(
  'Résultat intégral correct :',
  resultatTest88 === 'λόγος\nἀρχή\nἐν'
);


let definitionsModifiees89 = 0;
let definitionsPerdues89 = 0;

for (const entree of jsonCompletRelu) {
  const original = entree.definitionOriginale;
  const resultat = formatTBESG(original);

  if (entree.definitionOriginale !== original) {
    definitionsModifiees89++;
  }

  if (original.length > 0 && resultat.length === 0) {
    definitionsPerdues89++;
  }
}

console.log('\n=== CONTRÔLE GLOBAL DU FORMATAGE ===');

console.log('Entrées contrôlées :', jsonCompletRelu.length);
console.log('Définitions originales modifiées :', definitionsModifiees89);
console.log('Définitions perdues :', definitionsPerdues89);


let nombreNotes90 = 0;
let notesPerdues90 = 0;

for (const entree of jsonCompletRelu) {
  const original = entree.definitionOriginale;
  const resultat = formaterNotesTBESG(original);

  const notes = [
    ...original.matchAll(/<note>([\s\S]*?)<\/note>/gi)
  ];

  for (const note of notes) {
    nombreNotes90++;

    if (!resultat.includes(`[${note[1]}]`)) {
      notesPerdues90++;
    }
  }
}

console.log('\n=== CONTRÔLE GLOBAL DES NOTES ===');

console.log('Notes contrôlées :', nombreNotes90);
console.log('Notes perdues :', notesPerdues90);


let nombreReferences91 = 0;
let referencesPerdues91 = 0;
let identifiantsVides91 = 0;

for (const entree of jsonCompletRelu) {
  const original = entree.definitionOriginale;
  const resultat = formaterReferenceTBESG(original);
  const references = extraireReferencesTBESG(original);

  for (const reference of references) {
    nombreReferences91++;

    if (!resultat.includes(reference.texte)) {
      referencesPerdues91++;
    }

    if (!reference.identifiant.trim()) {
      identifiantsVides91++;
    }
  }
}

console.log('\n=== CONTRÔLE GLOBAL DES RÉFÉRENCES ===');

console.log('Références contrôlées :', nombreReferences91);
console.log('Textes de référence perdus :', referencesPerdues91);
console.log('Identifiants vides :', identifiantsVides91);


let ouvrantes92 = 0;
let fermantes92 = 0;

for (const entree of jsonCompletRelu) {
  const texte = entree.definitionOriginale;

  ouvrantes92 +=
    (texte.match(/<ref\b[^>]*>/gi) || []).length;

  fermantes92 +=
    (texte.match(/<\/ref\s*>/gi) || []).length;
}

console.log('\n=== INVENTAIRE DES BALISES REF ===');

console.log('Balises ouvrantes :', ouvrantes92);
console.log('Balises fermantes :', fermantes92);
console.log('Références extraites :', nombreReferences91);
console.log('Total des balises :', ouvrantes92 + fermantes92);


console.log('\n=== ENTRÉES PARTICULIÈRES REF ===');

for (const entree of jsonCompletRelu) {
  const texte = entree.definitionOriginale;

  const ouvrantes =
    (texte.match(/<ref\b[^>]*>/gi) || []).length;

  const fermantes =
    (texte.match(/<\/ref\s*>/gi) || []).length;

  const extraites =
    extraireReferencesTBESG(texte).length;

  if (ouvrantes !== extraites || fermantes !== extraites) {
    console.log(
      entree.dStrong,
      entree.grec,
      'Ouvrantes :', ouvrantes,
      'Fermantes :', fermantes,
      'Extraites :', extraites
    );
  }
}


console.log('\n=== BALISES REF NON RECONNUES ===');

for (const entree of jsonCompletRelu) {
  const reste = entree.definitionOriginale.replace(
    /<ref='[^']*'>(.*?)<\/ref>/gi,
    (reference) => ' '.repeat(reference.length)
  );

  for (const balise of reste.matchAll(/<\/?ref\b[^>]*>/gi)) {
    console.log(
      entree.dStrong,
      entree.definitionOriginale.slice(
        Math.max(0, balise.index - 40),
        balise.index + balise[0].length + 60
      )
    );
  }
}


console.log('\n=== DÉFINITIONS ORIGINALES À EXAMINER ===');

for (const entree of jsonCompletRelu) {
  const texte = entree.definitionOriginale;

  const ouvrantes =
    (texte.match(/<ref\b[^>]*>/gi) || []).length;

  const fermantes =
    (texte.match(/<\/ref\s*>/gi) || []).length;

  const extraites =
    extraireReferencesTBESG(texte).length;

  if (ouvrantes !== extraites || fermantes !== extraites) {
    console.log('\nIDENTIFIANT :', entree.dStrong);
    console.log('GREC :', entree.grec);
    console.log(texte);
  }
}


let imbriquees96 = 0;
let fermeturesOrphelines96 = 0;
let ouverturesNonFermees96 = 0;

for (const entree of jsonCompletRelu) {
  let profondeur = 0;

  for (const balise of entree.definitionOriginale
    .matchAll(/<\/?ref\b[^>]*>/gi)) {

    if (balise[0].startsWith('</')) {
      if (profondeur === 0) {
        fermeturesOrphelines96++;
      } else {
        profondeur--;
      }
    } else {
      if (profondeur > 0) {
        imbriquees96++;
      }

      profondeur++;
    }
  }

  ouverturesNonFermees96 += profondeur;
}

console.log('\n=== STRUCTURE DES RÉFÉRENCES TBESG ===');

console.log('Références imbriquées :', imbriquees96);
console.log('Fermetures orphelines :', fermeturesOrphelines96);
console.log('Ouvertures non fermées :', ouverturesNonFermees96);


const { formaterReferencesCompletesTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

console.log('\n=== TEST DES RÉFÉRENCES COMPLEXES ===');

console.log(
  'Référence normale :',
  formaterReferencesCompletesTBESG(
    "<ref='Jhn.1.1'>Jhn.1:1</ref>"
  ) === 'Jhn.1:1'
);

console.log(
  'Références imbriquées :',
  formaterReferencesCompletesTBESG(
    "<ref='2Ti.4.8, 10'>II <ref='Tim.4.8'>Tim 4:8</ref>, 10</ref>"
  ) === 'II Tim 4:8, 10'
);

console.log(
  'Fermeture orpheline :',
  formaterReferencesCompletesTBESG(
    "<ref='Jhn.9.1'>Jhn.9:1</ref>ff</ref>"
  ) === 'Jhn.9:1ff'
);


let balisesRestantes99 = 0;
let originauxModifies99 = 0;

for (const entree of jsonCompletRelu) {
  const original = entree.definitionOriginale;

  const resultat =
    formaterReferencesCompletesTBESG(original);

  balisesRestantes99 +=
    (resultat.match(/<\/?ref\b[^>]*>/gi) || []).length;

  if (entree.definitionOriginale !== original) {
    originauxModifies99++;
  }
}

console.log('\n=== CONTRÔLE GLOBAL DES RÉFÉRENCES COMPLEXES ===');

console.log('Entrées contrôlées :', jsonCompletRelu.length);
console.log('Balises ref restantes :', balisesRestantes99);
console.log('Originaux modifiés :', originauxModifies99);


const { formaterReTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const texteTest104 = '<re><i>SYN.</i>: φιλέω</re>';

const resultatTest104 = formaterReTBESG(texteTest104);

console.log('\n=== TEST DES BALISES RE ===');

console.log(
  'Formatage correct :',
  resultatTest104 === '<i>SYN.</i>: φιλέω'
);

console.log(
  'Grec conservé :',
  resultatTest104.includes('φιλέω')
);

console.log(
  'Italique conservé :',
  resultatTest104.includes('<i>SYN.</i>')
);


let balisesOriginales105 = 0;
let balisesRestantes105 = 0;
let contenusModifies105 = 0;

for (const entree of jsonCompletRelu) {
  const original = entree.definitionOriginale;
  const resultat = formaterReTBESG(original);

  balisesOriginales105 +=
    (original.match(/<\/?re\b[^>]*>/gi) || []).length;

  balisesRestantes105 +=
    (resultat.match(/<\/?re\b[^>]*>/gi) || []).length;

  const attendu = original
    .split(/<\/?re>/gi)
    .join('');

  if (resultat !== attendu) {
    contenusModifies105++;
  }
}

console.log('\n=== CONTRÔLE GLOBAL DES BALISES RE ===');

console.log('Entrées contrôlées :', jsonCompletRelu.length);
console.log('Balises originales :', balisesOriginales105);
console.log('Balises restantes :', balisesRestantes105);
console.log('Contenus modifiés :', contenusModifies105);


const { formaterGreekTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

let balisesOriginales109 = 0;
let balisesRestantes109 = 0;
let contenusModifies109 = 0;

for (const entree of jsonCompletRelu) {
  const original = entree.definitionOriginale;
  const resultat = formaterGreekTBESG(original);

  balisesOriginales109 +=
    (original.match(/<\/?greek\b[^>]*>/gi) || []).length;

  balisesRestantes109 +=
    (resultat.match(/<\/?greek\b[^>]*>/gi) || []).length;

  const attendu = original
    .split(/<\/?greek>/gi)
    .join('');

  if (resultat !== attendu) {
    contenusModifies109++;
  }
}

console.log('\n=== CONTRÔLE GLOBAL DES BALISES GREEK ===');

console.log('Entrées contrôlées :', jsonCompletRelu.length);
console.log('Balises originales :', balisesOriginales109);
console.log('Balises restantes :', balisesRestantes109);
console.log('Contenus modifiés :', contenusModifies109);


const { formaterAuthorTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

let balisesOriginales113 = 0;
let balisesRestantes113 = 0;
let contenusModifies113 = 0;

for (const entree of jsonCompletRelu) {
  const original = entree.definitionOriginale;
  const resultat = formaterAuthorTBESG(original);

  balisesOriginales113 +=
    (original.match(/<\/?author\b[^>]*>/gi) || []).length;

  balisesRestantes113 +=
    (resultat.match(/<\/?author\b[^>]*>/gi) || []).length;

  const attendu = original
    .split(/<\/?author>/gi)
    .join('');

  if (resultat !== attendu) {
    contenusModifies113++;
  }
}

console.log('\n=== CONTRÔLE GLOBAL DES BALISES AUTHOR ===');

console.log('Entrées contrôlées :', jsonCompletRelu.length);
console.log('Balises originales :', balisesOriginales113);
console.log('Balises restantes :', balisesRestantes113);
console.log('Contenus modifiés :', contenusModifies113);


const { formaterDefTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

let balisesOriginales117 = 0;
let balisesRestantes117 = 0;
let contenusModifies117 = 0;

for (const entree of jsonCompletRelu) {
  const original = entree.definitionOriginale;
  const resultat = formaterDefTBESG(original);

  balisesOriginales117 +=
    (original.match(/<\/?def\b[^>]*>/gi) || []).length;

  balisesRestantes117 +=
    (resultat.match(/<\/?def\b[^>]*>/gi) || []).length;

  const attendu = original
    .split(/<\/?def>/gi)
    .join('');

  if (resultat !== attendu) {
    contenusModifies117++;
  }
}

console.log('\n=== CONTRÔLE GLOBAL DES BALISES DEF ===');

console.log('Entrées contrôlées :', jsonCompletRelu.length);
console.log('Balises originales :', balisesOriginales117);
console.log('Balises restantes :', balisesRestantes117);
console.log('Contenus modifiés :', contenusModifies117);
