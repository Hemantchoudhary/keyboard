const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const bodyParser = require('body-parser');



const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const keyStates = Array(10).fill('white');
let controlAcquired = false;
let currentControlUser = '';

app.use(express.static('public'));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456', // your password
  database: 'app_yoga'
});

connection.connect((error) => {
  if (error) {
    console.error('MySQL Connection Error:', error);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.post('/updateKeyState', (req, res) => {
  const user = req.body.user;
  const keyToUpdate = req.body.keyToUpdate;
  const valueForKeyToUpdate = req.body.valueForKeyToUpdate;
  const query = `UPDATE app_yoga_data SET ${keyToUpdate} = ? WHERE user_id = ?`;
  const values = [valueForKeyToUpdate, user];
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('MySQL Insert Error:', error);
      res.json({ success: false, message: 'Failed to update user data' });
    } else {
      res.json({ success: true });
    }
  });
});


app.post('/updateAccessControl', (req, res) => {
  const user = req.body.user;
  const accessToggle = req.body.accessToggle;
  const query = `UPDATE app_yoga_data SET access_control = ${accessToggle} WHERE user_id = ?`;
  const values = [user];
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('MySQL Insert Error:', error);
      res.json({ success: false, message: 'Failed to update user data' });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/getAccessControlDetails', (req, res) => {
  const user = req.body.user;
  let accessToControl = false;
  const query = `Select id,user_id,access_control from app_yoga_data where access_control=1`;
   connection.query(query, (error, results) => {
    if (error) {
      console.error('MySQL Insert Error:', error);
      res.json({ success: false, message: 'Failed to update user data' });
    } else {
      console.log(results, 'Result');
      const parsedResults = JSON.parse(JSON.stringify(results));
      if (parsedResults.length > 0){
        if (parsedResults[0].user_id == user) {
          accessToControl = true;
        } else {
          accessToControl = false;
        }
      }else{
        const query = `UPDATE app_yoga_data SET access_control = 1 WHERE user_id = ?`;
        const values = [user];
         connection.query(query, values, (error, res) => {

          if (error) {
           console.log(error)
          } else {
            accessToControl = true;
          }
        });
     

      }

      res.json({ accessToControl: accessToControl, success: true });
    }
  });
});


app.post('/GetUserData', (req, res) => {
  const user = req.body.user;
  const query = "Select * from app_yoga_data where user_id=?";
  const values = [user];
  connection.query(query, values, (error, results) => {
    if (error) {
      res.json({ success: false, message: 'Failed to update user data' });
    } else {
      const parsedResults = JSON.parse(JSON.stringify(results));
      res.json({parsedResults, success: true });
    }
  });
});



app.post('/updateReleaseControls', (req, res) => {
  const user = req.body.user;
  const query = `update app_yoga_data set access_control=0,key1=0,key2=0,key3=0,key4=0,key5=0,key6=0,key7=0,key8=0,key9=0,key10=0 where user_id=${user}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('MySQL Insert Error:', error);
      res.json({ success: false, message: 'Failed to update user data' });
    } else {
      
      res.json({ message: 'Released Control', success: true });
    }
  });
});

// io.on('connection', (socket) => {
//   // Handle new user connection
//   socket.on('userConnected', (user) => {
//     socket.join(user); // Join the room corresponding to the user
//     // Emit the initial key states to the connected user
//     io.to(user).emit('updateKeyStates', keyStates);

//     // Emit the current control state to the connected user
//     io.to(user).emit('updateControlState', controlAcquired, currentControlUser);
//   });

//   // Handle key state updates
//   socket.on('updateKeyState', ({ index, color  ,i}) => {
//     keyStates[index] = color;
//     io.emit('updateKeyStates', keyStates);
//   });

//   // Handle control acquisition
//   socket.on('acquireControl', (user) => {
//     if (!controlAcquired) {
//       controlAcquired = true;
//       currentControlUser = user;
//       io.emit('updateControlState', controlAcquired, currentControlUser);

//       // Set a timeout to release control after 120 seconds
//       setTimeout(() => {
//         releaseControl();
//       }, 120000);
//     }
//   });

//   // Handle control release
//   socket.on('releaseControl', () => {
//     releaseControl();
//   });

//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     releaseControl();
//   });

//   // Function to release control
//   function releaseControl() {
//     controlAcquired = false;
//     currentControlUser = '';
//     io.emit('updateControlState', controlAcquired, currentControlUser);
//   }
// });

server.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});