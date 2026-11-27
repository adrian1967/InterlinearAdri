<script>
  // -----------------------------
  // ETAT GLOBAL
  // -----------------------------

import vaticanus1353 from '$lib/assets/vaticanus/Vaticanus_1353.jpg';

import { loadTBESG, getTBESGEntries } from '$lib/lexicon/stepbible/tbesg.js';

import { formaterDefinitionCompleteTBESG } from '$lib/lexicon/stepbible/format-tbesg.js';


  let selectedWord = null;

let tbesgEntrees = [];
let tbesgChargement = false;
let tbesgErreur = '';

let dictionnaireActif = 'strong';

$: tbesgResultats = selectedWord?.strong
  ? getTBESGEntries(tbesgEntrees, selectedWord.strong)
  : [];

function selectionnerDictionnaire(dictionnaire) {
  dictionnaireActif = dictionnaire;

  if (dictionnaire === 'tbesg') {
    chargerDictionnaireTBESG();
  }
}



async function chargerDictionnaireTBESG() {
  if (tbesgEntrees.length > 0 || tbesgChargement) return;

  tbesgChargement = true;
  tbesgErreur = '';

  try {
    tbesgEntrees = await loadTBESG();
  } catch (erreur) {
    tbesgErreur = erreur.message;
  } finally {
    tbesgChargement = false;
  }
}


  let screen = "home"; // "home" | "gospels" | "chapters" | "read"
  let selectedDocument = null;
  const documents = [
  {
    title: "Diplomatic Transcription",
    content: extractDiplomaticLines(diplomaticText)
  },
  {
    title: "Interlinear Reading",
    content: interlinearText
  },
  {
    title: "General Conventions",
    content: conventionsText
  }
];

function extractDiplomaticLines(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex(line =>
    /^\s*1\.\s*[Α-Ωα-ω]/u.test(line)
  );

  if (start === -1) return text;

  return lines.slice(start, start + 42).join("\n");
}

function extractDiplomaticNotes(text) {
  const start = text.indexOf("Annotations marginales");

  if (start === -1) {
    return "No manuscript notes available.";
  }

  const end = text.indexOf("Statut du document", start);

  return text.slice(
    start,
    end === -1 ? undefined : end
  ).trim();
}

  let showManuscriptNotes = false;
  let comparisonMode = true;
  let showMarginalAnnotations = false;

  let workspaceScrollPercent = 0;

function getWorkspaceScroller() {
  let element = document.getElementById('manuscript-workspace');

  while (element) {
    const style = window.getComputedStyle(element);

    if (
      element.scrollHeight > element.clientHeight + 2 &&
      /(auto|scroll)/.test(style.overflowY)
    ) {
      return element;
    }

    element = element.parentElement;
  }

  return document.scrollingElement || document.documentElement;
}

function setWorkspaceScroll(percent) {
  workspaceScrollPercent = Number(percent);

  const scroller = getWorkspaceScroller();
  const maximum = scroller.scrollHeight - scroller.clientHeight;

  scroller.scrollTop = maximum * workspaceScrollPercent / 100;
}

function updateWorkspaceScroll() {
  const scroller = getWorkspaceScroller();
  const maximum = scroller.scrollHeight - scroller.clientHeight;

  if (maximum <= 0) {
    workspaceScrollPercent = 0;
    return;
  }

  workspaceScrollPercent = Math.round(
    (scroller.scrollTop / maximum) * 100
  );
}

function handleWorkspaceScroll() {
  updateWorkspaceScroll();
}


onMount(() => {
  const scroller = getWorkspaceScroller();

  scroller.addEventListener('scroll', handleWorkspaceScroll, {
    passive: true
  });

  updateWorkspaceScroll();

  return () => {
    scroller.removeEventListener('scroll', handleWorkspaceScroll);
  };
});

  let manuscriptX = 0;
let manuscriptY = 0;

let manuscriptZoom = 1;

let transcriptionZoom = 1;

function zoomTranscription(direction) {
  transcriptionZoom = Math.max(
    0.75,
    Math.min(3, transcriptionZoom + direction * 0.25)
  );
}

let transcriptionPointers = new Map();
let transcriptionPinchDistance = 0;
let transcriptionPinchZoom = 1;

function getTranscriptionFingerDistance() {
  const points = Array.from(transcriptionPointers.values());

  if (points.length < 2) return 0;

  return Math.hypot(
    points[0].x - points[1].x,
    points[0].y - points[1].y
  );
}

function startTranscriptionTouch(event) {
  if (!comparisonMode) return;

  transcriptionPointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY
  });

  if (transcriptionPointers.size === 2) {
    transcriptionPinchDistance = getTranscriptionFingerDistance();
    transcriptionPinchZoom = transcriptionZoom;
  }
}

function moveTranscriptionTouch(event) {
  if (!transcriptionPointers.has(event.pointerId)) return;

  transcriptionPointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY
  });

  if (
    transcriptionPointers.size === 2 &&
    transcriptionPinchDistance > 0
  ) {
    transcriptionZoom = Math.max(
      0.75,
      Math.min(
        3,
        transcriptionPinchZoom *
          getTranscriptionFingerDistance() /
          transcriptionPinchDistance
      )
    );
  }
}

function stopTranscriptionTouch(event) {
  transcriptionPointers.delete(event.pointerId);

  if (transcriptionPointers.size < 2) {
    transcriptionPinchDistance = 0;
  }
}

let imageX = 0;
let imageY = 0;

let draggingImage = false;
let imageDragStartX = 0;
let imageDragStartY = 0;
let imageStartX = 0;
let imageStartY = 0;

function zoomManuscript(direction) {
  manuscriptZoom = Math.max(
    1,
    Math.min(8, manuscriptZoom + direction * 0.5)
  );
}

function resetZooms() {
  manuscriptZoom = 1;
  transcriptionZoom = 1;

  imageX = 0;
  imageY = 0;

  manuscriptX = 0;
  manuscriptY = 0;

  draggingImage = false;
  draggingManuscript = false;

  activeImagePointers.clear();
  transcriptionPointers.clear();

  pinchStartDistance = 0;
  transcriptionPinchDistance = 0;
}

function resetManuscriptZoom() {
  manuscriptZoom = 1;
  imageX = 0;
  imageY = 0;
  manuscriptX = 0;
  manuscriptY = 0;

  draggingImage = false;
  draggingManuscript = false;
  activeImagePointers.clear();
  pinchStartDistance = 0;
}

function resetTranscriptionZoom() {
  transcriptionZoom = 1;
  transcriptionPointers.clear();
  transcriptionPinchDistance = 0;
}

function startImageDrag(event) {
  if (!comparisonMode) return;

  event.currentTarget.setPointerCapture(event.pointerId);

  activeImagePointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY
  });

  if (activeImagePointers.size === 1) {
    draggingImage = true;
    imageDragStartX = event.clientX;
    imageDragStartY = event.clientY;
    imageStartX = imageX;
    imageStartY = imageY;
  }

  if (activeImagePointers.size === 2) {
    draggingImage = false;

    const points = Array.from(activeImagePointers.values());
    const rect = event.currentTarget.getBoundingClientRect();

    pinchStartDistance = getFingerDistance();
    pinchStartZoom = manuscriptZoom;

    pinchStartX = (points[0].x + points[1].x) / 2 - rect.left;
    pinchStartY = (points[0].y + points[1].y) / 2 - rect.top;

    pinchImageX = imageX;
    pinchImageY = imageY;
  }
}

