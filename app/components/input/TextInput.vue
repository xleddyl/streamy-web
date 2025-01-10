<template>
   <div class="relative">
      <input
         type="text"
         class="w-full appearance-none rounded-3xl bg-charleston-green px-5 py-2 pr-36 text-white outline-none placeholder:opacity-30 md:px-8"
         v-model="model"
         :placeholder
      />
      <div v-if="buttonText" class="absolute inset-y-0 right-5 flex items-center md:right-8">
         <Button type="search" class="lowercase" @click="emit('submit')" :disabled="!model">
            {{ buttonText }}
         </Button>
      </div>
   </div>
</template>

<script lang="ts" setup>
type Props = {
   placeholder?: string
   buttonText?: string
}
type Emits = {
   submit: []
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emits>()

const model = defineModel<string>()
</script>
