<template>
  <!-- Container principal -->
  <div class="layout">
    <!-- Barre de navigation -->
    <NavBar />
    
    <!-- Contenu principal avec transitions -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <!-- Animation de transition entre les routes -->
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import NavBar from './NavBar.vue';  // Import du composant de navigation
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Zone de contenu principale */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>