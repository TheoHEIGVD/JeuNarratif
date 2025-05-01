<template>
  <Layout />
</template>

<script setup>
import Layout from './components/Layout.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #f5f6fa;
}

button {
  font-family: inherit;
  font-size: inherit;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
