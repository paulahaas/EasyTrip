// Comidas e bebidas típicas por país (ISO alpha-2). Conteúdo curado à mão:
// para incluir um país, basta acrescentar uma entrada com 3 a 5 itens.

import type { TypicalFood } from '@easytrip/shared';

const f = (nome: string, descricao: string): TypicalFood => ({ nome, descricao });

export const TYPICAL_FOODS: Record<string, TypicalFood[]> = {
  // ── América do Sul ──
  BR: [
    f('Feijoada', 'Feijão-preto cozido com carnes de porco, servido com arroz, couve e farofa'),
    f('Coxinha', 'Salgado frito de massa de batata recheado com frango desfiado'),
    f('Pão de queijo', 'Bolinho de polvilho e queijo, típico de Minas Gerais'),
    f('Brigadeiro', 'Doce de leite condensado com chocolate, presente em toda festa'),
    f('Guaraná', 'Refrigerante feito com a fruta amazônica de mesmo nome'),
  ],
  AR: [
    f('Asado', 'Churrasco argentino de cortes bovinos assados na parrilla'),
    f('Empanada', 'Pastel assado ou frito recheado com carne, frango ou queijo'),
    f('Doce de leite', 'Usado em alfajores, panquecas e sobremesas'),
    f('Mate', 'Infusão de erva-mate tomada na cuia e compartilhada'),
  ],
  UY: [
    f('Chivito', 'Sanduíche de filé com presunto, queijo, ovo e salada'),
    f('Asado', 'Churrasco de parrilla, paixão nacional'),
    f('Mate', 'Bebida de erva-mate levada para todo lado na garrafa térmica'),
  ],
  CL: [
    f('Empanada de pino', 'Assada, recheada com carne, cebola, ovo e azeitona'),
    f('Pastel de choclo', 'Torta de milho com recheio de carne e frango'),
    f('Completo', 'Cachorro-quente com abacate, tomate e maionese'),
    f('Pisco sour', 'Coquetel de pisco com limão e clara de ovo'),
  ],
  PE: [
    f('Ceviche', 'Peixe cru marinado no limão com cebola-roxa e pimenta'),
    f('Lomo saltado', 'Carne salteada com cebola, tomate e batata frita'),
    f('Ají de gallina', 'Frango desfiado em creme de pimenta amarela'),
    f('Pisco sour', 'Coquetel nacional de pisco, limão e clara de ovo'),
  ],
  CO: [
    f('Bandeja paisa', 'Prato farto com feijão, arroz, carne moída, torresmo, ovo e banana'),
    f('Arepa', 'Pão de milho grelhado, comido com queijo ou recheios'),
    f('Ajiaco', 'Sopa de frango com três tipos de batata, típica de Bogotá'),
  ],
  VE: [
    f('Arepa', 'Pão de milho recheado com carne, queijo ou feijão'),
    f('Pabellón criollo', 'Carne desfiada, feijão-preto, arroz e banana frita'),
    f('Tequeños', 'Palitos de massa recheados com queijo e fritos'),
  ],
  EC: [
    f('Encebollado', 'Sopa de peixe com mandioca e cebola'),
    f('Ceviche de camarão', 'Camarão com limão e molho de tomate'),
    f('Llapingachos', 'Bolinhos de batata com queijo'),
  ],
  BO: [
    f('Salteña', 'Pastel assado com recheio suculento de carne'),
    f('Silpancho', 'Bife empanado sobre arroz e batata, com ovo frito'),
    f('Api', 'Bebida quente de milho roxo com canela'),
  ],
  PY: [
    f('Chipa', 'Pãozinho de polvilho e queijo, parente do pão de queijo'),
    f('Sopa paraguaya', 'Apesar do nome, é um bolo salgado de milho e queijo'),
    f('Tereré', 'Erva-mate servida gelada'),
  ],

  // ── América do Norte e Central ──
  US: [
    f('Hambúrguer', 'Clássico americano, servido com batata frita'),
    f('Cachorro-quente', 'Ícone de rua e de estádios'),
    f('Barbecue', 'Carnes defumadas lentamente, com estilos por região'),
    f('Torta de maçã', 'Sobremesa tradicional, muitas vezes com sorvete'),
  ],
  CA: [
    f('Poutine', 'Batata frita com queijo coalho e molho de carne'),
    f('Xarope de bordo', 'O maple syrup, usado em panquecas e doces'),
    f('Butter tart', 'Tortinha doce de manteiga e açúcar'),
  ],
  MX: [
    f('Tacos', 'Tortilhas de milho com carne, cebola, coentro e molho'),
    f('Guacamole', 'Pasta de abacate com tomate, cebola e limão'),
    f('Mole', 'Molho complexo com chocolate e pimentas, servido com frango'),
    f('Chilaquiles', 'Tortilhas fritas cobertas com molho, típicas do café da manhã'),
  ],
  CU: [
    f('Ropa vieja', 'Carne desfiada cozida em molho de tomate'),
    f('Moros y cristianos', 'Arroz cozido com feijão-preto'),
    f('Mojito', 'Coquetel de rum, hortelã, limão e açúcar'),
  ],
  CR: [
    f('Gallo pinto', 'Arroz com feijão temperado, servido no café da manhã'),
    f('Casado', 'Prato feito com arroz, feijão, carne, salada e banana'),
  ],
  PA: [
    f('Sancocho', 'Sopa de frango com raízes, prato nacional'),
    f('Patacones', 'Banana-verde amassada e frita'),
  ],
  GT: [
    f('Pepián', 'Ensopado de carne com molho de sementes e pimentas'),
    f('Tamales', 'Massa de milho recheada e cozida em folha de bananeira'),
  ],
  DO: [
    f('La bandera', 'Arroz, feijão e carne — o prato do dia a dia'),
    f('Mangú', 'Purê de banana-verde servido no café da manhã'),
  ],
  JM: [
    f('Jerk chicken', 'Frango marinado em temperos picantes e defumado'),
    f('Ackee and saltfish', 'Fruta ackee com bacalhau, prato nacional'),
  ],
  PR: [
    f('Mofongo', 'Banana-verde frita e amassada com alho e torresmo'),
    f('Piña colada', 'Coquetel de rum, coco e abacaxi, criado na ilha'),
  ],

  // ── Europa ──
  PT: [
    f('Bacalhau à Brás', 'Bacalhau desfiado com batata palha e ovos'),
    f('Pastel de nata', 'Tortinha de massa folhada com creme de ovos'),
    f('Francesinha', 'Sanduíche do Porto com carnes, queijo e molho picante'),
    f('Caldo verde', 'Sopa de batata com couve e rodelas de chouriço'),
  ],
  ES: [
    f('Paella', 'Arroz com açafrão e frutos do mar ou carnes, de Valência'),
    f('Tortilla de patatas', 'Omelete grossa de batata e ovos'),
    f('Jamón ibérico', 'Presunto curado de porcos ibéricos'),
    f('Churros', 'Massa frita, muitas vezes mergulhada em chocolate quente'),
  ],
  FR: [
    f('Croissant', 'Pão folhado amanteigado do café da manhã'),
    f('Baguete', 'Pão comprido e crocante, presente em toda refeição'),
    f('Queijos', 'Centenas de variedades, como brie, camembert e roquefort'),
    f('Crêpe', 'Panqueca fina, doce ou salgada'),
    f('Macaron', 'Doce de amêndoa com recheio cremoso'),
  ],
  IT: [
    f('Pizza napolitana', 'Massa fina e borda alta, nascida em Nápoles'),
    f('Massas', 'Carbonara, lasanha, risoto e centenas de formatos'),
    f('Gelato', 'Sorvete italiano, mais denso e cremoso'),
    f('Tiramisù', 'Sobremesa de café, mascarpone e cacau'),
  ],
  DE: [
    f('Bratwurst', 'Linguiça grelhada, servida com mostarda e pão'),
    f('Pretzel', 'Pão em forma de laço com sal grosso'),
    f('Schnitzel', 'Bife empanado e frito'),
    f('Cerveja', 'Tradição com festivais como a Oktoberfest'),
  ],
  GB: [
    f('Fish and chips', 'Peixe empanado com batata frita'),
    f('Full English breakfast', 'Ovos, bacon, salsicha, feijão e torrada'),
    f('Chá da tarde', 'Chá com scones, geleia e creme'),
  ],
  IE: [
    f('Irish stew', 'Ensopado de cordeiro com batata e cenoura'),
    f('Soda bread', 'Pão feito com bicarbonato em vez de fermento'),
    f('Guinness', 'Cerveja escura do tipo stout, símbolo do país'),
  ],
  NL: [
    f('Stroopwafel', 'Waffle fino recheado com caramelo'),
    f('Bitterballen', 'Bolinhos fritos de carne, petisco de bar'),
    f('Arenque cru', 'Peixe servido com cebola, comido na rua'),
  ],
  BE: [
    f('Waffle belga', 'Massa crocante e fofa, com açúcar ou chocolate'),
    f('Batata frita', 'Servida em cone com maionese'),
    f('Chocolate', 'Famoso pelas pralinés'),
    f('Moules-frites', 'Mexilhões cozidos com batata frita'),
  ],
  CH: [
    f('Fondue', 'Queijo derretido onde se mergulha pão'),
    f('Raclette', 'Queijo derretido raspado sobre batatas'),
    f('Chocolate suíço', 'Referência mundial em chocolate ao leite'),
    f('Rösti', 'Panqueca de batata ralada'),
  ],
  AT: [
    f('Wiener Schnitzel', 'Escalope de vitela empanado'),
    f('Apfelstrudel', 'Folhado de maçã com canela'),
    f('Sachertorte', 'Bolo de chocolate com geleia de damasco'),
  ],
  GR: [
    f('Moussaká', 'Camadas de berinjela, carne moída e molho bechamel'),
    f('Souvlaki', 'Espetinhos de carne no pão pita'),
    f('Salada grega', 'Tomate, pepino, azeitona e queijo feta'),
    f('Tzatziki', 'Molho de iogurte, pepino e alho'),
  ],
  TR: [
    f('Kebab', 'Carne assada no espeto, em várias versões'),
    f('Baklava', 'Folhado com nozes e calda de mel'),
    f('Chá turco', 'Servido em copinhos de vidro o dia todo'),
    f('Lahmacun', 'Massa fina com carne moída temperada'),
  ],
  PL: [
    f('Pierogi', 'Pastéis cozidos recheados de batata, queijo ou carne'),
    f('Żurek', 'Sopa azeda de centeio com linguiça e ovo'),
    f('Bigos', 'Ensopado de chucrute com carnes'),
  ],
  CZ: [
    f('Svíčková', 'Carne com molho de creme e bolinhos de pão'),
    f('Trdelník', 'Massa enrolada assada no espeto com açúcar'),
    f('Cerveja Pilsner', 'Estilo criado na cidade de Plzeň'),
  ],
  HU: [
    f('Goulash', 'Ensopado de carne com páprica'),
    f('Lángos', 'Massa frita com creme azedo e queijo'),
  ],
  RU: [
    f('Borscht', 'Sopa de beterraba servida com creme azedo'),
    f('Pelmeni', 'Pastéis cozidos recheados de carne'),
    f('Blini', 'Panquecas finas, com caviar ou doces'),
  ],
  UA: [
    f('Borscht', 'Sopa de beterraba, prato nacional'),
    f('Varenyky', 'Pastéis cozidos com batata, queijo ou cereja'),
  ],
  SE: [
    f('Almôndegas suecas', 'Servidas com molho, purê e geleia de mirtilo'),
    f('Kanelbulle', 'Pão doce de canela, tradição da pausa do fika'),
  ],
  NO: [
    f('Salmão', 'Fresco, defumado ou curado'),
    f('Brunost', 'Queijo marrom de sabor adocicado'),
  ],
  DK: [
    f('Smørrebrød', 'Pão de centeio aberto com coberturas variadas'),
    f('Wienerbrød', 'O famoso doce "dinamarquês" folhado'),
  ],
  FI: [
    f('Karjalanpiirakka', 'Tortinha de centeio recheada com arroz'),
    f('Lohikeitto', 'Sopa cremosa de salmão com batata e endro'),
  ],
  IS: [
    f('Skyr', 'Laticínio espesso parecido com iogurte'),
    f('Cachorro-quente islandês', 'Com cebola crua e frita e molhos especiais'),
  ],
  HR: [
    f('Peka', 'Carne ou polvo assado sob tampa de ferro com brasas'),
    f('Ćevapi', 'Espetinhos de carne moída no pão'),
  ],

  // ── Ásia ──
  JP: [
    f('Sushi', 'Arroz temperado com peixe cru e outros ingredientes'),
    f('Lámen', 'Macarrão em caldo, com versões de shoyu, missô e porco'),
    f('Tempurá', 'Legumes e frutos do mar empanados e fritos'),
    f('Onigiri', 'Bolinho de arroz com recheio, vendido em lojas de conveniência'),
    f('Matchá', 'Chá verde em pó usado na cerimônia do chá e em doces'),
  ],
  CN: [
    f('Pato laqueado', 'Pato assado de pele crocante, especialidade de Pequim'),
    f('Dim sum', 'Porções pequenas como bolinhos no vapor'),
    f('Xiaolongbao', 'Pastéis no vapor com caldo dentro'),
    f('Hot pot', 'Panela de caldo fervente onde se cozinham ingredientes à mesa'),
  ],
  KR: [
    f('Kimchi', 'Acelga fermentada com pimenta, presente em toda refeição'),
    f('Bibimbap', 'Arroz com legumes, carne, ovo e pasta de pimenta'),
    f('Churrasco coreano', 'Carnes grelhadas na própria mesa'),
    f('Tteokbokki', 'Bolinhos de arroz em molho picante'),
  ],
  TH: [
    f('Pad thai', 'Talharim de arroz salteado com amendoim e limão'),
    f('Tom yum', 'Sopa picante e azeda de camarão'),
    f('Curry verde', 'Curry de leite de coco com pimenta verde'),
    f('Mango sticky rice', 'Arroz doce glutinoso com manga'),
  ],
  VN: [
    f('Pho', 'Sopa de macarrão de arroz com carne e ervas'),
    f('Bánh mì', 'Sanduíche em pão francês com recheios vietnamitas'),
    f('Rolinhos frescos', 'Papel de arroz com camarão e ervas, não fritos'),
  ],
  IN: [
    f('Curry', 'Molhos temperados com especiarias, em centenas de versões'),
    f('Biryani', 'Arroz aromático com carne ou legumes'),
    f('Naan', 'Pão assado no forno tandoor'),
    f('Masala chai', 'Chá com leite e especiarias'),
  ],
  ID: [
    f('Nasi goreng', 'Arroz frito com ovo e molho de soja doce'),
    f('Satay', 'Espetinhos com molho de amendoim'),
    f('Rendang', 'Carne cozida longamente em leite de coco e especiarias'),
  ],
  MY: [
    f('Nasi lemak', 'Arroz no leite de coco com anchova, amendoim e ovo'),
    f('Laksa', 'Sopa picante de macarrão com leite de coco'),
  ],
  SG: [
    f('Arroz com frango de Hainan', 'Frango cozido com arroz aromático'),
    f('Chili crab', 'Caranguejo em molho de tomate apimentado'),
    f('Laksa', 'Sopa picante de macarrão com coco'),
  ],
  PH: [
    f('Adobo', 'Carne cozida em vinagre, soja e alho'),
    f('Lechon', 'Leitão assado inteiro, de pele crocante'),
    f('Halo-halo', 'Sobremesa de gelo raspado com frutas e feijão doce'),
  ],
  AE: [
    f('Shawarma', 'Carne assada no espeto, servida no pão'),
    f('Hummus', 'Pasta de grão-de-bico com tahine'),
    f('Tâmaras', 'Servidas com café árabe como sinal de hospitalidade'),
  ],
  SA: [
    f('Kabsa', 'Arroz temperado com frango ou cordeiro'),
    f('Tâmaras e café árabe', 'Símbolo de hospitalidade'),
  ],
  IL: [
    f('Falafel', 'Bolinhos de grão-de-bico fritos, no pão pita'),
    f('Hummus', 'Pasta de grão-de-bico com azeite'),
    f('Shakshuka', 'Ovos cozidos em molho de tomate e pimentão'),
  ],
  LB: [
    f('Tabule', 'Salada de trigo, salsinha, tomate e limão'),
    f('Quibe', 'Bolinho de trigo e carne, frito ou assado'),
    f('Mezze', 'Variedade de pequenos pratos para compartilhar'),
  ],
  NP: [
    f('Momo', 'Pastéis no vapor recheados de carne ou legumes'),
    f('Dal bhat', 'Lentilha com arroz, o prato do dia a dia'),
  ],
  MV: [
    f('Garudhiya', 'Caldo de atum servido com arroz e limão'),
    f('Mas huni', 'Atum com coco ralado, comido no café da manhã'),
  ],

  // ── África ──
  ZA: [
    f('Braai', 'Churrasco sul-africano, um evento social'),
    f('Bobotie', 'Carne moída temperada com cobertura de ovo'),
    f('Biltong', 'Carne seca curada, petisco popular'),
  ],
  MA: [
    f('Tajine', 'Ensopado cozido lentamente em panela de barro cônica'),
    f('Cuscuz marroquino', 'Sêmola com legumes e carne'),
    f('Chá de hortelã', 'Chá verde doce com hortelã, servido do alto'),
  ],
  EG: [
    f('Koshari', 'Arroz, lentilha, macarrão e molho de tomate'),
    f('Ful medames', 'Fava cozida com azeite e temperos'),
    f('Falafel (ta’ameya)', 'Feito com fava em vez de grão-de-bico'),
  ],
  NG: [
    f('Jollof rice', 'Arroz cozido em molho de tomate e pimenta'),
    f('Suya', 'Espetinhos de carne com tempero de amendoim'),
  ],
  KE: [
    f('Nyama choma', 'Carne assada na brasa'),
    f('Ugali', 'Massa firme de milho que acompanha os pratos'),
  ],
  ET: [
    f('Injera', 'Pão fermentado e esponjoso que serve de prato e talher'),
    f('Doro wat', 'Ensopado picante de frango'),
    f('Café', 'Servido em cerimônia tradicional'),
  ],
  AO: [
    f('Moamba de galinha', 'Frango cozido em óleo de palma'),
    f('Funge', 'Massa de mandioca ou milho que acompanha os pratos'),
  ],
  CV: [
    f('Cachupa', 'Ensopado de milho, feijão e carnes ou peixe'),
  ],
  MZ: [
    f('Matapa', 'Folhas de mandioca com amendoim e coco'),
    f('Frango à zambeziana', 'Frango grelhado com leite de coco'),
  ],
  SN: [
    f('Thieboudienne', 'Arroz com peixe e legumes, prato nacional'),
    f('Yassa', 'Frango ou peixe marinado com cebola e limão'),
  ],
  TN: [
    f('Brik', 'Massa fina frita recheada com ovo e atum'),
    f('Cuscuz', 'Sêmola com peixe ou carne e legumes'),
  ],

  // ── Oceania ──
  AU: [
    f('Meat pie', 'Torta individual de carne com molho'),
    f('Vegemite', 'Pasta salgada de levedura passada no pão'),
    f('Pavlova', 'Merengue com chantili e frutas'),
  ],
  NZ: [
    f('Hāngī', 'Carnes e legumes cozidos em forno de terra, tradição maori'),
    f('Pavlova', 'Merengue com frutas, disputado com a Austrália'),
    f('Sorvete hokey pokey', 'Sorvete de baunilha com pedaços de caramelo'),
  ],
  FJ: [
    f('Kokoda', 'Peixe cru marinado em limão e leite de coco'),
  ],
};
