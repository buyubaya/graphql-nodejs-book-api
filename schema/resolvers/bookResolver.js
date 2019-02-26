const Book = require('../../models/Book');
const BookList = require('../../mocks/Book');
const CategoryList = require('../../mocks/Category');
const AuthorList = require('../../mocks/Author');
const BrandList = require('../../mocks/Brand');


const bookResolver = {
    Query: {
        book: (_, { id }) => {
            if(id){
                console.log('BOOK ID: ', id, _);
                const item = BookList.find(item => item._id === id);
                return [item];
            }

            return BookList;
        }
    },
    Book: {
        category: (parent, _) => {
            const item = CategoryList.find(item => item._id === parent.category)
            return item;
        },
        author: (parent, _) => {
            const item = AuthorList.find(item => item._id === parent.author)
            return item;
        },
        brand: (parent, _) => {
            const item = BrandList.find(item => item._id === parent.brand)
            return item;
        }
    },
    Mutation: {
        addBook: (_, { data }) => {
            console.log('ADD BOOK', data);
            return {
                status: 200,
                message: 'Successful',
                data: JSON.stringify(data)
            };
        }
    }
};


module.exports = bookResolver;