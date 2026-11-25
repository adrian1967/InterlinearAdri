
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


// Test des références imbriquées

const { extraireReferencesCompletesTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

const exempleImbrique =
  "<ref='2Ti.4.8, 10'>II <ref='Tim.4.8'>Tim 4:8</ref>, 10</ref>";

const referencesImbriquees =
  extraireReferencesCompletesTBESG(exempleImbrique);

assert.deepEqual(referencesImbriquees, [
  {
    identifiant: '2Ti.4.8, 10',
    texte: 'II Tim 4:8, 10'
  },
  {
    identifiant: 'Tim.4.8',
    texte: 'Tim 4:8'
  }
]);

console.log('\n=== RÉFÉRENCES IMBRIQUÉES ===');
console.log('Références extraites :', referencesImbriquees.length);
console.log('Identifiants et textes conservés : OK');



// Contrôle global des références bibliques

let referencesOriginales = 0;
let referencesExtraites = 0;

for (const entree of entrees) {
  const original = entree.definitionOriginale;

  const identifiantsOriginaux = [
    ...original.matchAll(/<ref='([^']*)'>/gi)
  ].map(balise => balise[1]);

  const references =
    extraireReferencesCompletesTBESG(original);

  referencesOriginales += identifiantsOriginaux.length;
  referencesExtraites += references.length;

  assert.deepEqual(
    references.map(reference => reference.identifiant),
    identifiantsOriginaux,
    `Différence de références : ${entree.eStrong}`
  );
}

assert.equal(referencesOriginales, 41479);
assert.equal(referencesExtraites, referencesOriginales);

console.log('\n=== CONTRÔLE GLOBAL DES RÉFÉRENCES ===');
console.log('Entrées contrôlées :', entrees.length);
console.log('Références originales :', referencesOriginales);
console.log('Références extraites :', referencesExtraites);
console.log('Conservation des identifiants : OK');


// Contrôle du contenu des références

let contenusControles = 0;

for (const entree of entrees) {
  const references = extraireReferencesCompletesTBESG(
    entree.definitionOriginale
  );

  for (const reference of references) {
    assert.ok(
      reference.texte.trim().length > 0,
      `Référence vide : ${entree.eStrong} ${reference.identifiant}`
    );

    assert.ok(
      !/<\/?ref\b/i.test(reference.texte),
      `Balise restante : ${entree.eStrong} ${reference.identifiant}`
    );

    contenusControles++;
  }
}

assert.equal(contenusControles, 41479);

console.log('\n=== CONTENU DES RÉFÉRENCES ===');
console.log('Références contrôlées :', contenusControles);
console.log('Contenus non vides : OK');
console.log('Absence de balises ref : OK');


// Compatibilité des fonctions d'extraction

let entreesCompatibles196 = 0;
let entreesParticulieres196 = 0;

for (const entree of entrees) {
  const original = entree.definitionOriginale;

  const anciennes = extraireReferencesTBESG(original);
  const nouvelles = extraireReferencesCompletesTBESG(original);

  if (JSON.stringify(anciennes) === JSON.stringify(nouvelles)) {
    entreesCompatibles196++;
  } else {
    entreesParticulieres196++;
    console.log('Cas particulier :', entree.eStrong);
  }
}

console.log('\n=== COMPATIBILITÉ DES EXTRACTIONS ===');
console.log('Entrées contrôlées :', entrees.length);
console.log('Résultats identiques :', entreesCompatibles196);
console.log('Résultats différents :', entreesParticulieres196);


// Validation des six cas particuliers

const casParticuliers197 = entrees
  .filter(entree =>
    JSON.stringify(
      extraireReferencesTBESG(entree.definitionOriginale)
    ) !== JSON.stringify(
      extraireReferencesCompletesTBESG(entree.definitionOriginale)
    )
  )
  .map(entree => entree.dStrong)

  .sort();

console.log('\n=== VALIDATION DES CAS PARTICULIERS ===');

console.log('Identifiants :', casParticuliers197);
console.log('Nombre de cas :', casParticuliers197.length);

assert.equal(casParticuliers197.length, 6);


assert.deepEqual(casParticuliers197, [
  'G0025 =',
  'G3873 =',
  'G4413G =',
  'G4413H = a Meaning of',
  'G4413I = a Meaning of',
  'G4413J = a Meaning of'
]);

console.log('Identifiants détaillés : OK');


console.log('Nombre de cas particuliers : OK');



// Validation des autres références imbriquées

assert.deepEqual(
  extraireReferencesCompletesTBESG(
    "<ref='Bel.1.14, 2,3'>Dan LXX <ref='Bel.1.14'>Bel 1:14</ref>, 2,3</ref>"
  ),
  [
    {
      identifiant: 'Bel.1.14, 2,3',
      texte: 'Dan LXX Bel 1:14, 2,3'
    },
    {
      identifiant: 'Bel.1.14',
      texte: 'Bel 1:14'
    }
  ]
);

assert.deepEqual(
  extraireReferencesCompletesTBESG(
    "<ref='Jhn.8.7; 20.4, 8'>Jhn.8:[<ref='7].20.4'>7] 20:4</ref>, 8</ref>"
  ),
  [
    {
      identifiant: 'Jhn.8.7; 20.4, 8',
      texte: 'Jhn.8:[7] 20:4, 8'
    },
    {
      identifiant: '7].20.4',
      texte: '7] 20:4'
    }
  ]
);

console.log('\n=== VALIDATION DES RÉFÉRENCES IMBRIQUÉES ===');
console.log('Structure G3873 : OK');
console.log('Structure G4413 : OK');


// Validation de la fermeture orpheline

assert.deepEqual(
  extraireReferencesCompletesTBESG(
    "<ref='Jhn.9.1ff; 10.21, 11:37ff'>Jhn.9:1ff; 10.21, 11:37</ref>ff</ref>"
  ),
  [
    {
      identifiant: 'Jhn.9.1ff; 10.21, 11:37ff',
      texte: 'Jhn.9:1ff; 10.21, 11:37'
    }
  ]
);

console.log('\n=== FERMETURE ORPHELINE ===');
console.log('Structure G0455 : OK');


// Validation de la préparation des références

const { preparerReferencesTBESG } = await import(
  '../src/lib/lexicon/stepbible/format-tbesg.js'
);

let referencesPreparees203 = 0;

for (const entree of entrees) {
  const original = entree.definitionOriginale;

  const references = extraireReferencesCompletesTBESG(original);
  const preparees = preparerReferencesTBESG(original);

  assert.deepEqual(
    preparees,
    references.map(reference => ({
      identifiant: reference.identifiant,
      texte: reference.texte,
      cliquable: false
    })),
    `Préparation incorrecte : ${entree.dStrong}`
  );

  referencesPreparees203 += preparees.length;
}

assert.equal(referencesPreparees203, 41479);

console.log('\n=== PRÉPARATION DES RÉFÉRENCES ===');
console.log('Références préparées :', referencesPreparees203);
console.log('Identifiants et contenus conservés : OK');
console.log('Navigation désactivée : OK');


// 8. Bilan final

console.log('\n========================================');
console.log('GREAT BOOKS — TBESG');
console.log('Entrées contrôlées :', entrees.length);
console.log('TOUS LES TESTS ONT RÉUSSI');
console.log('========================================');
