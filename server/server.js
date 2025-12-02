const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./UserSchema')
const Host = require('./HostSchema')
//const Admin = require('./AdminSchema');
const Project = require('./Projects.js')
const Event = require('./Events.js')
const Team = require('./TeamName')
const Session = require('./SessionSchema');
const multer = require('multer')
const path = require('path')

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

const mongoose = require('mongoose');
const mongoString = "mongodb+srv://b322:1968cobra@cluster0.yhsbzdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoString);

const database = mongoose.connection

database.on('error', (error) => console.log(error))
database.once('connected', () => console.log('Databased Connected'))

//HOST _________________________________________________________________________________________________
app.post('/createHost', async (req, res) => {
    console.log(`SERVER: CREATE HOST REQ BODY: ${req.body.username} ${req.body.email} ${req.body.phone} ${req.body.org_name}`)
    const un = req.body.username;

    try {
        const resultHost = await Host.exists({ username: un });
        const resultUser = await User.exists({ username: un });

        if(resultHost === null && resultUser === null)
        {
            const host = new Host(req.body);
            await host.save();
            console.log("Host created successfully!")
            res.send(host);
        }

        else
        {
            console.log("Username already exists");
            res.status(500).send("Username already exists");
        }
    }

    catch (error)
    {
        console.error("SERVER ERROR in createHost:", error);
        res.status(500).send(error);
    }
})

app.get('/getHost', async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    try {
        const host = await Host.findOne({ username, password });
        if (host) {
            res.send(host);
        } else {
            res.status(404).send(null);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//USERS ________________________________________________________________________________________________
app.post('/createUser', async (req, res) => {
    console.log(`SERVER: CREATE USER REQ BODY: ${req.body.username} ${req.body.f_name} ${req.body.l_name}`)
    const un = req.body.username;
    try {
        const resultUser = await User.exists({ username: un });
        const resultHost = await Host.exists({ username: un });

        if (resultUser === null && resultHost === null) {
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
    console.log(`SERVER: CREATE PROJECT REQ BODY: ${req.body.proj_name}`)
    try {
        const project = new Project(req.body);
        await project.save()
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

app.get('/getMyGroups', async (req, res) => {
    const { managerId } = req.query;

    try {
        // Fetch all teams
        const teams = await Team.find({ manager_id: managerId });
        res.send(teams);
    }
    catch (error) {
        res.status(500).send(error)
    }
})

//EVENTS ___________________________________________________________________________________
app.post('/createEvent', upload.single('event_promo'), async (req, res) => {
    console.log(`SERVER: CREATE EVENT REQ BODY: ${req.body.event_name}`)

    const imagePath = req.file ? `http://localhost:9000/uploads/${req.file.filename}` : '';

    const newEventData = {
        event_name: req.body.event_name,
        event_location: req.body.event_location,
        event_start: req.body.event_start,
        event_end: req.body.event_end,
        event_price: req.body.event_price,
        event_desc: req.body.event_desc,
        event_promo: imagePath
    };

    try {
        const event = new Event(newEventData);
        await event.save()
        console.log(`Event created! ${event}`)
        res.send(event)
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send(error)
    }
})

app.get('/getEvents', async (req, res) => {
    try {
        const events = await Event.find()
        let responseDetails = []
        for (const event of events) {
            responseDetails.push({
                _id: event._id,
                name: event.event_name,
                location: event.event_location,
                start: event.event_start,
                end: event.event_end,
                price: event.event_price,
                description: event.event_desc,
                promo_image: event.event_promo
            })
        }
        res.send(responseDetails)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.post('/likeEvent', async (req, res) => {
    const { userId, eventId, eventName } = req.body;
    console.log(`SERVER: User ${userId} like Event ${eventName}`);

    try {
        const newGroup = new Team({
            team_name: `Group for ${eventName}`,
            manager_id: userId,
            event_id: eventId,
            members: [userId]
        });

        await newGroup.save();
        console.log(`Created new social group: ${newGroup._id}`);
        res.send(newGroup);
    } catch (error) {
        console.error("Error liking event: ", error);
        res.status(500).send(error);
    }
});

app.post('/inviteToGroup', async (req, res) => {
    const { teamId, userIdToInvite } = req.body;

    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).send("Group not found");

        if(!team.members.includes(userIdToInvite)) {
            team.members.push(userIdToInvite);
            await team.save();
            res.send(team);
        } else {
            res.status(400).send("User already in group");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// ADMIN _______________________________________________________________________

const ADMIN_SECRET_KEY = "admin_key";

app.post('/CreateAdmin', async (req, res) => {
    if (req.body.adminKey !== ADMIN_SECRET_KEY) {
        console.log(`SERVER: Admin creation failed. Invalid Key.`);
        return res.status(401).send("Invalid Admin Key");
    }
    console.log(`SERVER: CREATE ADMIN REQ BODY: ${req.body.username} ${req.body.f_name} ${req.body.l_name}`)
    const un = req.body.username;
    try {
        const resultUser = await User.exists({ username: un });
        const resultHost = await Host.exists({ username: un });
        const resultAdmin = await Admin.exists({ username: un });

        if(resultUser === null && resultHost === null && resultAdmin === null)
        {
            const admin = new Admin(req.body);
            await admin.save();
            console.log(`Admin created! ${admin}`);
            res.send(admin);
        } else {
            console.log("Username already exists")
            res.status(500).send("Username already exists")
        }

    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/getAdmin', async (req, res) => {
    const { username, password } = req.query;
    try {
        const admin = await Admin.findOne({ username: username, password: password });
        if(admin)
        {
            console.log("Admin Login Found:", admin.username);
            res.json(admin);
        } else {
            res.status(404).json("Admin not found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// SOCIAL PLANNER ENDPOINTS ____________________________________________________

app.post('/startGroupSession', async (req, res) => {
    console.log("Starting Group Session with filters:", req.body);
    const { host_id, location, activity_type } = req.body;

    try {
        // events that match the planner's location/type
        const query = {};
        if (location) {
            query.event_location = { $regex: location, $options: 'i' };
        }
        if (activity_type) {
            query.$or = [
                { event_name: { $regex: activity_type, $options: 'i' } },
                { event_desc: { $regex: activity_type, $options: 'i' } }
            ];
        }

        const matchedEvents = await Event.find(query);

        if (matchedEvents.length === 0) {
            return res.status(404).send({ message: "No events found matching criteria" });
        }

        const eventIds = matchedEvents.map(e => e._id);

        // create session entry
        const newSession = new Session({
            session_code: Math.floor(1000 + Math.random() * 9000).toString(),
            host_id: host_id,
            event_ids: eventIds,
            votes: [],
            status: 'active'
        });

        await newSession.save();
        
        res.send({ 
            session: newSession, 
            event_count: eventIds.length 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// check status
app.get('/sessionDetails/:sessionCode', async (req, res) => {
    try {
        const session = await Session.findOne({ session_code: req.params.sessionCode });
        if (!session) return res.status(404).send("Session not found");

        // headcount
        const uniqueVoters = [...new Set(session.votes.map(v => v.user_id))];

        res.send({
            session_code: session.session_code,
            headcount: uniqueVoters.length, 
            chat_log: session.chat_log // chat history
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// chat message
app.post('/sendMessage', async (req, res) => {
    try {
        const { session_code, sender, message } = req.body;
        const session = await Session.findOne({ session_code });
        
        if (session) {
            session.chat_log.push({ sender, message });
            await session.save();
            res.send({ success: true });
        } else {
            res.status(404).send("Session not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start Server
const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});
