// const { ApolloServer } = require('apollo-server-express');
const apolloServerExpress = require('apollo-server-express');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const app = require('./app');
// const express = require('express');
// const app = express();


const server = new apolloServerExpress.ApolloServer({
	typeDefs,
	resolvers,
	uploads: {
		// Limits here should be stricter than config for surrounding
		// infrastructure such as Nginx so errors can be handled elegantly by
		// graphql-upload:
		// https://github.com/jaydenseric/graphql-upload#type-uploadoptions
		maxFileSize: 10000000, // 10 MB
		maxFiles: 20
	},
	playground: {
		settings: {
			'editor.cursorShape': 'line' // possible values: 'line', 'block', 'underline'
		}
	}
});

server.applyMiddleware({ app });

const port = process.env.PORT || 4000;
app.listen(port, error => {
	if (error) throw error

	// eslint-disable-next-line no-console
	console.info(
	  `Serving http://localhost:${port}`
	)
});