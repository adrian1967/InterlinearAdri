
<script>
  import { onMount } from 'svelte';
  import { loadTBESG, getTBESGEntries } from '$lib/lexicon/stepbible/tbesg.js';
  import { formatTBESG, formaterTypographieTBESG, formaterReferencesCompletesTBESG, preparerReferencesTBESG, formaterNotesTBESG, formaterReTBESG, formaterGreekTBESG, formaterAuthorTBESG, formaterDefTBESG, formaterDateTBESG } from '$lib/lexicon/stepbible/format-tbesg.js';
  import DOMPurify from 'isomorphic-dompurify';
  import { formaterCorrTBESG } from '$lib/lexicon/stepbible/format-tbesg.js';
  import { formaterATBESG } from '$lib/lexicon/stepbible/format-tbesg.js';



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

  $: resultats = getTBESGEntries(entrees, 'G6164');

  $: definitionFormatee = formaterTypographieTBESG(
    formaterATBESG(
      formaterCorrTBESG(
        formaterDateTBESG(
          formaterDefTBESG(
            formaterAuthorTBESG(
              formaterGreekTBESG(
                formaterReTBESG(
                  formaterNotesTBESG(
                    formaterReferencesCompletesTBESG(
                      formatTBESG(resultats[0]?.definitionOriginale)
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
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

<h2>Définition originale complète</h2>
<p style="white-space: pre-wrap; overflow-wrap: anywhere;">


{@html DOMPurify.sanitize(definitionFormatee, {
  ALLOWED_TAGS: ['b', 'i'],
  ALLOWED_ATTR: []
})}


</p>

{/if}
