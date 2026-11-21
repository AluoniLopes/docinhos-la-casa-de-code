// --- 1. CARROSSEL SIMPLES DE DESTAQUES ---
let destaques = [
    {
        titulo: "Enroladinho de Python",
        descricao: "Rico em açúcar e indentação perfeita para suas tardes de estudo."
    },
    {
        titulo: "Brownie Full-Stack",
        descricao: "Camadas completas de chocolate meio amargo do front ao back-end."
    },
    {
        titulo: "Bolo de Pote Deploy",
        descricao: "Pronto para produção direto na sua mesa com Ninho e morango."
    }
];

let indiceDestaque = 0;

function mudarDestaque(direcao) {
    indiceDestaque = indiceDestaque + direcao;

    if (indiceDestaque >= destaques.length) {
        indiceDestaque = 0;
    }
    if (indiceDestaque < 0) {
        indiceDestaque = destaques.length - 1;
    }

    document.getElementById("titulo-destaque").innerText = destaques[indiceDestaque].titulo;
    document.getElementById("desc-destaque").innerText = destaques[indiceDestaque].descricao;
}

//2. CONTROLE DO CARRINHO E FRETE 
let carrinho = [];
let valorFrete = 0;
let pedidos = [];
let numeroPedido = 101;

function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome: nome, preco: preco });
    atualizarCarrinho();
}

function removerDoCarrinho(posicao) {
    carrinho.splice(posicao, 1);
    atualizarCarrinho();
}

function calcularFrete() {
    let cep = document.getElementById("cep-cliente").value;

    if (cep.length < 8) {
        alert("Digite um CEP válido com 8 números.");
        return;
    }

    // Simulação simples de frete fixo para entrega local
    valorFrete = 7.50;
    document.getElementById("info-frete").innerText = "Entrega padrão calculada: R$ 7,50 (30 a 45 min)";
    atualizarCarrinho();
}

function atualizarCarrinho() {
    let listaHTML = document.getElementById("lista-carrinho");
    let qtdSpan = document.getElementById("qtd-carrinho");
    let subtotalSpan = document.getElementById("valor-subtotal");
    let freteSpan = document.getElementById("valor-frete");
    let totalSpan = document.getElementById("valor-total");

    qtdSpan.innerText = carrinho.length;
    listaHTML.innerHTML = "";

    let subtotal = 0;

    if (carrinho.length === 0) {
        listaHTML.innerHTML = "<li>Seu carrinho está vazio.</li>";
    } else {
        for (let i = 0; i < carrinho.length; i++) {
            subtotal = subtotal + carrinho[i].preco;
            listaHTML.innerHTML +=
                "<li>" +
                    "<span>" + carrinho[i].nome + " - R$ " + carrinho[i].preco.toFixed(2) + "</span>" +
                    "<button type='button' onclick='removerDoCarrinho(" + i + ")' style='background:#888; padding:4px 10px; font-size:0.8rem;'>Remover</button>" +
                "</li>";
        }
    }

    let totalGeral = subtotal + (carrinho.length > 0 ? valorFrete : 0);

    subtotalSpan.innerText = subtotal.toFixed(2);
    freteSpan.innerText = (carrinho.length > 0 ? valorFrete : 0).toFixed(2);
    totalSpan.innerText = totalGeral.toFixed(2);
}

// --- 3. FINALIZAR, ACOMPANHAR E CANCELAR PEDIDOS ---
function finalizarPedido() {
    let nome = document.getElementById("nome-cliente").value;
    let endereco = document.getElementById("endereco-cliente").value;
    let pagamento = document.getElementById("forma-pagamento").value;

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (nome === "" || endereco === "") {
        alert("Por favor, preencha seu nome e endereço de entrega.");
        return;
    }

    let subtotal = 0;
    let listaNomes = [];

    for (let i = 0; i < carrinho.length; i++) {
        subtotal = subtotal + carrinho[i].preco;
        listaNomes.push(carrinho[i].nome);
    }

    let totalFinal = subtotal + valorFrete;

    let novoPedido = {
        id: numeroPedido,
        cliente: nome,
        endereco: endereco,
        pagamento: pagamento,
        itens: listaNomes.join(", "),
        total: totalFinal.toFixed(2),
        status: "Recebido",
        horaCriacao: new Date() // Guarda o horário exato do pedido
    };

    pedidos.push(novoPedido);
    numeroPedido++;

    // Limpa carrinho e campos
    carrinho = [];
    valorFrete = 0;
    document.getElementById("nome-cliente").value = "";
    document.getElementById("endereco-cliente").value = "";
    document.getElementById("cep-cliente").value = "";
    document.getElementById("info-frete").innerText = "Frete ainda não calculado.";

    atualizarCarrinho();
    atualizarPedidos();

    // Simula mudança automática de status para "Em Produção" após 5 segundos
    setTimeout(function() {
        if (novoPedido.status === "Recebido") {
            novoPedido.status = "Em Produção";
            atualizarPedidos();
        }
    }, 5000);

    alert("Pedido #" + novoPedido.id + " confirmado! Acompanhe na seção 'Meus Pedidos'.");
}

function cancelarPedido(idPedido) {
    let agora = new Date();

    for (let i = 0; i < pedidos.length; i++) {
        if (pedidos[i].id === idPedido) {
            // Calcula a diferença em minutos desde a compra
            let diferencaMs = agora - pedidos[i].horaCriacao;
            let minutosPassados = diferencaMs / 60000;

            if (minutosPassados <= 10) {
                pedidos[i].status = "Cancelado";
                alert("Pedido #" + idPedido + " foi cancelado com sucesso.");
            } else {
                alert("O prazo de 10 minutos para cancelamento já expirou.");
            }
        }
    }

    atualizarPedidos();
}

function atualizarPedidos() {
    let container = document.getElementById("lista-pedidos");
    container.innerHTML = "";

    if (pedidos.length === 0) {
        container.innerHTML = "<p>Nenhum pedido realizado até o momento.</p>";
        return;
    }

    for (let i = 0; i < pedidos.length; i++) {
        let p = pedidos[i];
        let classeCancelado = p.status === "Cancelado" ? "cancelado" : "";
        let botaoCancelar = "";

        if (p.status !== "Cancelado") {
            botaoCancelar = "<br><button type='button' class='btn-cancelar' onclick='cancelarPedido(" + p.id + ")'>Cancelar Pedido</button>";
        }

        container.innerHTML +=
            "<div class='card-pedido " + classeCancelado + "'>" +
                "<strong>Pedido #" + p.id + "</strong> — <span class='status-badge'>" + p.status + "</span><br>" +
                "<strong>Cliente:</strong> " + p.cliente + " | <strong>Pagamento:</strong> " + p.pagamento + "<br>" +
                "<strong>Entrega:</strong> " + p.endereco + "<br>" +
                "<strong>Itens:</strong> " + p.itens + "<br>" +
                "<strong>Total:</strong> R$ " + p.total +
                botaoCancelar +
            "</div>";
    }
}