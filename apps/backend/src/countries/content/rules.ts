// Regras importantes para turistas em países com leis ou costumes mais rígidos
// (ISO alpha-2). Conteúdo curado à mão e de caráter informativo: leis mudam,
// por isso a interface sempre mostra um aviso para conferir fontes oficiais.
// Exigências de visto ficam de fora de propósito (mudam com frequência).

import type { CountryRule } from '@easytrip/shared';

const proibido = (titulo: string, descricao: string): CountryRule => ({ tipo: 'proibido', titulo, descricao });
const obrigatorio = (titulo: string, descricao: string): CountryRule => ({ tipo: 'obrigatorio', titulo, descricao });
const atencao = (titulo: string, descricao: string): CountryRule => ({ tipo: 'atencao', titulo, descricao });

const DRUGS_DEATH_PENALTY = proibido(
  'Drogas',
  'Tráfico e porte de drogas têm punições severas, que podem incluir pena de morte.',
);

export const COUNTRY_RULES: Record<string, CountryRule[]> = {
  SG: [
    proibido('Chiclete', 'A venda e a entrada de chiclete no país são proibidas (exceto os de uso terapêutico).'),
    proibido('Comer e beber no metrô', 'Proibido comer ou beber nos trens e estações do MRT, sob multa.'),
    proibido('Cigarro eletrônico', 'Vapes são proibidos, inclusive para uso pessoal.'),
    atencao('Lixo e cuspe', 'Jogar lixo ou cuspir na rua dá multas altas.'),
    DRUGS_DEATH_PENALTY,
  ],
  JP: [
    obrigatorio('Passaporte sempre com você', 'Estrangeiros devem portar o passaporte o tempo todo.'),
    proibido('Alguns remédios', 'Remédios com estimulantes (como pseudoefedrina, comum em antigripais) são proibidos ou exigem autorização.'),
    atencao('Tatuagens', 'Muitos onsens (banhos termais) e academias não aceitam pessoas tatuadas.'),
    atencao('Silêncio no transporte', 'Falar ao telefone no trem é malvisto.'),
    atencao('Gorjeta', 'Não é costume dar gorjeta e pode até ser recusada.'),
  ],
  AE: [
    proibido('Drogas', 'Tolerância zero, inclusive para vestígios no sangue ou na bagagem.'),
    obrigatorio('Remédios controlados', 'Alguns medicamentos precisam de autorização prévia para entrar no país.'),
    atencao('Álcool', 'Só em locais licenciados; embriaguez em público é crime.'),
    atencao('Demonstrações de afeto', 'Beijos e carícias em público podem gerar problemas com a polícia.'),
    atencao('Roupas', 'Cubra ombros e joelhos em shoppings, mesquitas e locais públicos.'),
  ],
  SA: [
    proibido('Álcool', 'Bebidas alcoólicas são proibidas em todo o país.'),
    DRUGS_DEATH_PENALTY,
    atencao('Roupas', 'Homens e mulheres devem cobrir ombros e joelhos em público.'),
    atencao('Ramadã', 'Evite comer, beber e fumar em público durante o dia no mês sagrado.'),
  ],
  QA: [
    proibido('Entrar com álcool', 'É proibido trazer bebidas alcoólicas na bagagem.'),
    atencao('Álcool', 'Só é servido em hotéis e bares licenciados.'),
    atencao('Roupas e afeto', 'Roupas recatadas e discrição em público.'),
  ],
  KW: [
    proibido('Álcool', 'Bebidas alcoólicas são proibidas no país.'),
    DRUGS_DEATH_PENALTY,
  ],
  IR: [
    obrigatorio('Véu para mulheres', 'Mulheres, inclusive estrangeiras, devem cobrir o cabelo em público.'),
    proibido('Álcool', 'Bebidas alcoólicas são proibidas.'),
  ],
  TH: [
    proibido('Ofender a monarquia', 'Críticas ou desrespeito à família real são crime, com pena de prisão.'),
    proibido('Cigarro eletrônico', 'A posse de vapes é ilegal e pode render multa ou prisão.'),
    obrigatorio('Roupas em templos', 'Cubra ombros e joelhos e tire os sapatos para entrar.'),
    atencao('Dinheiro', 'Não pise em notas ou moedas: elas têm a imagem do rei.'),
  ],
  ID: [
    DRUGS_DEATH_PENALTY,
    obrigatorio('Taxa turística de Bali', 'Estrangeiros pagam uma taxa ao chegar em Bali.'),
    obrigatorio('Roupas em templos', 'Use sarongue e cubra ombros e joelhos.'),
  ],
  MY: [
    DRUGS_DEATH_PENALTY,
    atencao('Roupas', 'Cubra ombros e joelhos em mesquitas e áreas mais tradicionais.'),
  ],
  CN: [
    obrigatorio('Registro de hospedagem', 'Estrangeiros precisam ser registrados na polícia em até 24 h (hotéis fazem isso; quem fica em casa de amigos precisa ir até a delegacia).'),
    obrigatorio('Passaporte sempre com você', 'Exigido em hotéis, trens e pontos turísticos.'),
    DRUGS_DEATH_PENALTY,
    atencao('Internet', 'Google, WhatsApp e Instagram são bloqueados.'),
  ],
  IN: [
    obrigatorio('Sapatos em templos', 'Tire os sapatos antes de entrar em templos e muitas casas.'),
    atencao('Carne bovina', 'O abate de vacas é proibido em vários estados.'),
    atencao('Mão esquerda', 'Use a mão direita para comer e entregar objetos.'),
  ],
  US: [
    proibido('Álcool antes dos 21', 'A idade mínima para comprar e consumir álcool é 21 anos.'),
    proibido('Beber na rua', 'Na maioria das cidades é proibido beber em público.'),
    atencao('Gorjeta', 'Esperada em restaurantes (15% a 20%), táxis e hotéis.'),
  ],
  GB: [
    atencao('Mão inglesa', 'Dirige-se pela esquerda: olhe para a direita antes de atravessar.'),
  ],
  DE: [
    proibido('Símbolos nazistas', 'Exibir a suástica ou fazer a saudação nazista é crime.'),
    atencao('Domingo de descanso', 'Comércio fechado e barulho evitado aos domingos.'),
    atencao('Ciclovias e faixas', 'Não ande na ciclovia e respeite o sinal vermelho, mesmo sem carros.'),
  ],
  FR: [
    proibido('Cobrir o rosto', 'É proibido cobrir totalmente o rosto em espaços públicos.'),
  ],
  IT: [
    proibido('Sentar na Escadaria da Praça de Espanha', 'Em Roma, sentar nos degraus dá multa.'),
    proibido('Entrar nas fontes', 'Entrar ou se banhar em fontes, como a Fontana di Trevi, dá multa.'),
    obrigatorio('Taxa de acesso a Veneza', 'Visitantes que não pernoitam pagam taxa em dias de alta temporada.'),
    obrigatorio('Roupas no Vaticano e igrejas', 'Ombros e joelhos cobertos.'),
  ],
  VA: [
    obrigatorio('Roupas', 'Ombros e joelhos cobertos para entrar na Basílica de São Pedro.'),
  ],
  ES: [
    proibido('Roupa de banho fora da praia', 'Em Barcelona e outras cidades, andar de biquíni ou sem camisa pela cidade dá multa.'),
    proibido('Beber na rua', 'Muitas cidades proíbem consumir álcool em vias públicas.'),
  ],
  GR: [
    proibido('Salto alto em sítios arqueológicos', 'Saltos finos são proibidos em locais como a Acrópole.'),
    atencao('Papel higiênico', 'Em muitos lugares o papel vai no lixo, não no vaso.'),
  ],
  NL: [
    atencao('Maconha', 'Tolerada só nos coffeeshops; fumar na rua é proibido em partes de Amsterdã.'),
    atencao('Ciclovias', 'Não caminhe na ciclovia: as bicicletas têm prioridade.'),
  ],
  TR: [
    proibido('Ofender Atatürk ou a bandeira', 'Desrespeitar a memória de Atatürk ou símbolos nacionais é crime.'),
    obrigatorio('Roupas em mesquitas', 'Mulheres cobrem a cabeça; todos cobrem ombros e joelhos.'),
  ],
  EG: [
    proibido('Fotografar áreas militares', 'Fotos de quartéis, pontes e prédios do governo são proibidas.'),
    atencao('Roupas', 'Roupas recatadas fora das áreas de praia.'),
  ],
  MV: [
    proibido('Álcool nas ilhas locais', 'Só é permitido nos resorts.'),
    atencao('Biquíni', 'Nas ilhas habitadas, só em praias reservadas a turistas.'),
  ],
  BT: [
    obrigatorio('Taxa diária', 'Turistas pagam a taxa de desenvolvimento sustentável por dia de estadia.'),
    proibido('Venda de cigarro', 'A venda de produtos de tabaco é restrita.'),
  ],
  AU: [
    obrigatorio('Declarar alimentos', 'Toda comida, planta ou produto animal deve ser declarado na chegada, sob multa alta.'),
    atencao('Mão inglesa', 'Dirige-se pela esquerda.'),
  ],
  NZ: [
    obrigatorio('Declarar alimentos', 'Comida, plantas e itens de origem animal devem ser declarados, sob multa.'),
  ],
  CL: [
    obrigatorio('Declarar alimentos', 'Frutas, carnes, laticínios e sementes devem ser declarados ao SAG na fronteira, sob multa.'),
  ],
  RU: [
    obrigatorio('Cartão de migração e registro', 'Guarde o cartão de migração e registre a estadia (o hotel costuma fazer).'),
  ],
  KP: [
    proibido('Turismo independente', 'Visitas só com guias autorizados, e fotos são controladas.'),
  ],
};
