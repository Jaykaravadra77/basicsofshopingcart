 const mongoose =  require('mongoose');

const dbString = "mongodb://localhost:27017/shopping";
 
 mongoose.connect('mongodb://localhost:27017/shopping', {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => console.log('Connected Successfully'))
        .catch((err) => console.error('Not Connected'));
 
