"use client"
import { createContext, ReactNode, useContext, useState } from 'react'

interface LanguageContextType {
  isLanguageLoading: boolean
  setLanguageLoading: (loading: boolean) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isLanguageLoading, setIsLanguageLoading] = useState(false)

  const setLanguageLoading = (loading: boolean) => {
    setIsLanguageLoading(loading)
  }

  return (
    <LanguageContext.Provider value={{ isLanguageLoading, setLanguageLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}