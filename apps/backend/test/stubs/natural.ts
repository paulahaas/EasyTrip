// O pacote `natural` importa `afinn-165`, que é ESM puro e o Jest (CommonJS) não
// consegue carregar. A API só usa o stemmer em português, então nos testes e2e
// carregamos apenas esse arquivo (o stemmer real, não um mock).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stemmer = require('natural/lib/natural/stemmers/porter_stemmer_pt');

export const PorterStemmerPt = stemmer.default ?? stemmer;
