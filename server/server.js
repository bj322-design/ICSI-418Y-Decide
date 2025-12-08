const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./UserSchema')
const Host = require('./HostSchema')
const Admin = require('./AdminSchema');
const Project = require('./Projects.js')
const Event = require('./Events.js')
const Team = require('./TeamName')
const Session = require('./SessionSchema');
const ProfileToImg = require('./ProfileToImgSchema');
const multer = require('multer')
const path = require('path')

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

// 1. DEFINE STORAGE FIRST
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// 2. DEFINE MULTER INSTANCES NEXT, REFERENCING STORAGE
const upload = multer({ storage: storage });
const profileUpload = multer({ storage: storage });

const mongoose = require('mongoose');
const mongoString = "mongodb+srv://b322:1968cobra@cluster0.yhsbzdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoString);

const database = mongoose.connection

database.on('error', (error) => console.log(error))
database.once('connected', () => console.log('Databased Connected'))


app.get('/getUserDetailsById', async (req, res) => {
    const userId = req.query.userId;
    try {
        // Fetch user data from User schema (no profile_image field here now)
        const user = await User.findById(userId).select('username f_name l_name email');

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Fetch profile image URL from the separate schema
        const profileImg = await ProfileToImg.findOne({ username: user.username });
        const imgURL = profileImg ? profileImg.imgURL : '';

        // Combine and send data
        res.send({
            username: user.username,
            f_name: user.f_name,
            l_name: user.l_name,
            email: user.email,
            profile_image: imgURL // Send the image URL
        });

    }
    catch (error) {
        console.error("SERVER ERROR in getUserDetailsById:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.post('/updateUserProfile', profileUpload.single('profile_image'), async (req, res) => {
    const { userId, username, password, f_name, l_name } = req.body;
    const imagePath = req.file ? `http://localhost:9000/uploads/${req.file.filename}` : undefined;

    if (!userId) {
        return res.status(400).send({ message: "User ID is required for update." });
    }

    try {
        const updateData = {};
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        let oldUsername = user.username;
        let newUsername = username;
        let profileImgURL = user.profile_image; // Default to existing URL

        // 1. Check/Update First Name and Last Name
        if (f_name) updateData.f_name = f_name;
        if (l_name) updateData.l_name = l_name;

        // 2. Check/Update Username
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).send({ message: "Username already taken." });
            }
            updateData.username = username;
            newUsername = username;
        }

        // 3. Update Password (Only if provided)
        if (password) {
            updateData.password = password;
        }

        // 4. Update Profile Image URL in ProfileToImgSchema
        if (imagePath) {
            // Save or update the image URL linked to the (potentially new) username
            await ProfileToImg.findOneAndUpdate(
                { username: newUsername },
                { imgURL: imagePath },
                { upsert: true, new: true } // upsert: true creates the document if it doesn't exist
            );
            profileImgURL = imagePath; // Update the URL to be returned
        }
        // If the username changed, we need to update the ProfileToImg entry key
        else if (newUsername !== oldUsername) {
            await ProfileToImg.findOneAndUpdate(
                { username: oldUsername },
                { username: newUsername },
                { new: true }
            );
        }

        // 5. Update User Document (Name/Username/Password)
        if (Object.keys(updateData).length > 0) {
            await User.findByIdAndUpdate(userId, { $set: updateData });
        }

        // Return updated user data (including the latest profile image URL)
        const finalUser = await User.findById(userId).select('username f_name l_name email');

        res.send({
            message: "Profile updated successfully.",
            updatedUser: {
                _id: finalUser._id,
                username: finalUser.username,
                f_name: finalUser.f_name,
                l_name: finalUser.l_name,
                email: finalUser.email,
                profile_image: profileImgURL // Return the final, current image URL
            }
        });

    } catch (error) {
        console.error("SERVER ERROR in updateUserProfile:", error);
        res.status(500).send({ message: "Internal server error during update." });
    }
});

// server.js (Focusing only on the corrected /deleteUser endpoint logic)

app.post('/deleteUser', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send({ message: "User ID is required." });
    }

    try {
        // 1. Get user details and associated image record
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        const username = user.username;

        // Fetch image record to get the file path
        const profileImgRecord = await ProfileToImg.findOne({ username: username });
        const imageURL = profileImgRecord ? profileImgRecord.imgURL : null;

        // 2. FILE SYSTEM CLEANUP (Delete file from 'uploads' folder)
        if (imageURL) {
            // Extract the filename from the URL ("http://localhost:9000/uploads/filename.jpg")
            const filename = path.basename(imageURL);

            // Construct the absolute path to the file in the 'uploads' directory
            // We use 'path.join(__dirname, ...)' to ensure the path is absolute and correct.
            const filePath = path.join(__dirname, 'uploads', filename);

            // Asynchronously delete the file
            // We use fs.promises.unlink or fs.unlink with a callback. Since fs is used in your imports,
            // we'll stick to the standard async callback method used in your previous code style.
            const fs = require('fs'); // Re-import or ensure this is available
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    // Log error if file exists but deletion failed (not if the file wasn't found/already deleted)
                    console.error(`Error deleting file ${filePath}:`, err);
                } else if (err && err.code === 'ENOENT') {
                    console.log(`File not found at path: ${filePath}. Proceeding with DB cleanup.`);
                } else {
                    console.log(`Successfully deleted file: ${filePath}`);
                }
            });
        }

        // 3. Team Cleanup (Cleanup logic remains the same)
        const teamsToUpdate = await Team.find({
            $or: [{ manager_id: userId }, { members: userId }]
        });

        for (const team of teamsToUpdate) {
            if (team.manager_id.toString() === userId) {
                team.members = team.members.filter(memberId => memberId.toString() !== userId);
                if (team.members.length > 0) {
                    team.manager_id = team.members[0];
                    await team.save();
                } else {
                    await Team.findByIdAndDelete(team._id);
                }
            } else {
                team.members = team.members.filter(memberId => memberId.toString() !== userId);
                await team.save();
            }
        }

        // 4. Database Cleanup (Delete records)
        await ProfileToImg.deleteOne({ username: username });
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(500).send({ message: "User record could not be deleted." });
        }

        console.log(`SERVER: User ${userId} (${username}) successfully deleted.`);
        res.send({ message: "Account successfully deleted." });

    } catch (error) {
        console.error("SERVER ERROR in deleteUser:", error);
        res.status(500).send({ message: "Error during account deletion." });
    }
});

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

// NEW SECURE ENDPOINT TO FETCH PROFILE DETAILS BY ID
app.get('/getUserDetailsById', async (req, res) => {
    const userId = req.query.userId;
    try {
        // Fetch user data using ID, explicitly selecting non-sensitive public fields
        const user = await User.findById(userId).select('username f_name l_name email');

        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    }
    catch (error) {
        console.error("SERVER ERROR in getUserDetailsById:", error);
        res.status(500).send({ message: "Internal server error" });
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

    const userId = req.query.managerId;

    try {
        const teams = await Team.find({
            $or: [
                { manager_id: userId },
                { members: userId }
            ]
        }).lean();

        if (teams.length === 0) {
            return res.send([]);
        }

        // 1. Collect all unique user IDs involved
        const allMemberIds = new Set();
        teams.forEach(team => {
            // Ensure members is iterable and push all IDs
            if (team.members) {
                team.members.forEach(memberId => allMemberIds.add(memberId.toString()));
            }
        });

        // 2. Fetch details for all involved users
        const memberDetails = await User.find({
            _id: { $in: Array.from(allMemberIds) }
        }, { f_name: 1, l_name: 1, _id: 1 });

        const userMap = memberDetails.reduce((map, user) => {
            map[user._id.toString()] = `${user.f_name} ${user.l_name}`;
            return map;
        }, {});

        // 3. Construct the response with enriched details
        const teamsWithDetails = teams.map(team => {
            // Defensive check for team.members to prevent crash if data is corrupted
            const membersArray = team.members || [];

            return {
                ...team,
                isManager: team.manager_id.toString() === userId,
                memberNames: membersArray.map(memberId => ({
                    id: memberId.toString(),
                    name: userMap[memberId.toString()] || 'Unknown User',
                    isCurrentUser: memberId.toString() === userId
                }))
            };
        });

        res.send(teamsWithDetails);
    }
    catch (error) {
        console.error("Error fetching user groups:", error);
        res.status(500).send(error);
    }
});

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
        // 1. Check if the user is already a manager or a member of a group FOR THIS SPECIFIC EVENT
        const existingGroup = await Team.findOne({
            event_id: eventId, // Match the specific event ID
            $or: [
                { manager_id: userId },
                { members: userId }
            ]
        });

        if (existingGroup) {
            console.log(`User ${userId} is already associated with group ${existingGroup._id} for Event ${eventName}.`);

            // If the user is already in a group for this event, send flag to prevent navigation.
            return res.status(200).send({
                message: `User is already in a group for event: ${eventName}.`,
                alreadyInGroup: true, // Key flag for the client
                groupId: existingGroup._id
            });
        }

        // 2. If no existing group for this specific event is found, proceed to create a new one
        const newGroup = new Team({
            team_name: `Group for ${eventName}`,
            manager_id: userId,
            event_id: eventId,
            members: [userId]
        });

        await newGroup.save();
        console.log(`Created new social group: ${newGroup._id}`);

        // Send the response for a successfully created group.
        res.send({
            message: "Group created successfully.",
            alreadyInGroup: false, // Key flag for the client
            groupId: newGroup._id
        });

    } catch (error) {
        console.error("Error liking event: ", error);
        res.status(500).send({ message: "Internal server error." });
    }
});


