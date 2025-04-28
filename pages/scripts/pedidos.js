document.addEventListener('DOMContentLoaded', function() {
    const pedidosConcluidos = document.querySelector('#pedidosConcluidos tbody');
    
    // Dados dos lanches (mesmo do home.js)
    const lanches = [
        { id: 1, nome: "Hamburguer", ingredientes: ["Pão", "Carne", "Queijo", "Alface", "Tomate"], preco: 15.00 },
        { id: 2, nome: "X-Burguer", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate"], preco: 18.00 },
        { id: 3, nome: "X-Salada", ingredientes: ["Pão", "Carne", "Queijo", "Alface", "Tomate", "Cebola"], preco: 20.00 },
        { id: 4, nome: "X-Bacon", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate"], preco: 25.00 },
        { id: 5, nome: "X-Egg", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate", "Ovo"], preco: 30.00 },
        { id: 6, nome: "X-Tudo", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate", "Ovo", "Cebola"], preco: 35.00 }
    ];

    // Carregar pedidos concluídos
    function carregarPedidosConcluidos() {
        const concluidos = JSON.parse(localStorage.getItem('pedidosConcluidos')) || [];
        pedidosConcluidos.innerHTML = '';
        
        concluidos.forEach(pedido => {
            const lanche = lanches.find(l => l.id == pedido.lancheId);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${new Date(pedido.dataHora).toLocaleString()}</td>
                <td>${pedido.clienteNome}</td>
                <td>${lanche.nome}</td>
                <td>${pedido.clienteEndereco}</td>
                <td>${pedido.clienteTelefone}</td>
            `;
            
            pedidosConcluidos.appendChild(row);
        });
    }

    // Inicializar
    carregarPedidosConcluidos();
});