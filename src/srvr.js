import express from 'express';
import { MongoClient } from 'mongodb';
import { connectToDb, db } from './db.js';


const app = express();
app.use(express.json());

function cop() {

}

// get array of project objects in mongodb
app.get('/api/projects/:name', async (req, res) => {
    const { name } = req.params;



    const project = await db.collection('Projects').findOne({ name });

    if (project) {
        res.json(project);
    } else {
        return res.status(404).send('Project not found');
    }


});

// add 1 upvote to selected project
app.put('/api/projects/:name/upvote', async (req, res) => {
    const { name } = req.params;

    const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
    const db = client.db('Portfolio');

    await db.collection('Projects').updateOne({ name }, {
        '$inc': { upvotes: 1 },
    });
    const project = await db.collection('Projects').findOne({ name });

    //if project exists, add 1 upvote
    if (project) {
        res.send(`Project ${name} now has ${project.upvotes} upvotes!`);
    } else {
        res.status(404).send(`Project ${name} does not exist.`);
    }
});

// add comment to selected project
app.post('/api/projects/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
    const db = client.db('Portfolio');

    await db.collection('Projects').updateOne({ name }, {
        '$push': { comments: { postedBy, text } },
    });

    const project = await db.collection('Projects').findOne({ name });

    //if project exists, add comment
    if (project) {
        project.comments.push({ postedBy, text });
        res.send(project.comments);
    } else {
        res.status(404).send(`Project ${projectID} doesn't exist.`);
    }
});


connectToDb(() => {

    console.log('Database connected');

    app.listen(8000, () => {
        console.log('Listening on port 8000');
    });
});