function moveImageDrag(event) {
  if (!activeImagePointers.has(event.pointerId)) return;

  activeImagePointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY
  });

  if (activeImagePointers.size === 2 && pinchStartDistance > 0) {
    const points = Array.from(activeImagePointers.values());
    const rect = event.currentTarget.getBoundingClientRect();

    const centerX = (points[0].x + points[1].x) / 2 - rect.left;
    const centerY = (points[0].y + points[1].y) / 2 - rect.top;

    manuscriptZoom = Math.max(
      1,
      Math.min(8, pinchStartZoom * getFingerDistance() / pinchStartDistance)
    );

    const ratio = manuscriptZoom / pinchStartZoom;

    imageX = centerX - (pinchStartX - pinchImageX) * ratio;
    imageY = centerY - (pinchStartY - pinchImageY) * ratio;

    return;
  }

  if (draggingImage && manuscriptZoom > 1) {
    imageX = imageStartX + event.clientX - imageDragStartX;
    imageY = imageStartY + event.clientY - imageDragStartY;
  }
}

function stopImageDrag(event) {
  activeImagePointers.delete(event.pointerId);

  draggingImage = false;

  if (activeImagePointers.size === 1) {
    const remaining = Array.from(activeImagePointers.values())[0];

    imageDragStartX = remaining.x;
    imageDragStartY = remaining.y;
    imageStartX = imageX;
    imageStartY = imageY;

    draggingImage = true;
  }

  if (activeImagePointers.size === 0) {
    pinchStartDistance = 0;
  }
}



let activeImagePointers = new Map();
let pinchStartDistance = 0;
let pinchStartZoom = 1;

let pinchStartX = 0;
let pinchStartY = 0;
let pinchImageX = 0;
let pinchImageY = 0;

function getFingerDistance() {
  const points = Array.from(activeImagePointers.values());

  if (points.length < 2) return 0;

  const dx = points[0].x - points[1].x;
  const dy = points[0].y - points[1].y;

  return Math.hypot(dx, dy);
}

let draggingManuscript = false;
let dragStartX = 0;
let dragStartY = 0;
let manuscriptStartX = 0;
let manuscriptStartY = 0;

function startManuscriptDrag(event) {
  if (!comparisonMode) return;

  draggingManuscript = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  manuscriptStartX = manuscriptX;
  manuscriptStartY = manuscriptY;

  event.currentTarget.setPointerCapture(event.pointerId);
}

function moveManuscriptDrag(event) {
  if (!draggingManuscript) return;

  manuscriptX = manuscriptStartX + event.clientX - dragStartX;
  manuscriptY = manuscriptStartY + event.clientY - dragStartY;
}

function stopManuscriptDrag() {
  draggingManuscript = false;
}

  let currentBook = "John";
  let currentChapter = 1;
  let currentVerseNum = 1;

  import { translate } from '$lib/i18n';
  import { getLexiconEntry } from '$lib/lexicon/index.js';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  function renderMarkdown(text) {
  const html = marked.parse(text ?? '');
  return DOMPurify.sanitize(html);
}


function afficherDefinitionTBESG(texte) {
  return DOMPurify.sanitize(
    formaterDefinitionCompleteTBESG(texte),
    {
      ALLOWED_TAGS: ['b', 'i'],
      ALLOWED_ATTR: [],
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: false
    }
  );
}


  import { onMount } from "svelte";
  import diplomaticText from "$lib/manuscripts/john-column-001.md?raw";
  import interlinearText from "$lib/manuscripts/john-column-001-interlinear.md?raw";
  import conventionsText from "$lib/manuscripts/conventions.md?raw";
  import diplomaticNotesEn from "$lib/manuscripts/john-column-001-notes-en.md?raw";
  import diplomaticNotesFr from "$lib/manuscripts/john-column-001-notes-fr.md?raw";
  import diplomaticNotesPt from "$lib/manuscripts/john-column-001-notes-pt.md?raw";

  let currentLanguage = 'fr';
  const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' }
];
  onMount(() => {
  const savedLanguage = localStorage.getItem("interlinearAdri-language");
  if (['en', 'fr', 'pt'].includes(savedLanguage)) currentLanguage = savedLanguage;

  const saved = localStorage.getItem("interlinearAdri-reading-position");

  if (saved) {
    try {
      const position = JSON.parse(saved);
      if (position.book === "John" &&
          Number.isInteger(position.chapter) &&
          Number.isInteger(position.verse) &&
          position.chapter >= 1 &&
          position.chapter <= 21 &&
          position.verse >= 1 &&
          position.verse <= 36) {
        currentBook = position.book;
        currentChapter = position.chapter;
        currentVerseNum = position.verse;
      }
    } catch (error) {
      console.warn("Position de lecture invalide", error);
    }
  }
});
  // "read" | "chapters" | "verses"
  let view = "read";

let selectedKey = null;


// 1) formes fléchies -> lemme (clé du lexique)
const FORMS_TO_LEMMA = {
  ton: "ho"   // τὸν -> fiche "ho"
  // plus tard tu pourras ajouter:
  // edoken: "didomi", apoleitai: "apollumi", pisteuon: "pisteuo", etc.
};

// 2) renvoie la clé lexique à ouvrir pour un mot du verset
function getLexKey(w) {
  if (!w) return null;
  // priorité: w.lemma si tu veux l'ajouter plus tard
  return w.lemma ?? FORMS_TO_LEMMA[w.key] ?? w.key ?? null;
}

// 3) clic sur un mot -> ouvre la bonne fiche
function selectWord(w) {
  const k = getLexKey(w);
  if (!k) return;
  select(k);
}


function normalizeWord(w) {
  if (!w) return null;
  return {
    ...w,
    // harmonisation des champs (compat ancien/nouveau)
    phonetic: w.phonetic ?? w.phoneticSpelling ?? "",
    translatedAs: w.translatedAs ?? w.translatedAsCount ?? ""
  };
}

function select(key) {
  selectedKey = (selectedKey === key) ? null : key;

  selectedWord = selectedKey
    ? normalizeWord(getLexiconEntry(selectedKey, currentLanguage))
    : null;
}

  function copyLexicon() {
    if (!selectedWord) return;

    const text = `
${selectedWord.lexical} — Strong’s ${selectedWord.strong}

Transliteration: ${selectedWord.transliteration}
Part of Speech: ${selectedWord.partOfSpeech}
Phonetic Spelling: ${selectedWord.phonetic ?? selectedWord.phoneticSpelling ?? ""}

Definition:
${selectedWord.definition}

Origin:
${selectedWord.origin}

Usage:
${selectedWord.usage}

Translated as (count):
${selectedWord.translatedAs ?? selectedWord.translatedAsCount ?? ""}
    `.trim();

    navigator.clipboard?.writeText(text);
  }

  // -----------------------------
  // CHAPITRES / VERSETS
  // -----------------------------
  // John a 21 chapitres.
  // John 1 a 51 versets.
  // Les autres chapitres sont placeholders (à compléter).
  const CHAPTERS = {
    John: {
      1: 51,
      2: 25,
      3: 36,
      4: 54,
      5: 47,
      6: 71,
      7: 53,
      8: 59,
      9: 41,
      10: 42,
      11: 57,
      12: 50,
      13: 38,
      14: 31,
      15: 27,
      16: 33,
      17: 26,
      18: 40,
      19: 42,
      20: 31,
      21: 25
    }
  };

