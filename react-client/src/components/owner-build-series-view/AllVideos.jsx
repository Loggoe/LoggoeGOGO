import React from 'react';
import Paper from 'material-ui/Paper';
import AllVideosListEntry from './AllVideosListEntry.jsx';

const AllVideos = ({videos, redirect, save, addToSeries}) => {
  console.log('videos: ', videos);
  return (
    <div style={container}>
      <Paper style={style}>
        <div>
          {/* NEED TO CHANGE PROPS BELOW AS NEEDED */}
          {videos.length >= 2 ?
            videos.map(video => <AllVideosListEntry key={video.id} video={video} redirect={redirect} save={save} addToSeries={addToSeries}/>) :            
            <div>Save/add at least two videos to your classroom, then come back to build a series!</div>
          }
        </div>
      </Paper>
    </div>
  )
}

const style = {
  height: '100%',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px',
  "overflowY": 'auto'
}

const container = {
  height: '70vh',
  float: 'left',
  width: '40%'
}

export default AllVideos;