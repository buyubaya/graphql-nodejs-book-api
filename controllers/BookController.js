const mongoose = require('mongoose');
const Book = require('../models/Book');
const Category = require('../models/Category');
// FIREBASE & GOOGLE CLOUD
const GCS = require('../functions/GCS');
const uploadFile = GCS.uploadFile;
const deleteFile = GCS.deleteFile;
// HELPER
const helper = require('../functions/helper');
const findRelativeChildren = helper.findRelativeChildren;


exports.getById = (id) => {
    return Book.findById(id)
    .exec();
};

exports.getAll = async (options) => {    
    // PAGINATION
    let page = options.page ? options.page * 1 : 1;
    if(page < 1){
        page = 1;
    }
    const limit = options.limit ? options.limit * 1 : 10;
    // SORT
    let sortOption = {};
    if(options.sort){
        const sort = options.sort;
        if(sort === 'latest'){
            sortOption['createdAt'] = -1;
        }
        if(sort === 'oldest'){
            sortOption['createdAt'] = 1;
        }
        if(sort === 'a-z'){
            sortOption['name'] = 1;
        }
        if(sort === 'z-a'){
            sortOption['name'] = -1;
        }
        if(sort === 'price-asc'){
            sortOption['price'] = 1;
        }
        if(sort === 'price-desc'){
            sortOption['price'] = -1;
        }
    }
    // SEARCH CATEGORY
    let searchOption = {};
    if(options.category){
        const cateList = await Category.find().exec();
        const cateOptions = findRelativeChildren(cateList, options.category);
        searchOption['category'] = { $in: cateOptions };
    }
    // SEARCH AUTHOR
    if(options.author){
        searchOption['author'] = options.author;
    }
    // SEARCH BRAND
    if(options.brand){
        searchOption['brand'] = options.brand;
    }
    // SEARCH NAME
    if(options.search){
        let search = options.search.toLowerCase();
        search = search.replace('a', '(a|á|à|ả|ã|ạ|ă|â)');
        search = search.replace('ă', '(ă|ắ|ằ|ẳ|ẵ|ặ)');
        search = search.replace('â', '(â|ấ|ầ|ẩ|ẫ|ậ)');
        search = search.replace('e', '(e|é|è|ẻ|ẽ|ẹ|ê)');
        search = search.replace('ê', '(ê|ế|ề|ể|ễ|ệ)');
        search = search.replace('u', '(u|ú|ù|ủ|ũ|ụ|ư)');
        search = search.replace('ư', '(ư|ứ|ừ|ử|ữ|ự)');
        search = search.replace('i', '(i|í|ì|ỉ|ĩ|ị)');
        search = search.replace('o', '(o|ó|ò|ỏ|õ|ọ|ơ|ô)');
        search = search.replace('ơ', '(ơ|ớ|ờ|ở|ỡ|ợ)');
        search = search.replace('ô', '(ô|ố|ồ|ổ|ỗ|ộ)');
        const searchRegex = new RegExp(search, 'i');
        searchOption['name'] = searchRegex;
    }

    // const bookQuery = Book.find(searchOption)
    //     .sort(sortOption)
    //     .populate('category', '_id name')
    //     .populate('author', '_id name')
    //     .populate('brand', '_id name');
    return Book.find(searchOption)
        .sort(sortOption)
        .populate('category', '_id name')
        .populate('author', '_id name')
        .populate('brand', '_id name')
        // .limit(limit)
        // .skip(limit * (page - 1))
        .exec()
        .then(doc => {
            const totalPage = Math.ceil( doc.length / limit );
            if(page > totalPage){
                page = totalPage;
            }
            const list = doc.slice(limit * (page - 1), limit * page);

            return Promise.resolve({
                list,
                page,
                limit,
                count: doc.length
            });
        });
};


exports.addItem = async (options) => {
    let newItem = {};
    if (options.name) {
        newItem['name'] = options.name;
    }
    if (options.price) {
        newItem['price'] = options.price * 1;
    }
    if (options.category) {
        newItem['category'] = options.category;
    }
    if (options.author) {
        newItem['author'] = options.author;
    }
    if (options.brand) {
        newItem['brand'] = options.brand;
    }
    if (options.description) {
        newItem['description'] = options.description;
    }
    if (options.file && options.file.fieldname === 'img') {
        await uploadFile(options.file)
            .then(imgUrl => {
                newItem['img'] = imgUrl;
            })
            .catch(error => {
                res.status(500).send({
                    message: error
                });
            });
    }

    newItem = new Book({ _id: new mongoose.Types.ObjectId(), ...newItem });

    return newItem.save();
};


exports.updateItem = async (id, options) => {
    let newItem = {};

    for (let key in options) {
        if (options[key] && key !== 'price') {
            newItem[key] = options[key] * 1;
        }
        if (options[key] && key !== 'img') {
            newItem[key] = options[key];
        }
    }
    if (options.file && options.file.fieldname === 'img' && options.file.size > 0) {
        await uploadFile(options.file)
            .then(imgUrl => {
                newItem['img'] = imgUrl;
            })
            .catch(error => {
                throw new Error(error);
            });
    }
    newItem['updatedAt'] = Date.now();

    return Book.findByIdAndUpdate({ _id: id }, { $set: newItem })
        .then(async doc => {
            // DELETE OLD FILE
            if(doc.img && newItem.img){
                const filename = doc.img.split('?')[0].split('/').pop();
                await deleteFile(filename);
            }

            return Promise.resolve({ ...doc._doc, ...newItem });
        });
};


exports.deleteItem = (id) => {
    return Book.findByIdAndDelete({ _id: id })
        .exec()
        .then(async doc => {
            // DELETE OLD FILE
            if(doc.img){
                const filename = doc.img.split('?')[0].split('/').pop();
                await deleteFile(filename);
            }

            return Promise.resolve(doc);
        });
};