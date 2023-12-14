import express  from 'express'
import logger from 'morgan'

import { Server} from 'socket.io'
import { createServer } from 'node:http'

import sqlite3 from 'sqlite3';

// This allows us to establish the connetion with our database .db file which is the one used by sqlite.
// We will be persisting the data using this library. 

const db = new sqlite3.Database("D:/livechat/database/chat.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('connected to the database');
});

const port = process.env.PORT ?? 3000

// This initializes our express server
const app = express()

// This creates an instance of an http server, encapsulating our express app, which itself  already includes http functionality, but we do this
// In order to have more flexibility, which for this case implicates the usage of other libraries, like socket.io 
// So, the instance of "server" can be used for regular HTTP commmunications, and socket communications.
const server = createServer(app)

// Here we-re instatiationg the socket.io library which will represent the websocket io server instance. Allowing us to communicate with sockets from the
// server instance. 
const io = new Server(server, { // In the second argument we can pass an object connectionStateRecovery, which allow us to save information for a determined amount of time, so in case a connection is lost, the information will be retrieved once they get the connection back if the disconnection time has not exceeded the limitation
    connectionStateRecovery: {
    }
})

//CREATING DATABASE TABLE
const createTableQuery = `CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
)`
db.run(createTableQuery, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Table created or already exists.');
    }
})


// WEB SOCKET COMMUNCIATION 
// This sets up an event listener in the socket.io instance, that listens the 'connection' event is a special event in Socket.IO that is fired when a client successfully connects to the server.
// So when a client connects the server automatically listens to it, and it executes some function, which is stated in the second parameter as a callback function. 
io.on('connection', async (socket) => {
    console.log('a user has connected')

    socket.on('disconnect', () => {
        console.log('An user has disconnected');
    })

    // This listens to the chat message event, which we have defined on our client side to be sent.
    socket.on('chat message', async (msg) => {
        // Wrap the db.run call in a Promise to await its completion, this is because natively sqlite3 does not return a promise when the query is executed. So in order to be able to use async await, we need to wrapp it into a Promise
        const result = await new Promise((resolve, reject) => {
            const store_messages_sql = `INSERT INTO messages (content) VALUES (?)`;

            db.run(store_messages_sql, msg, function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log('Message successfully stored');
                    resolve({ lastID: this.lastID }); // When the db.run callback is executed, the library sqlite3 sets the this context to an object that represents the result of the SQL operation. The lastID property of this object contains the ID of the last inserted row.
                }
            });
        });

        // console.log(result); // Output: { lastID: [last_inserted_row_id] }

        // We get the last message, message id and then emit it to the client so they can have it.
        io.emit('chat message', msg, result.lastID.toString());
    });

    if(!socket.recovered){ // This evaluates if messages weren't retrieved after disconnection, in that case we get the messages records to render in our client side
        try {
            const retrieve_messages_sql = 'SELECT * FROM messages WHERE id > ?';
            const args = [socket.handshake.auth.serverOffset ?? 0];
            
            const results = await new Promise((resolve, reject) => {
                db.all(retrieve_messages_sql, args, (err, rows) => {
                    if (err){
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(rows)
                    }
                });
            });


        results.forEach(row => {
            socket.emit('chat message', row.content, row.id.toString());
        });

        } catch (error) {
            console.log(error);    
        }

    }

})

/* Logger is a library that help us to get information about the app functionality, and if something goes wrong this will help us to get information about it*/
app.use(logger('dev'))

/*Here we're telling the app that once we go to the main route "/", it should return what is sent in res.send
As we will  be sending an html file, we use sendFile  instead
*/
app.get('/', (req, res) => {
    // cwd is the current working directory, this is the directory where the application has ReadableStreamDefaultReader. In our case this is "livechat/"
    // So from there we need to search for our index file
    res.sendFile(process.cwd() + '/client/index.html')
})

/*This line will show us a notification in console, once the server is running */

/* HTTP COMMUNICATION */
server.listen(port, () => {
    console.log(`Server runing on port ${port}`);
})