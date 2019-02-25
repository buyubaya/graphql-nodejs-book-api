const jwt = require('jsonwebtoken');

const userResolver = {
    Mutation: {
        loginByUserNameAndPassword: (_, { userName, password }) => {
            const token = jwt.sign({ userName, password }, 'hello', { expiresIn: 60 });
            jwt.verify(token, 'hello', function (err, decoded) {
                console.log('DECODED', decoded);
            });
            return { token };
        }
    }
}

module.exports = userResolver;