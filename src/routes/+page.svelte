<script>
  // -----------------------------
  // ETAT GLOBAL
  // -----------------------------
  let selectedWord = null;

  let currentBook = "John";
  let currentChapter = 1;
  let currentVerseNum = 1;

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
}
};

let selectedKey = null;

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
// VERSES (contenu par verset)
// -----------------------------


const VERSE_DATA = {
  John: {
    1: {
      1: [
        // Ligne 1
        [
          { key: "en", trans: "In", greek: "Ἐν", pron: "en" },
          { dim: true, trans: "[the]" },
          { key: "arche", trans: "beginning", greek: "ἀρχῇ", pron: "archē" },
          { key: "eimi", trans: "was", greek: "ἦν", pron: "ēn" },
          { key: "ho", trans: "the", greek: "ὁ", pron: "ho" }
        ],
        // Ligne 2
        [
          { key: "logos", trans: "Word", greek: "Λόγος", pron: "logos" },
          { key: "kai", trans: "and", greek: "καὶ", pron: "kai" },
          { key: "ho", trans: "the", greek: "ὁ", pron: "ho" },
          { key: "logos", trans: "Word", greek: "Λόγος", pron: "logos" },
          { key: "eimi", trans: "was", greek: "ἦν", pron: "ēn" }
        ],
        // Ligne 3
        [
          { key: "pros", trans: "with", greek: "πρὸς", pron: "pros" },
          { key: "ho", trans: "the", greek: "τὸν", pron: "ton" },
          { key: "theos", trans: "God", greek: "Θεόν", pron: "theon" },
          { key: "kai", trans: "and", greek: "καὶ", pron: "kai" },
          { key: "theos", trans: "God", greek: "Θεὸς", pron: "theos" }
        ],
        // Ligne 4
        [
          { key: "eimi", trans: "was", greek: "ἦν", pron: "ēn" },
          { key: "ho", trans: "the", greek: "ὁ", pron: "ho" },
          { key: "logos", trans: "Word", greek: "Λόγος", pron: "logos" }
        ]
      ],

      // Pour tester: on met un verset 7 "placeholder" (tu pourras le remplir après)
      7: [
        [
          { key: "houtos", trans: "He", greek: "Οὗτος", pron: "houtos" },
          { key: "erchomai", trans: "came", greek: "ἦλθεν", pron: "ēlthen" },
          { key: "eis", trans: "for", greek: "εἰς", pron: "eis" },
          { dim: true, trans: "[a]" },
          { key: "martyria", trans: "witness", greek: "μαρτυρίαν", pron: "marturian" }
        ]
      ]
    }
  }
};

// verset courant (tableau de lignes)
$: currentVerseLines =
  VERSE_DATA?.[currentBook]?.[currentChapter]?.[currentVerseNum] ?? null;

  $: verseTitle = `${currentBook} ${currentChapter}:${currentVerseNum}`;

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
  }

  function cancelPicker() {
    view = "read";
    selectedWord = null;
  }
</script>

<!-- TITRE (cliquable) -->
<h2 class="verse-title" on:click={openChapterPicker}>
  {verseTitle}
</h2>

