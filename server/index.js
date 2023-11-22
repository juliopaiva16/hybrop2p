import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';

// cria aplicação express
var app = express();

// configura a aplicação para usar o body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configura a aplicação para usar o express.static
app.use(express.static('public'));

// configura a aplicação para usar o módulo routes
app.use(routes);

// inicia o servidor
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// exporta a aplicação
export default app;