app.post('/leaveGroup', async (req, res) => {
    const { teamId, userId } = req.body;

    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).send({ message: "Group not found" });

        // Remove the user from the members array
        team.members = team.members.filter(memberId => memberId.toString() !== userId);

        if (team.manager_id.toString() === userId) {
            // Case 1: The user is the manager.
            if (team.members.length > 0) {
                // Assign new manager (the next person in the list)
                team.manager_id = team.members[0];
                console.log(`Manager ${userId} left group ${teamId}. New manager is ${team.manager_id}`);
            } else {
                // Group is empty, delete it
                await Team.findByIdAndDelete(teamId);
                console.log(`Group ${teamId} is empty and was deleted.`);
                return res.send({ message: "Group deleted.", groupDeleted: true });
            }
        }

        await team.save();
        console.log(`User ${userId} left group ${teamId}.`);
        res.send({ message: "Left group successfully.", groupDeleted: false });

    } catch (error) {
        console.error("Error leaving group: ", error);
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

// NEW ENDPOINT: UPDATE USER PROFILE (Using profileUpload handler)
app.post('/updateUserProfile', profileUpload.single('profile_image'), async (req, res) => {
    const { userId, username, password, f_name, l_name } = req.body;
    const imagePath = req.file ? `http://localhost:9000/uploads/${req.file.filename}` : undefined;

    if (!userId) {
        return res.status(400).send({ message: "User ID is required for update." });
    }

    try {
        const updateData = {};
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // 1. Check/Update First Name and Last Name
        if (f_name) updateData.f_name = f_name;
        if (l_name) updateData.l_name = l_name;

        // 2. Check/Update Username
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).send({ message: "Username already taken." });
            }
            updateData.username = username;
            console.log(`Username changed from ${user.username} to ${username}`);
        }

        // 3. Update Password (Only if provided)
        if (password) {
            // NOTE: In a real app, you should hash this password before saving!
            updateData.password = password;
            console.log(`Password updated for user ${userId}.`);
        }

        // 4. Update Profile Image
        if (imagePath) {
            updateData.profile_image = imagePath;
            console.log(`Profile image updated to ${imagePath}.`);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(200).send({ message: "No changes submitted.", updatedUser: user });
        }

        // Perform the update
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, select: '-password' });

        // Return only essential, non-sensitive data
        res.send({
            message: "Profile updated successfully.",
            updatedUser: {
                _id: updatedUser._id,
                username: updatedUser.username,
                f_name: updatedUser.f_name,
                l_name: updatedUser.l_name,
                email: updatedUser.email,
                profile_image: updatedUser.profile_image
            }
        });

    } catch (error) {
        console.error("SERVER ERROR in updateUserProfile:", error);
        res.status(500).send({ message: "Internal server error during update." });
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