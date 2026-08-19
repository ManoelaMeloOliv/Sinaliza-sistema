import { useContext } from 'react'
import { AppContext } from '../contexto/context'

export function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp deve ser usado dentro de AppProvider')
  return value
}

