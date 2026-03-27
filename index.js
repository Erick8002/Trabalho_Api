const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json());
app.set('json spaces', 2);

let filmes = [
    { id: 1, titulo: "O Poderoso Chefão", diretor: "Francis Ford Coppola", ano: 1972, genero: "Crime", nota: 9.2 },
    { id: 2, titulo: "Batman: O Cavaleiro das Trevas", diretor: "Christopher Nolan", ano: 2008, genero: "Ação", nota: 9.0 },
    { id: 3, titulo: "A Lista de Schindler", diretor: "Steven Spielberg", ano: 1993, genero: "Biografia", nota: 9.0 },
    { id: 4, titulo: "Pulp Fiction", diretor: " ", ano: 1994, genero: "Crime", nota: 8.9 },
    { id: 5, titulo: "O Senhor dos Anéis: O Retorno do Rei", diretor: "Peter Jackson", ano: 2003, genero: "Aventura", nota: 9.0 },
    { id: 6, titulo: "Clube da Luta", diretor: "David Fincher", ano: 1999, genero: "Drama", nota: 8.8 },
    { id: 7, titulo: "A Origem", diretor: "Christopher Nolan", ano: 2010, genero: "Ficção Científica", nota: 8.8 },
    { id: 8, titulo: "Matrix", diretor: "Lana e Lilly Wachowski", ano: 1999, genero: "Ficção Científica", nota: 8.7 },
    { id: 9, titulo: "Interestelar", diretor: "Christopher Nolan", ano: 2014, genero: "Ficção Científica", nota: 8.7 },
    { id: 10, titulo: "Cidade de Deus", diretor: "Fernando Meirelles", ano: 2002, genero: "Crime", nota: 8.6 }
];

let proxId = 11;

app.get('/', (req, res) => {
    res.json({
        mensagem: 'Manipulação de filmes',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

app.get('/info', (req, res) => {
    res.json({
        nome: 'Api de Filmes',
        versao: '1.0.0',
        autor: 'Erick Shinji'
    });
});

app.get('/filmes', (req, res) => {
    let { 
        pagina = 1, 
        limite = 10, 
        titulo, 
        genero, 
        diretor, 
        min_nota, 
        max_nota, 
        ordem = 'asc'
    } = req.query;

    let resultados = [...filmes];

    if (titulo) resultados = resultados.filter(f => f.titulo.toLowerCase().includes(titulo.toLowerCase()));
    if (genero) resultados = resultados.filter(f => f.genero.toLowerCase() === genero.toLowerCase());
    if (diretor) resultados = resultados.filter(f => f.diretor.toLowerCase().includes(diretor.toLowerCase()));
    if (min_nota) resultados = resultados.filter(f => f.nota >= parseFloat(min_nota));
    if (max_nota) resultados = resultados.filter(f => f.nota <= parseFloat(max_nota));

    resultados.sort((a, b) => {
        const o = ordem.toLowerCase();
        if (o === 'desc' || o === 'decrescente') {
            return b.id - a.id; 
        } else {
            return a.id - b.id; 
        }
    });

    const paginaNum = Math.max(1, parseInt(pagina) || 1);
    const limiteNum = Math.max(1, parseInt(limite) || 10);
    const inicio = (paginaNum - 1) * limiteNum;
    const fim = inicio + limiteNum;
    
    const paginado = resultados.slice(inicio, fim);
    
    res.json({
        dados: paginado,
        paginacao: {
            pagina_atual: paginaNum,
            total_itens: resultados.length,
            total_paginas: Math.ceil(resultados.length / limiteNum)
        }
    });
});

app.get('/filmes/id/:id', (req, res) => {   
    const id = parseInt(req.params.id);
    const filme = filmes.find(f => f.id === id);
    if (filme) {
        res.json(filme);
    } else {
        res.status(404).json({ mensagem: 'Filme não encontrado' });
    }
});

// POST (Mantido com validações)
app.post('/filmes', (req, res) => {
    const { titulo, diretor, ano, genero, nota } = req.body;

    if (!titulo || !diretor || !ano || !genero || !nota) {
        return res.status(400).json({ erro: "Todos os campos (titulo, diretor, ano, genero, nota) são obrigatórios!" });
    }

    if (typeof ano !== 'number' || typeof nota !== 'number') {
        return res.status(400).json({ erro: "Ano e Nota devem ser números!" });
    }

    const novoFilme = { id: proxId++, titulo, diretor, ano, genero, nota };
    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
}); 


// PUT /api/produtos/:id - Atualizar produto
app.put('/api/produtos/:id', (req, res) => {
    // 1. Pegar ID da URL
    const id = parseInt(req.params.id);
    
    // 2. Buscar produto no array
    const produto = produtos.find(p => p.id === id);
    
    // 3. Verificar se existe
    if (!produto) {
        return res.status(404).json({ 
            erro: "Produto não encontrado" 
        });
    }
    
    // 4. Extrair dados do body
    const { nome, preco, categoria } = req.body;
    
    // 5. VALIDAÇÕES (igual ao POST!)
    if (!nome || !preco || !categoria) {
        return res.status(400).json({
            erro: "Campos obrigatórios: nome, preco, categoria"
        });
    }
    
    if (typeof preco !== 'number' || preco <= 0) {
        return res.status(400).json({
            erro: "Preço deve ser um número positivo"
        });
    }
    
    // 6. Atualizar campos do produto
    produto.nome = nome;
    produto.preco = preco;
    produto.categoria = categoria;
    
    // 7. Retornar produto atualizado com 200 OK
    res.json(produto);
});