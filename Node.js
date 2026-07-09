const express = require('express');
const app = express();
const session = require('express-session');
app.use(session({
    secret: 'seu-segredo',
    resave: false,
    saveUninitialized: true
}));
function verificarAutenticacao(req, res, next) {
    if (req.session.usuario) {
        next(); // Usuário autenticado, continua
    } else {
        res.redirect('/login'); // Redireciona para a página de login
    }
}
app.get('/pagina-protegida', verificarAutenticacao, (req, res) => {
    res.send('Conteúdo protegido');
});
app.get('/login', (req, res) => {
    res.send('Página de login');
});
app.post('/login', (req, res) => {
    // Lógica de autenticação aqui
    req.session.usuario = { id: 1 }; // Simula login
    res.redirect('/pagina-protegida');
});
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});