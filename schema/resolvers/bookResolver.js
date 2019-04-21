const Book = require('../../models/Book');
const Category = require('../../models/Category');
const Author = require('../../models/Author');
const Brand = require('../../models/Brand');
const BookController = require('../../controllers/BookController');
const BookList = require('../../mocks/Book');
const CategoryList = require('../../mocks/Category');
const AuthorList = require('../../mocks/Author');
const BrandList = require('../../mocks/Brand');


const bookResolver = {
    Query: {
        book: (_, { id, ...options }) => {           
            if(id){
                return BookController.getById(id)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {
                        _id: id,
                        name: 'ERROR'
                    };
                });
            }
            
            return BookController.getAll(options)
            .then(data => {
                return data;
            })
            .catch(err => {
                return [];
            });
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
        }
    },
    Book: {
        category: (parent, _) => {
            return Category.findById(parent.category)
            .then(data => data);
        },
        author: (parent, _) => {
            return Author.findById(parent.author)
            .then(data => data);
        },
        brand: (parent, _) => {
            return Brand.findById(parent.brand)
            .then(data => data);
        },
        relatedBook: (parent, { page: _page, limit: _limit }, aa, bb) => {
            let page = _page || 1;
            const limit = _limit || 10;
            
            return Book.find({
                _id: { $ne: parent._id },
                $or: [
                    { category: parent.category._id },
                    { author:  parent.author._id },
                    { brand:  parent.brand._id }
                ]
            })
            .then(data => {
                const list = data && data.slice((page - 1 ) * limit, page * limit);

                return({
                    list,
                    page,
                    limit,
                    count: data.length
                });
            });
               
            return BookController.getAll({
                ...options, 
                category: parent.category._id,
                _id: { $ne: parent._id }
            })
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return [];
                });
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