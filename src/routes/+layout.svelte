<script lang="ts">
  import { enhance } from '$app/forms';
  import '../app.css';

  const { data, children } = $props();
</script>

<main class="flex h-screen w-full flex-col bg-slate-950 text-white">
  <nav class="flex justify-between border-b-2 border-slate-900 p-2">
    <div class="flex items-center gap-4">
      <a href="/" class="flex items-center gap-2">
        <img src="/favicon.png" class="h-10 w-10" alt="logo" />
        <span class="text-xl font-bold">Startwatch</span>
      </a>
    </div>
    <div class="flex items-center gap-4">
      {#if data.user}
        <span>Hello, {data.user.username}!</span>
        <form method="post" action="/logout?/logout" use:enhance>
          <button>Sign out</button>
        </form>
      {/if}
    </div>
  </nav>

  {@render children()}
</main>
