import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar-state', () => {
   const open = ref<boolean>(false)

   return { open }
})
