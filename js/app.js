'use strict';

/* =========================================================
   Kyde Food - totem de autoatendimento
   Front-end em JavaScript puro. Fala com o banco (MySQL)
   através dos arquivos PHP da pasta /api (XAMPP).
   ========================================================= */

const $ = (seletor) => document.querySelector(seletor);

const estado = {
  nome: '',
  carrinho: [],          // [{ produto, quantidade }]
  produtos: [],
  timerConfirmacao: null
};

/* ---------- utilidades ---------- */
function moeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function criar(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;   // textContent evita injeção de HTML
  return e;
}

function iconeDoProduto(nome) {
  const n = nome.toLowerCase();
  if (n.includes('hot dog')) return '🌭';
  if (n.includes('burger') || n.includes('x-') || n.includes('cheese')) return '🍔';
  if (n.includes('batata')) return '🍟';
  if (n.includes('nugget')) return '🍗';
  if (n.includes('refri')) return '🥤';
  if (n.includes('suco')) return '🧃';
  if (n.includes('shake')) return '🥛';
  if (n.includes('sorvete') || n.includes('sundae')) return '🍨';
  return '🍽️';
}

/* ---------- navegação entre telas ---------- */
function mostrar(nome) {
  document.querySelectorAll('.tela').forEach((t) => t.classList.remove('ativa'));
  $('#tela-' + nome).classList.add('ativa');
  window.scrollTo(0, 0);

  if (nome === 'inicio') reiniciarPedido();
  if (nome === 'cadastro') prepararCadastro();
  if (nome === 'cardapio') carregarCardapio();
  if (nome === 'carrinho') desenharCarrinho();
  if (nome === 'pagamento') prepararPagamento();
}

document.querySelectorAll('[data-ir]').forEach((botao) => {
  botao.addEventListener('click', () => mostrar(botao.dataset.ir));
});

function reiniciarPedido() {
  clearInterval(estado.timerConfirmacao);
  estado.nome = '';
  estado.carrinho = [];
}

/* ---------- 2. cadastro ---------- */
function prepararCadastro() {
  const campo = $('#cad-nome');
  campo.value = '';
  campo.disabled = false;
  $('#cad-aviso').textContent = '';
  $('#cad-aviso').classList.remove('ok');
  $('#btn-cadastrar').hidden = false;
  $('#btn-ir-cardapio').hidden = true;
  campo.focus();
}

function cadastrar() {
  const nome = $('#cad-nome').value.trim();
  const aviso = $('#cad-aviso');
  if (nome.length < 2) {
    aviso.classList.remove('ok');
    aviso.textContent = 'Digite seu nome (mínimo 2 letras).';
    return;
  }
  estado.nome = nome;
  aviso.classList.add('ok');
  aviso.textContent = 'Cadastro realizado, ' + nome + '!';
  $('#cad-nome').disabled = true;
  $('#btn-cadastrar').hidden = true;
  $('#btn-ir-cardapio').hidden = false;
}

$('#btn-cadastrar').addEventListener('click', cadastrar);
$('#cad-nome').addEventListener('keydown', (e) => { if (e.key === 'Enter') cadastrar(); });

/* ---------- 3. cardápio ---------- */
async function carregarCardapio() {
  $('#saudacao').textContent = 'Olá, ' + estado.nome + '! Escolha seu lanche';
  atualizarBotaoCarrinho();

  const grade = $('#grade-produtos');
  grade.replaceChildren(criar('p', 'vazio', 'Carregando cardápio...'));

  try {
    const resp = await fetch('api/produtos.php');
    const dados = await resp.json();
    if (!resp.ok) throw new Error(dados.erro || 'Erro ao buscar produtos.');
    estado.produtos = dados;
    desenharCardapio();
  } catch (erro) {
    grade.replaceChildren(criar('p', 'vazio', 'Não foi possível carregar o cardápio: ' + erro.message));
  }
}