{#if view === "chapters"}
  <!-- PICKER CHAPITRES -->
  <div class="picker">
    <div class="tabs">
      <div class="tab active">CHAPTER</div>
      <div class="tab" on:click={openVersePicker}>VERSE</div>
    </div>

    <div class="grid">
      {#each Array(Object.keys(CHAPTERS[currentBook]).length) as _, i}
        <button
          class:selected={(i + 1) === currentChapter}
          on:click={() => pickChapter(i + 1)}
        >
          {i + 1}
        </button>
      {/each}
    </div>

    <button class="cancel" on:click={cancelPicker}>CANCEL</button>
  </div>


{:else}
  <!-- MODE LECTURE -->
  <div class="read">
    <!-- LIGNE 1 -->
    <div class="line">
      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("en")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("en")}
      >
        <div class="trans">In</div>
        <div class="greek">Ἐν</div>
        <div class="pron">en</div>
      </div>

      <div class="word-block">
        <div class="trans">[the]</div>
        <div class="greek"></div>
        <div class="pron"></div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("arche")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("arche")}
      >
        <div class="trans">beginning</div>
        <div class="greek">ἀρχῇ</div>
        <div class="pron">archē</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("eimi")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("eimi")}
      >
        <div class="trans">was</div>
        <div class="greek">ἦν</div>
        <div class="pron">ēn</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("ho")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("ho")}
      >
        <div class="trans">the</div>
        <div class="greek">ὁ</div>
        <div class="pron">ho</div>
      </div>
    </div>

    <!-- LIGNE 2 -->
    <div class="line">
      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("logos")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("logos")}
      >
        <div class="trans">Word</div>
        <div class="greek">Λόγος</div>
        <div class="pron">logos</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("kai")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("kai")}
      >
        <div class="trans">and</div>
        <div class="greek">καὶ</div>
        <div class="pron">kai</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("ho")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("ho")}
      >
        <div class="trans">the</div>
        <div class="greek">ὁ</div>
        <div class="pron">ho</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("logos")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("logos")}
      >
        <div class="trans">Word</div>
        <div class="greek">Λόγος</div>
        <div class="pron">logos</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("eimi")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("eimi")}
      >
        <div class="trans">was</div>
        <div class="greek">ἦν</div>
        <div class="pron">ēn</div>
      </div>
    </div>

    <!-- LIGNE 3 -->
    <div class="line">
      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("pros")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("pros")}
      >
        <div class="trans">with</div>
        <div class="greek">πρὸς</div>
        <div class="pron">pros</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("ho")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("ho")}
      >
        <div class="trans">the</div>
        <div class="greek">τὸν</div>
        <div class="pron">ton</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("theos")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("theos")}
      >
        <div class="trans">God</div>
        <div class="greek">Θεόν</div>
        <div class="pron">theon</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("kai")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("kai")}
      >
        <div class="trans">and</div>
        <div class="greek">καὶ</div>
        <div class="pron">kai</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("theos")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("theos")}
      >
        <div class="trans">God</div>
        <div class="greek">Θεὸς</div>
        <div class="pron">theos</div>
      </div>
    </div>

    <!-- LIGNE 4 -->
    <div class="line">
      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("eimi")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("eimi")}
      >
        <div class="trans">was</div>
        <div class="greek">ἦν</div>
        <div class="pron">ēn</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("ho")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("ho")}
      >
        <div class="trans">the</div>
        <div class="greek">ὁ</div>
        <div class="pron">ho</div>
      </div>

      <div
        class="word-block"
        role="button"
        tabindex="0"
        on:click={() => select("logos")}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && select("logos")}
      >
        <div class="trans">Word</div>
        <div class="greek">Λόγος</div>
        <div class="pron">logos</div>
      </div>
    </div>
  </div>
{/if}




{#if selectedWord}
  <div
    class="lexicon-overlay"
    on:click={() => (selectedKey = null, selectedWord = null)}
  >
    <div class="lexicon-card" on:click|stopPropagation>
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
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
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
    align-items: center;
    cursor: pointer;
    min-width: 90px;
  }

  .word-block.dim {
    opacity: 0.5;
    cursor: default;
  }
.trans {
  font-size: 1.2rem;
  font-weight: 500;
  color: #111;
  text-align: center;
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
}

.read .word-block .greek{
  font-size: 1.65rem !important;
  font-weight: 500 !important;
  color: #111 !important;
  line-height: 1.05 !important;
  margin-bottom: 0.05rem !important;
}

.read .word-block .pron{
  font-size: 1.3rem !important;
  color: #666 !important;
  line-height: 1 !important;
}

/* un peu plus de “bloc” pour que ça respire bien */
.read .word-block{
  min-width: 120px !important;
}

</style>