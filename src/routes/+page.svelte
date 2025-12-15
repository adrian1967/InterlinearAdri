<script>
  let selectedWord = null;

  const lexicon = {
    en: {
      lexical: "ἐν",
      transliteration: "en",
      meaning: "in (within)"
    },
    arche: {
      lexical: "ἀρχή",
      transliteration: "archē",
      meaning: "beginning"
    },
    enVerb: {
      lexical: "ἦν",
      transliteration: "ēn",
      meaning: "was"
    },
    ho: {
      lexical: "ὁ",
      transliteration: "ho",
      meaning: "the"
    },
    logos: {
      lexical: "λόγος",
      transliteration: "logos",
      meaning: "word"
    },
    kai: {
      lexical: "καί",
      transliteration: "kai",
      meaning: "and"
    },
    pros: {
      lexical: "πρός",
      transliteration: "pros",
      meaning: "toward"
    },
    ton: {
      lexical: "τόν",
      transliteration: "ton",
      meaning: "the (acc.)"
    },
    theos: {
      lexical: "θεός",
      transliteration: "theos",
      meaning: "God"
    }
  };

  function select(key) {
    if (selectedWord === lexicon[key]) {
      selectedWord = null;
    } else {
      selectedWord = lexicon[key];
    }
  }
</script>

<h1>Interlinear Greek–English Reader</h1>
<h2>John 1:1</h2>

<div class="greek">

  <div class="line">
    <span class="word-block">
      <span class="word" on:click={() => select("en")}>Ἐν</span>
      <span class="gloss">in (within)</span>
    </span>

    <span class="word-block">
      <span class="word" on:click={() => select("arche")}>ἀρχῇ</span>
      <span class="gloss"></span>
    </span>

    <span class="word-block">
      <span class="word" on:click={() => select("enVerb")}>ἦν</span>
      <span class="gloss"></span>
    </span>

    <span class="word-block">
      <span class="word" on:click={() => select("ho")}>ὁ</span>
      <span class="gloss"></span>
    </span>

    <span class="word-block">
      <span class="word" on:click={() => select("logos")}>Λόγος</span>
      <span class="gloss"></span>
    </span>
  </div>

  <div class="line">
    <span class="word" on:click={() => select("kai")}>καὶ</span>
    <span class="word" on:click={() => select("ho")}>ὁ</span>
    <span class="word" on:click={() => select("logos")}>Λόγος</span>
    <span class="word" on:click={() => select("enVerb")}>ἦν</span>
    <span class="word" on:click={() => select("pros")}>πρὸς</span>
    <span class="word" on:click={() => select("ton")}>τὸν</span>
    <span class="word" on:click={() => select("theos")}>Θεόν</span>
  </div>

  <div class="line">
    <span class="word" on:click={() => select("kai")}>καὶ</span>
    <span class="word" on:click={() => select("theos")}>Θεὸς</span>
    <span class="word" on:click={() => select("enVerb")}>ἦν</span>
    <span class="word" on:click={() => select("ho")}>ὁ</span>
    <span class="word" on:click={() => select("logos")}>Λόγος</span>
  </div>

</div>

{#if selectedWord}
  <div class="lexicon">
    <h3>Lexicon</h3>
    <p><strong>Lexical:</strong> {selectedWord.lexical}</p>
    <p><strong>Transliteration:</strong> {selectedWord.transliteration}</p>
    <p><strong>Meaning:</strong> {selectedWord.meaning}</p>
  </div>
{/if}

<style>
  .greek {
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-family: "Times New Roman", serif;
  }

  .word {
    cursor: pointer;
    padding: 0 0.15rem;
    font-size: 1.2em;
  }

  .word:hover {
    background-color: #eef;
  }

  .word-block {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
    margin: 0 4px;
  }

  .gloss {
    font-size: 0.8em;
    color: #555;
    margin-top: 6px;
    min-height: 1.2em;
  }

  .lexicon {
    margin-top: 1.5rem;
    padding: 1rem;
    border: 1px solid #ccc;
    background: #fafafa;
  }
</style>