function desenharCardapio() {
  const grade = $('#grade-produtos');
  grade.replaceChildren();

  if (estado.produtos.length === 0) {
    grade.append(criar('p', 'vazio', 'Nenhum produto cadastrado. Rode o produtos.sql no phpMyAdmin.'));
    return;
  }

  estado.produtos.forEach((p) => {
    const cartao = criar('article', 'produto');
    const base = criar('div', 'base');
    const botao = criar('button', 'btn btn-verde btn-pequeno', 'ADICIONAR');
    botao.addEventListener('click', () => adicionar(p));

    base.append(criar('span', 'preco', moeda(p.preco)), botao);
    cartao.append(
      criar('div', 'icone', iconeDoProduto(p.nome)),
      criar('h3', '', p.nome),
      criar('p', '', p.descricao),
      base
    );
    grade.append(cartao);
  });
}

/* ---------- carrinho (regras) ---------- */
function adicionar(produto) {
  const item = estado.carrinho.find((i) => i.produto.id === produto.id);
  if (item) item.quantidade++;
  else estado.carrinho.push({ produto, quantidade: 1 });
  atualizarBotaoCarrinho();
}

function totalItens() {
  return estado.carrinho.reduce((soma, i) => soma + i.quantidade, 0);
}

function totalValor() {
  return estado.carrinho.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0);
}

function atualizarBotaoCarrinho() {
  $('#btn-carrinho').textContent = '🛒 Carrinho (' + totalItens() + ') · ' + moeda(totalValor());
}

/* ---------- 4. carrinho (tela) ---------- */
function desenharCarrinho() {
  const lista = $('#lista-carrinho');
  lista.replaceChildren();

  if (estado.carrinho.length === 0) {
    lista.append(criar('p', 'vazio', 'Seu carrinho está vazio. Volte ao cardápio e escolha algo!'));
  }

  estado.carrinho.forEach((item) => {
    const linha = criar('div', 'linha-item');

    const menos = criar('button', 'btn btn-amarelo btn-pequeno', '−');
    const mais = criar('button', 'btn btn-amarelo btn-pequeno', '+');
    const remover = criar('button', 'btn btn-vermelho btn-pequeno', 'REMOVER');
    const qtd = criar('div', 'qtd');
    qtd.append(menos, criar('span', '', String(item.quantidade)), mais);

    menos.addEventListener('click', () => {
      if (item.quantidade > 1) item.quantidade--;
      desenharCarrinho();
    });
    mais.addEventListener('click', () => { item.quantidade++; desenharCarrinho(); });
    remover.addEventListener('click', () => {
      estado.carrinho = estado.carrinho.filter((i) => i !== item);
      desenharCarrinho();
    });

    linha.append(
      criar('span', 'nome', item.produto.nome),
      qtd,
      criar('strong', 'preco', moeda(item.produto.preco * item.quantidade)),
      remover
    );
    lista.append(linha);
  });

  $('#total-carrinho').textContent = moeda(totalValor());
  $('#btn-ir-pagamento').disabled = estado.carrinho.length === 0;
  atualizarBotaoCarrinho();
}

/* ---------- validação e máscara de CPF / CNPJ ---------- */
function somenteDigitos(s) { return String(s).replace(/\D/g, ''); }

function todosIguais(s) { return /^(\d)\1+$/.test(s); }

function cpfValido(cpf) {
  if (cpf.length !== 11 || todosIguais(cpf)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(cpf[i]) * (t + 1 - i);
    const digito = ((soma * 10) % 11) % 10;
    if (Number(cpf[t]) !== digito) return false;
  }
  return true;
}

