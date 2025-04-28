document.addEventListener('DOMContentLoaded', function() {
    // Dados dos lanches
    const lanches = [
        { id: 1, nome: "Hamburguer", ingredientes: ["Pão", "Carne", "Queijo", "Alface", "Tomate"], preco: 15.00 },
        { id: 2, nome: "X-Burguer", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate"], preco: 18.00 },
        { id: 3, nome: "X-Salada", ingredientes: ["Pão", "Carne", "Queijo", "Alface", "Tomate", "Cebola"], preco: 20.00 },
        { id: 4, nome: "X-Bacon", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate"], preco: 25.00 },
        { id: 5, nome: "X-Egg", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate", "Ovo"], preco: 30.00 },
        { id: 6, nome: "X-Tudo", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate", "Ovo", "Cebola"], preco: 35.00 }
    ];

    // Elementos do DOM
    const lancheSelect = document.getElementById('lancheSelect');
    const pedidoForm = document.getElementById('pedidoForm');
    const pedidosExecucao = document.getElementById('pedidosExecucao');
    const pedidosEntrega = document.getElementById('pedidosEntrega');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');

    // Carregar lanches no select
    function carregarLanches() {
        lanches.forEach(lanche => {
            const option = document.createElement('option');
            option.value = lanche.id;
            option.textContent = `${lanche.nome} - R$ ${lanche.preco.toFixed(2)}`;
            lancheSelect.appendChild(option);
        });
    }

    // Carregar pedidos do localStorage
    function carregarPedidos() {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || { execucao: [], entrega: [] };
        
        pedidosExecucao.innerHTML = '';
        pedidosEntrega.innerHTML = '';
        
        pedidos.execucao.forEach(pedido => criarCardPedido(pedido, 'execucao'));
        pedidos.entrega.forEach(pedido => criarCardPedido(pedido, 'entrega'));
    }

    // Criar card de pedido
    function criarCardPedido(pedido, status) {
        const card = document.createElement('div');
        card.className = 'pedido-card';
        card.dataset.id = pedido.id;
        
        const lanche = lanches.find(l => l.id == pedido.lancheId);
        
        card.innerHTML = `
            <h3>${pedido.clienteNome}</h3>
            <p><strong>Lanche:</strong> ${lanche.nome}</p>
            <p><strong>Endereço:</strong> ${pedido.clienteEndereco}</p>
            <p><strong>Telefone:</strong> ${pedido.clienteTelefone}</p>
            <p><strong>Data/Hora:</strong> ${new Date(pedido.dataHora).toLocaleString()}</p>
            <div class="pedido-actions">
                <button class="details-btn" title="Ver detalhes"><i class="fas fa-eye"></i></button>
                ${status === 'execucao' ? 
                    `<button class="next-btn" title="Mover para entrega"><i class="fas fa-arrow-right"></i></button>` : 
                    `<button class="done-btn" title="Finalizar pedido"><i class="fas fa-check"></i></button>`}
            </div>
        `;
        
        if (status === 'execucao') {
            pedidosExecucao.appendChild(card);
        } else {
            pedidosEntrega.appendChild(card);
        }
        
        // Adicionar eventos aos botões
        card.querySelector('.details-btn').addEventListener('click', () => mostrarDetalhesPedido(pedido, lanche));
        
        if (status === 'execucao') {
            card.querySelector('.next-btn').addEventListener('click', () => moverParaEntrega(pedido.id));
        } else {
            card.querySelector('.done-btn').addEventListener('click', () => finalizarPedido(pedido.id));
        }
    }

    // Mostrar detalhes do pedido no modal
    function mostrarDetalhesPedido(pedido, lanche) {
        modalContent.innerHTML = `
            <p><strong>Cliente:</strong> ${pedido.clienteNome}</p>
            <p><strong>Telefone:</strong> ${pedido.clienteTelefone}</p>
            <p><strong>Endereço:</strong> ${pedido.clienteEndereco}</p>
            <p><strong>Data/Hora:</strong> ${new Date(pedido.dataHora).toLocaleString()}</p>
            <p><strong>Lanche:</strong> ${lanche.nome} - R$ ${lanche.preco.toFixed(2)}</p>
            <p><strong>Ingredientes:</strong> ${lanche.ingredientes.join(', ')}</p>
        `;
        modal.style.display = 'block';
    }

    // Mover pedido para entrega
    function moverParaEntrega(pedidoId) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || { execucao: [], entrega: [] };
        const pedidoIndex = pedidos.execucao.findIndex(p => p.id == pedidoId);
        
        if (pedidoIndex !== -1) {
            const pedido = pedidos.execucao[pedidoIndex];
            pedidos.execucao.splice(pedidoIndex, 1);
            pedidos.entrega.push(pedido);
            
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            carregarPedidos();
        }
    }

    // Finalizar pedido (mover para concluídos)
    function finalizarPedido(pedidoId) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || { execucao: [], entrega: [] };
        const concluidos = JSON.parse(localStorage.getItem('pedidosConcluidos')) || [];
        const pedidoIndex = pedidos.entrega.findIndex(p => p.id == pedidoId);
        
        if (pedidoIndex !== -1) {
            const pedido = pedidos.entrega[pedidoIndex];
            pedidos.entrega.splice(pedidoIndex, 1);
            concluidos.push(pedido);
            
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            localStorage.setItem('pedidosConcluidos', JSON.stringify(concluidos));
            carregarPedidos();
        }
    }

    // Gerar ID único para o pedido
    function gerarId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Evento de submit do formulário
    pedidoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clienteNome = document.getElementById('clienteNome').value;
        const clienteEndereco = document.getElementById('clienteEndereco').value;
        const clienteTelefone = document.getElementById('clienteTelefone').value;
        const lancheId = document.getElementById('lancheSelect').value;
        
        if (!clienteNome || !clienteEndereco || !clienteTelefone || !lancheId) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        
        const novoPedido = {
            id: gerarId(),
            clienteNome,
            clienteEndereco,
            clienteTelefone,
            lancheId: parseInt(lancheId),
            dataHora: new Date().toISOString()
        };
        
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || { execucao: [], entrega: [] };
        pedidos.execucao.push(novoPedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        
        carregarPedidos();
        pedidoForm.reset();
    });

    // Fechar modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Inicializar
    carregarLanches();
    carregarPedidos();
});