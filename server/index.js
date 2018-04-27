const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment');
const axios = require('axios');
const session = require('express-session');
const path = require('path')
const {
  getOwnerTimestamp,
  getCurrentVideo,
  getOwnerVideos,
  getTimestamp, 
  getAllVideos, 
  getUserId,
  getUser, 
  setTimestamp, 
  setVideo, 
  setUser,
  getBuckets,
  deleteTimestamp,
  deleteVideo,
  getTeachers, 
  getChats,
  postChats,
  getUploads,
  setUploads,
  setTeacherComment,
  getOwnerComments,
  deleteOwnerComment
} = require('../database-mysql');

const searchYouTube = require ('youtube-search-api-with-axios');
const api = require('../config.js').API;

const app = express();

//---------------------------------------------------------SESSIONS
app.use(session({
  secret: 'keyboard cat'
}))

//---------------------------------------------------------MIDDLEWARE

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//---------------------------------------------------------USER LOGIN

app.post('/login', (req, res) => {
  getUser(req.body.username, (err, response) => {
    if (err) {
      res.status(403).send(err);
    } else {
      req.session.regenerate((err) => {
        if (err) {
          console.log(err);
        }
        req.session.user = response[0].name;
        req.session.isOwner = response[0].owner;
        req.session.userId = response[0].id;
        res.status(201).send(response);
      })
    }
  });
});

//---------------------------------------------------------USER REGISTRATION

app.post('/register', (req, res) => {
  getUser(req.body.username, (err, response) => {
    if (err) res.status(403).send(err);
    
    let isExist = !!response.length;

    if (isExist) {
      req.session.regenerate((err) => {
        if (err) {
          console.log(err);
          res.status(403).send(err);
          return;
        }
        req.session.user = response[0].name;
        req.session.isOwner = response[0].owner;
        res.status(201).send(true);
      })
    } 
    else {
      setUser(req.body, (err, response) => 
        (err) ? 
          res.status(403).send(err) :
          res.status(201).send(false)
      )      
    }

  })
})

//---------------------------------------------------------USER ID
//get userId for owner homepage and homepage
app.get('/user/id', (req, res) => {
  getUserId(req.query.user, (userId) => 
    res.send(userId)
  )
})

//---------------------------------------------------------USER LOGIN STATUS

// Returns an object with props:
// isLoggedIn: bool
// username: string or undefined if not logged in
// isOwner: bool or undefined if not logged in

app.get('/user/loginstatus', (req, res) => {
  if (req.session.user === undefined) {
    res.send({
      isLoggedIn: false
    });
    return;
  }
  res.send({
    isLoggedIn: true,
    username: req.session.user,
    isOwner: req.session.isOwner,
    userId: req.session.userId
  });
})

//---------------------------------------------------------STUDENT USER REQUESTS
//get all videos for student homepage
app.get('/student/homepage', (req, res) => 
  getAllVideos((videos) => 
    res.send(videos)
  )
)

app.get('/student/teachers', (req, res) => {
  getTeachers((teachers) => {
    res.send(teachers);
  })
})

app.get('/student/videos', (req, res) => {
  let teacher = req.query.teacher;
  getOwnerVideos(teacher, (data) => {
    res.send(data);
  })
})

//---------------------------------------------------------OWNER USER REQUESTS

app.get('/owner/searchYoutube', (req, res) => {
  searchYouTube({key: api, q: req.query.query, maxResults: 10}, 
    (videos) => {
      res.status(200).send(videos);
    }
  )
})

app.post('/owner/save', (req, res) => {
  let video = req.body.video;
  let userId = req.body.userId;
  let url = `https://www.googleapis.com/youtube/v3/videos?id=${video.id.videoId}&part=contentDetails&key=${api}`;
  axios.get(url)
  .then((data) => {
    let duration = moment.duration(data.data.items[0].contentDetails.duration, moment.ISO_8601).asSeconds();
    setVideo(video, userId, duration, () => {
      res.status(201).send('Saved to db');
    })
  })
})

app.post('/owner/delete', (req, res) => {
  let userId = req.body.userId;
  let videoId = req.body.video.videoId;
  deleteVideo(userId, videoId, () => {
    res.status(201).send('Removed from db');
  })
})

//get all videos for owner.
app.get('/owner/videoList', (req, res) => {
  getOwnerVideos(req.query.userId, (videos) => {
    res.send(videos);
  })
})

//---------------------------------------------------------OWNER COMMENTS
app.post('/owner/saveComment', (req, res) => {
  setTeacherComment(req.body.comment, req.body.videoId, req.body.userId, req.body.start, req.body.end, (comment) => {
    res.send('Comment saved to DB');
  })
})

app.get('/owner/getComments', (req, res) => {
  getOwnerComments(req.query.videoId, (comments) => {
    res.send(comments);
  })
})

app.post('/owner/deleteComment', (req, res) => {
  deleteOwnerComment(req.body.comment.id, (comment) => {
    res.send('Comment deleted from DB')
  })
})

//---------------------------------------------------------ANALYTICS

app.get('/buckets', (req,res) => {
  const params = req.query
  getBuckets(params, (data) => {
    data.sort(function (a, b) {
      return Number(a.TimeStampGroup.match(/\d+/)) - Number(b.TimeStampGroup.match(/\d+/));
    });
    res.json(data)
  })
})

//---------------------------------------------------------WORKING WITH STUDENT COMMENTS

app.get('/timestamps', (req, res) => {
  let videoId = req.query.videoId
  getTimestamp(videoId, req.query.userId, (data) => {
    res.json(data);
  });  
})


app.get('/timestamps/owner', (req, res) => {
  let videoId = req.query.videoId
  getOwnerTimestamp(videoId, (data) => {res.send(data)});  
})

app.post('/timestamps', (req, res) => {
  let params = req.body.params;
  setTimestamp(params, (success) => {res.status(201).send()});
})

app.delete('/timestamps', (req, res) => {
  let params = req.query;
  deleteTimestamp(params, (success) => {res.send()})
})

//---------------------------------------------------------TEACHER UPLOADS

app.post('/teacherUploads', (req, res) => {
  setUploads(req.body, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER POST UPLOADS: ', err) :
    res.status(201).send(results);
  })
})

app.get('/teacherUploads', (req, res) => {
  // console.log('in get teacher uploads', req.query)
  getUploads(req.query, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER GET UPLOADS: ', err) :
    res.status(200).send(results);
  })
})


//---------------------------------------------------------DEFAULT ROUTE
app.get('/*/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../react-client/dist/bundle.js'));
})
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../react-client/dist/index.html'));
})

//---------------------------------------------------------SERVER
let server = app.listen(3000, () => {
  console.log('listening on port 3000!');
});

//---------------------------------------------------------CHATROOM

const io = require('socket.io')(server);
let users = [];
let connections = [];

io.on('connection', (socket) => {
  connections.push(socket);
  console.log('Connected: %s sockets connected.', connections.length)

  socket.on('disconnect', (data) => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected.', connections.length)
  }) 

  socket.on('send message', (data) => {
    io.sockets.emit('new message', {msg: JSON.stringify(data)})
  })
});

//adds chat messages to the chats db
app.post('/chats', (req, res) => {

  postChats(req.body, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER POSTCHATS: ', err) :
    res.status(201).send(results);
  })
})

app.post('/chatInfo', (req, res) => { //change to get request
  // console.log('req in server get chats', req.body)
  getChats(req.body, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER GETCHATS: ', err) :
    res.status(201).send(results);
  });
})