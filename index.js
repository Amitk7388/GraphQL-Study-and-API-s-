const express = require("express")
const expressGraphQL = require("express-graphql")
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql")
const app = express()
const authors = [
    { id: 1, name: "J.K Rowling" },
    { id: 2, name: "J.R.R Tolkien" },
    { id: 3, name: "Barent Weeks" }
]
const books = [
    { id: 1, name: "Harry Potter and the chanmber of the secret", authorId: 1 },
    { id: 2, name: "Harry potter and the prisnior of Azkaban", authorId: 1 },
    { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
    { id: 4, name: "The Fellowship of the King", authorId: 2 },
    { id: 5, name: "The Two Towers", authorId: 2 },
    { id: 6, name: "The Returns of the King", authorId: 2 },
    { id: 7, name: "The way of the shadows", authorId: 3 },
    { id: 8, name: "Beyond of the shadows", authorId: 3 }
]
// This is about the BookType function which brings the list of all the data of the books 
//and this function will use in Root query to throw the all the data of the books
const BookType = new GraphQLObjectType({
    name: "Book",
    description: "List of all the books",
    fields: () => ({
        id : {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (books) => authors.find(author => author.id ===  books.id) 
        }
    })
})

//This is author data so whenenver we requiered author details from the author table 
// And also this author type is used to show all the author details according book author ids which is used in booktype functoion and also as AuthorType 
const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This is Author type and it will show all the author list according to the books author id",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
    })
})

// This is RootQuey function which will use to query of the data we have in database or the temprorily hard code data
//and also this funntion feilds we will ask on GraphQl Dev tools and to ask the perticular data which we have defind in the fields
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "This is Root Query Type",
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: "List of all the books",
            resolve: () => books
        },
        authors : {
            type : new GraphQLList(AuthorType),
            description: "List of all the Author details",
            resolve: () => authors
        }

    })
})

const Schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema: Schema,
    graphiql: true
}))

let PORT = 8483
app.listen(PORT, function () {
    console.log("PORT is working on ", PORT)
})