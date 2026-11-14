<script>
  // -----------------------------
  // ETAT GLOBAL
  // -----------------------------

import vaticanus1353 from '$lib/assets/vaticanus/Vaticanus_1353.jpg';

  let selectedWord = null;
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
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  function renderMarkdown(text) {
  const html = marked.parse(text ?? '');
  return DOMPurify.sanitize(html);
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

  // -----------------------------
  // LEXIQUE (version courte)
  // -----------------------------

  const lexicon = {

  en: {
  strong: "G1722",
  lexical: "ἐν",
  transliteration: "en",
  partOfSpeech: "Preposition",
  phoneticSpelling: "en",
  definition: "in, on, at, by, with.",
  origin: "A primary preposition denoting (fixed) position (in place, time or state), and (by implication) instrumentality (medially or constructively), i.e. A relation of rest (intermediate between eis and ek); \"in,\" at, (up-)on, by, etc..",
  usage: "about, after, against, + almost, X altogether, among, X as, at, before, between, (here-)by (+ all means), for (... Sake of), + give self wholly to, (here-)in(-to, -wardly), X mightily, (because) of, (up-)on, (open-)ly, X outwardly, one, X quickly, X shortly, (speedi-)ly, X that, X there(-in, -on), through(-out), (un-)to(-ward), under, when, where(-with), while, with(-in). Often used in compounds, with substantially the same import; rarely with verbs of motion, and then not to indicate direction, except (elliptically) by a separate (and different) preposition.",
  translatedAsCount: "in (2177), with (130), among (125), by (111), on (73), At (41), into (26), within (16), during (11), through (10), to (10), as (5), under (3), along (2), as to (2), because of (2), besides (2), in regard to (2), throughout (2), wherein (2), while (2), afterward (1), amid (1), amidst (1), before (1), between (1), But in (1), For (1), in all (1), in the (1), in the midst of (1), of (1), outwardly (1), the in (1), toward (1), until (1), When (1), With respect to (1), with the (1)."
},

arche: {
  strong: "G746",
  lexical: "ἀρχή",
  transliteration: "arché",
  partOfSpeech: "Noun, Feminine",
  phoneticSpelling: "ar-khay'",
  definition: "(a) rule (kingly or magisterial), (b) plur: in a quasi-personal sense, almost: rulers, magistrates, (c) beginning.",
  origin: "From archomai; (properly abstract) a commencement, or (concretely) chief (in various applications of order, time, place, or rank).",
  usage: "beginning, corner, (at the, the) first (estate), magistrate, power, principality, principle, rule.",
  translatedAsCount: "beginning (42), rulers (5), corners (2), rule (2), a commencement (1), domain (1), dominion (1), principalities (1), principality (1), to rulers (1)."
},

  eimi: {
  strong: "G1510",
  lexical: "εἰμί",
  transliteration: "eimi",
  partOfSpeech: "Verb",
  phoneticSpelling: "i-mee'",
  definition: "I exist, I am.",
  origin: "The first person singular present indicative; a prolonged form of a primary and defective verb; I exist (used only when emphatic).",
  usage: "am, have been, X it is I, was. See also ei, eien, einai, heis kath heis, en, esomai, esmen, este, esti, kerdos, isthi, o.",
  translatedAsCount: "is (603), are (242), was (166), being (147), it is (112), to be (109), will be (85), am (80), were (65), You are (65), He is (64), there is (52), He was (51), I am (50), they are (38), There was (33), we are (32), there are (31), it was (28), they were (26), there will be (25), is it (22), are you (21), may be (17), There were (16), you will be (16), you were (13), it will be (12), are they (11), I was (11), might be (11), Be (10), I will be (8), We were (8), am I (7), he will be (7), is He (7), will it be (7), had been (6), you may be (6), she is (5), he might be (4), Let be (4), let him be (4), Shall be (4), we will be (4), are we (3), He had been (3), Let it be (3), should be (3), there being (3), they may be (3), they will be (3), was it (3), will become (3), will I be (3), will there be (3), as being (2), be it (2), existed (2), existing (2), having been (2), He may be (2), He were (2), is there (2), it be (2), it being (2), It would be (2), shall have been (2), she was (2), there should be (2), there to be (2), they had been (2), they should be (2), will she be (2), would be (2), You had been (2), you shall be (2), are there (1), are to be (1), be absorbed (1), Be it so (1), belongs (1), came about (1), comes (1), consists (1), exist (1), had (1), have been (1), He (1), He exists (1), he had (1), he remained (1), he stood (1), himself to be (1), I (1), I shall be (1), I would be (1), if (1), it might be (1), it shall (1), it shall be (1), It was they (1), it were (1), it will be done (1), It will happen that (1), it would have been (1), let there be (1), may it be (1), means (1), might appear (1), might have been (1), remain (1), shall it be (1), she being (1), she should be (1), that will be (1), there be (1), these were (1), they continued (1), they existed (1), they had (1), they might be (1), to become (1), to remain (1), was He (1), was there (1), we had lived (1), we might be (1), we should be (1), we would have been (1), were they (1), would have emerged (1), would He be (1), would it be (1), you used to be (1), you would be (1), you yourselves are (1)."
},

ho: {
  strong: "G3588",
  lexical: "ὁ",
  transliteration: "ho",
  partOfSpeech: "Definite Article",
  phoneticSpelling: "ho",
  definition: "the, the definite article.",
  origin: "Including the feminine he (hay), and the neuter to (to) in all their inflections; the definite article; the (sometimes to be supplied, at others omitted, in English idiom).",
  usage: "the, this, that, one, he, she, it, etc.",
  translatedAsCount: "the (10868), - (5328), of the (1592), To the (451), those (425), that (133), The things (129), of (100), in the (92), who (82), to those (74), to (70), with the (64), on the (58), of those (51), for the (50), which (39), by the (31), that which (29), a (25), what (20), things (17), with (15), at the (14), he who (14), Some (13), than the (13), those who (13), from the (10), his (9), in (8), their (8), this (7), to the things (6), by (5), O (5), they (5), to him (5), for those (4), from (4), Him who (4), our (4), the one (4), the ones (4), these things (4), to whom (4), you (4), among the (3), for (3), of that (3), One (3), Others (3), over the (3), such (3), who were (3), with those (3), about the (2), during the (2), He (2), her (2), him (2), In this (2), into the (2), of that which (2), of the things (2), of this (2), of those who (2), on those (2), She (2), the thing (2), to her (2), to that (2), unto (2), who are (2), who was (2), about (1), according to the (1), against (1), anything (1), as the (1), at (1), at that (1), before (1), belonging to the (1), between the (1), by the things (1), by those (1), for that which (1), from those (1), he who is (1), however (1), in one (1), in the things (1), in things (1), it (1), its (1), my (1), of her (1), of him (1), of what (1), of your (1), on (1), She who (1), Since (1), than (1), than those (1), that of (1), that was (1), the of the (1), the same (1), the same things (1), their own (1), them (1), these (1), thing (1), those ones (1), those that (1), to Him who (1), to His (1), to the one (1), to the own (1), to those who (1), toward the (1), unto those (1), upon the (1), what is (1), which is (1), who is (1), whole (1), whom (1), whose (1)."
},


  logos: {
  strong: "G3056",
  lexical: "λόγος",
  transliteration: "logos",
  partOfSpeech: "Noun, Masculine",
  phoneticSpelling: "log'-os",
  definition: "a word (as embodying an idea), a statement, a speech.",
  origin: "From lego; something said (including the thought); by implication, a topic (subject of discourse), also reasoning (the mental faculty) or motive; by extension, a computation; specially, (with the article in John) the Divine Expression (i.e. Christ).",
  usage: "account, cause, communication, X concerning, doctrine, fame, X have to do, intent, matter, mouth, preaching, question, reason, + reckon, remove, say(-ing), shew, X speaker, speech, talk, thing, + none of these things move me, tidings, treatise, utterance, word, work.",
  translatedAsCount: "word (177), words (51), saying (9), a word (8), account (8), speech (8), message (6), report (4), statement (4), talk (4), in word (3), matter (3), the words (3), thing (3), an account (2), by word (2), of word (2), reason (2), the word (2), a matter (1), a reason (1), accounts (1), an appearance (1), by a word (1), by words (1), commandment (1), divine utterance (1), His words (1), in a word (1), in discourse (1), in speech (1), in talk (1), instruction (1), of discourse (1), of speech (1), of words (1), on account (1), one thing (1), question (1), reckoning (1), remark (1), sayings (1), sentence (1), speaker (1), teaching (1), the matter (1), things (1), what he says (1), with talk (1), with words (1)."
},

  kai: {
  strong: "G2532",
  lexical: "καί",
  transliteration: "kai",
  partOfSpeech: "Conjunction",
  phoneticSpelling: "kahee",
  definition: "and, even, also, namely.",
  origin: "Apparently, a primary particle, having a copulative and sometimes also a cumulative force; and, also, even, so then, too, etc.; often used in connection (or composition) with other particles or small words.",
  usage: "and, also, both, but, even, for, if, or, so, that, then, therefore, when, yet.",
  translatedAsCount: "and (8135), also (695), even (108), both (41), But (17), and yet (16), Then (16), that (13), and also (9), indeed (7), or (5), Although (3), yet (3), and then (2), including (2), again (1), also even (1), and even (1), as well (1), For (1), For even (1), however (1), nor (1), only (1), other (1), Truly (1), with (1)."
},

pros: {
  strong: "G4314",
  lexical: "πρός",
  transliteration: "pros",
  partOfSpeech: "Preposition",
  phoneticSpelling: "pros",
  definition: "advantageous for, at (denotes local proximity), toward (denotes motion toward a place).",
  origin: "A strengthened form of pro; a preposition of direction; forward to, i.e. Toward (with the genitive case, the side of, i.e. Pertaining to; with the dative case, by the side of, i.e. Near to; usually with the accusative case, the place, time, occasion, or respect, which is the destination of the relation, i.e. Whither or for which it is predicated).",
  usage: "about, according to, against, among, at, because of, before, between, (where-)by, for, X at thy house, in, for intent, nigh unto, of, which pertain to, that, to (the end that), X together, to (you) -ward, unto, with(-in). In the comparative case, it denotes essentially the same applications, namely, motion towards, accession to, or nearness at.",
  translatedAsCount: "to (476), with (48), for (45), toward (31), against (22), at (20), unto (18), among (10), in order (6), according to (3), as to (3), by (3), near (2), relating to (2), about (1), as (1), As for (1), Because of (1), before (1), between (1), close to (1), from (1), in (1), in view of (1), into (1), of (1), pertaining to (1), so as (1), with a view to (1), within (1)."
},

theos: {
  strong: "G2316",
  lexical: "θεός",
  transliteration: "theos",
  partOfSpeech: "Noun, Feminine; Noun, Masculine",
  phoneticSpelling: "theh'-os",
  definition: "(a) God, (b) a god, generally.",
  origin: "Of uncertain affinity; a deity, especially (with ho) the supreme Divinity; figuratively, a magistrate; by Hebraism, very.",
  usage: "X exceeding, God, god(-ly, -ward).",
  translatedAsCount: "God (718), of God (505), to God (68), God’s (11), gods (8), with God (3), for God (2), from God (2), the God (2), a god (1), between God (1), by God (1), divinely (1), goddess (1), in God (1), O God (1), Of a god (1), of God’s (1), toward God (1)"
},

  houtos: {
    strong: "G3779",
    lexical: "οὕτως",
    transliteration: "houtós",
    partOfSpeech: "Adverb",
    phoneticSpelling: "hoo'-to",
    definition: "thus, so, in this manner.",
    origin: "Or (before a vowel houtos hoo'-toce); adverb from houtos; in this way (referring to what precedes or follows).",
    usage: "after that, after (in) this manner, as, even (so), for all that, like(-wise), no more, on this fashion(-wise), so (in like manner), thus, what.",
    translatedAsCount: "thus (94), so (87), in this way (7), like this (5), in this manner (3), this (3), in the same manner (2), in the same way (2), this way (2), as they were (1), by thus (1), that (1), thus so (1)."
  },

  gar: {
    strong: "G1063",
    lexical: "γάρ",
    transliteration: "gar",
    partOfSpeech: "Conjunction",
    phoneticSpelling: "gar",
    definition: "for, indeed (a conjunction used to express cause, explanation, inference or continuation).",
    origin: "A primary particle; properly, assigning a reason (used in argument, explanation or intensification; often with other particles).",
    usage: "and, as, because (that), but, even, for, indeed, no doubt, seeing, then, therefore, verily, what, why, yet.",
    translatedAsCount: "for (1009), indeed (25), however (2), then (2), therefore (2), though (2), truly (2), - (1), As for (1), just (1)."
  },

  agapao: {
    strong: "G25",
    lexical: "ἀγαπάω",
    transliteration: "agapaó",
    partOfSpeech: "Verb",
    phoneticSpelling: "ag-ap-ah'-o",
    definition: "to love, wish well to, take pleasure in, long for; denotes the love of reason, esteem.",
    origin: "Perhaps from agan (much); to love (in a social or moral sense).",
    usage: "(be-)love(-ed). Compare phileo.",
    translatedAsCount: "loving (24), loved (15), love (12), You shall love (10), to love (8), loves (7), you love (7), we should love (6), having loved (5), Beloved (4), you loved (4), having been loved (3), He loved (3), he loves (3), should love (3), we love (3), will love (3), have loved (2), he will love (2), I have loved (2), I love (2), love you (2), has loved (1), having been beloved (1), I am loved (1), I do love (1), I loved (1), let love (1), she loved (1), they have loved (1), they loved (1), will be loved (1), You have loved (1), you should love (1), you would have loved (1)."
  },

  kosmos: {
    strong: "G2889",
    lexical: "κόσμος",
    transliteration: "kosmos",
    partOfSpeech: "Noun, Masculine",
    phoneticSpelling: "kos'-mos",
    definition: "the world, universe; worldly affairs; the inhabitants of the world; adornment.",
    origin: "Probably from the base of komizo; orderly arrangement, i.e. Decoration; by implication, the world (in a wide or narrow sense, including its inhabitants, literally or figuratively (morally)).",
    usage: "adorning, world.",
    translatedAsCount: "world (169), of world (13), adorning (1), earth (1), in this world (1), the world (1)."
  },

  hoste: {
    strong: "G5620",
    lexical: "ὥστε",
    transliteration: "hóste",
    partOfSpeech: "Conjunction",
    phoneticSpelling: "hoce'-teh",
    definition: "so that, therefore, so then, so as to.",
    origin: "From hos and te; so too, i.e. Thus therefore (in various relations of consecution, as follow).",
    usage: "(insomuch) as, so that (then), (insomuch) that, therefore, to, wherefore.",
    translatedAsCount: "so that (25), Therefore (13), so as (11), so as for (11), So then (7), So (6), in order for (3), in order (2), that (2), as (1), Likewise (1), Thus (1)."
  },

  huios: {
    strong: "G5207",
    lexical: "υἱός",
    transliteration: "huios",
    partOfSpeech: "Noun, Masculine",
    phoneticSpelling: "hwee-os'",
    definition: "a son, descendent.",
    origin: "Apparently a primary word; a \"son\" (sometimes of animals), used very widely of immediate, remote or figuratively, kinship.",
    usage: "child, foal, son.",
    translatedAsCount: "son (284), sons (67), a son (19), the Son (6), of sons (2), foal (1), His Son (1), sons of (1), to sons (1)."
  },
monogenes: {
  strong: "G3439",
  lexical: "μονογενής",
  transliteration: "monogenés",
  partOfSpeech: "Adjective",
  phoneticSpelling: "mon-og-en-ace'",
  definition: "only, only-begotten; unique.",
  origin: "From monos and ginomai; only-born, i.e. Sole.",
  usage: "only (begotten, child).",
  translatedAsCount: "only begotten (4), an only (1), an only child (1), of an only begotten (1), one and only (1), only begotten son (1)."
},

didomi: {
  strong: "G1325",
  lexical: "δίδωμι",
  transliteration: "didómi",
  partOfSpeech: "Verb",
  phoneticSpelling: "did'-o-mee",
  definition: "to offer, give; to put, place.",
  origin: "A prolonged form of a primary verb (which is used as an alternative in most of the tenses); to give (used in a very wide application, properly, or by implication, literally or figuratively; greatly modified by the connection).",
  usage: "adventure, bestow, bring forth, commit, deliver (up), give, grant, hinder, make, minister, number, offer, have power, put, receive, set, shew, smite (+ with the hand), strike (+ with the palm of the hand), suffer, take, utter, yield.",
  translatedAsCount: "give (36), to give (34), gave (27), has given (21), will give (21), He gave (20), was given (17), having given (15), having been given (14), I will give (14), You have given (12), gives (10), I give (9), will be given (8), giving (7), it will be given (7), you gave (7), he will give (5), they gave (5), Had given (4), Has been given (4), He has given (4), is given (4), to be given (4), were given (4), given (3), grant (3), He gives (3), it has been given (3), may give (3), putting (3), there was given (3), was giving (3), did you give (2), gave up (2), have given (2), He kept giving (2), He may give (2), I have given (2), it has been granted (2), May grant (2), might be given (2), they will give (2), will I give (2), you give (2), are giving (1), began to take (1), began yielding (1), did give (1), granting (1), had been given (1), has put (1), have been given (1), have been granted (1), having been bestowed (1), He did give (1), he had given (1), He might give (1), he should give (1), he will offer (1), He would have given (1), I gave (1), I have set (1), I will grant (1), I will show (1), inflicting (1), is giving (1), it had been given (1), it may give (1), it should give (1), it was given (1), it was granted (1), it yielded (1), kept giving (1), let him give (1), may be given (1), may He give (1), pay (1), placing (1), shall give (1), Should we pay (1), there will be given (1), they give (1), they kept giving (1), they shall give up (1), they were offering (1), to grant (1), to have been given (1), to offer (1), to venture (1), was granted (1), we gave (1), we may offer (1), we might give (1), we should place (1), were yielding (1), will they put (1), will You allow (1), You will allow (1), you would have given (1)."
},

hina: {
  strong: "G2443",
  lexical: "ἵνα",
  transliteration: "hina",
  partOfSpeech: "Conjunction",
  phoneticSpelling: "hin'-ah",
  definition: "in order that, that, so that.",
  origin: "Probably from the same as the former part of heautou (through the demonstrative idea; compare ho); in order that (denoting the purpose or the result).",
  usage: "albeit, because, to the intent (that), lest, so as, (so) that, (for) to. Compare hina me.",
  translatedAsCount: "that (390), so that (262), in order that (11), so (2), - (1), in order (1), in that (1), that it (1), Thus (1), when (1)."
},

pas: {
  strong: "G3956",
  lexical: "πᾶς",
  transliteration: "pas",
  partOfSpeech: "Adjective",
  phoneticSpelling: "pas",
  definition: "all, the whole, every kind of.",
  origin: "Including all the forms of declension; apparently a primary word; all, any, every, the whole.",
  usage: "all (manner of, means), alway(-s), any (one), X daily, + ever, every (one, way), as many as, + no(-thing), X thoroughly, whatsoever, whole, whosoever.",
  translatedAsCount: "All (693), All things (146), every (138), everyone (60), of all (44), to all (36), everything (32), any (19), to everyone (10), than all (7), of every (6), Anyone (5), among all (3), for all (3), in all (3), in all things (3), of all things (3), with all (3), anything (2), every one (2), of full (2), over all (2), to every (2), all kinds of (1), all of you (1), all the things (1), all these (1), all this (1), all those (1), altogether (1), always (1), by all (1), by every (1), complete (1), each one (1), ever (1), in every (1), In everything (1), of all kinds (1), of any (1), of everything (1), on all (1), the entire (1), the whole (1), upon every (1), Whoever (1), whole (1), with all things (1), with every (1)."
},

pisteuo: {
  strong: "G4100",
  lexical: "πιστεύω",
  transliteration: "pisteuó",
  partOfSpeech: "Verb",
  phoneticSpelling: "pist-yoo'-o",
  definition: "to believe, have faith in, trust in; pass: to be entrusted with.",
  origin: "From pistis; to have faith (in, upon, or with respect to, a person or thing), i.e. Credit; by implication, to entrust (especially one's spiritual well-being to Christ).",
  usage: "believe(-r), commit (to trust), put in trust with.",
  translatedAsCount: "believing (54), believe (27), believed (25), having believed (22), to believe (9), you believe (8), they believed (6), Believe you (5), I believe (5), we believe (5), have believed (4), believes (3), did you believe (3), has believed (3), he believed (3), will you believe (3), you have believed (3), you should believe (3), have been entrusted (2), he has believed (2), may believe (2), might believe (2), were believing (2), you believed (2), you did believe (2), you may believe (2), you might believe (2), did believe (1), did entrust (1), did they believe (1), do believe (1), do they believe (1), do you believe (1), have come to believe (1), I am entrusted with (1), I believed (1), I have been entrusted with (1), I have believed (1), I may believe (1), is belief (1), shall believe (1), shall they believe on (1), they had believed (1), they may believe (1), they should believe (1), they were entrusted with (1), to be entrusted with (1), was believed (1), was believed on (1), we believed (1), we should believe (1), we will believe (1), who believed (1), will believe (1), will entrust (1), will I believe (1), would you believe (1), you do believe (1), you shall believe (1), you were believing (1), you would believe (1), you would have believed (1)."
},

eis: {
  strong: "G1519",
  lexical: "εἰς",
  transliteration: "eis",
  partOfSpeech: "Preposition",
  phoneticSpelling: "ice",
  definition: "to or into (indicating the point reached or entered, of place, time, purpose, result).",
  origin: "A primary preposition; to or into (indicating the point reached or entered), of place, time, or (figuratively) purpose (result, etc.); also in adverbial phrases.",
  usage: "(abundant-)ly, against, among, as, at, (back-)ward, before, by, concerning, + continual, + far more exceeding, for (intent, purpose), fore, + forth, in (among, at, unto, -so much that, -to), to the intent that, + of one mind, + never, of, (up-)on, + perish, + set at one again, (so) that, therefore(-unto), throughout, til, to (be, the end, -ward), (here-)until(-to),...ward, (where-)fore, with. Often used in composition with the same general import, but only with verbs (etc.) Expressing motion (literally or figuratively).",
  translatedAsCount: "into (569), to (568), For (188), in (161), unto (72), toward (44), on (30), at (23), against (18), among (13), in order (13), upon (13), as (11), as to (8), so as (8), of (3), to the (3), about (2), by (2), in order for (2), over (2), so as for (2), the (2), until (2), Accordingly (1), and (1), back (1), for the (1), for the purpose of (1), for this (1), For what (1), in regard to (1), in respect to (1), onto (1), so that (1), to result in (1), To this (1), with (1), with regard to (1)."
},

autos: {
  strong: "G846",
  lexical: "αὐτός",
  transliteration: "autos",
  partOfSpeech: "Personal Pronoun",
  phoneticSpelling: "ow-tos'",
  definition: "(1) self (emphatic) (2) he, she, it (used for the third person pronoun) (3) the same.",
  origin: "From the particle au (perhaps akin to the base of aer through the idea of a baffling wind) (backward); the reflexive pronoun self, used (alone or in the comparative heautou) of the third person, and (with the proper personal pronoun) of the other persons.",
  usage: "her, it(-self), one, the other, (mine) own, said, (self-), the) same, ((him-, my-, thy-)self, (your-)selves, she, that, their(-s), them(-selves), there(-at, - by, -in, -into, -of, -on, -with), they, (these) things, this (man), those, together, very, which. Compare hautou.",
  translatedAsCount: "him (1426), of him (1047), them (689), to him (448), to them (387), of them (369), it (227), He (137), her (96), of her (96), of it (81), they (78), same (62), to her (48), Himself (46), his (46), their (21), He Himself (19), themselves (17), for him (16), to it (15), yourselves (12), for them (11), of himself (11), myself (10), the same (9), on them (8), she (8), itself (7), on him (7), by Him (6), of His (6), with him (6), You yourselves (6), ourselves (5), these (5), this very (5), against him (4), likewise (4), than he (4), with them (4), by them (3), I myself (3), of herself (3), same thing (3), same things (3), that (3), theirs (3), these things (3), They themselves (3), this (3), upon them (3), We ourselves (3), yourself (3), against them (2), as He (2), from Him (2), in it (2), in them (2), place (2), unto him (2), very (2), - (1), a woman (1), about them (1), among them (1), as them (1), at her (1), at him (1), before Him (1), between them (1), both theirs (1), for her (1), from it (1), he answered (1), herself (1), in Him (1), in person (1), in those things (1), its (1), number (1), of themselves (1), of these (1), on her (1), On His part (1), one (1), over them (1), own (1), selves (1), than them (1), than they (1), the same things (1), their own (1), thereof (1), this very thing (1), to these (1), to those who (1), upon her (1), upon him (1), very thing (1), we (1), with it (1)."
},

me: {
  strong: "G3361",
  lexical: "μή",
  transliteration: "mé",
  partOfSpeech: "Particle, Negative",
  phoneticSpelling: "may",
  definition: "not, that...not, lest (used for qualified negation).",
  origin: "A primary particle of qualified negation (whereas ou expresses an absolute denial); (adverb) not, (conjunction) lest; also (as an interrogative implying a negative answer (whereas ou expects an affirmative one)) whether.",
  usage: "any but (that), X forbear, + God forbid, + lack, lest, neither, never, no (X wise in), none, nor, (can-)not, nothing, that not, un(-taken), without. Often used in compounds in substantially the same relations. See also ean me, hina me, ou me, mekos, mekuno, men, me ouk.",
  translatedAsCount: "not (958), lest (46), Never (17), no (15), Nothing (6), Neither (5), nor (5), none (3), not even (2), - (1), at all (1), but (1), except (1), no more (1), not at all (1), whether (1), without (1)."
},

apollumi: {
  strong: "G622",
  lexical: "ἀπόλλυμι",
  transliteration: "apollumi",
  partOfSpeech: "Verb",
  phoneticSpelling: "ap-ol'-loo-mee",
  definition: "(a) to kill, destroy, (b) to lose, mid: to be perishing (the resultant death being viewed as certain).",
  origin: "From apo and the base of olethros; to destroy fully (reflexively, to perish, or lose), literally or figuratively.",
  usage: "destroy, die, lose, mar, perish.",
  translatedAsCount: "to destroy (8), will lose (7), should perish (6), perishing (4), will perish (4), having been lost (3), perished (3), they might destroy (3), being lost (2), destroyed (2), has perished (2), having lost (2), he destroyed (2), I lost (2), might lose (2), shall he lose (2), to perish (2), we are perishing (2), will be destroyed (2), will destroy (2), you will perish (2), am perishing (1), are destroyed (1), are perishing (1), being destroyed (1), destroy (1), has been lost (1), have departed (1), have perished (1), having destroyed (1), having perished (1), he was lost (1), He will destroy (1), I should lose (1), I will destroy (1), Is destroyed (1), is perishing (1), it might destroy (1), loses (1), lost (1), may be lost (1), might destroy (1), shall they perish (1), she should lose (1), should destroy (1), they perished (1), we perish (1), were destroyed (1), you should lose (1)."
},

alla: {
  strong: "G235",
  lexical: "ἀλλά",
  transliteration: "alla",
  partOfSpeech: "Conjunction",
  phoneticSpelling: "al-lah'",
  definition: "otherwise, on the other hand, but.",
  origin: "Neuter plural of allos; properly, other things, i.e. (adverbially) contrariwise (in many relations).",
  usage: "and, but (even), howbeit, indeed, nay, nevertheless, no, notwithstanding, save, therefore, yea, yet.",
  translatedAsCount: "but (588), Instead (15), yet (13), rather (9), Nevertheless (3), but only (2), but rather (2), However (2), In fact (2), but instead (1), but other (1), certainly (1), except (1), No (1), On the contrary (1), other (1), Yes (1)."
},

echo: {
  strong: "G2192",
  lexical: "ἔχω",
  transliteration: "echó",
  partOfSpeech: "Verb",
  phoneticSpelling: "ekh'-o",
  definition: "to have, hold, possess.",
  origin: "Including an alternate form scheo skheh'-o; (used in certain tenses only); a primary verb; to hold (used in very various applications, literally or figuratively, direct or remote; such as possession; ability, contiuity, relation, or condition).",
  usage: "be (able, X hold, possessed with), accompany, + begin to amend, can(+ -not), X conceive, count, diseased, do + eat, + enjoy, + fear, following, have, hold, keep, + lack, + go to law, lie, + must needs, + of necessity, + need, next, + recover, + reign, + rest, + return, X sick, take for, + tremble, + uncircumcised, use.",
  translatedAsCount: "having (211), has (63), you have (55), have (48), I have (35), we have (34), he has (25), had (23), to have (20), they have (14), being (12), have you (11), holding (9), he had (8), have we (7), they had (7), may have (6), hold (5), will have (5), I had (4), I might have (4), might have (4), you may have (4), you will have (4), following (3), I should have (3), it had (3), let have (3), should have (3), they may have (3), they were holding (3), they would have had (3), we may have (3), do you have (2), has it (2), having had (2), I am (2), she had (2), to be (2), we have had (2), we might have (2), you have had (2), you would have (2), accompanying (1), are (1), are You (1), being able (1), gain possession of (1), Had seized (1), had you (1), has he (1), having been (1), he does have (1), he got (1), he has been (1), He holds (1), He is holding (1), he may have (1), he might have (1), he will have (1), I am having (1), I kept (1), incurring (1), is (1), is coming to (1), is he (1), is holding (1), it has (1), keep (1), keeping (1), neighboring (1), retain (1), she could (1), she has (1), they are (1), they had upheld (1), they might have (1), they will be (1), We are having (1), we had (1), were (1), were holding (1), will hold (1), you are (1), you consider (1), you might have (1), you shall have (1), you should have (1), you took (1)."
},

zoe: {
  strong: "G2222",
  lexical: "ζωή",
  transliteration: "zóé",
  partOfSpeech: "Noun, Feminine",
  phoneticSpelling: "dzo-ay'",
  definition: "life, both of physical (present) and of spiritual (particularly future) existence.",
  origin: "From zao; life (literally or figuratively).",
  usage: "life(-time). Compare psuche.",
  translatedAsCount: "life (97), of life (34), living (2), lifetime (1), of a life (1)."
},

aionios: {
  strong: "G166",
  lexical: "αἰώνιος",
  transliteration: "aiónios",
  partOfSpeech: "Adjective",
  phoneticSpelling: "ahee-o'-nee-os",
  definition: "age-long, and therefore: practically eternal, unending; partaking of the character of that which lasts for an age, as contrasted with that which is brief and fleeting.",
  origin: "From aion; perpetual (also used of past time, or past and future as well).",
  usage: "eternal, for ever, everlasting, world (began).",
  translatedAsCount: "eternal (66), an eternal (1), eternally (1), everlasting (1), of eternal (1), of the ages (1)."
},

palin: {
  strong: "G3825",
  lexical: "πάλιν",
  transliteration: "palin",
  partOfSpeech: "Adverb",
  phoneticSpelling: "pal'-in",
  definition: "again, back, once more, further, on the other hand.",
  origin: "Probably from the same as pale (through the idea of oscillatory repetition); (adverbially) anew, i.e. (of place) back, (of time) once more, or (conjunctionally) furthermore or on the other hand.",
  usage: "again.",
  translatedAsCount: "Again (140), back (1)."
},

oun: {
  strong: "G3767",
  lexical: "οὖν",
  transliteration: "oun",
  partOfSpeech: "Conjunction",
  phoneticSpelling: "oon",
  definition: "therefore, then, (and) so.",
  origin: "Apparently a primary word; (adverbially) certainly, or (conjunctionally) accordingly.",
  usage: "and (so, truly), but, now (then), so (likewise then), then, therefore, verily, wherefore.",
  translatedAsCount: "therefore (393), then (109), so (2)."
},

laleo: {
  strong: "G2980",
  lexical: "λαλέω",
  transliteration: "laleó",
  partOfSpeech: "Verb",
  phoneticSpelling: "lal-eh'-o",
  definition: "(to talk, chatter in classical Greek, but in NT a more dignified word) to speak, say.",
  origin: "A prolonged form of an otherwise obsolete verb; to talk, i.e. Utter words.",
  usage: "preach, say, speak (after), talk, tell, utter. Compare lego.",
  translatedAsCount: "speaking (48), to speak (35), spoke (23), He was speaking (11), I speak (11), speaks (11), speak (9), He spoke (8), we speak (8), was speaking (7), I have spoken (6), has spoken (5), have spoken (5), I spoke (5), having been spoken (4), spoken (4), having spoken (3), He speaks (3), he will speak (3), I have said (3), I will speak (3), speak You (3), to say (3), being spoken (2), I am saying (2), I should speak (2), it was said (2), it will be told (2), let speak (2), said (2), should speak (2), to be spoken (2), were speaking (2), will be spoken of (2), will speak (2), you should say (2), am I saying (1), are speaking (1), as He is speaking (1), as they were telling (1), continue speaking (1), declared (1), do I speak (1), do speak (1), does speak (1), going to be spoken (1), had spoken (1), having been told (1), having said (1), he began speaking (1), He had spoken (1), He is saying (1), he kept saying (1), He kept speaking (1), He might say (1), he might speak (1), he says (1), he utters (1), He was saying (1), He would have spoken (1), I say (1), I was speaking (1), is speaking (1), is spoken (1), it has been said (1), it speaks (1), it was speaking (1), let him speak (1), saying (1), sounded (1), spoke He (1), they began speaking (1), they speak (1), they spoke (1), they were speaking (1), they will speak (1), to declare (1), to speak of (1), we are speaking (1), we began speaking (1), we have spoken (1), we will speak (1), were saying (1), will tell (1), would He speak (1), you have spoken (1), you should speak (1), You speak (1)."
},

iesous: {
  strong: "G2424",
  lexical: "Ἰησοῦς",
  transliteration: "Iésous",
  partOfSpeech: "Noun, Masculine",
  phoneticSpelling: "ee-ay-sooce'",
  definition: "Jesus; the Greek form of Joshua; Jesus, son of Eliezer; Jesus, surnamed Justus.",
  origin: "Of Hebrew origin (Yhowshuwa'); Jesus (i.e. Jehoshua), the name of our Lord and two (three) other Israelites.",
  usage: "Jesus.",
  translatedAsCount: "Jesus (835), of Jesus (68), to Jesus (15), from Jesus (3), Joshua (2), in Jesus (1), of Joshua (1)."
},

lego: {
  strong: "G3004",
  lexical: "λέγω",
  transliteration: "legó",
  partOfSpeech: "Verb",
  phoneticSpelling: "leg'-o",
  definition: "(denoting speech in progress), (a) to say, speak; to mean, mention, tell, (b) to call, name, especially in the pass., (c) to tell, command.",
  origin: "A primary verb; properly, to \"lay\" forth, i.e. (figuratively) relate (in words (usually of systematic or set discourse; whereas epo and phemi generally refer to an individual expression or speech respectively; while rheo is properly to break silence merely, and laleo means an extended or random harangue)); by implication, to mean.",
  usage: "ask, bid, boast, call, describe, give out, name, put forth, say(-ing, on), shew, speak, tell, utter.",
  translatedAsCount: "saying (391), says (182), I say (164), He says (117), say (50), They say (29), to say (24), called (21), you say (14), I speak (11), said (11), is called (9), to speak (8), tell (7), being called (6), it says (6), She says (6), declaring (5), do pronounce (5), speak (5), telling (5), claiming (4), He is speaking (4), He said (4), I ask (4), I tell (4), I am speaking (3), say You (3), to tell (3), being spoken (2), call you (2), He speaks (2), I am saying (2), is saying (2), is to say (2), spoken (2), they should tell (2), They speak (2), You speak (2), affirming (1), are said (1), are saying (1), asserting (1), being spoken of (1), calling (1), calls (1), crying out (1), declares (1), do I say (1), do I speak (1), do say (1), do they declare (1), do you pronounce (1), have said (1), he calls (1), he is saying (1), He may say (1), he tells (1), I am telling (1), I call (1), I may say (1), I mean (1), I say this (1), is He speaking (1), it does say (1), it is said (1), it was said (1), let say (1), might say (1), named (1), on saying (1), proclaiming (1), saying to (1), says He (1), says it (1), shall I say (1), so-called (1), speak You (1), speaking (1), speaks (1), states (1), tells (1), they are saying (1), they call (1), they might say (1), they said (1), those saying (1), to be called (1), to be named (1), to call (1), to mention (1), We are saying (1), we declare (1), we might say (1), we say (1), were speaking (1), who says (1), you call (1), you speak of (1)."
},

phos: {
  strong: "G5457",
  lexical: "φῶς",
  transliteration: "phós",
  partOfSpeech: "Noun, Neuter",
  phoneticSpelling: "foce",
  definition: "light, a source of light, radiance.",
  origin: "From an obsolete phao (to shine or make manifest, especially by rays; compare phaino, phemi); luminousness (in the widest application, natural or artificial, abstract or concrete, literal or figurative).",
  usage: "fire, light.",
  translatedAsCount: "light (51), a light (10), of light (7), fire (1), in light (1), lights (1), of lights (1)."
},

akoloutheo: {
  strong: "G190",
  lexical: "ἀκολουθέω",
  transliteration: "akoloutheó",
  partOfSpeech: "Verb",
  phoneticSpelling: "ak-ol-oo-theh'-o",
  definition: "to accompany, attend, follow.",
  origin: "From a (as a particle of union) and keleuthos (a road); properly, to be in the same way with, i.e. To accompany (specially, as a disciple).",
  usage: "follow, reach.",
  translatedAsCount: "followed (22), Follow (18), following (10), they followed (5), was following (5), Were following (4), I will follow (3), let him follow (3), having followed (2), he followed (2), he was following (2), to follow (2), accompanying (1), began following (1), does follow (1), follows (1), had been following (1), he began following (1), he began to follow (1), he follows (1), they follow (1), they were following (1), they will follow (1), you will follow (1)."
},

ego: {
  strong: "g1473",
  lexical: "ἐγώ",
  transliteration: "egó",
  partOfSpeech: "Personal Pronoun",
  phonetic: "eg-o'",
  definition: "I (only expressed when emphatic).",
  origin: "A primary pronoun of the first person I (only expressed when emphatic).",
  usage: "I, me. For the other cases and the plural see eme, emoi, emou, hemas, hemeis, hemin, hemon, etc.",
  translatedAs: "me (664), of Me (493), I (356), to me (133), My (40), for me (11), with Me (8), of mine (5), in me (3), Mine (3), of my (3), than I (3), on me (2), over me (2), But I (1), by Me (1), I am (1)."
},

ou: {
  strong: "g3756",
  lexical: "οὐ",
  transliteration: "ou",
  partOfSpeech: "Particle, Negative",
  phonetic: "oo",
  definition: "not, no.",
  origin: "Also (before a vowel) ouk (ook), and (before an aspirate) ouch (ookh) a primary word; the absolute negative (compare me) adverb; no or not.",
  usage: "+ long, nay, neither, never, no (X man), none, (can-)not, + nothing, + special, un(-worthy), when, + without, + yet but. See also ou me, mekos.",
  translatedAs: "not (1452), no (116), never (25), nothing (14), neither (10), none (9), in no way (2), nor (2), except (1), no more (1), not any (1), not one (1), Not yet (1), 'No (1)."
},

peripateo: {
  strong: "g4043",
  lexical: "περιπατέω",
  transliteration: "peripateó",
  partOfSpeech: "Verb",
  phonetic: "per-ee-pat-eh'-o",
  definition: "to walk, hence Hebraistically (in an ethical sense): to conduct life, live.",
  origin: "From peri and pateo; to tread all around, i.e. walk at large (especially as proof of ability); figuratively, to live, deport oneself, follow (as a companion or votary).",
  usage: "go, be occupied with, walk (about).",
  translatedAs: "Walking (23), walk (17), to walk (10), walked (6), are walking (5), we should walk (4), walks (3), began to walk (2), began walking (2), should walk (2), was walking (2), you walk (2), are you walking (1), as they are walking (1), being devoted (1), did we walk (1), had walked (1), he should walk (1), is walking (1), let him walk (1), prowls about (1), shall walk (1), they will walk (1), to walk about (1), we walk (1), who walk (1), will walk (1), you may walk (1), you should walk (1), you walked (1)."
},

skotia: {
  strong: "G4653",
  lexical: "σκοτία",
  transliteration: "skotia",
  partOfSpeech: "Noun, Feminine",
  phoneticSpelling: "skot-ee'-ah",
  definition: "darkness; figuratively, spiritual darkness.",
  origin: "From skotos; dimness, obscurity.",
  usage: "darkness.",
  translatedAsCount: "darkness (15), dark (2)."
}


};

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
  selectedWord = selectedKey ? normalizeWord(lexicon[selectedKey]) : null;
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

      <p><b>Transliteration:</b> {selectedWord.transliteration}</p>
      <p><b>Part of Speech:</b> {selectedWord.partOfSpeech}</p>
      <p><b>Phonetic Spelling:</b> {selectedWord.phonetic}</p>

      <hr />

      <p><b>Definition:</b><br />{selectedWord.definition}</p>
      <p><b>Origin:</b><br />{selectedWord.origin}</p>
      <p><b>Usage:</b><br />{selectedWord.usage}</p>

      <p><b>Translated as (count):</b><br />{selectedWord.translatedAs}</p>
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