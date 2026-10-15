import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLocalHistory } from './useLocalHistory'

describe('useLocalHistory', () => {
  it('add escreve no localStorage e deduplica case-insensitive', () => {
    const { result } = renderHook(() => useLocalHistory())
    act(() => result.current.add('Brazil'))
    expect(result.current.history).toEqual(['Brazil'])
    expect(JSON.parse(localStorage.getItem('easytrip:search-history')!)).toEqual([
      'Brazil',
    ])
    act(() => result.current.add('brazil'))
    expect(result.current.history).toEqual(['brazil'])
  })

  it('limita a 8 itens', () => {
    const { result } = renderHook(() => useLocalHistory())
    act(() => {
      for (let i = 0; i < 10; i++) result.current.add(`Country${i}`)
    })
    expect(result.current.history).toHaveLength(8)
    expect(result.current.history[0]).toBe('Country9')
  })

  it('clear remove tudo', () => {
    const { result } = renderHook(() => useLocalHistory())
    act(() => {
      result.current.add('A')
      result.current.add('B')
    })
    act(() => result.current.clear())
    expect(result.current.history).toEqual([])
    expect(localStorage.getItem('easytrip:search-history')).toBeNull()
  })
})
