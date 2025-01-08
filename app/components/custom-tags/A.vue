<template>
   <a :href="href" :target="target" :title="title">
      <slot />
   </a>
</template>

<script lang="ts" setup>
type Props = {
   target?: '_blank' | '_parent' | '_self' | '_top'
   href: string
   title: string
}

withDefaults(defineProps<Props>(), {
   target: '_blank',
})
</script>
