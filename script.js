const botoesAdicionar = document.querySelectorAll(".botao-adicionar");
const listaPedido = document.getElementById("lista-pedido");
const valorTotal = document.getElementById("valor-total");
const botaoEnviarWhatsapp = document.getElementById("enviar-whatsapp");

const nomeCliente = document.getElementById("nome-cliente");
const observacoes = document.getElementById("observacoes");

let pedido = [];

function adicionarProduto(produto) {
    const nome = produto.dataset.nome;
    const preco = Number(produto.dataset.preco);

    const produtoExistente = pedido.find((item) => item.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        pedido.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarPedido();
}

function removerProduto(nomeProduto) {
    const produto = pedido.find((item) => item.nome === nomeProduto);

    if (!produto) {
        return;
    }

    produto.quantidade--;

    if (produto.quantidade <= 0) {
        pedido = pedido.filter((item) => item.nome !== nomeProduto);
    }

    atualizarPedido();
}

function atualizarPedido() {
    listaPedido.innerHTML = "";

    if (pedido.length === 0) {
        listaPedido.innerHTML = "<p>Nenhum produto adicionado ao pedido.</p>";
        valorTotal.textContent = "0,00";
        return;
    }

    let total = 0;

    pedido.forEach((item) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const itemPedido = document.createElement("div");

        itemPedido.innerHTML = `
      <p>
        <strong>${item.nome}</strong><br>
        Quantidade: ${item.quantidade}<br>
        Preço unitário: R$ ${formatarPreco(item.preco)}<br>
        Subtotal: R$ ${formatarPreco(subtotal)}
      </p>

      <button type="button" onclick="removerProduto('${item.nome}')">
        Remover
      </button>
    `;

        listaPedido.appendChild(itemPedido);
    });

    valorTotal.textContent = formatarPreco(total);
}

function calcularTotal() {
    return pedido.reduce((total, item) => {
        return total + item.preco * item.quantidade;
    }, 0);
}

function formatarPreco(valor) {
    return valor.toFixed(2).replace(".", ",");
}

function gerarMensagemWhatsapp() {
    let mensagem = "Olá, BN Massas! Gostaria de fazer um pedido:%0A%0A";

    if (nomeCliente.value.trim() !== "") {
        mensagem += `Nome: ${nomeCliente.value.trim()}%0A%0A`;
    }

    mensagem += "Pedido:%0A";

    pedido.forEach((item) => {
        const subtotal = item.preco * item.quantidade;

        mensagem += `- ${item.quantidade}x ${item.nome} - R$ ${formatarPreco(subtotal)}%0A`;
    });

    mensagem += `%0ATotal: R$ ${formatarPreco(calcularTotal())}`;

    if (observacoes.value.trim() !== "") {
        mensagem += `%0A%0AObservações:%0A${observacoes.value.trim()}`;
    }

    return mensagem;
}

function enviarPedidoWhatsapp() {
    if (pedido.length === 0) {
        alert("Adicione pelo menos um produto ao pedido.");
        return;
    }

    const numeroWhatsapp = "558481737412";
    const mensagem = gerarMensagemWhatsapp();

    const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${mensagem}`;

    window.open(linkWhatsapp, "_blank");
}

botoesAdicionar.forEach((botao) => {
    botao.addEventListener("click", () => {
        const produto = botao.closest(".produto");
        adicionarProduto(produto);
    });
});

botaoEnviarWhatsapp.addEventListener("click", enviarPedidoWhatsapp);

atualizarPedido();