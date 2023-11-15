import express from 'express';
import { MongoClient } from 'mongodb';


const app = express();
app.use(express.json());

// get array of project objects in mongodb
app.get('/api/projects/:name', async (req, res) => {
    const { name } = req.params;

    const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
    const db = client.db('Portfolio');

    const project = await db.collection('Projects').findOne({ name });

    if (project){
        res.json(project);
    } else {
        return res.status(404).send('Project not found');
    }

    
});

// add new project to mongodb
app.post('/api/projects/:projectID', async (req, res) => {
    const { projectID } = req.params;
    const { name, description, tech, image, github, live } = req.body;

    const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
    const db = client.db('Portfolio');

    const project = await db.collection('Projects').findOne({ projectID });

    if (project){
        return res.status(409).send('Project already exists');
    }

    const result = await db.collection('Projects').insertOne({ projectID, name, description, tech, image, github, live });
    res.json(result.ops[0]);
});



// add 1 upvote to selected project
app.put('/api/projects/:projectID/upvote', async (req, res) => {
    const { projectID } = req.params;
    const project = await db.collection('Projects').findOne({ projectID });

    const db = client.db('Portfolio');
    await db.collection('Projects').updateOne({ projectID }, {
        '$inc': {
            upvotes: 1,
        },
    });

    //if project exists, add 1 upvote
    if (project) {
        project.upvotes += 1;
        res.send(`Project ${projectID} now has ${project.upvotes} upvotes!`);
    } else {
        res.status(404).send(`Project ${projectID} does not exist.`);
    }
});

// add comment to selected project
app.post('/api/projects/:projectID/comments', (req, res) => {
    const { projectID } = req.params;
    const { postedBy, text } = req.body;
    const project = projectInfo.find((project) => project.name === projectID);
    //if project exists, add comment
    if (project) {
        project.comments.push({ postedBy, text });
        res.send(project.comments);
    } else {
        res.status(404).send(`Project ${projectID} doesn't exist.`);
    }
});



app.listen(8000, () => {
    console.log('Listening on port 8000');
    });