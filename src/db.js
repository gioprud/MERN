import { MongoClient } from 'mongodb';

let db;

async function connectToDb(callback)  {
    const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
    db = client.db('Portfolio');
    callback();
}

export {
    connectToDb,
    db,
};