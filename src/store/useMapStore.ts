import { create } from 'zustand'
import type { Country } from '../types/country'

interface MapStore {
  selectedCountryId: string | null
  countryData: Country | null
  loading: boolean
  error: string | null
  selectCountry: (id: string) => Promise<void>
  clearSelection: () => void
}

export const useMapStore = create<MapStore>((set) => ({
  selectedCountryId: null,
  countryData: null,
  loading: false,
  error: null,

  selectCountry: async (id: string) => {
    set({ selectedCountryId: id, loading: true, error: null, countryData: null })
    try {
      const module = await import(`../data/countries/${id}.json`)
      set({ countryData: module.default as Country, loading: false })
    } catch {
      set({
        error: `No detailed data available for this country yet.`,
        loading: false,
      })
    }
  },

  clearSelection: () =>
    set({ selectedCountryId: null, countryData: null, error: null }),
}))
