import { describe, expect, it } from 'vitest'
import { profileIdFromParam, profileUrl } from './profileLink'

describe('profileLink', () => {
  it('monta o link sem texto extra', () => {
    expect(profileUrl('https://easytrip.app', 'cmwtv7t74')).toBe(
      'https://easytrip.app/profile/cmwtv7t74',
    )
  })

  it('ignora o texto que apps de compartilhamento colam no link', () => {
    expect(profileIdFromParam('cmwtv7t7400003r7mugki98x8 Veja meu perfil de viagens')).toBe(
      'cmwtv7t7400003r7mugki98x8',
    )
    expect(profileIdFromParam('cmwtv7t7400003r7mugki98x8%20Veja%20meu%20perfil')).toBe(
      'cmwtv7t7400003r7mugki98x8',
    )
  })

  it('mantém um id limpo e recusa vazio', () => {
    expect(profileIdFromParam('cmwtv7t7400003r7mugki98x8')).toBe('cmwtv7t7400003r7mugki98x8')
    expect(profileIdFromParam('')).toBeUndefined()
    expect(profileIdFromParam('   ')).toBeUndefined()
  })
})
