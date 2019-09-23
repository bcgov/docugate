require('dotenv').config({
    path: '.env.production',
});

const {ApolloServer, gql} = require('apollo-server');

const RocketChatAPI = require('./datasources/documize');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`      
    
  type SearchResult {
    id: String
    message: String
    author: String
    time: String
    roomId: String    
  } 

  # The "Query" type is the root of all GraphQL queries.
  type Query {    
    search( rooms: [String], searchString: String!): [SearchResult]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers = {
    Query: {
        search: (_, {searchString}, {dataSources}) => dataSources.rocketChatAPI.searchRooms({
            roomIds: process.env.ROCKETCHAT_ROOM_IDS.split(","),
            searchString: searchString
        })
    }
};

// Start ApolloServer by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        rocketChatAPI: new RocketChatAPI({
            baseURL: process.env.ROCKETCHAT_BASE_URL,
            authToken: process.env.ROCKETCHAT_AUTH_TOKEN,
            userId: process.env.ROCKETCHAT_USER_ID
        })
    })
});

// This `listen` method launches a web-server.
server.listen().then(({url}) => {
    console.log(`🚀  RocketGate Rocket.Chat GraphQL search gateway ready at ${url}`);
});