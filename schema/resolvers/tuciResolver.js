const FakeTuci = [
    {
        _id: 1,
        tuciValue: 1000,
        tuciType: 'tu',
        tuciCategory: {
            _id: 1,
            name: 'bonus',
            tuciType: 'tu'
        }
    }
];

const FakeTuciCategory = [
    {
        _id: 1,
        name: 'bonus',
        tuciType: 'tu'
    },
    {
        _id: 2,
        name: 'incentive',
        tuciType: 'tu'
    },
    {
        _id: 3,
        name: 'com',
        tuciType: 'ci'
    },
    {
        _id: 4,
        name: 'xe',
        tuciType: 'ci'
    }
];

const tuciResolver = {
    Query: {
        tuci: (_, { id }) => {
            // console.log('TUCI', id);
            // return Tuci.findById(id)
            // .exec()
            // .then(data => ({
            // 	data
            // }))
            // .catch(error => ({
            // 	error
            // }));
            return FakeTuci;
        }
    },

    tuci: {
        relatedTuci: (parent, { tuciType }) => {
            console.log('RELATED TUCI', parent, tuciType);
            return [...FakeTuci];
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
}

module.exports = tuciResolver;