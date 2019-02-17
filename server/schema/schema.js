const graphql = require('graphql');
const _ = require('lodash');

const {GraphQLObjectType,GraphQLSchema,
       GraphQLString,GraphQLID,
       GraphQLInt, GraphQLList} = graphql;

// dummy data
var books = [
  {name:'Name of the Wind',genre:'Fantasy',id:'1',authorId:'1'},
  {name:'The Final Empire',genre:'Fantasy',id:'2',authorId:'2'},
  {name:'The Long Earth',genre:'Sci-Fi',id:'3',authorId:'3'},
  {name:'The Hero of Ages',genre:'Fantasy',id:'4',authorId:'2'},
  {name:'The Colour of Magic',genre:'Fantasy',id:'5',authorId:'3'},
  {name:'The Light Fantastic',genre:'Fantasy',id:'6',authorId:'3'}
];
var authors = [
  {name:'Patrick Rothfuss',age:44,id:'1'},
  {name:'Brandon Sanderson',age:42,id:'2'},
  {name:'Terry Pratchett',age:66,id:'3'}
];

// graphql data objects
const BookType = new GraphQLObjectType({
  name: 'Book',
  //fields is a function returning an object
  //to prevent the Catch 22 situation of referencing between
  //AuthorType and BookType when defined as an object
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args){
        console.log("3.",parent,args);
        return _.find(authors, {id:parent.authorId});
      }
    }
  })
});
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        console.log("5.",parent,args);
        return _.filter(books, {authorId:parent.id});
      }
    }
  })
});

// graphql query objects
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        // code to get data from db / other source
        console.log("1.",parent,args);
        let book = _.find(books, {id:args.id});
        console.log("4.",book);
        return book;
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        console.log("2.",parent,args);
        let author = _.find(authors, {id: args.id});
        console.log("6.",author);
        return author;
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        console.log("7.",parent,args);
        return books;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
