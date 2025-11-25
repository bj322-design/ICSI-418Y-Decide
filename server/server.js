const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./UserSchema')
const Project = require('./Projects.js')
const Team = require('./TeamName')

app.use(express.json());
app.use(cors())
app.listen(9000, () => {
    console.log(`Server Started at ${9000}`)
})

const mongoose = require('mongoose');
const mongoString = "mongodb+srv://b322:1968cobra@cluster0.yhsbzdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoString);

const database = mongoose.connection

database.on('error', (error) => console.log(error))
database.once('connected', () => console.log('Databased Connected'))


//USERS ________________________________________________________________________________________________
app.post('/createUser', async (req, res) => {
    console.log(`SERVER: CREATE USER REQ BODY: ${req.body.username} ${req.body.f_name} ${req.body.l_name}`)
    const un = req.body.username;
    try {
        const result = await User.exists({ username: un });
        if (result === null) {
            const user = new User(req.body);
            await user.save();
            console.log(`User created! ${user}`);
            res.send(user);

        } else {
            console.log("Username already exists")
            res.status(500).send("Username already exists")
        }

    } catch (error) {
        res.status(500).send(error)
    }
})


app.get('/getUser', async (req, res) => {
    console.log(`SERVER: GET USER REQ BODY: ${req.query.username}, ${req.query.password}`)
    const username = req.query.username
    const password = req.query.password
    try {
        const user = await User.findOne({ username, password })
        if (user) {
            res.send(user);
        } else {
            // A more specific response for a failed login
            res.status(404).send(null);
        }
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.get('/getUsers', async (req, res) => {
    try {
        const userList = await User.find({}, {f_name:1, l_name:1, _id:1}); 
        res.send(userList);
    }
    catch (error) {
        res.status(500).send(error);
    }
});


//PROJECTS ___________________________________________________________________________________
app.post('/createProject', async (req, res) => {
    try {
        const project = new Project(req.body);
        project.save()
        console.log(`Project created! ${project}`)
        res.send(project)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.get('/getProjects', async (req, res) => {
    try {
        const projects = await Project.find()
        let responseDetails = []
        for (const project of projects) {
           const manager = await User.findById(project.mgr_id) 
           const owner = await User.findById(project.prod_owner_id) 
           const team = await Team.findById(project.team_id)
           responseDetails.push({
             _id: project._id,
             project_name: project.proj_name, 
             description: project.proj_desc,
             manager_details: {firstName: manager ? manager.firstName : 'N/A', lastName: manager ? manager.lastName : ''},
             owner_details: {firstName: owner ? owner.firstName : 'N/A', lastName: owner ? owner.lastName : ''},
             team_details: {team_name: team ? team.team_name : 'N/A'}
           })
        }
        res.send(responseDetails)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// TEAMS ___________________________________________________________________________________
app.post('/createTeam', async (req, res) => {
    console.log(`SERVER: CREATE TEAM REQ BODY: ${req.body.team_name}`)
    try {
        const team = new Team(req.body);
        await team.save();
        console.log(`Team created! ${team}`);
        res.send(team);
    }
    catch (error) {
        console.error('Error creating team:', error);
        res.status(500).send(error);
    }
})

app.get('/getTeams', async (req, res) => {
    try {
        // Fetch all teams
        const teams = await Team.find()
        res.send(teams);
    }
    catch (error) {
        res.status(500).send(error)
    }
})


// Start Server
const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});