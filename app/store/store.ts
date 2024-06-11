import { create } from 'zustand'

type GlobalStore = {
  selectedTables: any[]
  setSelectedTables: (selectedTables: any) => void
  response: { tables: any }
  setResponse: (response: any) => void
}

export const useStore = create<GlobalStore>(set => ({
  selectedTables: [],
  setSelectedTables: selectedTables => set({ selectedTables }),
  response: { tables: {} },
  setResponse: response => set({ response })
}))
