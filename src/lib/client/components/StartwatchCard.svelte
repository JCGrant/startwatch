<script lang="ts">
  import type { Startwatch } from '$lib/server/db/schema';
  import Timer from './Timer.svelte';

  const {
    startwatch,
    onLongPress,
  }: {
    startwatch: Startwatch;
    onLongPress: (startwatch: Startwatch) => void;
  } = $props();

  // Handling the long press
  let holdTimeout: number;
  const startLongPress = (target: HTMLElement) => {
    target.style.transition = 'background-color 1000ms';
    target.style.backgroundColor = 'oklch(20.8% 0.042 265.755)';
    holdTimeout = setTimeout(async () => {
      onLongPress(startwatch);
    }, 500);
  };
  const endLongPress = (target: HTMLElement) => {
    target.style.transition = '';
    target.style.backgroundColor = '';
    clearTimeout(holdTimeout);
  };
  const onMouseDown = (event: MouseEvent) => startLongPress(event.currentTarget as HTMLElement);
  const onMouseUp = (event: MouseEvent) => endLongPress(event.currentTarget as HTMLElement);
  const onMouseLeave = (event: MouseEvent) => endLongPress(event.currentTarget as HTMLElement);
  const onTouchStart = (event: TouchEvent) => startLongPress(event.currentTarget as HTMLElement);
  const onTouchEnd = (event: TouchEvent) => endLongPress(event.currentTarget as HTMLElement);
  const onTouchCancel = (event: TouchEvent) => endLongPress(event.currentTarget as HTMLElement);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onmousedown={onMouseDown}
  onmouseup={onMouseUp}
  onmouseleave={onMouseLeave}
  ontouchstart={onTouchStart}
  ontouchend={onTouchEnd}
  ontouchcancel={onTouchCancel}
  class="flex w-[75vw] cursor-pointer flex-col rounded-lg bg-slate-800 px-[2vw] py-[1vw] select-none"
>
  <span class="self-center text-[2vw] text-slate-600 italic">{startwatch.name}</span>
  <Timer startedAt={startwatch.startedAt} class="fredoka-bold mt-[-2vw] text-[8vw]" />
  <span class="mt-[-2vw] self-center text-[2vw] text-slate-600 italic">
    Started at {startwatch.startedAt.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}
  </span>
</div>