function cnpjValido(cnpj) {
  if (cnpj.length !== 14 || todosIguais(cnpj)) return false;
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const calcula = (pesos) => {
    const soma = pesos.reduce((s, peso, i) => s + Number(cnpj[i]) * peso, 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return calcula(pesos1) === Number(cnpj[12]) && calcula(pesos2) === Number(cnpj[13]);
}

const PADROES = { cpf: '999.999.999-99', cnpj: '99.999.999/9999-99' };

function aplicarMascara(digitos, padrao) {
  let saida = '';
  let i = 0;
  for (const ch of padrao) {
    if (i >= digitos.length) break;
    if (ch === '9') saida += digitos[i++];
    else saida += ch;
  }
  return saida;
}

function tipoDocumento() {
  return document.querySelector('input[name="doc"]:checked').value;
}

function atualizarCampoDocumento() {
  const tipo = tipoDocumento();
  const campo = $('#pag-doc');
  campo.value = '';
  campo.placeholder = tipo === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00';
  campo.maxLength = PADROES[tipo].length;
  $('#pag-doc-dica').textContent = tipo === 'cpf'
    ? 'Digite os 11 números do CPF.'
    : 'Digite os 14 números do CNPJ.';
  campo.focus();
}

document.querySelectorAll('input[name="doc"]').forEach((r) =>
  r.addEventListener('change', atualizarCampoDocumento));

$('#pag-doc').addEventListener('input', (e) => {
  const tipo = tipoDocumento();
  const max = tipo === 'cpf' ? 11 : 14;
  e.target.value = aplicarMascara(somenteDigitos(e.target.value).slice(0, max), PADROES[tipo]);
});

/* ---------- 5. pagamento ---------- */
function prepararPagamento() {
  $('#total-pagamento').textContent = 'Total: ' + moeda(totalValor());
  document.querySelector('input[name="doc"][value="cpf"]').checked = true;
  document.querySelector('input[name="retirada"][value="Comer aqui"]').checked = true;
  $('#pag-forma').selectedIndex = 0;
  $('#pag-aviso').textContent = '';
  $('#btn-confirmar').disabled = false;
  atualizarCampoDocumento();
}

async function confirmarPagamento() {
  const aviso = $('#pag-aviso');
  const tipo = tipoDocumento();
  const documento = somenteDigitos($('#pag-doc').value);
  const valido = tipo === 'cpf' ? cpfValido(documento) : cnpjValido(documento);

  if (!valido) {
    aviso.textContent = (tipo === 'cpf' ? 'CPF' : 'CNPJ') + ' inválido. Confira os números.';
    return;
  }
  if (estado.carrinho.length === 0) {
    aviso.textContent = 'Seu carrinho está vazio.';
    return;
  }

  const corpo = {
    nome: estado.nome,
    tipoDocumento: tipo,
    documento: documento,
    forma: $('#pag-forma').value,
    retirada: document.querySelector('input[name="retirada"]:checked').value,
    // só id e quantidade: o servidor busca os preços no banco
    itens: estado.carrinho.map((i) => ({ id: i.produto.id, quantidade: i.quantidade }))
  };

  const botao = $('#btn-confirmar');
  botao.disabled = true;
  aviso.textContent = 'Processando pagamento...';

  try {
    const resp = await fetch('api/pedido.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    });
    const dados = await resp.json();
    if (!resp.ok || !dados.ok) throw new Error(dados.erro || 'Falha ao salvar o pedido.');
    mostrarConfirmacao(dados, corpo, tipo);
  } catch (erro) {
    aviso.textContent = erro.message;
    botao.disabled = false;
  }
}

$('#btn-confirmar').addEventListener('click', confirmarPagamento);

/* ---------- 6. confirmação ---------- */
function mostrarConfirmacao(dados, corpo, tipo) {
  $('#conf-numero').textContent = '#' + String(dados.id).padStart(4, '0');

  const docFormatado = aplicarMascara(corpo.documento, PADROES[tipo]);
  const linhas = [
    'Cliente: ' + corpo.nome,
    (tipo === 'cpf' ? 'CPF ' : 'CNPJ ') + docFormatado,
    'Data: ' + dados.dataHora,
    'Pagamento: ' + corpo.forma + ' · ' + moeda(dados.total),
    'Retirada: ' + corpo.retirada,
    'Status: Em preparo'
  ];
  $('#conf-detalhes').replaceChildren(...linhas.map((t) => criar('li', '', t)));

  estado.carrinho = [];
  mostrar('confirmacao');
  iniciarContagem();
}

function iniciarContagem() {
  let restante = 30;
  $('#conf-contagem').textContent = restante;
  clearInterval(estado.timerConfirmacao);
  estado.timerConfirmacao = setInterval(() => {
    restante--;
    $('#conf-contagem').textContent = restante;
    if (restante <= 0) mostrar('inicio');
  }, 1000);
}

$('#btn-novo').addEventListener('click', () => mostrar('inicio'));
