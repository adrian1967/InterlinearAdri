
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
