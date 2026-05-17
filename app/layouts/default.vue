<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <LayoutAppSidebar />
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <LayoutAppTopbar />
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
