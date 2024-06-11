import { create } from 'zustand'

type GlobalStore = {
  files: File[]
  setFiles: (files: File[]) => void
  tables: any[]
  setTables: (tables: any[]) => void
  selectedTables: any[]
  setSelectedTables: (selectedTables: any[]) => void
}

export const useStore = create<GlobalStore>(set => ({
  files: [],
  setFiles: (files: File[]) => set({ files }),
  tables: [],
  setTables: (tables: any[]) => set({ tables }),
  selectedTables: [],
  setSelectedTables: (selectedTables: any[]) => set({ selectedTables })
}))
