const path = require('path');
const { fileLoader, mergeResolvers } = require('merge-graphql-schemas');

const resolversArray = fileLoader(path.join(__dirname, './resolvers'), { extensions: ['.js'] });
const resolvers = mergeResolvers(resolversArray);

module.exports = resolvers;