/** Link do perfil compartilhável. */
export function profileUrl(origin: string, userId: string): string {
  return `${origin}/profile/${encodeURIComponent(userId)}`
}

/**
 * Extrai o id do usuário do parâmetro da rota. Alguns apps de compartilhamento
 * colam o texto da mensagem no fim do link ("…/profile/<id> Veja meu perfil"),
 * então só vale o primeiro trecho de letras e números.
 */
export function profileIdFromParam(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  let value = raw
  try {
    value = decodeURIComponent(raw)
  } catch {
    // já veio decodificado
  }
  const match = value.trim().match(/^[A-Za-z0-9_-]+/)
  return match ? match[0] : undefined
}
