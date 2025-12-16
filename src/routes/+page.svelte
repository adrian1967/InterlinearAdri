<script>
  let selectedWord = null;

  const lexicon = {
    en: {
      strong: "G1722",
      lexical: "ἐν",
      transliteration: "en",
      partOfSpeech: "Preposition",
      phonetic: "en",
      definition: "in, on, at, by, with",
      origin:
        "A primary preposition denoting fixed position in place, time or state; a relation of rest.",
      usage:
        "Used to denote position, state, or instrumentality; often used in compounds.",
      translatedAs:
        "in (2177), with (130), among (125), by (111), on (73), within (16)"
    },

    arche: {
      strong: "G746",
      lexical: "ἀρχή",
      transliteration: "archē",
      partOfSpeech: "Noun, Feminine",
      phonetic: "ar-khay'",
      definition:
        "(a) beginning, (b) rule or authority, (c) principality",
      origin:
        "From archomai; a commencement or chief point in time, order, or rank.",
      usage:
        "Used of beginnings in time, authority structures, or foundational principles.",
      translatedAs:
        "beginning (42), rulers (5), rule (2), principality (1)"
    },

    enVerb: {
      strong: "G1510",
      lexical: "εἰμί",
      transliteration: "eimi",
      partOfSpeech: "Verb",
      phonetic: "i-mee'",
      definition: "I exist, I am",
      origin:
        "A primary and defective verb of existence.",
      usage:
        "Used to denote existence or being; often carries aspectual force.",
      translatedAs:
        "was (166), is (603), are (242), being (147)"
    },

    ho: {
      strong: "G3588",
      lexical: "ὁ",
      transliteration: "ho",
      partOfSpeech: "Definite Article",
      phonetic: "ho",
      definition: "the definite article",
      origin:
        "The Greek definite article in all its inflected forms.",
      usage:
        "Used to specify, identify, or particularize a noun.",
      translatedAs:
        "the (10868), that (133), this (7)"
    },

    logos: {
      strong: "G3056",
      lexical: "λόγος",
      transliteration: "logos",
      partOfSpeech: "Noun, Masculine",
      phonetic: "log'-os",
      definition:
        "a word, statement, speech, reasoning",
      origin:
        "From legō; something spoken or expressed; by implication reasoning.",
      usage:
        "Used of speech, message, reason, or divine expression (John 1).",
      translatedAs:
        "word (177), saying (9), speech (8), reason (2)"
    },
kai: {
  strong: "G2532",
  lexical: "καί",
  transliteration: "kai",
  partOfSpeech: "Conjunction",
  phonetic: "kahee",
  definition: "and, even, also, namely",
  origin:
    "A primary particle with copulative and sometimes cumulative force.",
  usage:
    "Used to connect clauses or words; can have additive or emphatic force.",
  translatedAs:
    "and (8135), also (695), even (108), both (41)"
},

pros: {
  strong: "G4314",
  lexical: "πρός",
  transliteration: "pros",
  partOfSpeech: "Preposition",
  phonetic: "pros",
  definition:
    "toward, at, with reference to",
  origin:
    "A strengthened form of pro; a preposition of direction or relation.",
  usage:
    "Used with the accusative to denote direction, orientation, or relation.",
  translatedAs:
    "to (476), with (48), for (45), toward (31)"
},
theos: {
  strong: "G2316",
  lexical: "θεός",
  transliteration: "theos",
  partOfSpeech: "Noun, Masculine",
  phonetic: "theh-os",
  definition: "God, deity",
  origin:
    "Of uncertain affinity; used of the supreme Divinity.",
  usage:
    "Used of God, the supreme being; also of divine beings in some contexts.",
  translatedAs:
    "God (1343), god (3), godhead (1)"
},


  };

  function select(key) {
    selectedWord =
      selectedWord === lexicon[key] ? null : lexicon[key];
  }
</script>

<h2>John 1:1</h2>

