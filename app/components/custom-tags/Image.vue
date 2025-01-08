<template>
   <img :src="src" :alt="alt" />
</template>

<script lang="ts" setup>
type Props = {
   src: string
   alt: string
}

withDefaults(defineProps<Props>(), {})
</script>
