const jwt = require('jsonwebtoken');
const apolloServerExpress = require('apollo-server-express');
const fs = require('fs');


const uploadFile = async file => {
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    return { filename, mimetype };
};
const userResolver = {
    Upload: apolloServerExpress.GraphQLUpload,
    Mutation: {
        login: async (_, { username, password, file }) => {
            console.log('UPLOAD FILE', file);

            // SAVE IMAGE TO UPLOADS FOLDER
            const { createReadStream, filename, mimetype } = await file;
            const dir = 'uploads';
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            const path = `uploads/${filename + Date.now()}.${mimetype.split('/').pop()}`;
            const r_stream = createReadStream();
            const w_stream = fs.createWriteStream(path);
            r_stream.pipe(w_stream);
            // stream.on('data', chunk => console.log('CHUNK', chunk));

            // JWT
            const token = jwt.sign({ username, password }, 'secret', { expiresIn: 60 });
            return jwt.verify(token, 'secret', function (err, decoded) {
                if(decoded.username === 'admin' && decoded.password === 'P@ssword123'){
                    return { username: decoded.username, token };
                }
                return { error: 'Invalid Username or Password' };
            });
            
        }
    }
};


module.exports = userResolver;