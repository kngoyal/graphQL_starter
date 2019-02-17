const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {GraphQLObjectType,GraphQLSchema,
       GraphQLString,GraphQLID,
       GraphQLInt, GraphQLList,
       GraphQLNonNull} = graphql;

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
        //return _.find(authors, {id:parent.authorId});
        return Author.findById(parent.authorId);
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
        //return _.filter(books, {authorId:parent.id});
        return Book.find({authorId:parent.id});
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
        //let book = _.find(books, {id:args.id});
        console.log("4.",book);
        //return book;
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        console.log("2.",parent,args);
        //let author = _.find(authors, {id: args.id});
        console.log("6.",author);
        //return author;
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        console.log("7.",parent,args);
        //return books;
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        console.log("8.",parent,args);
        //return authors;
        return Author.find({});
      }
    }
  }
});
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
