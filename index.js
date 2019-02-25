const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const app = require('./app');


const server = new ApolloServer({
	typeDefs,
	resolvers,
	playground: {
		settings: {
			'editor.cursorShape': 'line' // possible values: 'line', 'block', 'underline'
		}
	}
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  	console.log(`🚀 Server ready at ${server.graphqlPath}`)
);