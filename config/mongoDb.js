const mongoose= require('mongoose');
const db = process.env.mongoDb_URI;

const connectDb = async () => {
    try{
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('MongoDB Atlas is connected')
    } catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDb;