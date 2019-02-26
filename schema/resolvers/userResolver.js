const jwt = require('jsonwebtoken');


const userResolver = {
    Mutation: {
        login: (_, { username, password }) => {
            const token = jwt.sign({ username, password }, 'secret', { expiresIn: 60 });
            return jwt.verify(token, 'secret', function (err, decoded) {
                if(decoded.username === 'admin' && decoded.password === 'P@ssword123'){
                    return { token };
                }
                return { error: 'Invalid Username or Password' };
            });
            
        }
    }
};


module.exports = userResolver;