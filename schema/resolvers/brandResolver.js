const BrandList = require('../../mocks/Brand');
const Brand = require('../../models/Brand');


const brandResolver = {
    Query: {
        brand: (_, { id }) => {
            if(id){
                console.log('BRAND ID: ', id, _);
                const item = BrandList.find(item => item._id === id);
                return [item];
            }
            
            return Brand.find().then(data => data);
            return BrandList;
        }
    }
};


module.exports = brandResolver;