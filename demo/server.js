const express = require('express');
const hppPrevent = require('hpp-prevent');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    hppPrevent.hppPrevent({
        takeLastOccurrences: true,
        deepSearch: true,
        blackList: ['__proto__', 'constructor'],
        returnBadRequestResponse: true,
        customInvalidParamMessage: 'Parâmetros inválidos.',
    })
);

app.get('/query', (req, res) => {
    res.json({ query: req.query });
});

app.post('/body', (req, res) => {
    console.log(req.body);
    res.json({ body: req.body });
});

app.get('/health', (req, res) => {
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`\n  Demo rodando em http://localhost:${PORT}\n`);
    console.log('  Rotas:');
    console.log(`    GET  http://localhost:${PORT}/query?name=João&name=Maria`);
    console.log(`    POST http://localhost:${PORT}/body (JSON body)`);
    console.log(`    GET  http://localhost:${PORT}/health\n`);
});