// -----------------------------
// LISTES POUR LES MENUS (chapitres / versets)
// -----------------------------

// Liste des chapitres (ex: [1..21] pour John)
$: chapterNums = Object.keys(CHAPTERS?.[currentBook] ?? {})
  .map(Number)
  .sort((a, b) => a - b);

// Nombre de versets dans le chapitre courant
$: maxVerses = CHAPTERS?.[currentBook]?.[currentChapter] ?? 0;

// Liste des versets (ex: [1..51] si chapitre 1)
$: verseNums = Array.from({ length: currentBook === "John" && currentChapter === 1 ? 5 : maxVerses }, (_, i) => i + 1);


// -----------------------------
// VERSES (contenu par verset)
// -----------------------------

const FLUENT_TRANSLATIONS = {
  John: {
    1: {
      1: "In the beginning was the Logos, and the Logos was with God, and the Logos was God.",
      2: "He was in the beginning with God.",
      3: "All things came into being through him, and without him not even one thing came into being.",
      4: "What came into being in him was life, and this life was the light.",
      5: "And the light shines in the darkness, and the darkness did not grasp it."
    }
  }
};


const VERSE_DATA = {
  John: {

    // =========================
    // CHAPITRE 1
    // =========================
    1: {

      
1: [
  // Jean 1:1
  [
    { key: "en", trans: "in", greek: "ΕΝ", pron: "en" },
    { key: "arche", trans: "beginning", greek: "ΑΡΧΗ", pron: "archè" },
    { key: "eimi", trans: "was", greek: "ΗΝ", pron: "èn" },
    { key: "ho", trans: "the", greek: "Ο", pron: "o" },
    { key: "logos", trans: "Logos", greek: "ΛΟΓΟC", pron: "logos" },
    { key: "kai", trans: "and", greek: "ΚΑΙ", pron: "kai" },
    { key: "ho", trans: "the", greek: "Ο", pron: "o" },
    { key: "logos", trans: "Logos", greek: "ΛΟΓΟC", pron: "logos" }
  ],
  [
    { key: "eimi", trans: "was", greek: "ΗΝ", pron: "èn" },
    { key: "pros", trans: "with", greek: "ΠΡΟC", pron: "pros" },
    { key: "ton", trans: "the", greek: "ΤΟΝ", pron: "ton" },
    { key: "theos", trans: "God", greek: "Θ̅Ν̅", pron: "téon" },
    { key: "kai", trans: "and", greek: "ΚΑΙ", pron: "kai" },
    { key: "theos", trans: "God", greek: "Θ̅C̅", pron: "téos" },
    { key: "eimi", trans: "was", greek: "ΗΝ", pron: "èn" },
    { key: "ho", trans: "the", greek: "Ο", pron: "o" },
    { key: "logos", trans: "Logos", greek: "ΛΟΓΟC", pron: "logos" }
  ]
],

2: [
  // Jean 1:2
  [
    { key: "houtos", trans: "He", greek: "ΟΥΤΟC", pron: "outos" },
    { key: "eimi", trans: "was", greek: "ΗΝ", pron: "èn" },
    { key: "en", trans: "in", greek: "ΕΝ", pron: "en" },
    { key: "arche", trans: "beginning", greek: "ΑΡΧΗ", pron: "archè" },
    { key: "pros", trans: "with", greek: "ΠΡΟC", pron: "pros" },
    { key: "ton", trans: "the", greek: "ΤΟΝ", pron: "ton" },
    { key: "theos", trans: "God", greek: "Θ̅Ν̅", pron: "téon" }
  ]
],

3: [
  // Jean 1:3
  [
    { key: "pas", trans: "all things", greek: "ΠΑΝΤΑ", pron: "panta" },
    { key: "dia", trans: "through", greek: "ΔΙ’", pron: "di" },
    { key: "autos", trans: "him", greek: "ΑΥΤΟΥ", pron: "autou" },
    { key: "ginomai", trans: "came to be", greek: "ΕΓΕΝΕΤΟ", pron: "egeneto" },
    { key: "kai", trans: "and", greek: "ΚΑΙ", pron: "kai" }
  ],
  [
    { key: "choris", trans: "without", greek: "ΧωΡΙC", pron: "choris" },
    { key: "autos", trans: "him", greek: "ΑΥΤΟΥ", pron: "autou" },
    { key: "ginomai", trans: "came to be", greek: "ΕΓΕΝΕΤΟ", pron: "egeneto" },
    { key: "oude", trans: "not even", greek: "ΟΥΔΕ", pron: "oude" },
    { key: "heis", trans: "one", greek: "ΕΝ", pron: "hen" }
  ]
],

4: [
  // Jean 1:4
  [
    { key: "ho", trans: "what", greek: "Ο", pron: "ho" },
    { key: "ginomai", trans: "has come to be", greek: "ΓΕΓΟΝΕ", pron: "gegone" },
    { key: "en", trans: "in", greek: "ΕΝ", pron: "en" },
    { key: "autos", trans: "him", greek: "ΑΥΤω", pron: "auto" },
    { key: "zoe", trans: "life", greek: "ΖωΗ", pron: "zoè" },
    { key: "eimi", trans: "was", greek: "ΗΝ", pron: "èn" }
  ],
  [
    { key: "kai", trans: "and", greek: "ΚΑΙ", pron: "kai" },
    { key: "ho", trans: "the", greek: "Η", pron: "è" },
    { key: "zoe", trans: "life", greek: "ΖωΗ", pron: "zoè" },
    { key: "eimi", trans: "was", greek: "ΗΝ", pron: "èn" },
    { key: "ho", trans: "the", greek: "ΤΟ", pron: "to" },
    { key: "phos", trans: "light", greek: "ΦωC", pron: "fos" }
  ]
],


5: [
  // Jean 1:5 — Première proposition
  [
    { key: "kai", trans: "and", greek: "ΚΑΙ", pron: "kai" },
    { key: "ho", trans: "the", greek: "ΤΟ", pron: "to" },
    { key: "phos", trans: "light", greek: "ΦωC", pron: "fos" },
    { key: "en", trans: "in", greek: "ΕΝ", pron: "en" },
    { key: "ho", trans: "the", greek: "ΤΗ", pron: "tè" },
    { key: "skotia", trans: "darkness", greek: "CΚΟΤΙΑ", pron: "skotia" },
    { key: "phaino", trans: "shines", greek: "ΦΑΙΝΕΙ", pron: "fainei" }
  ],

  // Jean 1:5 — Deuxième proposition
  [
    { key: "kai", trans: "and", greek: "ΚΑΙ", pron: "kai" },
    { key: "ho", trans: "the", greek: "Η", pron: "è" },
    { key: "skotia", trans: "darkness", greek: "CΚΟΤΙΑ", pron: "skotia" },
    { key: "autos", trans: "it", greek: "ΑΥΤΟ", pron: "auto" },
    { key: "ou", trans: "not", greek: "ΟΥ", pron: "ou" },
    { key: "katalambano", trans: "grasped", greek: "ΚΑΤΕΛΑΒΕΝ", pron: "katelaben" }
  ]
],


      7: [
        [
          { key: "houtos", trans: "He", greek: "Οὗτος", pron: "houtos" },
          { key: "erchomai", trans: "came", greek: "ἦλθεν", pron: "ēlthen" },
          { key: "eis", trans: "for", greek: "εἰς", pron: "eis" },
          { dim: true, trans: "[a]" },
          { key: "martyria", trans: "witness", greek: "μαρτυρίαν", pron: "marturian" }
        ]
      ]
    },
// =========================
// CHAPITRE 3
// =========================
3: {

  16: [

    // Ligne 1
    [
      { key: "houtos", trans: "Thus", greek: "Οὕτως", pron: "houtōs" },
      { key: "gar", trans: "for", greek: "γὰρ", pron: "gar" },
      { key: "agapao", trans: "loved", greek: "ἠγάπησεν", pron: "ēgapēsen" },
      { key: "ho", trans: "—", greek: "ὁ", pron: "ho" },
      { key: "theos", trans: "God", greek: "Θεὸς", pron: "theos" }
    ],

    // Ligne 2 (5 mots)
    [
      { key: "ho", trans: "the", greek: "τὸν", pron: "ton" },
      { key: "kosmos", trans: "world", greek: "κόσμον", pron: "kosmon" },
      { key: "hoste", trans: "that", greek: "ὥστε", pron: "hōste" },
      { key: "ho", trans: "the", greek: "τὸν", pron: "ton" },
      { key: "huios", trans: "Son", greek: "Υἱὸν", pron: "huion" }
    ],

    // Ligne 3 (5 mots)
    [
      { key: "ho", trans: "the", greek: "τὸν", pron: "ton" },
      { key: "monogenes", trans: "only begotten", greek: "μονογενῆ", pron: "monogenē" },
      { key: "didomi", trans: "He gave", greek: "ἔδωκεν", pron: "edōken" },
      { key: "hina", trans: "so that", greek: "ἵνα", pron: "hina" },
      { key: "pas", trans: "everyone", greek: "πᾶς", pron: "pas" }
    ],

    // Ligne 4
    [
      { key: "ho", trans: "—", greek: "ὁ", pron: "ho" },
      { key: "pisteuo", trans: "believing", greek: "πιστεύων", pron: "pisteuōn" },
      { key: "eis", trans: "in", greek: "εἰς", pron: "eis" },
      { key: "autos", trans: "Him", greek: "αὐτὸν", pron: "auton" },
      { key: "me", trans: "not", greek: "μὴ", pron: "mē" }
    ],

    // Ligne 5
    [
      { key: "apollumi", trans: "should perish", greek: "ἀπόληται", pron: "apolētai" },
      { key: "alla", trans: "but", greek: "ἀλλ’", pron: "all’" },
      { key: "echo", trans: "should have", greek: "ἔχῃ", pron: "echē" },
      { key: "zoe", trans: "life", greek: "ζωὴν", pron: "zōēn" },
      { key: "aionios", trans: "eternal", greek: "αἰώνιον", pron: "aiōnion" }
    ]

  ]

},

// =========================
// CHAPITRE 8
// =========================
8: {

  12: [

    // Ligne 1 (5)
    [
      { key: "palin",  trans: "Again",      greek: "Πάλιν",     pron: "palin" },
      { key: "oun",    trans: "therefore",  greek: "οὖν",       pron: "oun" },
      { key: "autos",  trans: "to them",    greek: "αὐτοῖς",    pron: "autois" },
      { key: "laleo",  trans: "spoke",      greek: "ἐλάλησεν",  pron: "elalēsen" },
      { key: "ho",     trans: "—",          greek: "ὁ",         pron: "ho" }
    ],

    // Ligne 2 (5)
    [
      { key: "iesous", trans: "Jesus",      greek: "Ἰησοῦς",    pron: "iēsous" },
      { key: "lego",   trans: "saying",     greek: "λέγων",     pron: "legōn" },
      { key: "ego",    trans: "I",          greek: "Ἐγώ",       pron: "egō" },
      { key: "eimi",   trans: "am",         greek: "εἰμι",      pron: "eimi" },
      { key: "ho",     trans: "the",        greek: "τὸ",        pron: "to" }
    ],

    // Ligne 3 (5)
    [
      { key: "phos",      trans: "light",        greek: "φῶς",        pron: "phōs" },
      { key: "ho",        trans: "of the",       greek: "τοῦ",        pron: "tou" },
      { key: "kosmos",    trans: "world",        greek: "κόσμου",     pron: "kosmou" },
      { key: "ho",        trans: "the (one)",          greek: "ὁ",          pron: "ho" },
      { key: "akoloutheo",trans: "following",    greek: "ἀκολουθῶν",  pron: "akolouthōn" }
    ],

    // Ligne 4 (5)  (on laisse τῇ pour la ligne 5)
    [
      { key: "ego",       trans: "Me",          greek: "ἐμοὶ",        pron: "emoi" },
      { key: "ou",        trans: "no",          greek: "οὐ",          pron: "ou" },
      { key: "me",        trans: "not",         greek: "μὴ",          pron: "mē" },
      { key: "peripateo", trans: "shall walk",  greek: "περιπατήσῃ",  pron: "peripatēsē" },
      { key: "en",        trans: "in",          greek: "ἐν",          pron: "en" }
    ],

    // Ligne 5 (5) (on garde ici τῇ + ... + τὸ ; et on pousse φῶς + τῆς vers la ligne 6)
    [
      { key: "ho",     trans: "the",        greek: "τῇ",       pron: "tē" },
      { key: "skotia", trans: "darkness",   greek: "σκοτίᾳ",   pron: "skotia" },
      { key: "alla",   trans: "but",        greek: "ἀλλ’",     pron: "all’" },
      { key: "echo",   trans: "will have",  greek: "ἕξει",     pron: "hexei" },
      { key: "ho",     trans: "the",        greek: "τὸ",       pron: "to" }
    ],

    // Ligne 6 (3) (les mots “déplacés” + ζωῆς)
    [
      { key: "phos", trans: "light",     greek: "φῶς",     pron: "phōs" },
      { key: "ho",   trans: "-",    greek: "τῆς",     pron: "tēs" },
      { key: "zoe",  trans: "of life",   greek: "ζωῆς",    pron: "zōēs" }
    ]

  ]

}



  }
};

