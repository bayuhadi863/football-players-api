const express = require('express');
const playerRoutes = require('./playerRoutes');

const app = express();

// SWAGGER
const swaggerUi = require('swagger-ui-express');
const apiDocumentation = require('./apidocs.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

app.use(express.json());

app.use('/players', playerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server Listening on PORT:', PORT);
});
