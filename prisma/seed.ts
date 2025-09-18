import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seed...');

  const classes = await prisma.class.createMany({
    data: [
      { name: 'tank', hp: 150, mp: 20, strength: 80, intelligence: 20 },
      { name: 'mago', hp: 80, mp: 150, strength: 20, intelligence: 150 },
      { name: 'lutador', hp: 120, mp: 10, strength: 120, intelligence: 10 },
      { name: 'ladino', hp: 90, mp: 30, strength: 90, intelligence: 90 },
      { name: 'paladino', hp: 130, mp: 50, strength: 100, intelligence: 50 },
      { name: 'bardo', hp: 100, mp: 100, strength: 50, intelligence: 100 },
    ],
    skipDuplicates: true, // Isso evita erros se você rodar o script mais de uma vez
  });

  console.log(`Foram criadas ${classes.count} classes.`);

  const questionsData = [
    //perguntas faceis.
  { texto_pergunta: 'Complete a frase: "She ___ a student."', opcao_a: 'is', opcao_b: 'are', opcao_c: 'am', resposta_correta: 'is', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual o verbo "to be" para "you"?', opcao_a: 'is', opcao_b: 'am', opcao_c: 'are', resposta_correta: 'are', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "A dog".', opcao_a: 'Um gato', opcao_b: 'Um cachorro', opcao_c: 'Um pássaro', resposta_correta: 'Um cachorro', dificuldade: 'Facil' },
  { texto_pergunta: 'O plural de "car" é:', opcao_a: 'cars', opcao_b: 'caros', opcao_c: 'carss', resposta_correta: 'cars', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a tradução de "hello"?', opcao_a: 'Adeus', opcao_b: 'Olá', opcao_c: 'Obrigado', resposta_correta: 'Olá', dificuldade: 'Facil' },
  { texto_pergunta: 'O antônimo de "big" é:', opcao_a: 'small', opcao_b: 'tall', opcao_c: 'short', resposta_correta: 'small', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "I am happy".', opcao_a: 'Eu estou triste', opcao_b: 'Eu estou feliz', opcao_c: 'Eu estou com raiva', resposta_correta: 'Eu estou feliz', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a cor "red"?', opcao_a: 'Azul', opcao_b: 'Vermelho', opcao_c: 'Verde', resposta_correta: 'Vermelho', dificuldade: 'Facil' },
  { texto_pergunta: 'O plural de "book" é:', opcao_a: 'books', opcao_b: 'bookes', opcao_c: 'bookss', resposta_correta: 'books', dificuldade: 'Facil' },
  { texto_pergunta: 'Complete a frase: "They ___ playing".', opcao_a: 'is', opcao_b: 'am', opcao_c: 'are', resposta_correta: 'are', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a tradução de "cat"?', opcao_a: 'Gato', opcao_b: 'Cachorro', opcao_c: 'Pássaro', resposta_correta: 'Gato', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "We are friends".', opcao_a: 'Nós somos inimigos', opcao_b: 'Nós somos amigos', opcao_c: 'Nós somos família', resposta_correta: 'Nós somos amigos', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a tradução de "water"?', opcao_a: 'Água', opcao_b: 'Comida', opcao_c: 'Fogo', resposta_correta: 'Água', dificuldade: 'Facil' },
  { texto_pergunta: 'Complete a frase: "He ___ a doctor".', opcao_a: 'am', opcao_b: 'is', opcao_c: 'are', resposta_correta: 'is', dificuldade: 'Facil' },
  { texto_pergunta: 'O plural de "pen" é:', opcao_a: 'pen', opcao_b: 'pens', opcao_c: 'penns', resposta_correta: 'pens', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a tradução de "house"?', opcao_a: 'Carro', opcao_b: 'Casa', opcao_c: 'Rua', resposta_correta: 'Casa', dificuldade: 'Facil' },
  { texto_pergunta: 'O oposto de "hot" é:', opcao_a: 'cold', opcao_b: 'warm', opcao_c: 'cool', resposta_correta: 'cold', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "She is sad".', opcao_a: 'Ela está feliz', opcao_b: 'Ela está triste', opcao_c: 'Ela está com raiva', resposta_correta: 'Ela está triste', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual o verbo "to be" para "it"?', opcao_a: 'am', opcao_b: 'are', opcao_c: 'is', resposta_correta: 'is', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "school".', opcao_a: 'Escola', opcao_b: 'Trabalho', opcao_c: 'Parque', resposta_correta: 'Escola', dificuldade: 'Facil' },
  { texto_pergunta: 'O plural de "apple" é:', opcao_a: 'apples', opcao_b: 'appless', opcao_c: 'applees', resposta_correta: 'apples', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a tradução de "bye"?', opcao_a: 'Oi', opcao_b: 'Olá', opcao_c: 'Tchau', resposta_correta: 'Tchau', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "I have a book".', opcao_a: 'Eu tenho um carro', opcao_b: 'Eu tenho um livro', opcao_c: 'Eu tenho uma caneta', resposta_correta: 'Eu tenho um livro', dificuldade: 'Facil' },
  { texto_pergunta: 'O oposto de "up" é:', opcao_a: 'down', opcao_b: 'in', opcao_c: 'out', resposta_correta: 'down', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a tradução de "chair"?', opcao_a: 'Mesa', opcao_b: 'Cadeira', opcao_c: 'Sofá', resposta_correta: 'Cadeira', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "yellow".', opcao_a: 'Vermelho', opcao_b: 'Verde', opcao_c: 'Amarelo', resposta_correta: 'Amarelo', dificuldade: 'Facil' },
  { texto_pergunta: 'Complete a frase: "The sun ___ hot".', opcao_a: 'are', opcao_b: 'am', opcao_c: 'is', resposta_correta: 'is', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a tradução de "family"?', opcao_a: 'Amigos', opcao_b: 'Família', opcao_c: 'Colegas', resposta_correta: 'Família', dificuldade: 'Facil' },
  { texto_pergunta: 'O plural de "box" é:', opcao_a: 'boxs', opcao_b: 'boxes', opcao_c: 'boxxes', resposta_correta: 'boxes', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "good morning".', opcao_a: 'Boa noite', opcao_b: 'Boa tarde', opcao_c: 'Bom dia', resposta_correta: 'Bom dia', dificuldade: 'Facil' },
  { texto_pergunta: 'O oposto de "day" é:', opcao_a: 'night', opcao_b: 'afternoon', opcao_c: 'morning', resposta_correta: 'night', dificuldade: 'Facil' },
  { texto_pergunta: 'Qual a tradução de "run"?', opcao_a: 'Andar', opcao_b: 'Correr', opcao_c: 'Pular', resposta_correta: 'Correr', dificuldade: 'Facil' },
  { texto_pergunta: 'Complete a frase: "I ___ a boy".', opcao_a: 'am', opcao_b: 'is', opcao_c: 'are', resposta_correta: 'am', dificuldade: 'Facil' },
  { texto_pergunta: 'Traduza: "teacher".', opcao_a: 'Aluno', opcao_b: 'Professor', opcao_c: 'Diretor', resposta_correta: 'Professor', dificuldade: 'Facil' }, 
  
    //perguntas medias.
  { texto_pergunta: 'Qual a forma do passado de "go"?', opcao_a: 'went', opcao_b: 'goed', opcao_c: 'gone', resposta_correta: 'went', dificuldade: 'Medio' },
  { texto_pergunta: 'Traduza: "I am cooking now".', opcao_a: 'Eu cozinhei agora', opcao_b: 'Eu estou cozinhando agora', opcao_c: 'Eu cozinharei agora', resposta_correta: 'Eu estou cozinhando agora', dificuldade: 'Medio' },
  { texto_pergunta: 'Complete com a preposição correta: "The book is ___ the table".', opcao_a: 'in', opcao_b: 'at', opcao_c: 'on', resposta_correta: 'on', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual o plural de "mouse"?', opcao_a: 'mouses', opcao_b: 'mice', opcao_c: 'mouce', resposta_correta: 'mice', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a forma do passado de "eat"?', opcao_a: 'eated', opcao_b: 'ate', opcao_c: 'eaten', resposta_correta: 'ate', dificuldade: 'Medio' },
  { texto_pergunta: 'Traduza: "I like to read".', opcao_a: 'Eu gosto de comer', opcao_b: 'Eu gosto de correr', opcao_c: 'Eu gosto de ler', resposta_correta: 'Eu gosto de ler', dificuldade: 'Medio' },
  { texto_pergunta: 'O que significa "break a leg"?', opcao_a: 'Quebre a perna', opcao_b: 'Boa sorte', opcao_c: 'Desastre', resposta_correta: 'Boa sorte', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a forma do passado de "drink"?', opcao_a: 'drank', opcao_b: 'drinked', opcao_c: 'drunken', resposta_correta: 'drank', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a tradução de "I have to go"?', opcao_a: 'Eu quero ir', opcao_b: 'Eu tenho que ir', opcao_c: 'Eu preciso ir', resposta_correta: 'Eu tenho que ir', dificuldade: 'Medio' },
  { texto_pergunta: 'Complete a frase: "She ___ to the store yesterday".', opcao_a: 'go', opcao_b: 'goes', opcao_c: 'went', resposta_correta: 'went', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual o plural de "child"?', opcao_a: 'childs', opcao_b: 'children', opcao_c: 'childes', resposta_correta: 'children', dificuldade: 'Medio' },
  { texto_pergunta: 'O que significa "hold on"?', opcao_a: 'Segurar', opcao_b: 'Esperar', opcao_c: 'Soltar', resposta_correta: 'Esperar', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a forma do passado de "see"?', opcao_a: 'saw', opcao_b: 'seed', opcao_c: 'seen', resposta_correta: 'saw', dificuldade: 'Medio' },
  { texto_pergunta: 'Traduza: "They are studying".', opcao_a: 'Eles estudaram', opcao_b: 'Eles estão estudando', opcao_c: 'Eles estudarão', resposta_correta: 'Eles estão estudando', dificuldade: 'Medio' },
  { texto_pergunta: 'Complete com a preposição correta: "He is ___ the car".', opcao_a: 'at', opcao_b: 'in', opcao_c: 'on', resposta_correta: 'in', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a tradução de "it is up to you"?', opcao_a: 'É sua vez', opcao_b: 'Depende de você', opcao_c: 'É sua culpa', resposta_correta: 'Depende de você', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a forma do passado de "write"?', opcao_a: 'writed', opcao_b: 'wrote', opcao_c: 'written', resposta_correta: 'wrote', dificuldade: 'Medio' },
  { texto_pergunta: 'Traduza: "We are watching TV".', opcao_a: 'Nós assistimos TV', opcao_b: 'Nós assistimos TV agora', opcao_c: 'Nós estamos assistindo TV', resposta_correta: 'Nós estamos assistindo TV', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual o plural de "man"?', opcao_a: 'mans', opcao_b: 'mens', opcao_c: 'men', resposta_correta: 'men', dificuldade: 'Medio' },
  { texto_pergunta: 'O que significa "catch a cold"?', opcao_a: 'Pegar um peixe', opcao_b: 'Ficar resfriado', opcao_c: 'Pegar um ônibus', resposta_correta: 'Ficar resfriado', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a forma do passado de "run"?', opcao_a: 'ran', opcao_b: 'runed', opcao_c: 'ron', resposta_correta: 'ran', dificuldade: 'Medio' },
  { texto_pergunta: 'Traduza: "get in the car".', opcao_a: 'Saia do carro', opcao_b: 'Entre no carro', opcao_c: 'Corra com o carro', resposta_correta: 'Entre no carro', dificuldade: 'Medio' },
  { texto_pergunta: 'Complete a frase: "I ___ a pizza last night".', opcao_a: 'ate', opcao_b: 'eat', opcao_c: 'eaten', resposta_correta: 'ate', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a tradução de "I get it"?', opcao_a: 'Eu consigo', opcao_b: 'Eu entendo', opcao_c: 'Eu pego', resposta_correta: 'Eu entendo', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a forma do passado de "buy"?', opcao_a: 'buyed', opcao_b: 'bought', opcao_c: 'buyt', resposta_correta: 'bought', dificuldade: 'Medio' },
  { texto_pergunta: 'O que significa "give up"?', opcao_a: 'Entregar', opcao_b: 'Desistir', opcao_c: 'Dar a volta', resposta_correta: 'Desistir', dificuldade: 'Medio' },
  { texto_pergunta: 'Complete a frase: "We are ___ for a walk".', opcao_a: 'go', opcao_b: 'going', opcao_c: 'went', resposta_correta: 'going', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a tradução de "I used to play soccer"?', opcao_a: 'Eu costumava jogar futebol', opcao_b: 'Eu jogo futebol', opcao_c: 'Eu irei jogar futebol', resposta_correta: 'Eu costumava jogar futebol', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual o plural de "woman"?', opcao_a: 'womans', opcao_b: 'womens', opcao_c: 'women', resposta_correta: 'women', dificuldade: 'Medio' },
  { texto_pergunta: 'O que significa "look up"?', opcao_a: 'Olhar para baixo', opcao_b: 'Pesquisar', opcao_c: 'Procurar', resposta_correta: 'Pesquisar', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a forma do passado de "tell"?', opcao_a: 'telld', opcao_b: 'told', opcao_c: 'telled', resposta_correta: 'told', dificuldade: 'Medio' },
  { texto_pergunta: 'Traduza: "I am looking forward to it".', opcao_a: 'Eu estou ansioso por isso', opcao_b: 'Eu estou olhando para frente', opcao_c: 'Eu espero por isso', resposta_correta: 'Eu estou ansioso por isso', dificuldade: 'Medio' },
  { texto_pergunta: 'O que significa "call off"?', opcao_a: 'Ligar', opcao_b: 'Cancelar', opcao_c: 'Ligar de volta', resposta_correta: 'Cancelar', dificuldade: 'Medio' },
  { texto_pergunta: 'Qual a forma do passado de "find"?', opcao_a: 'finded', opcao_b: 'found', opcao_c: 'find', resposta_correta: 'found', dificuldade: 'Medio' },

    //perguntas dificeis
  { texto_pergunta: 'Qual o significado de "as the crow flies"?', opcao_a: 'Em linha reta', opcao_b: 'Voando como um corvo', opcao_c: 'De forma circular', resposta_correta: 'Em linha reta', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual a forma correta do Present Perfect de "to be"?', opcao_a: 'was/were', opcao_b: 'have been/has been', opcao_c: 'had been', resposta_correta: 'have been/has been', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "If I ___ the lottery, I would buy a car".', opcao_a: 'won', opcao_b: 'win', opcao_c: 'have won', resposta_correta: 'won', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "to bite the bullet"?', opcao_a: 'Atirar', opcao_b: 'Encarar uma situação difícil', opcao_c: 'Morder a bala', resposta_correta: 'Encarar uma situação difícil', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete com a preposição correta: "He is interested ___ chess".', opcao_a: 'on', opcao_b: 'in', opcao_c: 'at', resposta_correta: 'in', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "break the bank"?', opcao_a: 'Quebrar o banco', opcao_b: 'Gastar muito dinheiro', opcao_c: 'Assaltar um banco', resposta_correta: 'Gastar muito dinheiro', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual a forma correta do Present Perfect de "to write"?', opcao_a: 'wrote', opcao_b: 'have written', opcao_c: 'have wrote', resposta_correta: 'have written', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "to hit the nail on the head"?', opcao_a: 'Bater o martelo', opcao_b: 'Acertar em cheio', opcao_c: 'Acertar a cabeça', resposta_correta: 'Acertar em cheio', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "I have ___ this movie twice".', opcao_a: 'see', opcao_b: 'saw', opcao_c: 'seen', resposta_correta: 'seen', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual o significado de "a piece of cake"?', opcao_a: 'Um pedaço de bolo', opcao_b: 'Algo muito fácil', opcao_c: 'Uma fatia de pão', resposta_correta: 'Algo muito fácil', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa o phrasal verb "look forward to"?', opcao_a: 'Esperar ansiosamente', opcao_b: 'Olhar para frente', opcao_c: 'Procurar', resposta_correta: 'Esperar ansiosamente', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "We have ___ that book".', opcao_a: 'readed', opcao_b: 'read', opcao_c: 'red', resposta_correta: 'read', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "to have a screw loose"?', opcao_a: 'Ter um parafuso solto', opcao_b: 'Ser maluco', opcao_c: 'Ser teimoso', resposta_correta: 'Ser maluco', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual a forma correta do Present Perfect de "to go"?', opcao_a: 'went', opcao_b: 'have gone', opcao_c: 'have goed', resposta_correta: 'have gone', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "He has been here ___ an hour".', opcao_a: 'for', opcao_b: 'since', opcao_c: 'in', resposta_correta: 'for', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "a blessing in disguise"?', opcao_a: 'Uma benção disfarçada', opcao_b: 'Um presente inesperado', opcao_c: 'Uma piada sem graça', resposta_correta: 'Uma benção disfarçada', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual a forma correta do Present Perfect de "to speak"?', opcao_a: 'spoked', opcao_b: 'spoken', opcao_c: 'have spoken', resposta_correta: 'have spoken', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "If you had studied, you ___ passed the test".', opcao_a: 'would', opcao_b: 'would have', opcao_c: 'will have', resposta_correta: 'would have', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "to get a taste of your own medicine"?', opcao_a: 'Gostar do seu remédio', opcao_b: 'Provar do próprio veneno', opcao_c: 'Sentir o sabor', resposta_correta: 'Provar do próprio veneno', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual a tradução de "It is raining cats and dogs"?', opcao_a: 'Está chovendo muito', opcao_b: 'Está chovendo gatos e cachorros', opcao_c: 'A tempestade é forte', resposta_correta: 'Está chovendo muito', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "She has lived here ___ 2010".', opcao_a: 'since', opcao_b: 'for', opcao_c: 'in', resposta_correta: 'since', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "to cost an arm and a leg"?', opcao_a: 'Custar um braço e uma perna', opcao_b: 'Ser muito caro', opcao_c: 'Ter um preço justo', resposta_correta: 'Ser muito caro', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual a forma correta do Present Perfect de "to give"?', opcao_a: 'gaved', opcao_b: 'given', opcao_c: 'have given', resposta_correta: 'have given', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa o phrasal verb "take off"?', opcao_a: 'Tirar a roupa', opcao_b: 'Decolar', opcao_c: 'Partir', resposta_correta: 'Decolar', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "I wish I ___ rich".', opcao_a: 'am', opcao_b: 'was', opcao_c: 'were', resposta_correta: 'were', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual o significado de "a dime a dozen"?', opcao_a: 'Ser comum', opcao_b: 'Custar dez centavos', opcao_c: 'Ser raro', resposta_correta: 'Ser comum', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual a forma correta do Past Perfect de "to eat"?', opcao_a: 'ate', opcao_b: 'had eaten', opcao_c: 'eated', resposta_correta: 'had eaten', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "to pull someones leg"?', opcao_a: 'Puxar a perna de alguém', opcao_b: 'Prender a perna', opcao_c: 'Fazer uma piada', resposta_correta: 'Fazer uma piada', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "He had ___ before I arrived".', opcao_a: 'left', opcao_b: 'leaft', opcao_c: 'leaved', resposta_correta: 'left', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa o phrasal verb "break up"?', opcao_a: 'Quebrar algo', opcao_b: 'Terminar um relacionamento', opcao_c: 'Separar', resposta_correta: 'Terminar um relacionamento', dificuldade: 'Dificil' },
  { texto_pergunta: 'Qual a forma correta do Past Perfect de "to come"?', opcao_a: 'came', opcao_b: 'had came', opcao_c: 'had come', resposta_correta: 'had come', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa "to get cold feet"?', opcao_a: 'Ficar com os pés frios', opcao_b: 'Ficar nervoso', opcao_c: 'Desistir de algo', resposta_correta: 'Ficar nervoso', dificuldade: 'Dificil' },
  { texto_pergunta: 'Complete a frase: "They ___ traveled to Japan".', opcao_a: 'has', opcao_b: 'have', opcao_c: 'had', resposta_correta: 'have', dificuldade: 'Dificil' },
  { texto_pergunta: 'O que significa o phrasal verb "put up with"?', opcao_a: 'Montar', opcao_b: 'Tolerar', opcao_c: 'Colocar em cima', resposta_correta: 'Tolerar', dificuldade: 'Dificil' },
];

  const questions = await prisma.question.createMany({
    data: questionsData,
    skipDuplicates: true,
  });

  const monsters = await prisma.monster.createMany({
    data: [
        { nome: 'Diabrete Errôneo', hp: 50, dano: 10 },
        { nome: 'Esqueleto da Sintaxe', hp: 80, dano: 20 },
        { nome: 'Lexicógrafo, o Guardião do Vazio', hp: 1500, dano: 40 },
        { nome: 'Malak, O Silenciador', hp: 5000, dano: 100 },
    ],
    skipDuplicates: true,
});
console.log(`Foram criados ${monsters.count} monstros.`);
}

main()
  .catch((e) => {
    console.error(e);
    throw new Error('Falha no processo de seed.');
  })
  .finally(async () => {
    await prisma.$disconnect();
  });