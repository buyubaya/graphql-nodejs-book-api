const CategoryList = require('../../mocks/Category');
const Category = require('../../models/Category');


const categoryResolver = {
    Query: {
        category: (_, { id }) => {
            console.log('CATEGORY ID: ', id, _);
            if(id){
                console.log('CATEGORY ID: ', id, _);
                const item = CategoryList.find(item => item._id === id);
                return [item];
            }
            
            return Category.find().then(data => data);
            return CategoryList;
        }
    }
};


module.exports = categoryResolver;