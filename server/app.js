const express = require('express');
const graphqlHTTP = require('express-graphql'); // not a package but a convention for express-graphql
const schema = require('./schema/schema');
const config = require('./config/config');
const mongoose = require('mongoose');

const app = express();

//connect to mongoDB.Atlas database
const {mongoDB: {username,password,cluster,dbname}} = config;
mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true`, {useNewUrlParser: true});
mongoose.connection.once('open', () => {
  console.log('connected to mongoDB');
})

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql:true
}));

app.listen(4000, () => {
  console.log("Now listening for requests on the port 4000");
});
