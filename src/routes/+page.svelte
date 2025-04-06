<script lang="ts">
  import { enhance } from '$app/forms';
  import StartwatchCard from '$lib/client/components/StartwatchCard.svelte';
  import { type Startwatch } from '$lib/server/db/schema';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  // The new startwatch data
  let newStartwatch = $state({
    name: '',
  });

  // The delete confirmation modal
  let deleteConfirmModalData = $state<Startwatch>();
  let deleteConfirmModalEl = $state<HTMLDialogElement>();
  const openDeleteConfirmModal = (startwatch: Startwatch) => {
    deleteConfirmModalData = startwatch;
    deleteConfirmModalEl?.showModal();
  };
  const closeDeleteConfirmModal = () => {
    deleteConfirmModalData = undefined;
    deleteConfirmModalEl?.close();
  };
</script>

<svelte:head>
  <title>Startwatch</title>
</svelte:head>

<div class="flex flex-1 flex-col items-center gap-4 p-4">
  <!-- List tartwatches -->
  {#each data.startwatches as startwatch}
    <StartwatchCard {startwatch} onLongPress={openDeleteConfirmModal} />
  {/each}

  <!-- New startwatch form -->
  <form method="POST" action="?/addStartwatch" use:enhance>
    <input
      type="text"
      name="name"
      bind:value={newStartwatch.name}
      placeholder="Startwatch Name"
      required
      class="rounded-md border-none bg-slate-700"
    />
    <button>➕</button>
  </form>

  <!-- Delete confirmation modal -->
  <dialog
    class="mx-auto mt-[25vh] w-1/2 rounded-lg backdrop:bg-black/50"
    bind:this={deleteConfirmModalEl}
  >
    <div class="flex flex-col gap-2 p-4">
      <header class="flex justify-between">
        <h2 class="text-2xl text-gray-700">
          Are you sure you want to Delete '{deleteConfirmModalData?.name}'?
        </h2>
      </header>
      <div>
        <form
          method="POST"
          action="?/deleteStartwatch"
          use:enhance={() => {
            closeDeleteConfirmModal();
          }}
          class="flex justify-end gap-2"
        >
          <input type="hidden" name="id" value={deleteConfirmModalData?.id} />
          <!-- Reverse order so hitting Enter chooses the Delete option by default -->
          <div class="flex flex-row-reverse gap-2">
            <button
              type="submit"
              class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Delete
            </button>
            <button
              type="button"
              class="rounded-md bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
              onclick={() => {
                closeDeleteConfirmModal();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</div>
