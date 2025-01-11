<template>
   <div class="relative">
      <input
         ref="input"
         type="text"
         class="w-full appearance-none rounded-2xl bg-charleston-green px-5 py-3 pr-36 text-white outline-none placeholder:opacity-30 md:px-8"
         :class="{ 'rounded-b-none': showSuggestionLocal }"
         v-model="model"
         :placeholder
         @focus="inputFocus = true"
         @blur="hover ? null : (inputFocus = false)"
         @keyup.enter="$emit('submit')"
      />
      <div v-if="buttonText" class="absolute inset-y-0 right-5 flex items-center md:right-8">
         <Button
            type="search"
            class="bg-charleston-green pl-3 lowercase"
            @click="emit('submit')"
            :disabled="!model || buttonDisabled"
            :loading="buttonLoading"
         >
            {{ buttonText }}
         </Button>
      </div>
      <div
         v-if="showSuggestionLocal"
         class="__glass absolute inset-x-0 z-20 rounded-b-2xl bg-gradient-to-b from-charleston-green to-charleston-green/70 px-5 shadow-lg"
         ref="suggestions"
      >
         <div class="border-t border-white/10 py-4">
            <slot name="suggestion" />
         </div>
      </div>
   </div>
</template>

<script lang="ts" setup>
type Props = {
   placeholder?: string
   buttonText?: string
   showSuggestion?: boolean
   buttonDisabled?: boolean
   buttonLoading?: boolean
}
type Emits = {
   submit: []
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emits>()
const suggestions = ref<HTMLDivElement>()
const hover = useElementHover(suggestions)

const model = defineModel<string>()

const inputFocus = ref<boolean>(false)
const showSuggestionLocal = computed(() => props.showSuggestion && inputFocus.value)
</script>
