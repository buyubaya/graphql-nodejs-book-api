const AuthorList = require('../../mocks/Author');
const Author = require('../../models/Author');


const authorResolver = {
    Query: {
        author: (_, { id }) => {
            if(id){
                console.log('AUTHOR ID: ', id, _);
                const item = AuthorList.find(item => item._id === id);
                return [item];
            }
            
            return Author.find().then(data => data);
            return AuthorList;
        }
    }
};


module.exports = authorResolver;