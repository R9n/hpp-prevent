# hpp-prevent

[![codecov](https://codecov.io/gh/R9n/hpp-prevent/branch/main/graph/badge.svg?token=6I00XDYH40)](https://codecov.io/gh/R9n/hpp-prevent)
[![npm version](https://img.shields.io/npm/v/hpp-prevent.svg)](https://www.npmjs.com/package/hpp-prevent)
[![dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://www.npmjs.com/package/hpp-prevent)

Middleware Express para mitigar **HTTP Parameter Pollution (HPP)** e reforçar a sanitização de `query` e `body`.

---

## O que é HTTP Parameter Pollution (HPP)?

Em um ataque HPP, o atacante repete parâmetros com o mesmo nome na URL ou no corpo da requisição. Em Express, isso pode resultar em valores em array ou sobrescrita de parâmetros, levando a comportamento inesperado ou bypass de validações.

**Exemplo:**  
URL esperada: `?name=João&lastname=Silva`  
URL poluída: `?name=João&lastname=Silva&name=Maria&lastname=Outro`

Sem proteção, `req.query` pode ficar assim:

```js
{ name: ['João', 'Maria'], lastname: ['Silva', 'Outro'] }
```

Com **hpp-prevent** você controla se fica o primeiro ou o último valor e ainda remove chaves/valores perigosos (ex.: `__proto__`, `constructor`), reduzindo também risco de **prototype pollution**.

- [OWASP – Testing for HTTP Parameter Pollution](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/04-Testing_for_HTTP_Parameter_Pollution)

---

## Instalação

```bash
npm install hpp-prevent
```

---

## Uso básico

**Importante:** use os parsers de corpo **antes** do middleware (ex.: `express.json()`, `express.urlencoded()`).

```js
const express = require('express');
const hppPrevent = require('hpp-prevent');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hppPrevent.hppPrevent());

// Ou com opções por middleware
app.use(hppPrevent.hppPrevent({
  takeLastOccurrences: true,
  deepSearch: true,
  whiteList: ['friends', 'tags'],
}));
```

### Apenas em rotas específicas

```js
app.get('/rota', hppPrevent.hppPrevent(), (req, res) => {
  res.json(req.query);
});

app.post('/rota', hppPrevent.hppPrevent({ whiteList: ['ids'] }), (req, res) => {
  res.json(req.body);
});
```

---

## Opções do middleware

Todas são opcionais. Valores padrão vêm de `initial-parameters.js`.

| Opção | Tipo | Descrição |
|-------|------|-----------|
| `takeLastOccurrences` | `boolean` | `true` = usa a **última** ocorrência de parâmetro duplicado; `false` = usa a **primeira**. Padrão: `true`. |
| `blackList` | `string[]` | Termos proibidos em chave ou valor. Se encontrados, o parâmetro é removido (ou retorna 400, conforme `returnBadRequestResponse`). Padrão: `['__proto__', 'constructor']`. |
| `whiteList` | `string[]` | Parâmetros que **podem** permanecer como array (múltiplos valores). Padrão: `[]`. |
| `returnBadRequestResponse` | `boolean` | Se `true`, retorna **400** quando algum termo da blacklist for encontrado. Se `false`, apenas remove o parâmetro e segue. Padrão: `false`. |
| `customInvalidParamMessage` | `string` | Mensagem enviada no corpo da resposta 400 quando `returnBadRequestResponse` é `true`. |
| `canIgnoreBodyParse` | `boolean` | Se `true`, **não** sanitiza o `body` (só query). Útil para manter body intacto em rotas específicas. Padrão: `false`. |
| `deepSearch` | `boolean` | Se `true`, faz busca profunda (achata objetos aninhados) em `query` e `body`. Aumenta uso de CPU em payloads grandes; recomenda-se limitar tamanho do body. Padrão: `false`. |

---

## API global (configuração legada)

Ainda é possível configurar comportamento global e usar o middleware sem opções:

```js
hppPrevent.config({
  takeLastOccurrences: false,
  blackList: ['__proto__', 'constructor', 'select'],
  whiteList: ['tags'],
  returnBadRequestResponse: true,
  customInvalidParamMessage: 'Parâmetros inválidos.',
  canIgnoreBodyParse: false,
  deepSearch: true,
});

app.use(hppPrevent.hppPrevent);
```

- **`getCurrentConfig()`** – retorna a configuração global atual.
- **`resetConfig()`** – restaura a configuração padrão (valores de `initial-parameters.js`).

> **Depreciação:** a partir da v2, prefira passar as opções diretamente em `hppPrevent.hppPrevent({ ... })`.

---

## Uso de `parseParams` fora do middleware

Para sanitizar um objeto manualmente (ex.: em um handler):

```js
const { parseParams } = require('hpp-prevent');

const result = parseParams(
  objectParams,           // objeto (ex.: req.query ou req.body)
  isLastParams,           // true = última ocorrência; false = primeira
  forbiddenTerms,         // array de termos proibidos
  expectedParamsToBeArray // array de chaves que podem permanecer como array
);

// result = { sanitizedParams, forbiddenParametersFound }
```

---

## Exemplo completo

```js
const express = require('express');
const hppPrevent = require('hpp-prevent');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(hppPrevent.hppPrevent({
  takeLastOccurrences: true,
  deepSearch: true,
  whiteList: ['friends', 'tags'],
  blackList: ['__proto__', 'constructor'],
  returnBadRequestResponse: true,
  customInvalidParamMessage: 'Parâmetros inválidos.',
}));

app.post('/api/data', (req, res) => {
  res.send(req.body);
});
```

---

## Performance

Com `deepSearch` habilitado, o custo por requisição permanece baixo (na ordem de décimos de ms em cenários típicos). Em APIs com payloads grandes, recomenda-se limitar o tamanho do body (ex.: `express.json({ limit: '10kb' })`).

---

## Licença

[LICENSE](LICENSE)

---

## Autor

**Ronaldo** – [GitHub](https://github.com/R9n) · [LinkedIn](https://www.linkedin.com/in/ronaldo-mp)
