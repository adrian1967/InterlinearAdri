
<script>
  import { onMount } from 'svelte';
  import { loadTBESG, getTBESGEntries } from '$lib/lexicon/stepbible/tbesg.js';

  import {
    formaterDefinitionCompleteTBESG,
    preparerReferencesTBESG
  } from '$lib/lexicon/stepbible/format-tbesg.js';
  import DOMPurify from 'isomorphic-dompurify';


  let entrees = [];
  let erreur = '';
  let chargement = true;

  onMount(async () => {
    try {
      entrees = await loadTBESG();
    } catch (e) {
      erreur = e.message;
    } finally {
      chargement = false;
    }
  });

  $: resultats = getTBESGEntries(entrees, 'G0025');


  $: referencesPreparees = preparerReferencesTBESG(
    resultats[0]?.definitionOriginale
  );


  $: definitionFormatee = formaterDefinitionCompleteTBESG(
    resultats[0]?.definitionOriginale
  );

</script>

<h1>Great Books — Test TBESG</h1>

{#if chargement}
  <p>Chargement du dictionnaire...</p>
{:else if erreur}
  <p>Erreur : {erreur}</p>
{:else}
  <p>Entrées chargées : {entrees.length}</p>
  <p>Mot grec : {resultats[0]?.grec ?? 'Introuvable'}</p>
  <p>Translittération : {resultats[0]?.translitteration ?? '—'}</p>
  <p>Sens court : {resultats[0]?.sensCourt ?? '—'}</p>


<p>Références bibliques : {referencesPreparees.length}</p>

<details>
  <summary>Liste des références bibliques</summary>

  <ol>
    {#each referencesPreparees as reference}
      <li>
        {reference.texte} — {reference.identifiant}
      </li>
    {/each}
  </ol>
</details>

<h2>Définition originale complète</h2>
<p style="white-space: pre-wrap; overflow-wrap: anywhere;">


{@html DOMPurify.sanitize(definitionFormatee, {
  ALLOWED_TAGS: ['b', 'i'],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false
})}


</p>

{/if}