// verset courant (tableau de lignes)
$: currentVerseLines =
  VERSE_DATA?.[currentBook]?.[currentChapter]?.[currentVerseNum] ?? null;

  $: verseTitle = `${currentBook === 'John' ? translate(currentLanguage, 'navigation.john') : currentBook} ${currentChapter}:${currentVerseNum}`;

  // -----------------------------
  // NAV (mode "page remplace tout")
  // -----------------------------
  function openChapterPicker() {
    view = "chapters";
    selectedWord = null;
  }

  function pickChapter(ch) {
    currentChapter = ch;
    currentVerseNum = 1;
    view = "verses";
    selectedWord = null;
  }

  function openVersePicker() {
    view = "verses";
    selectedWord = null;
  }

  function pickVerse(v) {
    currentVerseNum = v;
    view = "read";
    selectedWord = null;
    localStorage.setItem(
  "interlinearAdri-reading-position",
  JSON.stringify({
    book: currentBook,
    chapter: currentChapter,
    verse: currentVerseNum
  })
);
  }

function changeVerse(direction) {
  const nextVerse = currentVerseNum + direction;

  if (nextVerse >= 1 && nextVerse <= 5) {
    pickVerse(nextVerse);
  }
}

  function cancelPicker() {
    view = "read";
    selectedWord = null;
  }
