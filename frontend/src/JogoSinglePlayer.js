import React, { useState, useEffect, useMemo } from 'react';
// Removed redundant destructuring assignment

    // --- Puzzle Data ---
    const easyPuzzles = [
      { question: "Quanto é 5 + 7?", answer: "12", hint: "Use os dedos para contar se precisar.", additionalHints: ["Comece pelo 5", "Adicione uma unidade por vez", "Depois do 5, conte: 6, 7, 8, 9, 10, 11...", "É o próximo número depois do 11"], key: "soma", encouragement: "Muito bem! Você é ótimo em somar!" },
      { question: "Se hoje é domingo, que dia será amanhã?", answer: "segunda", hint: "Pense na ordem dos dias da semana.", additionalHints: ["O domingo é o primeiro dia da semana", "Depois do domingo vem...", "É o dia que geralmente começam as aulas", "É o primeiro dia útil da semana"], key: "dias", encouragement: "Perfeito! Você conhece bem os dias da semana!" },
      { question: "Quantas patas tem um cachorro?", answer: "4", hint: "Olhe para um cachorro ou pense em uma imagem dele.", additionalHints: ["Os cachorros andam sobre todas as suas patas", "É o mesmo número de patas que um gato", "É um número par", "É o dobro de 2"], key: "patas", encouragement: "Excelente! Você sabe muito sobre animais!" },
      { question: "Que cor resulta da mistura de azul com amarelo?", answer: "verde", hint: "Pense nas cores do Brasil.", additionalHints: ["É a cor das folhas", "É a cor da grama", "É a cor principal das florestas", "É a cor que simboliza a natureza"], key: "cores", encouragement: "Parabéns! Você entende bem de cores!" },
      { question: "Quantos dedos tem uma mão?", answer: "5", hint: "Olhe para sua própria mão.", additionalHints: ["Conte começando pelo polegar", "É menor que 6", "É maior que 4", "É o número antes do 6"], key: "dedos", encouragement: "Ótimo! Você sabe contar muito bem!" }
    ];
    const mediumPuzzles = [
      { question: "Na sequência 1, 3, 6, 10, 15, qual é o próximo número?", answer: "21", hint: "Observe a diferença entre cada par de números consecutivos.", additionalHints: ["A diferença entre os números consecutivos forma uma sequência própria.", "As diferenças são: 2, 3, 4, 5...", "Para encontrar o próximo número, some o último número (15) com a próxima diferença (6).", "15 + 6 = ?"], key: "triangular", encouragement: "Impressionante! Você descobriu o padrão dos números triangulares." },
      { question: "Se 3 gatos capturam 3 ratos em 3 minutos, quantos gatos serão necessários para capturar 100 ratos em 100 minutos?", answer: "3", hint: "Estabeleça a taxa de captura por gato.", additionalHints: ["Cada gato captura quantos ratos por minuto?", "3 gatos capturam 3 ratos em 3 minutos, então 1 gato captura 1/3 de rato por minuto.", "Em 100 minutos, 1 gato capturaria 100 × (1/3) = 33,33 ratos.", "Quanto gatos seriam necessários para capturar 100 ratos nesse tempo?"], key: "proporção", encouragement: "Excelente análise! Você não caiu na armadilha da proporcionalidade direta." },
      { question: "Qual é o único número que é o dobro da soma de seus dígitos?", answer: "18", hint: "Se chamarmos o número de n e a soma de seus dígitos de s, então n = 2s.", additionalHints: ["Para um número de dois dígitos ab, temos a + b = s e 10a + b = n.", "Então 10a + b = 2(a + b) = 2a + 2b.", "Simplificando: 10a + b = 2a + 2b, então 8a = b.", "Quais valores de a e b satisfazem 8a = b e b < 10?"], key: "equação", encouragement: "Fantástico! Você resolveu esse problema algébrico com precisão." },
      { question: "Em uma sala há 4 cantos, em cada canto há 1 gato, cada gato vê 3 gatos. Quantos gatos há no total?", answer: "4", hint: "Desenhe a sala e considere o que cada gato pode ver.", additionalHints: ["Cada gato está em um canto diferente", "Um gato não consegue se ver", "Os gatos podem ver os outros 3 gatos nos outros cantos", "Não some o número de gatos que cada um vê"], key: "perspectiva", encouragement: "Excelente! Você entendeu bem a questão da perspectiva!" },
      { question: "Se um tijolo pesa 1 quilo mais meio tijolo, quanto pesa um tijolo inteiro?", answer: "2", hint: "Monte uma equação usando o peso do tijolo.", additionalHints: ["Chame o peso do tijolo de x", "A equação seria: x = 1 + x/2", "Subtraia x/2 dos dois lados", "x/2 = 1"], key: "algebra", encouragement: "Ótimo trabalho com álgebra!" }
    ];
    const hardPuzzles = [
      { 
        question: "Se um relógio é colocado em frente a um espelho às 7:25, que horas o reflexo mostrará?", 
        answer: "4:35", 
        hint: "No espelho, os números aparecem invertidos horizontalmente.", 
        additionalHints: [
          "Pense em como os ponteiros se refletem",
          "O ponteiro das horas reflete para o lado oposto",
          "7 horas no espelho parece 5 horas",
          "25 minutos no espelho parece 35 minutos"
        ],
        key: "reflexo",
        encouragement: "Excelente! Você tem uma ótima percepção espacial!"
      },
      {
        question: "Em uma corrida, você ultrapassa o segundo colocado. Em que posição você fica?",
        answer: "segundo",
        hint: "Pense bem na posição de quem você ultrapassou.",
        additionalHints: [
          "Se você ultrapassou o segundo lugar...",
          "Você não ultrapassou o primeiro lugar",
          "Você apenas trocou de posição com o segundo",
          "Você assumiu exatamente a posição de quem ultrapassou"
        ],
        key: "posição",
        encouragement: "Muito bem! Você não caiu na armadilha do raciocínio rápido!"
      },
      {
        question: "Qual número, quando multiplicado por 3, dá o mesmo resultado que quando somado a 3?",
        answer: "1.5",
        hint: "Use álgebra: 3x = x + 3",
        additionalHints: [
          "Subtraia x dos dois lados: 2x = 3",
          "Divida tudo por 2",
          "A resposta é um número decimal",
          "É metade de 3"
        ],
        key: "algebra",
        encouragement: "Perfeito! Você resolveu essa equação com maestria!"
      },
      {
        question: "Se 5 máquinas levam 5 minutos para fazer 5 produtos, quanto tempo 100 máquinas levarão para fazer 100 produtos?",
        answer: "5",
        hint: "Analise cuidadosamente a proporção entre máquinas e produtos.",
        additionalHints: [
          "Uma máquina faz um produto em 5 minutos",
          "A proporção máquina/produto permanece a mesma",
          "Mais máquinas significa mais produtos simultâneos",
          "O tempo total não muda com mais máquinas"
        ],
        key: "tempo",
        encouragement: "Excelente raciocínio lógico!"
      },
      {
        question: "Em uma sala escura há uma lâmpada vermelha e uma azul. A vermelha pisca a cada 3 segundos e a azul a cada 4 segundos. Se piscam juntas às 12:00:00, quando piscarão juntas novamente?",
        answer: "12:00:12",
        hint: "Encontre o mínimo múltiplo comum (MMC) de 3 e 4.",
        additionalHints: [
          "3 x 4 = 12 segundos é o MMC",
          "As lâmpadas sincronizarão a cada 12 segundos",
          "12:00:00 + 12 segundos = ?",
          "Use o formato HH:MM:SS"
        ],
        key: "mmc",
        encouragement: "Fantástico! Você dominou o conceito de MMC!"
      }
    ];
    const extremePuzzles = [
      { 
        question: "Em uma cidade, 1/3 das pessoas tem olhos castanhos, 1/4 tem olhos azuis, e as restantes tem olhos verdes. Se há 60 pessoas com olhos verdes, qual é a população total da cidade?", 
        answer: "240", 
        hint: "Use frações para encontrar a parte correspondente aos olhos verdes.", 
        additionalHints: [
          "Some as frações: 1/3 + 1/4 = ...",
          "A fração restante é 1 - (1/3 + 1/4)",
          "Se essa fração representa 60 pessoas...",
          "Use regra de três para encontrar o total"
        ],
        key: "frações",
        encouragement: "Excelente trabalho com frações e proporções!" 
      },
      { 
        question: "Um trem parte às 8:00 a 60km/h. Outro trem parte às 9:00 do mesmo local a 90km/h, na mesma direção. A que horas o segundo trem alcançará o primeiro?", 
        answer: "11:00", 
        hint: "Calcule a distância entre os trens inicialmente e a diferença de velocidades.", 
        additionalHints: [
          "O primeiro trem viaja por 1 hora sozinho",
          "Em 1 hora, o primeiro trem percorre 60km",
          "A diferença de velocidade é 30km/h",
          "Para alcançar 60km a 30km/h leva 2 horas"
        ],
        key: "velocidade",
        encouragement: "Incrível! Você domina problemas de movimento!" 
      },
      { 
        question: "Em uma sequência, cada número é a soma dos dois anteriores ao cubo. Se os dois primeiros números são 1 e 2, qual é o quarto número da sequência?", 
        answer: "729", 
        hint: "Comece calculando o terceiro número da sequência.", 
        additionalHints: [
          "Primeiro: 1, Segundo: 2",
          "Terceiro: 1³ + 2³ = 1 + 8 = 9",
          "Quarto: 2³ + 9³ = 8 + 721",
          "Some os valores"
        ],
        key: "cubo",
        encouragement: "Fantástico! Você é ótimo com potências!" 
      },
      { 
        question: "Se 5 pintores pintam 5 quadros em 5 dias, quantos pintores são necessários para pintar 100 quadros em 10 dias?", 
        answer: "50", 
        hint: "Estabeleça a relação entre pintores, quadros e dias.", 
        additionalHints: [
          "Um pintor pinta um quadro em 5 dias",
          "Em 10 dias, um pintor pinta 2 quadros",
          "Para 100 quadros em 10 dias...",
          "Divida 100 por 2 para encontrar o número de pintores"
        ],
        key: "proporção",
        encouragement: "Excelente raciocínio proporcional!" 
      },
      { 
        question: "Três amigos dividem um prêmio. O primeiro recebe metade do total mais R$1, o segundo recebe um terço do restante mais R$2, e o terceiro recebe o que sobrou: R$10. Qual era o valor total do prêmio?", 
        answer: "42", 
        hint: "Comece pelo final e trabalhe de trás para frente.", 
        additionalHints: [
          "O terceiro recebeu R$10",
          "Antes do segundo, havia R$10 + R$2 = R$12",
          "R$12 é 2/3 do que havia após o primeiro",
          "Continue calculando até o valor inicial"
        ],
        key: "algebra",
        encouragement: "Incrível resolução algébrica!" 
      }
    ];
        const almostImpossiblePuzzles = [
          {
            question: "Se você tem 3 meias vermelhas e 4 meias azuis em uma gaveta escura, qual é a probabilidade de pegar exatamente 2 meias vermelhas em 3 tentativas, repondo as meias após cada tentativa?",
            answer: "0.147",
            hint: "Use probabilidade binomial com reposição.",
            additionalHints: [
              "A probabilidade de pegar vermelha em cada tentativa é 3/7",
              "A probabilidade de pegar azul em cada tentativa é 4/7",
              "Use a fórmula: C(3,2) * (3/7)² * (4/7)¹",
              "Calcule: 3 * (3/7)² * (4/7)"
            ],
            key: "probabilidade",
            encouragement: "Impressionante! Você domina probabilidade avançada!"
          },
          {
            question: "Um cubo é pintado de azul e depois cortado em 27 cubos menores iguais (3x3x3). Quantos cubinhos têm exatamente duas faces azuis?",
            answer: "12",
            hint: "Visualize as arestas do cubo maior.",
            additionalHints: [
              "Os cubinhos com duas faces azuis estão nas arestas",
              "Não inclua os cubinhos dos cantos",
              "Cada aresta tem 3 cubinhos",
              "Quantas arestas tem um cubo?"
            ],
            key: "geometria",
            encouragement: "Excepcional! Sua visão espacial é extraordinária!"
          },
          {
            question: "Se 2^x = 8^(x-1), qual é o valor de x?",
            answer: "3",
            hint: "Converta 8 em potência de 2.",
            additionalHints: [
              "8 = 2³",
              "Reescreva: 2^x = (2³)^(x-1)",
              "Simplifique: 2^x = 2^(3x-3)",
              "Resolva a equação: x = 3x-3"
            ],
            key: "algebra",
            encouragement: "Brilhante! Você é um mestre em manipulação algébrica!"
          },
          {
            question: "Em uma sequência onde cada termo é a soma dos dois anteriores ao quadrado, se os dois primeiros termos são 2 e 3, qual é o quarto termo?",
            answer: "169",
            hint: "Calcule termo a termo, elevando ao quadrado antes de somar.",
            additionalHints: [
              "Primeiro: 2, Segundo: 3",
              "Terceiro: 2² + 3² = 4 + 9 = 13",
              "Quarto: 3² + 13² = 9 + 169",
              "Simplifique o resultado final"
            ],
            key: "sequencia",
            encouragement: "Fantástico! Você superou esse desafio complexo!"
          },
          {
            question: "Se ABC × A = BCBC (onde cada letra representa um dígito diferente), qual é o valor de A?",
            answer: "7",
            hint: "Use álgebra e propriedades de números de 3 dígitos.",
            additionalHints: [
              "ABC é um número de 3 dígitos",
              "BCBC é um número de 4 dígitos",
              "ABC × A = 1000 × BC + BC",
              "ABC × A = BC × 1001"
            ],
            key: "criptaritmetica",
            encouragement: "Incrível! Você resolveu um enigma matemático complexo!"
          }
        ];
        const hackerPuzzles = [
          { 
            question: "Se você tem uma string '01001010', qual é sua representação em ASCII?", 
            answer: "J", 
            hint: "Converta o binário para decimal primeiro.", 
            additionalHints: [
              "01001010 em decimal é 74",
              "A tabela ASCII associa números a caracteres",
              "74 em ASCII é uma letra maiúscula",
              "É a décima letra do alfabeto"
            ],
            key: "ascii",
            encouragement: "Excelente! Você domina conversão binária e ASCII!" 
          },
          { 
            question: "Qual comando Linux mostra todos os arquivos ocultos começando com '.' ?", 
            answer: "ls -la", 
            hint: "O comando ls tem um parâmetro específico para isso.", 
            additionalHints: [
              "ls é o comando base para listar arquivos",
              "Você precisa de um parâmetro que começa com -",
              "São duas letras após o hífen",
              "O 'l' é para formato longo e 'a' para todos os arquivos"
            ],
            key: "linux",
            encouragement: "Perfeito! Você conhece bem os comandos Linux!" 
          },
          { 
            question: "Em hexadecimal, qual é a soma de 1F + A5?", 
            answer: "C4", 
            hint: "Converta para decimal, some, e depois volte para hex.", 
            additionalHints: [
              "1F em decimal é 31",
              "A5 em decimal é 165",
              "31 + 165 = 196",
              "196 em hexadecimal é C4"
            ],
            key: "hex",
            encouragement: "Impressionante! Você é ótimo com bases numéricas!" 
          },
          { 
            question: "Qual protocolo usa a porta 443 por padrão?", 
            answer: "https", 
            hint: "É a versão segura de um protocolo web muito comum.", 
            additionalHints: [
              "É usado para conexões web seguras",
              "É a versão com SSL/TLS",
              "A versão não segura usa porta 80",
              "HTTP + Segurança = ?"
            ],
            key: "portas",
            encouragement: "Excelente! Você conhece bem os protocolos de rede!" 
          },
          { 
            question: "Se MD5('x' + 'y') = '5f5738a9e38a374e9a75c4e9d69ab458', qual é o valor de y se x = 'hack'?", 
            answer: "er", 
            hint: "A palavra completa é muito comum entre hackers.", 
            additionalHints: [
              "x + y forma uma palavra de 6 letras",
              "É alguém que 'hackeia'",
              "Termina com 'er'",
              "hack + ?? = hacker"
            ],
            key: "md5",
            encouragement: "Fantástico! Você quebrou o hash!" 
          }
        ];
        const egyptianPuzzles = [
          {
            question: "Usando hieróglifos antigos, se 𓃭 + 𓃭 = 10 e 𓃭 + 𓃱 = 7, quanto vale 𓃱?",
            answer: "2",
            hint: "Substitua os hieróglifos por variáveis e resolva o sistema de equações.",
            additionalHints: [
              "Se 𓃭 + 𓃭 = 10, então 𓃭 = 5",
              "Agora que você sabe 𓃭, use a segunda equação",
              "5 + 𓃱 = 7",
              "Subtraia 5 dos dois lados"
            ],
            key: "algebra",
            encouragement: "Você decifrou os hieróglifos como um verdadeiro escriba!"
          },
          {
            question: "Na antiga matemática egípcia, números eram escritos como somas de frações unitárias (1/n). Como você escreveria 3/4 usando apenas duas frações unitárias diferentes?",
            answer: "1/2+1/4",
            hint: "Tente começar com a maior fração unitária possível menor que 3/4.",
            additionalHints: [
              "1/2 é a maior fração unitária menor que 3/4",
              "Depois de usar 1/2, quanto falta para 3/4?",
              "3/4 - 1/2 = 1/4",
              "Junte as duas frações"
            ],
            key: "fracoes",
            encouragement: "Você dominou a arte das frações egípcias!"
          },
          {
            question: "Se um escriba pode copiar um papiro em 2 dias, e outro em 3 dias, quantos dias levarão trabalhando juntos?",
            answer: "1.2",
            hint: "Use o conceito de taxa de trabalho por dia.",
            additionalHints: [
              "O primeiro escriba faz 1/2 por dia",
              "O segundo escriba faz 1/3 por dia",
              "Juntos fazem (1/2 + 1/3) por dia",
              "Divida 1 pelo total por dia"
            ],
            key: "trabalho",
            encouragement: "Os antigos escribas ficariam orgulhosos!"
          },
          {
            question: "Se uma pirâmide tem base quadrada de lado 10 e altura 8, qual é seu volume?",
            answer: "266.67",
            hint: "Use a fórmula do volume da pirâmide: (área da base × altura) ÷ 3",
            additionalHints: [
              "A área da base é 10 × 10 = 100",
              "Multiplique por 8",
              "Divida por 3",
              "Arredonde para 2 casas decimais"
            ],
            key: "geometria",
            encouragement: "Você calcularia pirâmides com os melhores arquitetos do Egito!"
          },
          {
            question: "Um faraó divide 100 moedas entre seus 5 conselheiros. Cada um recebe 6 moedas a mais que o anterior. Quantas moedas recebeu o primeiro conselheiro?",
            answer: "8",
            hint: "Use uma progressão aritmética onde a soma é 100 e a diferença é 6.",
            additionalHints: [
              "Se x é o primeiro valor, os outros são x+6, x+12, x+18, x+24",
              "Some todos: x + (x+6) + (x+12) + (x+18) + (x+24) = 100",
              "Simplifique: 5x + 60 = 100",
              "Resolva para x"
            ],
            key: "pa",
            encouragement: "Você resolveu esse enigma digno dos tesouros do faraó!"
          }
        ];
        const legendaryPuzzles = [
          {
            question: "Em uma biblioteca infinita, existe um livro que contém sua própria localização exata na biblioteca. Em que seção ele está?",
            answer: "paradoxo",
            hint: "Pense sobre a natureza auto-referencial do problema.",
            additionalHints: [
              "O livro precisa conter informação sobre si mesmo",
              "A informação que contém afeta sua própria localização",
              "Isso cria um loop infinito de referências",
              "É similar ao paradoxo do mentiroso"
            ],
            key: "autorreferencia",
            encouragement: "Extraordinário! Você compreendeu um dos mais profundos paradoxos lógicos!"
          },
          {
            question: "Se cada número natural maior que 1 fosse colorido de vermelho ou azul, qual cor teria o menor número que tem exatamente 3 números da mesma cor menores que ele?",
            answer: "azul",
            hint: "Comece listando os primeiros números e suas possíveis colorações.",
            additionalHints: [
              "Considere os números 2, 3, 4 e 5",
              "Para minimizar, os primeiros números devem alternar cores",
              "2: vermelho, 3: azul, 4: vermelho, 5: azul",
              "O próximo número deve ser azul para ter 3 números azuis menores"
            ],
            key: "coloracao",
            encouragement: "Incrível! Você dominou um problema de teoria dos números!"
          },
          {
            question: "Qual é o único número que, quando escrito por extenso em português, tem suas letras em ordem alfabética?",
            answer: "dois",
            hint: "Considere números de um a mil.",
            additionalHints: [
              "Procure palavras curtas",
              "As letras devem estar em ordem crescente no alfabeto",
              "d vem antes de o, que vem antes de i, que vem antes de s",
              "É um número menor que 10"
            ],
            key: "alfabetico",
            encouragement: "Fantástico! Você descobriu uma propriedade única da língua portuguesa!"
          },
          {
            question: "Se A + B = B + C = C + A = 6, e A × B × C = 6, quais são os valores de A, B e C em ordem crescente?",
            answer: "1,2,3",
            hint: "Use as propriedades da soma e multiplicação.",
            additionalHints: [
              "A soma dos três números é 9",
              "O produto dos três números é 6",
              "Os números devem ser positivos",
              "Considere números inteiros"
            ],
            key: "algebra",
            encouragement: "Excepcional! Você resolveu um sistema de equações complexo!"
          },
          {
            question: "Em um relógio digital, quantos minutos por dia os números mostrados formam uma sequência estritamente crescente?",
            answer: "180",
            hint: "Considere o formato HH:MM do relógio.",
            additionalHints: [
              "Os dígitos devem estar em ordem crescente",
              "Por exemplo: 01:23, 01:24, 01:25",
              "Some todos os minutos que atendem a condição",
              "Considere todas as horas do dia"
            ],
            key: "sequencia",
            encouragement: "Brilhante! Você dominou um problema de combinatória temporal!"
          }
        ];
        const mentalPuzzles = [
          {
            question: "Qual é o número que somado ao seu dobro e ao seu triplo resulta em 60?",
            answer: "10",
            hint: "Se chamarmos o número de x, temos: x + 2x + 3x = 60",
            additionalHints: [
              "Some os termos semelhantes: 6x = 60",
              "Divida os dois lados por 6",
              "É um número que multiplicado por 6 dá 60",
              "Pense em múltiplos de 10"
            ],
            key: "algebra",
            encouragement: "Excelente cálculo mental!"
          },
          {
            question: "Em uma sala há 7 mesas. Em cada mesa há 7 gatos. Cada gato tem 7 filhotes. Quantos gatos há no total?",
            answer: "399",
            hint: "Divida o problema em partes: primeiro calcule o total de gatos adultos",
            additionalHints: [
              "7 mesas × 7 gatos = 49 gatos adultos",
              "Cada um dos 49 gatos tem 7 filhotes",
              "49 × 7 = 343 filhotes",
              "Some gatos adultos e filhotes"
            ],
            key: "multiplicacao",
            encouragement: "Impressionante habilidade com números!"
          },
          {
            question: "Se hoje é quarta-feira e daqui a 100 dias será uma segunda-feira, que dia da semana é hoje?",
            answer: "sexta",
            hint: "100 dividido por 7 (dias da semana) dá quanto resto?",
            additionalHints: [
              "100 ÷ 7 = 14 resto 2",
              "Volte 2 dias a partir de segunda",
              "Segunda → Domingo → Sábado",
              "O dia real é 2 dias antes"
            ],
            key: "calendario",
            encouragement: "Você é ótimo com calendários!"
          },
          {
            question: "Um trem parte às 15:00 e chega às 21:45. Se percorre 450 km, qual sua velocidade média em km/h?",
            answer: "67",
            hint: "Primeiro calcule o tempo total em horas",
            additionalHints: [
              "21:45 - 15:00 = 6 horas e 45 minutos = 6,75 horas",
              "Velocidade = distância ÷ tempo",
              "450 ÷ 6,75 = ?",
              "Arredonde para o número inteiro mais próximo"
            ],
            key: "velocidade",
            encouragement: "Excelente raciocínio matemático!"
          },
          {
            question: "Se 5 pessoas podem construir 5 casas em 5 meses, quantas pessoas são necessárias para construir 100 casas em 100 meses?",
            answer: "5",
            hint: "Analise a proporção entre pessoas, casas e tempo",
            additionalHints: [
              "Uma pessoa constrói uma casa em 5 meses",
              "A proporção pessoa/casa permanece constante",
              "O tempo aumentou na mesma proporção que as casas",
              "Não é necessário mais pessoas"
            ],
            key: "proporcao",
            encouragement: "Fantástico! Você não caiu na armadilha!"
          }
        ];
        const xrayPuzzles = [
          {
            question: "O que está no meio do 'meio'?", 
            answer: "e",
            hint: "Olhe literalmente para a palavra, não pense no significado.",
            additionalHints: [
              "É uma letra",
              "Está exatamente no centro da palavra",
              "A palavra tem 4 letras",
              "É uma vogal"
            ],
            key: "literal",
            encouragement: "Excelente visão! Você tem olhos de raio-x!"
          },
          {
            question: "Eu sou um número. Se você me multiplicar por qualquer outro número, o resultado será sempre maior que eu. Que número sou eu?",
            answer: "0",
            hint: "Pense no único número que quando multiplicado não aumenta.",
            additionalHints: [
              "É um número muito especial",
              "Quando multiplicado, anula tudo",
              "Não é positivo nem negativo",
              "É o ponto de início da contagem"
            ],
            key: "multiplicacao",
            encouragement: "Perfeito! Você viu através do truque!"
          },
          {
            question: "Quantas vezes a letra 'a' aparece nesta pergunta?",
            answer: "4",
            hint: "Conte cada ocorrência da letra, incluindo a própria palavra 'letra'.",
            additionalHints: [
              "Não esqueça de incluir todas as palavras",
              "Inclua artigos e preposições",
              "Conta também a letra na palavra 'aparece'",
              "São exatamente quatro ocorrências"
            ],
            key: "contagem",
            encouragement: "Impressionante atenção aos detalhes!"
          },
          {
            question: "Se você me tem, quer me compartilhar. Se me compartilha, não me tem mais. O que sou eu?",
            answer: "segredo",
            hint: "É algo que perde seu valor quando revelado.",
            additionalHints: [
              "Quando você conta, deixa de ser o que é",
              "Pessoas costumam guardar isso",
              "Está relacionado à confidencialidade",
              "Começa com 'S' e tem 7 letras"
            ],
            key: "confidencial",
            encouragement: "Brilhante dedução!"
          },
          {
            question: "O que é tão frágil que apenas dizer seu nome o quebra?",
            answer: "silencio",
            hint: "É algo que existe até você falar.",
            additionalHints: [
              "É o oposto do som",
              "Quando você o nomeia, ele desaparece",
              "É prezado em bibliotecas",
              "Começa com 'S' e termina com 'O'"
            ],
            key: "quebra",
            encouragement: "Fantástico! Você pensou fora da caixa!"
          }
        ];
        const intuitionPuzzles = [
          {
            question: "Se você me quebra, eu funciono. Se me dobra, eu paro. O que sou eu?",
            answer: "silencio",
            hint: "Pense em algo intangível que pode ser 'quebrado'.",
            additionalHints: [
              "É algo que todos podem fazer",
              "Está relacionado com som",
              "Quando você fala, você o quebra",
              "Em uma biblioteca, pedem para mantê-lo"
            ],
            key: "abstrato",
            encouragement: "Excelente intuição! Você captou a essência do enigma!"
          },
          {
            question: "Quanto mais você tira, maior eu fico. O que sou eu?",
            answer: "buraco",
            hint: "Pense em algo que cresce quando você remove material.",
            additionalHints: [
              "É um espaço vazio",
              "Quanto mais você cava...",
              "É uma ausência que cresce",
              "Pode ser feito com uma pá"
            ],
            key: "vazio",
            encouragement: "Incrível! Sua intuição está afiada!"
          },
          {
            question: "O que está sempre na sua frente mas você nunca consegue ver?",
            answer: "futuro",
            hint: "É algo que todos temos mas ninguém pode tocar.",
            additionalHints: [
              "Está sempre à sua frente",
              "Não pode ser visto nem tocado",
              "Está relacionado ao tempo",
              "Todo mundo caminha em sua direção"
            ],
            key: "tempo",
            encouragement: "Fantástico! Você tem uma intuição natural!"
          },
          {
            question: "O que é seu, mas outras pessoas usam mais que você?",
            answer: "nome",
            hint: "É algo que te identifica.",
            additionalHints: [
              "É dado quando você nasce",
              "Outros usam para te chamar",
              "É sua identidade pessoal",
              "Você raramente o diz para si mesmo"
            ],
            key: "identidade",
            encouragement: "Perfeito! Sua percepção intuitiva é impressionante!"
          },
          {
            question: "Quanto mais você alimenta, mais forte fico. Quanto mais água me dá, mais fraco fico. O que sou eu?",
            answer: "fogo",
            hint: "Pense em algo que consome mas não digere.",
            additionalHints: [
              "É um dos quatro elementos",
              "Pode ser controlado mas é perigoso",
              "Precisa de combustível para crescer",
              "A água é seu inimigo natural"
            ],
            key: "elemento",
            encouragement: "Brilhante! Você tem um dom natural para enigmas!"
          }
        ];
        const teacherPuzzles = [
          {
            question: "Se eu tenho 24 laranjas e quero dividir igualmente entre 6 crianças, quantas laranjas cada criança receberá? Explique seu raciocínio.",
            answer: "4",
            hint: "Pense na operação matemática de divisão.",
            additionalHints: [
              "Para dividir igualmente, todas as crianças devem receber o mesmo número",
              "24 ÷ 6 é a operação que precisamos fazer",
              "6 × 4 = 24, então...",
              "Cada criança deve receber a mesma quantidade para ser justo"
            ],
            key: "divisao",
            encouragement: "Excelente! Você demonstrou compreensão da divisão!"
          },
          {
            question: "Observe a sequência: 2, 4, 8, 16, __. Qual é o próximo número e por quê?",
            answer: "32",
            hint: "Observe como cada número se relaciona com o anterior.",
            additionalHints: [
              "Cada número está sendo multiplicado por algo",
              "2 × 2 = 4, 4 × 2 = 8...",
              "É uma sequência onde cada número dobra",
              "16 × 2 nos dará o próximo número"
            ],
            key: "multiplicacao",
            encouragement: "Ótimo! Você identificou o padrão de multiplicação por 2!"
          },
          {
            question: "Em uma turma de 30 alunos, 40% gostam de matemática. Quantos alunos gostam de matemática? Mostre o cálculo.",
            answer: "12",
            hint: "40% é o mesmo que 40/100. Use isso para calcular.",
            additionalHints: [
              "Para calcular porcentagem, multiplique o total por 40/100",
              "30 × (40/100) = 30 × 0,4",
              "Primeiro multiplique 30 × 40 = 1200, depois divida por 100",
              "1200 ÷ 100 = 12"
            ],
            key: "porcentagem",
            encouragement: "Perfeito! Você dominou o cálculo de porcentagem!"
          },
          {
            question: "Se um retângulo tem perímetro de 20 metros e largura de 3 metros, qual é seu comprimento? Explique como chegou à resposta.",
            answer: "7",
            hint: "O perímetro é a soma de todos os lados do retângulo.",
            additionalHints: [
              "Em um retângulo, lados opostos são iguais",
              "Perímetro = 2 × largura + 2 × comprimento",
              "20 = 2 × 3 + 2 × comprimento",
              "20 = 6 + 2 × comprimento, então..."
            ],
            key: "perimetro",
            encouragement: "Excelente trabalho com geometria!"
          },
          {
            question: "João tem 3 anos a mais que Maria, e a soma de suas idades é 25 anos. Quantos anos tem Maria? Demonstre sua solução.",
            answer: "11",
            hint: "Use álgebra. Se Maria tem x anos, João tem x + 3 anos.",
            additionalHints: [
              "A soma das idades é 25: x + (x + 3) = 25",
              "Junte os termos semelhantes: 2x + 3 = 25",
              "Subtraia 3 dos dois lados: 2x = 22",
              "Divida tudo por 2 para encontrar x"
            ],
            key: "algebra",
            encouragement: "Fantástico! Você resolveu uma equação algébrica!"
          }
        ];
    const tongueTwisterPuzzles = [
      {
        question: "Se cada C em 'O rato roeu a roupa do rei de Roma' fosse trocado por K, quantos K's haveria?",
        answer: "0",
        hint: "Procure cuidadosamente pela letra 'C' na frase.",
        additionalHints: [
          "Releia a frase palavra por palavra",
          "Preste atenção em cada letra",
          "A frase não tem nenhum 'C'",
          "Mesmo trocando, continuaria com zero K's"
        ],
        key: "letras",
        encouragement: "Excelente observação! Você tem olhos atentos!"
      },
      {
        question: "Em 'O sapo não lava o pé', qual é a única consoante que aparece mais de uma vez?",
        answer: "p",
        hint: "Conte a frequência de cada consoante.",
        additionalHints: [
          "Ignore as vogais (a,e,i,o,u)",
          "As consoantes são: s,p,n,l,v,p",
          "Uma delas se repete",
          "Está no início de 'pé'"
        ],
        key: "repeticao",
        encouragement: "Perfeito! Sua análise fonética é impressionante!"
      },
      {
        question: "Na frase 'Três tigres tristes', quantas vezes o som 'tr' aparece?",
        answer: "3",
        hint: "Procure pela combinação 'tr' no início das palavras.",
        additionalHints: [
          "A primeira palavra começa com 'tr'",
          "A segunda palavra tem 'tr'",
          "A terceira palavra também começa com 'tr'",
          "Conte todas as ocorrências"
        ],
        key: "sons",
        encouragement: "Excelente contagem de sons! Você é ótimo em fonética!"
      },
      {
        question: "Se você disser 'Paralelepípedo' de trás para frente, qual será a primeira sílaba?",
        answer: "do",
        hint: "Divida a palavra em sílabas e inverta a ordem.",
        additionalHints: [
          "Pa-ra-le-le-pí-pe-do",
          "A última sílaba será a primeira",
          "A sílaba final termina em 'o'",
          "É uma sílaba de duas letras"
        ],
        key: "silabas",
        encouragement: "Fantástico! Você domina a inversão de palavras!"
      },
      {
        question: "Em 'A Aranha Arranha a Rã', quantas vezes o som 'nh' aparece?",
        answer: "2",
        hint: "Procure pelo dígrafo 'nh' em cada palavra.",
        additionalHints: [
          "Está presente em 'Aranha'",
          "Aparece em 'Arranha'",
          "Não aparece em 'a' nem em 'Rã'",
          "Conte todas as ocorrências do dígrafo"
        ],
        key: "digrafos",
        encouragement: "Excelente! Você é um expert em dígrafos!"
      }
    ];
    const whatNowPuzzles = [
      {
        question: "Se você está em uma corrida e ultrapassa o último colocado, em que posição você fica?",
        answer: "penultimo",
        hint: "Pense bem na posição de quem você ultrapassou.",
        additionalHints: [
          "Se a pessoa estava em último lugar...",
          "Ao ultrapassar, você toma a posição dela",
          "A pessoa que você ultrapassou agora está em último",
          "Logo, você está na posição imediatamente anterior"
        ],
        key: "posicao",
        encouragement: "Excelente raciocínio lógico! Você não caiu na armadilha."
      },
      {
        question: "Se você tem um fósforo e entra em uma sala escura onde há uma vela, uma lamparina e uma fogueira, o que você acende primeiro?",
        answer: "fosforo",
        hint: "A ordem das ações é importante aqui.",
        additionalHints: [
          "Antes de acender qualquer coisa...",
          "Você precisa ter uma fonte de fogo",
          "O que precisa estar aceso para acender os outros itens?",
          "É o primeiro item que precisa ser aceso"
        ],
        key: "sequencia",
        encouragement: "Perfeito! Você pensou na sequência lógica das ações!"
      },
      {
        question: "Se 5 máquinas levam 5 minutos para fazer 5 peças, quanto tempo uma máquina leva para fazer uma peça?",
        answer: "5",
        hint: "Não se deixe enganar pelos números iguais.",
        additionalHints: [
          "Cada máquina trabalha independentemente",
          "Todas as máquinas trabalham ao mesmo tempo",
          "O tempo é o mesmo para cada peça",
          "A proporção máquina/peça não altera o tempo"
        ],
        key: "proporcao",
        encouragement: "Excelente! Você não se confundiu com a proporção!"
      },
      {
        question: "Um homem mora no 10º andar. Todo dia ele desce pelo elevador para trabalhar. Ao voltar, se não há ninguém no elevador, ele vai até o 7º andar e sobe os últimos andares pela escada. Se há alguém, ele vai direto ao 10º. Por quê?",
        answer: "baixo",
        hint: "Pense na altura do homem e no que ele consegue alcançar no elevador.",
        additionalHints: [
          "O homem tem uma limitação física",
          "Ele não consegue alcançar o botão do 10º andar",
          "Quando há alguém, essa pessoa pode apertar para ele",
          "Ele é uma pessoa de baixa estatura"
        ],
        key: "altura",
        encouragement: "Fantástico! Você pensou fora da caixa!"
      },
      {
        question: "Você participa de uma corrida e ultrapassa o segundo colocado. Em que posição você termina a corrida?",
        answer: "segundo",
        hint: "Analise exatamente o que acontece na ultrapassagem.",
        additionalHints: [
          "Você ultrapassou apenas o segundo lugar",
          "O primeiro lugar continua na frente",
          "Ao ultrapassar o segundo, você toma sua posição",
          "Nada acontece com sua posição em relação ao primeiro"
        ],
        key: "posicionamento",
        encouragement: "Brilhante! Você manteve o raciocínio claro!"
      }
    ];
    const challengeYouPuzzles = [
      {
        question: "Em um jogo de cartas, cada jogador tem exatamente 3 cartas. Se eu sei que você tem o Ás de Copas, e você sabe que eu sei, e eu sei que você sabe que eu sei, quantas camadas de conhecimento existem nessa situação?",
        answer: "3",
        hint: "Conte cada nível de 'saber' na sequência.",
        additionalHints: [
          "Primeiro nível: Eu sei sobre sua carta",
          "Segundo nível: Você sabe que eu sei",
          "Terceiro nível: Eu sei que você sabe que eu sei",
          "Pare quando não houver mais níveis de conhecimento"
        ],
        key: "metacognição",
        encouragement: "Impressionante! Você compreende níveis complexos de metacognição!"
      },
      {
        question: "Se esta pergunta fosse falsa, a resposta seria 'não'. A resposta é 'sim' ou 'não'?",
        answer: "sim",
        hint: "Use lógica reversa e considere a consistência da afirmação.",
        additionalHints: [
          "Se a resposta fosse 'não', a pergunta seria verdadeira",
          "Mas se a pergunta fosse verdadeira, a resposta não poderia ser 'não'",
          "Portanto, a resposta 'não' leva a uma contradição",
          "A única resposta consistente é 'sim'"
        ],
        key: "paradoxo",
        encouragement: "Extraordinário! Você resolveu um paradoxo lógico complexo!"
      },
      {
        question: "Quantas vezes a palavra 'quantas' aparece nesta pergunta, incluindo esta ocorrência da palavra 'quantas'?",
        answer: "2",
        hint: "Conte cuidadosamente cada ocorrência da palavra específica.",
        additionalHints: [
          "A palavra aparece no início da pergunta",
          "E aparece novamente quando menciona a própria palavra",
          "Não conte outras formas da palavra",
          "Verifique se não há mais ocorrências"
        ],
        key: "autorreferência",
        encouragement: "Brilhante! Você dominou um problema de autorreferência!"
      },
      {
        question: "Se você está resolvendo este desafio, e eu estou desafiando você, quem está realmente fazendo a pergunta?",
        answer: "ninguem",
        hint: "Pense sobre a natureza da interação com um programa de computador.",
        additionalHints: [
          "O desafio é parte de um programa",
          "Não há uma pessoa real fazendo a pergunta",
          "É uma construção artificial",
          "A pergunta existe por si só"
        ],
        key: "existencial",
        encouragement: "Profundo! Você compreendeu a natureza meta deste desafio!"
      },
      {
        question: "Se a resposta desta pergunta for incorreta, ela está correta. Esta afirmação é verdadeira ou falsa?",
        answer: "impossivel",
        hint: "Analise as implicações lógicas de ambas as possibilidades.",
        additionalHints: [
          "Se for verdadeira, então deve ser falsa",
          "Se for falsa, então deve ser verdadeira",
          "Isso cria um loop infinito de contradições",
          "Não há resposta logicamente consistente"
        ],
        key: "paradoxal",
        encouragement: "Fantástico! Você reconheceu um paradoxo insolúvel!"
      }
    ];
    const breakingHeadPuzzles = [
      {
        question: "Em uma sala há um interruptor e uma lâmpada em um quarto fechado. Você pode usar o interruptor quantas vezes quiser, mas só pode entrar na sala uma vez. Como descobrir se o interruptor controla a lâmpada?",
        answer: "acender",
        hint: "Pense sobre temperatura e tempo.",
        additionalHints: [
          "O interruptor pode ser usado antes de entrar na sala",
          "A lâmpada aquece quando fica ligada",
          "Você pode tocar na lâmpada ao entrar na sala",
          "Deixe a lâmpada ligada por um tempo antes de entrar"
        ],
        key: "temperatura",
        encouragement: "Brilhante! Você pensou como um verdadeiro detetive!"
      },
      {
        question: "Três deuses A, B e C são chamados Verdade, Falso e Aleatório em alguma ordem. Verdade sempre fala a verdade, Falso sempre mente, e Aleatório pode tanto falar a verdade quanto mentir. Você pode fazer uma pergunta de sim/no para um deus. A resposta 'da' significa sim e 'ja' significa não. Qual pergunta você faria para descobrir se B é Aleatório?",
        answer: "voce e aleatorio",
        hint: "A pergunta deve ser sobre a identidade do próprio deus B.",
        additionalHints: [
          "Pense em como cada deus responderia sobre ser Aleatório",
          "Verdade responderia honestamente",
          "Falso sempre mentiria sobre sua identidade",
          "A resposta de Aleatório não importaria"
        ],
        key: "logica",
        encouragement: "Extraordinário! Você resolveu um dos mais complexos problemas de lógica!"
      },
      {
        question: "Você tem duas cordas que levam exatamente uma hora para queimar completamente, mas queimam de forma não uniforme. Como medir exatamente 45 minutos usando apenas estas cordas e um isqueiro?",
        answer: "duas pontas",
        hint: "Uma corda pode ser acesa em ambas as extremidades.",
        additionalHints: [
          "Queimar uma corda nas duas pontas leva 30 minutos",
          "A primeira corda pode ser usada para medir 30 minutos",
          "A segunda corda pode ser usada para os 15 minutos restantes",
          "Comece acendendo a primeira corda em ambas as pontas"
        ],
        key: "tempo",
        encouragement: "Fantástico! Você tem um excelente pensamento criativo!"
      },
      {
        question: "Em uma ilha, existem dois tipos de habitantes: cavaleiros que sempre falam a verdade e knaves que sempre mentem. Você encontra três habitantes A, B e C. A diz 'B é um knave', B diz 'C é um knave', e C diz 'A é um knave'. Quantos cavaleiros há entre eles?",
        answer: "1",
        hint: "Se alguém é cavaleiro, sua afirmação é verdadeira.",
        additionalHints: [
          "Não podem ser todos cavaleiros ou todos knaves",
          "As afirmações formam um ciclo",
          "Se dois fossem cavaleiros, haveria contradição",
          "Deve haver exatamente um cavaleiro"
        ],
        key: "verdade",
        encouragement: "Excepcional! Você dominou a lógica dos cavaleiros e knaves!"
      },
      {
        question: "Você tem 12 moedas idênticas, uma delas é falsa e tem peso diferente das outras (não se sabe se mais leve ou mais pesada). Como descobrir qual é a falsa usando uma balança de pratos apenas 3 vezes?",
        answer: "4-4-4",
        hint: "Divida as moedas em três grupos iguais inicialmente.",
        additionalHints: [
          "Compare dois grupos de 4 moedas primeiro",
          "Se equilibrar, a moeda falsa está no grupo não pesado",
          "Se desiquilibrar, está em um dos grupos pesados",
          "Use a última pesagem para identificar a moeda específica"
        ],
        key: "pesagem",
        encouragement: "Magnífico! Você tem um raciocínio dedutivo impressionante!"
      }
    ];



    const BASE_PUZZLES_MAP = {
        easy: easyPuzzles, medium: mediumPuzzles, hard: hardPuzzles, extreme: extremePuzzles,
        almostImpossible: almostImpossiblePuzzles, hacker: hackerPuzzles, egyptian: egyptianPuzzles,
        legendary: legendaryPuzzles, mental: mentalPuzzles, xray: xrayPuzzles,
        intuition: intuitionPuzzles, teacher: teacherPuzzles, tongueTwister: tongueTwisterPuzzles,
        whatNow: whatNowPuzzles, challengeYou: challengeYouPuzzles, breakingHead: breakingHeadPuzzles
    };

    const DIFFICULTY_LEVELS_ORDER = [
        'easy', 'medium', 'hard', 'extreme', 'almostImpossible', 'hacker', 
        'egyptian', 'legendary', 'mental', 'xray', 'intuition', 'teacher', 
        'tongueTwister', 'whatNow', 'challengeYou', 'breakingHead'
    ];

    const DIFFICULTY_CONFIG = {
        'easy': { label: 'Fácil', description: 'Ideal para iniciantes', colors: 'bg-green-500 hover:bg-green-600', progressColor: 'bg-green-600', textColor: 'text-green-800' },
        'medium': { label: 'Médio', description: 'Para mentes curiosas', colors: 'bg-yellow-500 hover:bg-yellow-600', progressColor: 'bg-yellow-600', textColor: 'text-yellow-800' },
        'hard': { label: 'Difícil', description: 'Desafios complexos', colors: 'bg-red-500 hover:bg-red-600', progressColor: 'bg-red-600', textColor: 'text-red-800' },
        'extreme': { label: 'Extremo', description: 'Somente para gênios', colors: 'bg-purple-700 hover:bg-purple-800', progressColor: 'bg-purple-800', textColor: 'text-purple-800' },
        'almostImpossible': { label: 'Quase Impossível', description: 'Para quem quer o máximo desafio', colors: 'bg-blue-600 hover:bg-blue-700', progressColor: 'bg-blue-600', textColor: 'text-blue-800' },
        'hacker': { label: 'Hacker', description: 'Desafios de códigos e decifração', colors: 'bg-orange-500 hover:bg-orange-600', progressColor: 'bg-orange-500', textColor: 'text-orange-800' },
        'egyptian': { label: 'Fase Egípcia', description: 'Enigmas com hieróglifos', colors: 'bg-pink-500 hover:bg-pink-600', progressColor: 'bg-pink-500', textColor: 'text-pink-800' },
        'legendary': { label: 'Lendário / Impossível', description: 'Desafios extremos e multi-etapas', colors: 'bg-gray-500 hover:bg-gray-600', progressColor: 'bg-gray-500', textColor: 'text-gray-800' },
        'mental': { label: 'De Cabeça', description: 'Cálculo mental e cultura geral', colors: 'bg-cyan-600 hover:bg-cyan-700', progressColor: 'bg-cyan-600', textColor: 'text-cyan-800' },
        'xray': { label: 'Visão de Raio-X', description: 'Pegadinhas e lógica rápida', colors: 'bg-amber-900 hover:bg-amber-800', progressColor: 'bg-amber-900', textColor: 'text-amber-900' },
        'intuition': { label: 'Intuição Pura', description: 'Desafios de percepção e lógica', colors: 'bg-rosa-choque hover:bg-rosa-choque-escuro', progressColor: 'bg-rosa-choque', textColor: 'text-pink-600' },
        'teacher': { label: 'Professor que Dá Aula', description: 'Perguntas com explicação', colors: 'bg-verde-neon hover:bg-verde-neon-escuro text-black', progressColor: 'bg-verde-neon', textColor: 'text-green-700' },
        'tongueTwister': { label: 'Trava-Língua Mental', description: 'Desafios de linguagem e lógica', colors: 'bg-preto hover:bg-preto-escuro text-white', progressColor: 'bg-preto', textColor: 'text-gray-900' },
        'whatNow': { label: 'E Agora?', description: 'Dilemas e paradoxos', colors: 'bg-bordo hover:bg-bordo-escuro text-white', progressColor: 'bg-bordo', textColor: 'text-red-900' },
        'challengeYou': { label: 'Vou Desafiar Você', description: 'Meta-desafios e paradoxos', colors: 'bg-dourado hover:bg-dourado-escuro text-black', progressColor: 'bg-dourado', textColor: 'text-yellow-700' },
        'breakingHead': { label: 'Quebrando a Cabeça', description: 'Clássicos de lógica e raciocínio', colors: 'bg-azul-escuro hover:bg-azul-escuro-escuro text-white', progressColor: 'bg-azul-escuro', textColor: 'text-blue-900' },
    };
    
    const CUSTOMIZABLE_DIFFICULTIES = ['easy', 'medium', 'hard', 'extreme', 'almostImpossible', 'hacker'];
    const SKILL_MODE_TIMER_DURATION = 10;

    const bossPuzzles = [
      { id: 1, question: "Eu falo sem boca e ouço sem ouvidos. Não tenho corpo, mas ganho vida com o vento. O que sou eu?", answer: "eco", hint: "Pense em sons que retornam ou se repetem em certos ambientes.", encouragement: "O Chefão sente o golpe! Mas ele ainda está de pé!", failureMessage: "Hah! Patético! O Chefão ri da sua tentativa." },
      { id: 2, question: "O que tem cidades, mas não casas; florestas, mas não árvores; e água, mas não peixes?", answer: "mapa", hint: "É uma representação bidimensional de lugares e características geográficas.", encouragement: "Você está ferindo o Chefão! Continue assim!", failureMessage: "Fraco demais! O Chefão mal sentiu isso." },
      { id: 3, question: "Qual é a criatura que anda com quatro pés de manhã, dois ao meio-dia e três à noite? (Dica: enigma da Esfinge)", answer: "homem", hint: "Pense nas diferentes fases da vida de um ser humano.", encouragement: "IMPOSSÍVEL! VOCÊ DERROTOU O CHEFÃO!", failureMessage: "Você falhou! O Chefão reina supremo!" },
      { id: 4, question: "Quanto mais você tira, maior eu fico. O que sou eu?", answer: "buraco", hint: "Pense em algo que aumenta quando você remove material.", encouragement: "O Chefão está impressionado!", failureMessage: "Ha! Você nunca me derrotará assim!" },
      { id: 5, question: "Se 2² = 4 e 3² = 9, quanto é (2+3)²?", answer: "25", hint: "Lembre-se: (a+b)² = a² + 2ab + b²", encouragement: "Sua inteligência me machuca!", failureMessage: "Matemática básica! Como errou isso?" },
      { id: 6, question: "Em uma sala escura há três interruptores, um deles controla uma lâmpada em outra sala. Você só pode entrar na outra sala uma vez. Como descobrir qual interruptor controla a lâmpada?", answer: "calor", hint: "A lâmpada não apenas emite luz...", encouragement: "Sua lógica é afiada!", failureMessage: "Pensamento muito superficial!" },
      { id: 7, question: "Se você me tem, quer me compartilhar. Se me compartilha, não me tem mais. O que sou eu?", answer: "segredo", hint: "Algo que perde seu valor ao ser revelado.", encouragement: "O Chefão está perdendo força!", failureMessage: "Seus segredos estão seguros comigo!" },
      { id: 8, question: "Qual número, quando multiplicado por 2/3 de si mesmo, resulta em 6?", answer: "3", hint: "Se x * (2x/3) = 6, resolva para x", encouragement: "Sua matemática é poderosa!", failureMessage: "Números são seus inimigos?" },
      { id: 9, question: "O que é tão frágil que apenas dizer seu nome o quebra?", answer: "silencio", hint: "Existe até você falar algo.", encouragement: "O Chefão está quase derrotado!", failureMessage: "Shhhh... Tente novamente!" },
      { id: 10, question: "Em uma corrida, você ultrapassa o segundo colocado. Em que posição você fica?", answer: "segundo", hint: "Pense bem na posição de quem você ultrapassou.", encouragement: "Sua lógica é impressionante!", failureMessage: "Não seja precipitado!" },
      { id: 11, question: "Se três gatos caçam três ratos em três minutos, quantos gatos são necessários para caçar 100 ratos em 100 minutos?", answer: "3", hint: "Analise a proporção entre tempo e quantidade.", encouragement: "O Chefão está atordoado!", failureMessage: "A resposta é mais simples do que parece!" },
      { id: 12, question: "Qual é o próximo número na sequência: 1, 11, 21, 1211, 111221, ...?", answer: "312211", hint: "Cada número descreve o anterior em termos de quantidade.", encouragement: "Impressionante observação de padrões!", failureMessage: "O padrão escapa de você!" },
      { id: 13, question: "Se você tiver 3 meias azuis e 3 meias vermelhas misturadas em uma gaveta escura, qual é o número mínimo de meias que você precisa pegar para ter certeza de ter um par da mesma cor?", answer: "3", hint: "Considere o pior cenário possível.", encouragement: "Sua lógica é devastadora!", failureMessage: "Pense no princípio da casa dos pombos!" }
    ];
    const BOSS_INITIAL_HEALTH = bossPuzzles.length;

    export const JogoRaciocinio = () => {
      const [difficulty, setDifficulty] = useState('');
      const [currentPuzzle, setCurrentPuzzle] = useState(0);
      const [userAnswer, setUserAnswer] = useState('');
      const [feedback, setFeedback] = useState('');
      const [showHint, setShowHint] = useState(false);
      const [hintLevel, setHintLevel] = useState(0);
      const [solved, setSolved] = useState([]);
      const [gameComplete, setGameComplete] = useState(false);
      const [gameStarted, setGameStarted] = useState(false);
      const [showCreatePuzzle, setShowCreatePuzzle] = useState(false);
      const [customPuzzles, setCustomPuzzles] = useState(() => {
        const saved = localStorage.getItem('customPuzzles');
        if (saved) return JSON.parse(saved);
        const initialCustom = {};
        CUSTOMIZABLE_DIFFICULTIES.forEach(d => initialCustom[d] = []);
        return initialCustom;
      });
      const [newPuzzle, setNewPuzzle] = useState({ question: '', answer: '', hint: '', additionalHints: ['', '', '', ''], key: '', encouragement: '', difficulty: 'easy' });
      const [skillMode, setSkillMode] = useState('');
      const [timeLeft, setTimeLeft] = useState(SKILL_MODE_TIMER_DURATION);
      const [timerActive, setTimerActive] = useState(false);
      const [activeTab, setActiveTab] = useState('normal');
      const [bossHealth, setBossHealth] = useState(BOSS_INITIAL_HEALTH);
      const [currentBossPuzzleIndex, setCurrentBossPuzzleIndex] = useState(0);
      const [bossUserAnswer, setBossUserAnswer] = useState('');
      const [bossFeedback, setBossFeedback] = useState('');
      const [showBossHint, setShowBossHint] = useState(false);
      const [bossGameActive, setBossGameActive] = useState(false);
      const [bossDefeated, setBossDefeated] = useState(false);
      const [bossPlayerLost, setBossPlayerLost] = useState(false);

      useEffect(() => {
        localStorage.setItem('customPuzzles', JSON.stringify(customPuzzles));
      }, [customPuzzles]);

      const activePuzzles = useMemo(() => {
        if (!difficulty) return [];
        const base = BASE_PUZZLES_MAP[difficulty] || [];
        const custom = customPuzzles[difficulty] || [];
        return [...base, ...custom];
      }, [difficulty, customPuzzles]);
      
      useEffect(() => {
        let timerId;
        if (timerActive && timeLeft > 0) {
          timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && timerActive) {
          setFeedback('✗ Tempo esgotado! Tente novamente ou peça uma dica.');
          setTimerActive(false);
        }
        return () => clearTimeout(timerId);
      }, [timeLeft, timerActive]);

      const resetPuzzleState = (isSkillMode = false) => {
        setUserAnswer('');
        setFeedback('');
        setShowHint(false);
        setHintLevel(0);
        if (isSkillMode || skillMode === 'Reflexo Rápido') {
          setTimeLeft(SKILL_MODE_TIMER_DURATION);
          setTimerActive(true);
        } else {
          setTimerActive(false);
        }
      };

      const checkAnswer = () => {
        if (!activePuzzles[currentPuzzle]) return;
        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = activePuzzles[currentPuzzle].answer.toLowerCase();
        
        if (normalizedUserAnswer === normalizedCorrectAnswer) {
          setFeedback(`✓ Correto! ${activePuzzles[currentPuzzle].encouragement || 'Muito bem!'}`);
          const newSolved = [...solved];
          newSolved[currentPuzzle] = true;
          setSolved(newSolved);
          setTimerActive(false);
          
          if (newSolved.every(status => status)) {
            setGameComplete(true);
          } else {
            setTimeout(() => {
              if (currentPuzzle < activePuzzles.length - 1) {
                setCurrentPuzzle(currentPuzzle + 1);
                resetPuzzleState();
              } else {
                 setGameComplete(true);
              }
            }, 3000);
          }
        } else {
          setFeedback('✗ Incorreto. Tente novamente.');
        }
      };
      
      const toggleHint = () => {
        if (!activePuzzles[currentPuzzle]) return;
        const currentPuzData = activePuzzles[currentPuzzle];
        const maxHints = (currentPuzData.additionalHints?.length || 0) + 1 + (currentPuzData.key ? 1 : 0); // +1 for main hint, +1 if key exists for final reveal

        if (!showHint) {
          setShowHint(true);
          setHintLevel(1);
        } else if (hintLevel < maxHints ) { 
          setHintLevel(hintLevel + 1);
        } else {
          setShowHint(false);
          setHintLevel(0);
        }
      };
      
      const restartNormalMode = () => {
        setDifficulty('');
        setCurrentPuzzle(0);
        resetPuzzleState();
        setSolved([]);
        setGameComplete(false);
        setGameStarted(false);
        setShowCreatePuzzle(false);
        setSkillMode('');
      };
      
      const startGame = (level) => {
        setDifficulty(level);
        setGameStarted(true);
        setShowCreatePuzzle(false);
        
        const base = BASE_PUZZLES_MAP[level] || [];
        const custom = customPuzzles[level] || [];
        const puzzlesForLevel = [...base, ...custom];
        
        setSolved(new Array(puzzlesForLevel.length).fill(false));
        setCurrentPuzzle(0);
        resetPuzzleState();
        setGameComplete(false);
        setSkillMode('');
      };

      const startSkillModeGame = (modeName) => {
        if (!difficulty) {
          alert("Por favor, escolha um nível de dificuldade primeiro.");
          return;
        }
        setSkillMode(modeName);
        setCurrentPuzzle(0);
        resetPuzzleState(true); // Pass true to indicate skill mode start
        setSolved(new Array(activePuzzles.length).fill(false));
        setGameComplete(false);
        setGameStarted(true);
      };

      const handleNewPuzzleChange = (field, value, index = null) => {
        if (field === 'additionalHints' && index !== null) {
          const updatedHints = [...newPuzzle.additionalHints];
          updatedHints[index] = value;
          setNewPuzzle({ ...newPuzzle, additionalHints: updatedHints });
        } else {
          setNewPuzzle({ ...newPuzzle, [field]: value });
        }
      };

      const addNewPuzzle = () => {
        if (!newPuzzle.question || !newPuzzle.answer) {
          alert("Por favor, preencha pelo menos a pergunta e a resposta!");
          return;
        }
        setCustomPuzzles(prev => {
          const updated = { ...prev };
          if (!updated[newPuzzle.difficulty]) {
            updated[newPuzzle.difficulty] = [];
          }
          updated[newPuzzle.difficulty].push({
            question: newPuzzle.question,
            answer: newPuzzle.answer,
            hint: newPuzzle.hint,
            additionalHints: newPuzzle.additionalHints.filter(h => h.trim() !== ''),
            key: newPuzzle.key,
            encouragement: newPuzzle.encouragement
          });
          return updated;
        });
        setNewPuzzle({ question: '', answer: '', hint: '', additionalHints: ['', '', '', ''], key: '', encouragement: '', difficulty: 'easy' });
        alert("Novo desafio adicionado com sucesso!");
      };
      
      const getDifficultyDescriptionText = () => {
        return difficulty && DIFFICULTY_CONFIG[difficulty] ? DIFFICULTY_CONFIG[difficulty].description : "";
      };
      
      const getCompletionMessage = () => {
        if (!difficulty) return "Parabéns! Você completou todos os desafios!";
        const currentConfig = DIFFICULTY_CONFIG[difficulty];
        const currentOrderIndex = DIFFICULTY_LEVELS_ORDER.indexOf(difficulty);
        if (currentOrderIndex < DIFFICULTY_LEVELS_ORDER.length - 1 && DIFFICULTY_LEVELS_ORDER[currentOrderIndex + 1]) {
            const nextLevelKey = DIFFICULTY_LEVELS_ORDER[currentOrderIndex + 1];
            const nextLevelLabel = DIFFICULTY_CONFIG[nextLevelKey]?.label || "Próximo";
            return `Você completou o nível ${currentConfig.label}! Que tal tentar o ${nextLevelLabel} agora?`;
        }
        return `EXTRAORDINÁRIO! Você superou o nível ${currentConfig.label}! Sua mente é realmente excepcional!`;
      };

      const currentPuzzleData = activePuzzles[currentPuzzle];
      const difficultyColors = difficulty && DIFFICULTY_CONFIG[difficulty] ? DIFFICULTY_CONFIG[difficulty] : DIFFICULTY_CONFIG['easy'];

      const startBossFight = () => {
        setBossHealth(BOSS_INITIAL_HEALTH);
        setCurrentBossPuzzleIndex(0);
        setBossUserAnswer('');
        setBossFeedback('');
        setShowBossHint(false);
        setBossDefeated(false);
        setBossPlayerLost(false);
        setBossGameActive(true);
      };

      const checkBossAnswer = () => {
        if (!bossGameActive || bossDefeated || bossPlayerLost) return;
        const currentBossPuz = bossPuzzles[currentBossPuzzleIndex];
        if (!currentBossPuz) return;

        const normalizedUserAnswer = bossUserAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = currentBossPuz.answer.toLowerCase();

        if (normalizedUserAnswer === normalizedCorrectAnswer) {
          const newHealth = bossHealth - 1;
          setBossHealth(newHealth);
          setBossFeedback(`✓ ${currentBossPuz.encouragement}`);
          
          if (newHealth <= 0) {
            setBossDefeated(true);
            setBossGameActive(false);
          } else {
            setTimeout(() => {
              if (currentBossPuzzleIndex < bossPuzzles.length - 1) {
                setCurrentBossPuzzleIndex(currentBossPuzzleIndex + 1);
                setBossUserAnswer('');
                setBossFeedback(''); // Clear feedback for next puzzle
                setShowBossHint(false);
              } else {
                // This case should ideally not be reached if health is tied to puzzle count
                // and newHealth > 0, but as a fallback:
                setBossPlayerLost(true); 
                setBossGameActive(false);
              }
            }, 3000);
          }
        } else {
          setBossFeedback(`✗ ${currentBossPuz.failureMessage || 'O Chefão zomba da sua tentativa! Tente de novo!'}`);
        }
      };

      const toggleBossHint = () => {
        if (!bossGameActive) return;
        setShowBossHint(!showBossHint);
      };

      const currentBossPuzzleData = bossPuzzles[currentBossPuzzleIndex];
      
      const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        if (tabName === 'boss') {
          // Optionally reset normal mode fully, or just hide its game screen
          setGameStarted(false); 
          setShowCreatePuzzle(false);
          // If a boss fight was in progress and player switches tabs, what should happen?
          // For now, let's reset boss fight if not completed.
          if (!bossDefeated && !bossPlayerLost) {
            setBossGameActive(false); // Stop any ongoing boss game, player must click "Enfrentar" again
          }
        } else if (tabName === 'normal') {
            // If switching back to normal and no difficulty is set, show level selection
            if (!difficulty) {
                restartNormalMode();
            }
            // If a boss fight was in progress, it will be "paused"
            // (its state remains, but not visible)
        }
      };

      return (
        <div className="flex flex-col items-center justify-center p-6 max-w-2xl mx-auto bg-slate-50 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-blue-800">Quebra-Cabeças de Raciocínio Lógico</h1>

          <div className="flex justify-center gap-4 mb-6 w-full">
            <button onClick={() => handleTabChange('normal')} className={`tab-button ${activeTab === 'normal' ? 'tab-button-active' : 'tab-button-inactive'}`}>Modo Normal</button>
            <button onClick={() => handleTabChange('boss')} className={`tab-button ${activeTab === 'boss' ? 'tab-button-active' : 'tab-button-inactive'}`}>Modo Chefão</button>
          </div>

          {activeTab === 'normal' && (
            <>
              {!gameStarted && !showCreatePuzzle ? (
                <div className="w-full">
                  <p className="text-lg mb-6 text-center">Escolha um nível de dificuldade:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {DIFFICULTY_LEVELS_ORDER.map(levelId => {
                      const config = DIFFICULTY_CONFIG[levelId];
                      if (!config) return null;
                      return (
                        <button key={levelId} onClick={() => startGame(levelId)} className={`${config.colors} text-white font-bold py-4 px-4 rounded-lg transition-colors shadow-md`}>
                          <div className="text-xl mb-2">{config.label}</div>
                          <div className="text-sm">{config.description}</div>
                        </button>
                      );
                    })}
                    <button onClick={() => setShowCreatePuzzle(true)} className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg transition-colors shadow-md md:col-span-2">
                      <div className="text-xl mb-2">Criar Desafio Personalizado</div>
                      <div className="text-sm">Adicione seus próprios quebra-cabeças</div>
                    </button>
                  </div>
                </div>
              ) : showCreatePuzzle ? (
                <div className="w-full bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Criar Novo Desafio</h2>
                  <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Pergunta:</label><input type="text" value={newPuzzle.question} onChange={(e) => handleNewPuzzleChange('question', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Pergunta"/></div>
                  <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Resposta:</label><input type="text" value={newPuzzle.answer} onChange={(e) => handleNewPuzzleChange('answer', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Resposta"/></div>
                  <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Dica Inicial:</label><input type="text" value={newPuzzle.hint} onChange={(e) => handleNewPuzzleChange('hint', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Dica Inicial"/></div>
                  {newPuzzle.additionalHints.map((hint, index) => (<div className="mb-2" key={`add-hint-${index}`}><label className="block text-sm font-medium text-gray-700 mb-1">Dica Adicional {index + 1}:</label><input type="text" value={hint} onChange={(e) => handleNewPuzzleChange('additionalHints', e.target.value, index)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={`Dica ${index + 1}`}/></div>))}
                  <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Palavra-chave:</label><input type="text" value={newPuzzle.key} onChange={(e) => handleNewPuzzleChange('key', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Palavra-chave"/></div>
                  <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Incentivo:</label><input type="text" value={newPuzzle.encouragement} onChange={(e) => handleNewPuzzleChange('encouragement', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Incentivo"/></div>
                  <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade:</label><select value={newPuzzle.difficulty} onChange={(e) => handleNewPuzzleChange('difficulty', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">{CUSTOMIZABLE_DIFFICULTIES.map(d => <option key={d} value={d}>{DIFFICULTY_CONFIG[d]?.label || d}</option>)}</select></div>
                  <div className="flex gap-4"><button onClick={addNewPuzzle} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">Adicionar</button><button onClick={() => { setShowCreatePuzzle(false); if (!difficulty) restartNormalMode(); }} className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md">Voltar</button></div>
                </div>
              ) : !gameComplete ? (
                <>
                  <div className="w-full mb-2 text-center">
                    <p className={`text-lg font-semibold ${difficultyColors.textColor}`}>{DIFFICULTY_CONFIG[difficulty]?.label}</p>
                    <p className="text-sm text-gray-600 mb-2">{getDifficultyDescriptionText()}</p>
                    {skillMode && <p className="text-md font-semibold text-purple-600">Modo: {skillMode}</p>}
                  </div>
                  {!skillMode && difficulty && activePuzzles.length > 0 && (
                    <div className="w-full mb-4 flex justify-center gap-4">
                        <button onClick={() => startSkillModeGame('Reflexo Rápido')} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">Jogar Reflexo Rápido</button>
                    </div>
                  )}
                  {timerActive && skillMode === 'Reflexo Rápido' && (<div className="w-full mb-4 text-center"><p className="text-2xl font-bold text-red-600">Tempo: {timeLeft}s</p></div>)}
                  
                  {activePuzzles.length > 0 && currentPuzzleData ? (
                    <>
                      <div className="w-full mb-6">
                        <div className="flex justify-between mb-2 px-1">
                          {activePuzzles.map((_, index) => (<div key={index} className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm ${solved[index] ? 'bg-green-500' : difficultyColors.progressColor || 'bg-gray-700'}`}>{solved[index] ? '✓' : index + 1}</div>))}
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full"><div className={`h-2 rounded-full transition-all duration-500 ${difficultyColors.progressColor || 'bg-gray-700'}`} style={{ width: `${(currentPuzzle / (activePuzzles.length > 1 ? activePuzzles.length - 1 : 1)) * 100}%` }}></div></div>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md w-full mb-6">
                        <h2 className="text-xl font-semibold mb-4">Desafio {currentPuzzle + 1} de {activePuzzles.length}:</h2>
                        <p className="text-lg mb-6">{currentPuzzleData.question}</p>
                        <div className="mb-4"><label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">Sua resposta:</label><input type="text" id="answer" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Sua resposta"/></div>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button onClick={checkAnswer} className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700">Verificar</button>
                          {currentPuzzleData.hint && (<button onClick={toggleHint} className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300">{!showHint ? 'Mostrar Dica' : hintLevel >= ((currentPuzzleData.additionalHints?.length || 0) + 1 + (currentPuzzleData.key ? 1 : 0)) ? 'Esconder Dicas' : `Próxima Dica (${hintLevel}/${(currentPuzzleData.additionalHints?.length || 0) + 1 + (currentPuzzleData.key ? 1 : 0)})`}</button>)}
                        </div>
                        {showHint && currentPuzzleData.hint && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-yellow-800 font-medium mb-2">Dica {hintLevel} de {(currentPuzzleData.additionalHints?.length || 0) + 1 + (currentPuzzleData.key ? 1 : 0)}:</p>
                            {hintLevel === 1 && <p className="text-yellow-800">{currentPuzzleData.hint}</p>}
                            {hintLevel > 1 && hintLevel <= (currentPuzzleData.additionalHints?.length || 0) + 1 && <p className="text-yellow-800">{currentPuzzleData.additionalHints[hintLevel-2]}</p>}
                            {hintLevel === (currentPuzzleData.additionalHints?.length || 0) + 1 + (currentPuzzleData.key ? 1 : 0) && currentPuzzleData.key && (
                              <div className="mt-3 pt-3 border-t border-yellow-200">
                                <p className="text-yellow-800 mb-2">Palavra-chave: <span className="font-bold">{currentPuzzleData.key}</span></p>
                                <p className="text-yellow-800">A resposta correta é: <span className="font-bold">{currentPuzzleData.answer}</span></p>
                              </div>
                            )}
                          </div>
                        )}
                        {feedback && (<div className={`mt-4 p-3 flex items-center ${feedback.includes('✓') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} rounded-md`}><span className="text-2xl mr-2">{feedback.includes('✓') ? '✓' : '✗'}</span><span>{feedback.replace(/^[✓✗]\s/, '')}</span></div>)}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                        <p className="text-lg text-gray-700">Não há desafios para este nível ou dificuldade não selecionada.</p>
                    </div>
                  )}
                  <button onClick={restartNormalMode} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md mt-4">Menu de Níveis</button>
                </>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md w-full text-center">
                  <h2 className={`text-2xl font-bold mb-6 ${difficultyColors.textColor}`}>{getCompletionMessage()}</h2>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <button onClick={restartNormalMode} className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700">Menu de Níveis</button>
                    {difficulty && DIFFICULTY_LEVELS_ORDER.indexOf(difficulty) < DIFFICULTY_LEVELS_ORDER.length - 1 && DIFFICULTY_LEVELS_ORDER[DIFFICULTY_LEVELS_ORDER.indexOf(difficulty) + 1] && (
                      <button onClick={() => { const cI = DIFFICULTY_LEVELS_ORDER.indexOf(difficulty); const nL = DIFFICULTY_LEVELS_ORDER[cI + 1]; startGame(nL);}}
                        className={`${DIFFICULTY_CONFIG[DIFFICULTY_LEVELS_ORDER[DIFFICULTY_LEVELS_ORDER.indexOf(difficulty) + 1]]?.colors || 'bg-gray-800'} font-medium py-2 px-6 rounded-md text-white`}>
                        Próximo: {DIFFICULTY_CONFIG[DIFFICULTY_LEVELS_ORDER[DIFFICULTY_LEVELS_ORDER.indexOf(difficulty) + 1]]?.label}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'boss' && (
             <div className="w-full">
              {!bossGameActive && !bossDefeated && !bossPlayerLost && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-700 mb-4">Modo Chefão!</h2>
                  <p className="text-lg mb-6 text-gray-700">Prepare-se para o desafio supremo!</p>
                  <img src="https://via.placeholder.com/150/800000/FFFFFF?Text=Chefão" alt="Chefão" className="mx-auto mb-6 rounded-lg shadow-md" />
                  <button onClick={startBossFight} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg">Enfrentar o Chefão!</button>
                </div>
              )}
              {bossGameActive && !bossDefeated && !bossPlayerLost && currentBossPuzzleData && (
                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                  <h2 className="text-xl font-bold text-center text-red-700 mb-2">Desafio do Chefão!</h2>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Vida do Chefão:</p>
                    <div className="w-full bg-gray-300 rounded-full h-6">
                      <div className="bg-red-500 h-6 rounded-full text-white flex items-center justify-center font-bold transition-all duration-500"
                           style={{ width: `${(bossHealth / BOSS_INITIAL_HEALTH) * 100}%` }}>
                        {bossHealth} / {BOSS_INITIAL_HEALTH}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg mb-4 font-semibold">{currentBossPuzzleData.question}</p>
                  <div className="mb-4"><label htmlFor="bossAnswer" className="block text-sm font-medium text-gray-700 mb-2">Sua resposta:</label><input type="text" id="bossAnswer" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500" value={bossUserAnswer} onChange={(e) => setBossUserAnswer(e.target.value)} placeholder="Desvende..."/></div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={checkBossAnswer} className="bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600">Atacar!</button>
                    {currentBossPuzzleData.hint && (<button onClick={toggleBossHint} className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-md hover:bg-yellow-600">{showBossHint ? 'Esconder Dica' : 'Pedir Dica'}</button>)}
                  </div>
                  {showBossHint && currentBossPuzzleData.hint && (<div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md"><p className="text-yellow-800"><span className="font-bold">Dica:</span> {currentBossPuzzleData.hint}</p></div>)}
                  {bossFeedback && (<div className={`mt-4 p-3 rounded-md ${bossFeedback.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}><p>{bossFeedback}</p></div>)}
                </div>
              )}
              {bossDefeated && (
                <div className="text-center bg-green-100 p-6 rounded-lg shadow-md">
                  <h2 className="text-3xl font-bold text-green-700 mb-4">VITÓRIA!</h2>
                  <p className="text-xl text-green-600 mb-6">{currentBossPuzzleData?.encouragement || "Você derrotou o Chefão!"}</p>
                  <img src="https://via.placeholder.com/150/008000/FFFFFF?Text=Vitória!" alt="Vitória" className="mx-auto mb-6 rounded-lg" />
                  <button onClick={() => { handleTabChange('normal'); startBossFight(); /* Reset boss for next time */ }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Voltar ao Modo Normal</button>
                </div>
              )}
              {bossPlayerLost && (
                <div className="text-center bg-red-100 p-6 rounded-lg shadow-md">
                  <h2 className="text-3xl font-bold text-red-700 mb-4">DERROTA...</h2>
                  <p className="text-xl text-red-600 mb-6">{bossPuzzles[currentBossPuzzleIndex]?.failureMessage || "O Chefão venceu."}</p>
                  <img src="https://via.placeholder.com/150/FF0000/FFFFFF?Text=Game Over" alt="Derrota" className="mx-auto mb-6 rounded-lg" />
                  <button onClick={() => { handleTabChange('normal'); startBossFight(); /* Reset boss for next time */ }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Voltar ao Modo Normal</button>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>Desafie seu raciocínio com quebra-cabeças de diversos níveis.</p>
          </div>
        </div>
      );
    };
    // ADICIONE ESTA LINHA NO LUGAR DA ANTERIOR:
export default JogoRaciocinio;