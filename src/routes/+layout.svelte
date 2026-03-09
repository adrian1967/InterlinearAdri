
<script>
  import { onMount } from 'svelte';

  onMount(async () => {
    if (typeof window !== 'undefined') {
      const { registerSW } = await import('virtual:pwa-register');
      registerSW({ immediate: true });
    }
  });
</script>

<svelte:head>
  <link rel="icon" href="/favicon.ico" />
</svelte:head>

<slot />