</script>

{#if screen === "home"}
  <main style="max-width: 400px; margin: 40px auto; padding: 24px; text-align: center;">
  <div style="text-align: right; margin-bottom: 20px;">
  <select
    aria-label="Select language"
    bind:value={currentLanguage}
    on:change={() => localStorage.setItem("interlinearAdri-language", currentLanguage)}
    style="font-size: 16px; padding: 8px; border-radius: 8px;"
  >
    {#each languageOptions as language}
      <option value={language.code}>{language.name}</option>
    {/each}
  </select>
</div>
    <h1>GREAT BOOKS</h1>
<h2>{translate(currentLanguage, 'navigation.subtitle')}</h2>
<p><em>{translate(currentLanguage, 'navigation.motto')}</em></p>
    <button
  type="button"
  on:click={() => screen = "read"}
  style="font-size: 18px; padding: 14px 24px; margin-top: 24px; border-radius: 12px; cursor: pointer;"
>
  📖 {translate(currentLanguage, 'navigation.continueReading')}
  <div style="font-size: 13px; color: #666; margin-top: 5px;">
    {verseTitle}
  </div>
</button>
    <div style="display: grid; gap: 12px; margin-top: 36px; text-align: left;">
  {#each [

[translate(currentLanguage, 'navigation.antiquity'), translate(currentLanguage, 'navigation.antiquityDescription')],
[translate(currentLanguage, 'navigation.newTestament'), translate(currentLanguage, 'navigation.newTestamentDescription')],
[translate(currentLanguage, 'navigation.lateAntiquity'), translate(currentLanguage, 'navigation.lateAntiquityDescription')],
[translate(currentLanguage, 'navigation.renaissance'), translate(currentLanguage, 'navigation.renaissanceDescription')],
[translate(currentLanguage, 'navigation.modern'), translate(currentLanguage, 'navigation.modernDescription')]


  ] as category, categoryIndex}

<button
  type="button"
  on:click={() => { if (categoryIndex === 1) screen = "gospels"; }}
  style="display: block; width: 100%; text-align: left; font: inherit; color: inherit; border: 0; background: #f0f0f0; padding: 24px; border-radius: 12px; cursor: pointer;"
>
  <span style="font-size: 26px; margin-right: 14px;">{["🏛️", "📖", "📜", "📚", "🌍"][categoryIndex]}</span><strong style="font-size: 20px;">{category[0]}</strong><span style="float: right; color: #666; font-size: 30px;">❯</span>
  
    <span style="display: block; font-size: 14px; color: #666; margin-top: 5px; margin-left: 50px;">
    {category[1]}
  </span>
</button>


  {/each}
</div>
  </main>
{:else if screen === "gospels"}
  <main style="max-width: 400px; margin: 40px auto; padding: 24px; text-align: center;">

<button
  type="button"
  on:click={() => (screen = "home")}
  style="font-size: 22px; padding: 14px 24px; display: block; margin: 0 auto 16px; border-radius: 12px; cursor: pointer;"
>
  🏠 {translate(currentLanguage, 'navigation.home')}
</button>

  <button type="button" on:click={() => screen = "home"} style="font-size: 18px; padding: 12px 20px; margin-bottom: 20px; border-radius: 12px; cursor: pointer;">← {translate(currentLanguage, 'navigation.back')}</button>
    <h1>{translate(currentLanguage, 'navigation.fourGospels')}</h1>
    <button type="button" on:click={() => screen = "chapters"} style="font-size: 20px; padding: 16px 32px; margin-top: 24px; border-radius: 12px; cursor: pointer;">📖 {translate(currentLanguage, 'navigation.john')} →</button>
  </main>
  {:else if screen === "chapters"}
  <main style="max-width: 600px; margin: 40px auto; padding: 24px; text-align: center;">
<button
  type="button"
  on:click={() => (screen = "home")}
  style="font-size: 22px; padding: 14px 24px; display: block; margin: 0 auto 16px; border-radius: 12px; cursor: pointer;"
>
🏠 {translate(currentLanguage, 'navigation.home')}
</button>
    <button
  type="button"
  on:click={() => (screen = "gospels")}
  style="font-size: 18px; padding: 12px 20px; margin-bottom: 20px; border-radius: 12px; cursor: pointer;"
>
  ← {translate(currentLanguage, 'navigation.back')}
</button>


    <button
      type="button"
      on:click={() => {
        currentChapter = 1;
        currentVerseNum = 1;
        screen = "read";
      }}
      style="display: block; width: 100%; margin-top: 32px; padding: 20px; cursor: pointer;"
    >
      <div style="font-size: 14px; color: #666; margin-bottom: 6px;">
     {translate(currentLanguage, 'navigation.chapter')} 1
    </div>
    <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold;">
     {translate(currentLanguage, 'navigation.chapter1Title')}
     </div>
      <div style="font-size: 14px; color: #666; margin-top: 8px;">
        {translate(currentLanguage, 'navigation.additionalReference')}: {translate(currentLanguage, 'navigation.john')} 1:1–5
      </div>
    </button>
    <button
  type="button"
  disabled
  style="display: block; width: 100%; margin-top: 16px; padding: 20px; opacity: 0.55; cursor: not-allowed;"
>
  <div style="font-size: 14px; color: #666; margin-bottom: 6px;">
  {translate(currentLanguage, 'navigation.chapter')} 2
</div>
<div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold;">
  {translate(currentLanguage, 'navigation.chapter2Title')}
</div>
  
  <div style="font-size: 14px; color: #666; margin-top: 8px;">
    {translate(currentLanguage, 'navigation.additionalReference')}: {translate(currentLanguage, 'navigation.john')} 1:6–9
  </div>
  <div style="font-size: 12px; margin-top: 6px;">
    {translate(currentLanguage, 'navigation.comingSoon')}
  </div>
</button>
  </main>
{:else}
  <!-- TITRE (cliquable) -->

<button type="button" on:click={() => screen = "home"} style="font-size: 22px; padding: 14px 24px; border-radius: 12px; cursor: pointer; margin-left: 40px">🏠 {translate(currentLanguage, 'navigation.home')}</button>
<button type="button" on:click={() => screen = "chapters"} style="font-size: 18px; padding: 12px 20px;display: block; margin-top: 12px; margin-left: 40px; border-radius: 12px; cursor: pointer;">← {translate(currentLanguage, 'navigation.back')}</button>
<div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
  <button
    type="button"
    on:click={() => changeVerse(-1)}
    disabled={currentVerseNum <= 1}
    aria-label="Previous verse"
    style="font-size: 28px; min-width: 48px; min-height: 48px; cursor: pointer;"

  >
    ◀
  </button>

  <button
    type="button"
    class="verse-title"
    on:click={openVersePicker}
  >
    {verseTitle}
  </button>

  <button
    type="button"
    on:click={() => changeVerse(1)}
    disabled={currentVerseNum >= 5}
    aria-label="Next verse"
    style="font-size: 28px; min-width: 48px; min-height: 48px; cursor: pointer;"

  >
    ▶
  </button>
</div>


{#if view === "chapters"}
  <!-- PICKER CHAPITRES -->
  <div class="picker">
    <div class="tabs">
      <div class="tab active">CHAPTER</div>

      <button
      type="button"
      class="tab"
      on:click={openVersePicker}
      >
      VERSE
     </button>


    </div>

    <div class="grid">
      {#each chapterNums as ch}
        <button
          class:selected={ch === currentChapter}
          on:click={() => pickChapter(ch)}
        >
          {ch}
        </button>
      {/each}
    </div>

    <button class="cancel" on:click={cancelPicker}>CANCEL</button>
  </div>

{:else if view === "verses"}
  <!-- PICKER VERSETS -->
  <div class="picker">
    <div class="tabs">



      <div class="tab active">VERSE</div>
    </div>

    <div class="grid">
      {#each verseNums as v}
        <button
          class:selected={v === currentVerseNum}
          on:click={() => pickVerse(v)}
        >
          {v}
        </button>
      {/each}
    </div>

    <button class="cancel" on:click={cancelPicker}>CANCEL</button>
  </div>

{:else}
  <!-- MODE LECTURE -->

<div class="read">
  {#if currentVerseLines}
    {#each currentVerseLines as line}
      <div class="line">
        {#each line as w}
          <button
            type="button"
            class="word-block"
            class:dim={w.dim}
            
            disabled={!getLexKey(w)}
            on:click={() => selectWord(w)}
          >
            <div class="greek">{w.greek ?? ""}</div>
            <div class="pron">{w.pron ?? ""}</div>
            <div class="trans">{w.trans ?? ""}</div>
          </button>
        {/each}
      </div>
    {/each}
  {:else}



      <p style="text-align:center; margin-top: 24px;">
        Verset pas encore encodé 🙂<br />
        (choisis un autre verset, ou on l’ajoute)
      </p>
    {/if}
    {#if FLUENT_TRANSLATIONS[currentBook]?.[currentChapter]?.[currentVerseNum]}
  <p style="font-size: 24px; line-height: 1.5; margin: 28px 0; text-align: center;">
    {FLUENT_TRANSLATIONS[currentBook][currentChapter][currentVerseNum]}
  </p>
{/if}
    <div style="text-align: center; margin-top: 24px;">
  <button
    type="button"
    on:click={() => (selectedDocument = documents[0])}
    style="padding: 8px 16px; font-size: 14px; cursor: pointer;"
  >
    Manuscript
  </button>
</div>
  </div>
{/if}


{#if selectedWord}

  <div
  class="lexicon-overlay"
  role="button"
  tabindex="0"
  aria-label="Close lexicon overlay"
  on:click={() => (selectedKey = null, selectedWord = null)}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selectedKey = null, selectedWord = null)}
  >

    <div
     class="lexicon-card"
     role="dialog"
     aria-modal="true"
     tabindex="0"
     on:click|stopPropagation
     on:keydown|stopPropagation={(e) => e.key === 'Escape' && (selectedKey = null, selectedWord = null)}
     >


      <div class="lexicon-actions">
        <button class="copy-btn" type="button" on:click={copyLexicon}>Copy</button>
        <button class="close-btn" type="button" on:click={() => (selectedKey = null, selectedWord = null)}>
          Close
        </button>
      </div>

      <div class="lexicon-header">
        <h2>{selectedWord.lexical}</h2>
        <p class="strong-line">
          <span class="lex-label">Greek lexical index:</span>
          <span class="lex-value">Strong {selectedWord.strong}</span>
        </p>
      </div>


<div class="lexicon-tabs">

<h3>Lexical Resources</h3>

  <button
    type="button"
    aria-pressed={dictionnaireActif === 'strong'}
    on:click={() => selectionnerDictionnaire('strong')}
  >
    Strong's
  </button>

  <button
    type="button"
    aria-pressed={dictionnaireActif === 'tbesg'}
    on:click={() => selectionnerDictionnaire('tbesg')}
  >
    TBESG
  </button>
</div>


<p class="lexicon-source-description">
  {#if dictionnaireActif === 'strong'}
    Biblical lexicon by James Strong (1890).
  {:else if dictionnaireActif === 'tbesg'}
    Biblical Greek lexicon by STEPBible
    (<b>T</b>ranslators <b>B</b>rief lexicon of
    <b>E</b>xtended <b>S</b>trongs for <b>G</b>reek).
  {/if}
</p>


{#if dictionnaireActif === 'strong'}

      <p><b>Transliteration:</b> {selectedWord.transliteration}</p>
      <p><b>Part of Speech:</b> {selectedWord.partOfSpeech}</p>
      <p><b>Phonetic Spelling:</b> {selectedWord.phonetic}</p>

      <hr />

      <p><b>Definition:</b><br />{selectedWord.definition}</p>
      <p><b>Origin:</b><br />{selectedWord.origin}</p>
      <p><b>Usage:</b><br />{selectedWord.usage}</p>

      <p><b>Translated as (count):</b><br />{selectedWord.translatedAs}</p>
      
{/if}

{#if dictionnaireActif === 'tbesg'}
  <h3>STEPBible — TBESG</h3>

  {#if tbesgChargement}
    <p>Loading dictionary...</p>
  {:else if tbesgErreur}
    <p>{tbesgErreur}</p>
  {:else if tbesgResultats.length === 0}
    <p>No entry found.</p>
  {:else}
    <p>Entries found: {tbesgResultats.length}</p>

    {#each tbesgResultats as entree}

      <p><b>Lexical form:</b> {entree.grec}</p>
      <p><b>Transliteration:</b> {entree.translitteration}</p>
      <p><b>Short definition:</b> {entree.sensCourt}</p>


<hr />

<p style="white-space: pre-wrap; overflow-wrap: anywhere;">
  {@html afficherDefinitionTBESG(entree.definitionOriginale)}
</p>

    {/each}
  {/if}
{/if}


    </div>
  </div>
{/if}
{/if}

{#if selectedDocument}
  <div class="lexicon-overlay" role="presentation">
    <div class="lexicon-card" role="dialog" aria-modal="true" aria-label="Manuscript document">
      <button on:click={() => (selectedDocument = null)}>
        Close ✕
      </button>

      <h2>{selectedDocument.title}</h2>

      {#if selectedDocument.title === "Diplomatic Transcription"}

    
  <div class="workspace-scroll-controls">
    <input
  type="range"
  class="workspace-scroll-slider"
  min="0"
  max="100"
  step="1"
  value={workspaceScrollPercent}
  on:input={(event) => setWorkspaceScroll(event.currentTarget.value)}
  aria-label="Position verticale du lecteur"
/>
    <a href="#transcription-start" aria-label="Aller à la transcription">
      ↓
    </a>
  </div>

    <div
  class="manuscript-workspace"
  class:comparison-mode={comparisonMode}
  id="manuscript-workspace"
>
      <div
  class="manuscript-panel"
  style:transform={comparisonMode ? `translate(${manuscriptX}px, ${manuscriptY}px)` : 'none'}
  style:z-index={comparisonMode ? 10 : 'auto'}
>

      {#if comparisonMode}
  <div
    class="panel-handle"
    role="button"
    tabindex="0"
    on:pointerdown={startManuscriptDrag}
    on:pointermove={moveManuscriptDrag}
    on:pointerup={stopManuscriptDrag}
    on:pointercancel={stopManuscriptDrag}
  >
    ☰ Manuscript — Move
  </div>
{/if}

{#if comparisonMode}
  <div class="manuscript-zoom-controls">
    <button type="button" on:click={() => zoomManuscript(-1)}>
      −
    </button>

    <span>{Math.round(manuscriptZoom * 100)}%</span>

    <button type="button" on:click={() => zoomManuscript(1)}>
      +
    </button>
    {#if manuscriptZoom !== 1 || imageX !== 0 || imageY !== 0 || manuscriptX !== 0 || manuscriptY !== 0}
  <button
    type="button"
    on:click={resetManuscriptZoom}
    aria-label="Réinitialiser le zoom du manuscrit"
    title="Reset Manuscript Zoom"
  >
    ↺
  </button>
{/if}
  </div>
{/if}


<div
  class="manuscript-viewport"
  on:pointerdown={startImageDrag}
  on:pointermove={moveImageDrag}
  on:pointerup={stopImageDrag}
  on:pointercancel={stopImageDrag}
>

    <img
      src={vaticanus1353}
      alt="Codex Vaticanus — page complète, début de l'Évangile selon Jean dans la troisième colonne"
      style:width="100%"
style:height="auto"

style:transform={comparisonMode
  ? `translate(${imageX}px, ${imageY}px) scale(${manuscriptZoom})`
  : 'none'}

style:transform-origin="top left"
    />
</div>
</div>


<div class="transcription-panel" id="transcription-start">


{#if showMarginalAnnotations}
  <div class="marginal-annotations-panel">
    <h3>Annotations marginales — Codex Vaticanus</h3>

    <h4>Marge gauche</h4>

    <p><strong>À hauteur des lignes 39–40 de la colonne II :</strong></p>

<p class="marginal-greek">ΜΕΓΑΛΗC</p>

<p><em>Annotation de la colonne voisine (Luc), et non de la colonne III (Jean).</em></p>

    <h4>Marge droite</h4>

<p><strong>À hauteur de la ligne 9 :</strong></p>
<p class="marginal-greek">ΤωΝΑΝΘΡωΠωΝ</p>

<p><strong>À hauteur des lignes 38–39 :</strong></p>
<p class="marginal-greek">ΟΥΔΕΕΚΘΕΛΗΜΑ ΤΟCΑΝΔΡΟC</p>

  </div>
{/if}

  {#if comparisonMode}
  <div class="transcription-zoom-controls">
    <button type="button" on:click={() => zoomTranscription(-1)}>−</button>
    <span>{Math.round(transcriptionZoom * 100)}%</span>
    <button type="button" on:click={() => zoomTranscription(1)}>+</button>
    {#if transcriptionZoom !== 1}
  <button
    type="button"
    on:click={resetTranscriptionZoom}
    aria-label="Réinitialiser le zoom de la transcription"
    title="Reset Transcription Zoom"
  >
    ↺
  </button>
{/if}

  <button

    type="button"

    class="marginal-annotations-button"

    on:click={() => (showMarginalAnnotations = !showMarginalAnnotations)}

    aria-label={showMarginalAnnotations

      ? 'Masquer les annotations marginales'

      : 'Afficher les annotations marginales'}

    title="Annotations marginales"

  >

    {showMarginalAnnotations ? '✕ Marges' : '☷ Marges'}

  </button>

  </div>
{/if}

  <div
    class="transcription-viewport"
    on:pointerdown={startTranscriptionTouch}
    on:pointermove={moveTranscriptionTouch}
    on:pointerup={stopTranscriptionTouch}
    on:pointercancel={stopTranscriptionTouch}
  >
    <pre
  style={`white-space: pre; overflow-wrap: normal; margin: 0; font-size: ${transcriptionZoom}em;`}
>{selectedDocument.content}</pre>

  </div>

</div>


<div class="notes-panel">
  <h3>Manuscript Notes</h3>

  <div class="notes-content">
  {@html renderMarkdown(
    currentLanguage === 'fr'
      ? diplomaticNotesFr
      : currentLanguage === 'pt'
        ? diplomaticNotesPt
        : diplomaticNotesEn
  )}
</div>

</div>

</div>

{:else}
  <pre style="white-space: pre-wrap; overflow-wrap: anywhere;">{selectedDocument.content}</pre>
{/if}

    </div>
  </div>
{/if}

<style>

  .verse-title {
    font-family: "Times New Roman", serif;
    font-size: 3rem;
    margin: 0.5rem 0 1rem;
    cursor: pointer;
    user-select: none;
  }

  /* Lecture */

.read {
  margin-top: 0.5rem;
  width: 100%;
  max-width: 900px;
  margin-left: 0;
  padding-inline: clamp(12px, 3vw, 40px);
  box-sizing: border-box;
}

  .line {
    display: flex;
    gap: 12px;
    margin-bottom: 1rem;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
.word-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;   /* ✅ au lieu de center */
  cursor: pointer;
  min-width: 120px;          /* ✅ cohérent avec ton override */
}
  .word-block.dim {
    opacity: 0.5;
    cursor: default;
  }
.trans {
  font-size: 1.2rem;
  font-weight: 500;
  color: #111;
  text-align: left;
}

.greek {
  font-size: 1.6rem;
  font-family: "Times New Roman", serif;
  font-weight: 500;
}

.pron {
  font-size: 0.8rem;
  color: #777;
}

  /* Picker style (Hagios-ish) */
  .picker {
    border: 1px solid #ddd;
    border-radius: 14px;
    padding: 16px;
    max-width: 900px;
    margin: 24px auto;
    background: #fafafa;
  }

  .tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }

  .tab {
    text-align: center;
    padding: 10px 12px;
    border-radius: 999px;
    background: #eee;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #666;
  }

  .tab.active {
    background: #e6e6e6;
    color: #111;
    border: 1px solid #cfcfcf;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    padding: 10px 4px 18px;
  }

  .grid button {
    padding: 16px 10px;
    border-radius: 12px;
    border: 1px solid #cfcfcf;
    background: white;
    font-size: 1.2rem;
    cursor: pointer;
  }

  .grid button.selected {
    outline: 2px solid #d26;
    border-color: #d26;
  }

  .cancel {
    width: 100%;
    padding: 12px 10px;
    border-radius: 999px;
    border: 0;
    background: #eee;
    cursor: pointer;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #777;
  }

  /* Lexicon overlay */
  .lexicon-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    z-index: 9999;
  }

  .lexicon-card {
    width: min(920px, 95vw);
    max-height: 78vh;
    overflow: auto;
    background: white;
    border-radius: 14px;
    padding: 18px 18px 22px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }


.lexicon-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 16px;
}

.lexicon-tabs button {
  padding: 10px 18px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #eeeeee;
  color: #333333;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.lexicon-tabs button[aria-pressed="true"] {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}


.lexicon-card .lexicon-source-description {
  color: #2563eb;
  font-size: 11px;
  font-style: italic;
  line-height: 1.4;
  margin: -10px 0 14px 160px;
}


  .lexicon-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 6px;
  }

  .copy-btn,
  .close-btn {
    border: 0;
    padding: 8px 12px;
    border-radius: 999px;
    background: #e9eefb;
    cursor: pointer;
    font-weight: 600;
  }

.lexicon-card p {
  margin: 4px 0;
}

.lex-label { font-weight: 700; }
.lex-value { font-weight: 400; }

/* === OVERRIDE HIÉRARCHIE (English > Greek > Pron) === */
.read .word-block .trans{
  font-size: 1.8rem !important;
  font-weight: 600 !important;
  color: #111 !important;
  line-height: 1.05 !important;
  margin-bottom: 0.15rem !important;
  text-align: left !important;
}

.read .word-block .greek{
  font-size: 1.65rem !important;
  font-weight: 500 !important;
  color: #111 !important;
  line-height: 1.05 !important;
  margin-bottom: 0.05rem !important;
  text-align: left !important;
}

.read .word-block .pron{
  font-size: 1.3rem !important;
  color: #666 !important;
  line-height: 1 !important;
  text-align: left !important;
}

/* un peu plus de “bloc” pour que ça respire bien */
.read .word-block{
  min-width: 120px !important;
}

.lexicon-overlay {
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  text-align: inherit;
}

/* Great Books — adaptation aux écrans étroits */

@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .verse-title {
    font-size: clamp(1.8rem, 7vw, 2.5rem);
  }
    .read .word-block .greek {
    font-size: 1.4rem !important;
  }

  .read .word-block .pron {
    font-size: 1.05rem !important;
  }

  .read .word-block .trans {
    font-size: 1.5rem !important;
  }
    .read .word-block {
    min-width: 0 !important;
  }
}
/* Great Books — Manuscript Workspace */

.manuscript-workspace {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: start;
  justify-items: center;
}

@media (min-width: 800px) {
  .manuscript-workspace {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .notes-panel {
    grid-column: 1 / -1;
  }
}

/* Great Books — panneau de transcription diplomatique */

.transcription-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  height: 65vh;
  max-height: 65vh;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}


/* Great Books — Manuscript Notes */

.notes-panel {
  width: 100%;
  min-width: 0;
  max-height: 45vh;
  overflow: auto;
  box-sizing: border-box;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fafafa;
}

/* Great Books — présentation des notes du manuscrit */

.notes-content {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #222;
  overflow-wrap: anywhere;
}

.notes-content :global(h1) {
  font-size: 1.6rem;
  margin: 0 0 1rem;
}

.notes-content :global(h2) {
  font-size: 1.3rem;
  margin: 1.5rem 0 0.75rem;
}

.notes-content :global(h3) {
  font-size: 1.1rem;
  margin: 1.2rem 0 0.5rem;
}

.notes-content :global(p) {
  margin: 0.6rem 0;
}

/* Great Books — Comparison Mode */

.manuscript-workspace.comparison-mode {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
}

.manuscript-workspace.comparison-mode .manuscript-panel,
.manuscript-workspace.comparison-mode .transcription-panel {
  flex: 1 1 300px;
  min-width: 0;
}

.manuscript-workspace.comparison-mode .notes-panel {
  flex: 1 1 100%;
}

.panel-handle {
  padding: 10px 14px;
  margin-bottom: 10px;
  background: #e9e9e9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.manuscript-zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;
}

.manuscript-zoom-controls button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f5f5f5;
  font-size: 20px;
  cursor: pointer;
}

/* Zone de visualisation du manuscrit */

.manuscript-viewport {
  width: 100%;
  overflow: hidden;
  position: relative;
  touch-action: none;
}

.comparison-mode .manuscript-viewport {
  height: 60vh;
}

.transcription-zoom-controls button {
  padding: 5px 8px;
  min-width: 32px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f5f5f5;
  font-size: 15px;
  cursor: pointer;
  flex-shrink: 0;
}


/* Great Books — fenêtre intérieure de transcription diplomatique */

.transcription-viewport {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  max-height: none;
  overflow-x: auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.comparison-mode .transcription-viewport {
  touch-action: pan-x pan-y;
}


/* Great Books — navigation verticale */

.workspace-scroll-controls {
  position: fixed;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  padding: 8px 4px;
  border-radius: 20px;
  background: rgba(245, 245, 245, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.workspace-scroll-controls a {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  color: #333;
  text-decoration: none;
  font-size: 22px;
  font-weight: bold;
}

/* Great Books — curseur vertical */

.workspace-scroll-slider {
  appearance: auto;
  -webkit-appearance: auto;

  writing-mode: vertical-lr;
  direction: ltr;

  width: 24px;
  height: 240px;

  margin: 0;
  cursor: pointer;
  accent-color: #777;
  touch-action: none;
}

/* Garder les commandes de zoom libres de la barre verticale */

.manuscript-zoom-controls,
.transcription-zoom-controls {
  padding-right: 65px;
  box-sizing: border-box;
  flex-wrap: wrap;
}

/* Great Books — annotations marginales */

.marginal-annotations-panel {
  padding: 14px;
  margin: 12px 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #faf9f6;
  max-height: 25vh;
  overflow: auto;
}

.marginal-annotations-panel h3 {
  margin-top: 0;
}

.marginal-annotations-panel h4 {
  margin-bottom: 6px;
}

/* Great Books — commandes compactes de transcription */

.transcription-zoom-controls {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  padding-right: 48px;
  margin-top: 0;
  margin-bottom: 4px;
  box-sizing: border-box;
}

.transcription-zoom-controls span {
  font-size: 13px;
  white-space: nowrap;
}

.transcription-zoom-controls .marginal-annotations-button {
  padding: 5px 7px;
  font-size: 13px;
  white-space: nowrap;
}

/* Great Books — hauteur de lecture de la transcription */

.comparison-mode .transcription-viewport {
  height: 65vh;
  max-height: none;
  overflow: auto;
}

/* Great Books — espace pour la glissière sur téléphone */

@media (max-width: 600px) {
  .marginal-annotations-panel {
    margin-right: 36px;
  }
}

/* Great Books — alignement des trois panneaux sur téléphone */

@media (max-width: 600px) {
  .comparison-mode .transcription-viewport,
  .comparison-mode .notes-panel {
    margin-right: 36px;
    min-width: 0;
  }
}

/* Great Books — limiter la transcription avant la glissière */

@media (max-width: 600px) {
  .comparison-mode .transcription-viewport {
    width: calc(100% - 36px);
    max-width: calc(100% - 36px);
    margin-right: 0;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: auto;
  }
}

</style>