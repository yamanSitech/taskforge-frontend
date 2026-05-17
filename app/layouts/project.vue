<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <LayoutAppSidebar />
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <LayoutAppTopbar />
      <div class="flex flex-1 overflow-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>
