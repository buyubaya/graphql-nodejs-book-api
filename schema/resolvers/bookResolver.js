const Book = require('../../models/Book');


const bookResolver = {
    Query: {
        book: () => {
            console.log('BOOK BOOK');
            // return Book.find()
            // .exec()
            // .then(data => {
            //     console.log(22222, data);
            //     return(
            //         [
            //             {_id: '11111', name: 'Book 01'},
            //             {_id: '22222', name: 'Book 25'}
            //         ]
            //     );
            // });
            return([
                {_id: '11111', name: 'Book 01'},
                {_id: '22222', name: 'Book 25'}
            ]);
        }
    },
    Mutation: {
        addTuci: async (_, { data: { tuciValue, tuciType, tuciCategoryId, tuciNote } }) => {
            let promise = await fetch("http://localhost:5000/tuci/add",
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({
                        tuciValue,
                        tuciType,
                        tuciCategoryId,
                        tuciNote,
                    })
                });
            promise = await promise.json();
            promise = await promise.data;

            return promise;
        }
    }
};


module.exports = bookResolver;