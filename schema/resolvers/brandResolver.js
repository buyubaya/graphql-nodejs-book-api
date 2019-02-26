const BrandList = require('../../mocks/Brand');


const brandResolver = {
    Query: {
        author: (_, { id }) => {
            if(id){
                console.log('BRAND ID: ', id, _);
                const item = BrandList.find(item => item._id === id);
                return [item];
            }
            
            return BrandList;
        }
    }
};


module.exports = brandResolver;