<!-- Ligne grecque 1 -->
<div class="line">
  <div class="word-block" on:click={() => select("en")}>
    <div class="greek">Ἐν</div>
    <div class="pron">en</div>
    <div class="trans">in (within)</div>
  </div>

  <div class="word-block" on:click={() => select("arche")}>
    <div class="greek">ἀρχῇ</div>
    <div class="pron">archē</div>
    <div class="trans">beginning (origin, principle)</div>
  </div>

  <div class="word-block" on:click={() => select("enVerb")}>
    <div class="greek">ἦν</div>
    <div class="pron">ēn</div>
    <div class="trans">was (existing)</div>
  </div>

  <div class="word-block" on:click={() => select("ho")}>
    <div class="greek">ὁ</div>
    <div class="pron">ho</div>
    <div class="trans">the</div>
  </div>

  <div class="word-block" on:click={() => select("logos")}>
    <div class="greek">Λόγος</div>
    <div class="pron">logos</div>
    <div class="trans">Word (reason, discourse)</div>
  </div>
</div>

<!-- Ligne grecque 2 -->
<div class="line">
  <div class="word-block" on:click={() => select("kai")}>
    <div class="greek">καὶ</div>
    <div class="pron">kai</div>
    <div class="trans">and (also, even)</div>
  </div>

  <div class="word-block" on:click={() => select("ho")}>
    <div class="greek">ὁ</div>
    <div class="pron">ho</div>
    <div class="trans">the</div>
  </div>

  <div class="word-block" on:click={() => select("logos")}>
    <div class="greek">Λόγος</div>
    <div class="pron">logos</div>
    <div class="trans">Word (reason, discourse)</div>
  </div>

  <div class="word-block" on:click={() => select("enVerb")}>
    <div class="greek">ἦν</div>
    <div class="pron">ēn</div>
    <div class="trans">was (existing)</div>
  </div>

  <div class="word-block" on:click={() => select("pros")}>
    <div class="greek">πρὸς</div>
    <div class="pron">pros</div>
    <div class="trans">toward (facing, in relation to)</div>
  </div>

  <div class="word-block" on:click={() => select("ho")}>
    <div class="greek">τὸν</div>
    <div class="pron">ton</div>
    <div class="trans">the</div>
  </div>

  <div class="word-block" on:click={() => select("theos")}>
    <div class="greek">Θεόν</div>
    <div class="pron">theon</div>
    <div class="trans">God</div>
  </div>
</div>

<!-- Ligne grecque 3 -->
<div class="line">
  <div class="word-block" on:click={() => select("kai")}>
    <div class="greek">καὶ</div>
    <div class="pron">kai</div>
    <div class="trans">and (also, even)</div>
  </div>

  <div class="word-block" on:click={() => select("theos")}>
    <div class="greek">Θεὸς</div>
    <div class="pron">theos</div>
    <div class="trans">God (divine)</div>
  </div>

  <div class="word-block" on:click={() => select("enVerb")}>
    <div class="greek">ἦν</div>
    <div class="pron">ēn</div>
    <div class="trans">was (existing)</div>
  </div>

  <div class="word-block" on:click={() => select("ho")}>
    <div class="greek">ὁ</div>
    <div class="pron">ho</div>
    <div class="trans">the</div>
  </div>

  <div class="word-block" on:click={() => select("logos")}>
    <div class="greek">Λόγος</div>
    <div class="pron">logos</div>
    <div class="trans">Word (reason, discourse)</div>
  </div>
</div>

<!-- Fiche lexicale -->
{#if selectedWord}
  <div class="lexicon">
    <h3>{selectedWord.lexical} — Strong’s {selectedWord.strong}</h3>

    <p><strong>Lexical:</strong> {selectedWord.lexical}</p>
    <p><strong>Transliteration:</strong> {selectedWord.transliteration}</p>
    <p><strong>Part of Speech:</strong> {selectedWord.partOfSpeech}</p>
    <p><strong>Phonetic Spelling:</strong> {selectedWord.phonetic}</p>
    <p><strong>Definition:</strong> {selectedWord.definition}</p>
    <p><strong>Origin:</strong> {selectedWord.origin}</p>
    <p><strong>Usage:</strong> {selectedWord.usage}</p>
    <p><strong>Translated as (count):</strong> {selectedWord.translatedAs}</p>
  </div>
{/if}

<style>
  .line {
    display: flex;
    gap: 12px;
    margin-bottom: 1rem;
  }

  .word-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    min-width: 90px;
  }

  .greek {
    font-size: 1.6rem;
    font-family: "Times New Roman", serif;
  }

  .pron {
    font-size: 0.9rem;
    color: #444;
  }

  .trans {
    font-size: 0.85rem;
    color: #666;
    text-align: center;
  }

  .lexicon {
    margin-top: 1.5rem;
    padding: 1rem;
    border: 1px solid #ccc;
    background: #fafafa;
  }
</style>