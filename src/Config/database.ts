import mongoose from 'mongoose';

const runDatabase = () => {

  mongoose.connect(`mongodb+srv://admin:${process.env.DB_CONNECT}@omar.p6xaa.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  console.log('DATABASE IS RUNNING');
};
export default runDatabase;
// `mongodb+srv://admin:${process.env.DATABASE_CONNECT}@saudi.6pcq9.mongodb.net/<dbname>?retryWrites=true&w=majority`
