<script lang="ts">
  import time from '$lib/client/state/time.svelte';

  const props: {
    startedAt: Date;
    class: string;
  } = $props();

  const formatDuration = (ms: number) => {
    if (ms < 0) {
      return '00:00:00:00:0000';
    }
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    ms %= 24 * 60 * 60 * 1000;
    const hours = Math.floor(ms / (60 * 60 * 1000));
    ms %= 60 * 60 * 1000;
    const minutes = Math.floor(ms / (60 * 1000));
    ms %= 60 * 1000;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${String(days).padStart(4, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(4, '0')}`;
  };

  let formattedTime = $derived(formatDuration(time.now.getTime() - props.startedAt.getTime()));
</script>

<span class={props.class}>{formattedTime}</span>
