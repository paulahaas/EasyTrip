import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CountryFlag } from './CountryFlag'

describe('CountryFlag', () => {
  it('mostra a imagem da bandeira pelo código do país', () => {
    const { container } = render(<CountryFlag cca2="BR" />)
    const img = container.querySelector('img')!
    expect(img.getAttribute('src')).toBe('https://flagcdn.com/w40/br.png')
    expect(img.getAttribute('srcset')).toContain('w80/br.png 2x')
  })

  it('mostra um globo sem código ou se a imagem falhar', () => {
    const semCodigo = render(<CountryFlag cca2={null} />)
    expect(semCodigo.container.querySelector('img')).toBeNull()
    expect(semCodigo.container.querySelector('svg')).not.toBeNull()

    const { container } = render(<CountryFlag cca2="ZZ" />)
    fireEvent.error(container.querySelector('img')!)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('svg')).not.toBeNull()
  })
})
