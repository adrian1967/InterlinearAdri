
// GREAT BOOKS — Tests du dictionnaire TBESG

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const entrees = JSON.parse(
  readFileSync('data-local/tbesg-complet.json', 'utf8')
);

console.log('\n=== GREAT BOOKS — TESTS TBESG ===');

assert.equal(entrees.length, 11035);

console.log('Entrées chargées :', entrees.length);
console.log('Chargement du dictionnaire : OK');


// 1. Intégrité des données

const entreesApplication = JSON.parse(
  readFileSync('static/lexicons/tbesg-complet.json', 'utf8')
);

assert.equal(entreesApplication.length, 11035);

assert.deepEqual(entreesApplication, entrees);

console.log('\n=== INTÉGRITÉ DES DONNÉES ===');
console.log('Entrées locales :', entrees.length);
console.log('Entrées application :', entreesApplication.length);
console.log('Conformité des données : OK');


// 2. Structure des entrées

const champsAttendus = [
  'eStrong',
  'dStrong',
  'uStrong',
  'grec',
  'translitteration',
  'morphologie',
  'sensCourt',
  'definitionOriginale'
];

for (const entree of entrees) {
  for (const champ of champsAttendus) {
    assert.ok(
      Object.hasOwn(entree, champ),
      `Champ manquant : ${champ} dans ${entree.eStrong}`
    );

    assert.equal(
      typeof entree[champ],
      'string',
      `Type incorrect : ${champ} dans ${entree.eStrong}`
    );
  }
}

console.log('\n=== STRUCTURE DES ENTRÉES ===');
console.log('Entrées contrôlées :', entrees.length);
console.log('Champs obligatoires :', champsAttendus.length);
console.log('Structure des entrées : OK');


// 3. Recherche des entrées

const { getTBESGEntries } = await import(
  '../src/lib/lexicon/stepbible/tbesg.js'
);

const motsTests = [
  ['G3056', 'λόγος'],
  ['G0746', 'ἀρχή'],
  ['G1722', 'ἐν']
];

console.log('\n=== RECHERCHE DES ENTRÉES ===');

for (const [numero, grec] of motsTests) {
  const resultats = getTBESGEntries(entrees, numero);

  assert.ok(
    resultats.some(entree =>
       entree.grec.normalize('NFC') === grec.normalize('NFC')
    ),



    `Mot introuvable : ${numero} ${grec}`
  );

  console.log(numero, grec, ': OK');
}

assert.equal(
  getTBESGEntries(entrees, 'G999999').length,
  0
);

console.log('Identifiant inexistant : OK');


// 4. Formatage complet des définitions

const { formaterDefinitionCompleteTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

for (const entree of entrees) {
  const resultat = formaterDefinitionCompleteTBESG(
    entree.definitionOriginale
  );

  assert.ok(
    resultat.trim().length > 0,
    `Définition vide : ${entree.eStrong}`
  );

  assert.ok(
    !/(?:<|&lt;)\/?(?:br|lb|ref|re|note|greek|author|def|date|corr|a)\b/i.test(resultat),
    `Balise indésirable : ${entree.eStrong}`
  );
}

console.log('\n=== FORMATAGE COMPLET ===');
console.log('Entrées contrôlées :', entrees.length);
console.log('Définitions non vides : OK');
console.log('Absence de balises indésirables : OK');



// 5. Conservation intégrale du texte

for (const entree of entrees) {
  const original = entree.definitionOriginale;

  const attendu = original
    .replace(/<br\s*\/?>|<lb\s*\/?>/gi, '\n')
    .replace(/<note>/gi, ' [')
    .replace(/<\/note>/gi, '] ')
    .replace(/<corr>/gi, '[')
    .replace(/<\/corr>/gi, ']')
    .replace(/(\p{L})<author>(?=\p{L})/giu, '$1 ')
    .replace(
      /<a\b[^>]*title="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
      '$2 ($1)'
    )
    .replace(/<[^>]*>/g, '');

  const obtenu = formaterDefinitionCompleteTBESG(original)
    .replace(/<\/?[bi]>/gi, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, '&');

  assert.equal(
    obtenu,
    attendu,
    `Différence textuelle : ${entree.eStrong}`
  );
}

console.log('\n=== CONSERVATION DU TEXTE INTÉGRAL ===');
console.log('Entrées contrôlées :', entrees.length);
console.log('Fidélité textuelle : OK');



// 6. Sécurité DOMPurify

const { default: DOMPurify } = await import(
  'isomorphic-dompurify'
);

function normaliserHTML(texte) {
  return texte
    .replace(/&#39;|&#x27;|&apos;/gi, "'")
    .replace(/&quot;|&#34;/gi, '"');
}

for (const entree of entrees) {
  const avant = formaterDefinitionCompleteTBESG(
    entree.definitionOriginale
  );

  const apres = DOMPurify.sanitize(avant, {
    ALLOWED_TAGS: ['b', 'i'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false
  });

  assert.equal(
    normaliserHTML(apres),
    normaliserHTML(avant),
    `Différence après DOMPurify : ${entree.eStrong}`
  );

  const balises = apres.match(/<[^>]*>/g) || [];

  for (const balise of balises) {
    assert.ok(
      /^<\/?[bi]>$/i.test(balise),
      `Balise inattendue : ${entree.eStrong}`
    );
  }
}

console.log('\n=== SÉCURITÉ DOMPURIFY ===');
console.log('Entrées contrôlées :', entrees.length);
console.log('Conservation du contenu : OK');
console.log('Balises HTML autorisées : OK');



// 7. Extraction des références bibliques

const { extraireReferencesTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const referencesTests = [
  ['G3056', 104],
  ['G0746', 40],
  ['G1722', 69]
];

console.log('\n=== EXTRACTION DES RÉFÉRENCES ===');

for (const [numero, nombreAttendu] of referencesTests) {
  const entree = getTBESGEntries(entrees, numero)[0];

  assert.ok(entree, `Entrée introuvable : ${numero}`);

  const references = extraireReferencesTBESG(
    entree.definitionOriginale
  );

  assert.equal(
    references.length,
    nombreAttendu,
    `Nombre de références incorrect : ${numero}`
  );

  console.log(numero, references.length, ': OK');
}


// 8. Bilan final

console.log('\n========================================');
console.log('GREAT BOOKS — TBESG');
console.log('Entrées contrôlées :', entrees.length);
console.log('TOUS LES TESTS ONT RÉUSSI');
console.log('========================================');
