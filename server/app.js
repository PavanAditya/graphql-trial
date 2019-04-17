const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema');

const app = express();

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}));

app.listen(9000, () => {
    console.log('Server is running on port 9000..');
});