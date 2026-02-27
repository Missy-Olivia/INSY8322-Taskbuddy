<template>
  <section class="mx-auto grid max-w-2xl gap-4">
    <h1 class="text-3xl font-semibold tracking-tight">Page not found</h1>
    <p class="text-sm text-zinc-600 dark:text-zinc-400">
      The page you’re looking for doesn’t exist (or moved). Use the navigation above, or go back to the dashboard.
    </p>

    <div class="flex flex-wrap gap-2">
      <RouterLink
        to="/dashboard"
        class="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
      >
        Go to dashboard
      </RouterLink>
      <RouterLink
        to="/login"
        class="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus-visible:outline-white"
      >
        Sign in
      </RouterLink>
    </div>
  </section>
</template>

