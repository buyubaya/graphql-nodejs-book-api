const Book = require('../../models/Book');
const BookList = require('../../mocks/Book');
const CategoryList = require('../../mocks/Category');
const AuthorList = require('../../mocks/Author');
const BrandList = require('../../mocks/Brand');


const bookResolver = {
    Query: {
        book: (_, { id, page }) => {
            if(id){
                const item = BookList.find(item => item._id === id);
                return item;
            }

            if(page){
                const limit = 2;
                const list = BookList.slice(limit * (page - 1), limit * page);
                return { list, count: 10 };
            }

            return {
                list: BookList, count: 10
            };
        }
    },
    BookQueryResponse: {
        __resolveType(obj, context, info){
            if(obj.list){
                return 'BookListResponse';
            }
      
            if(obj._id){
                return 'Book';
            }
      
            return null;
        },
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