import React from 'react';
import SeriesListEntry from './SeriesListEntry.jsx';
import Paper from 'material-ui/Paper';
import { ItemTypes } from '../../constants.js';
import { DropTarget } from 'react-dnd';

const videoSource = {
  // NEED TO UPDATE
  drop(props, monitor) {
    let item = monitor.getItem();
    props.addToSeries(item.item);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

class SeriesList extends React.Component {

  render() {
    // NEED TO UPDATE
    const { videosInSeries, videos, redirect, deleteVideo, connectDropTarget} = this.props;
    return connectDropTarget(
      <div style={container}>
        <Paper style={style}>
          <div>
            {/* NEED TO UPDATE */}
            {videosInSeries.length === 0 ? 'Search for a video and drag it here to save it' : videosInSeries.map((video, i) => <SeriesListEntry key={i} video={video} redirect={redirect} deleteVideo={deleteVideo}/>)}
          </div>
        </Paper>
      </div>
    )
  }
}

const style = {
  height: '100%',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px',
  "overflowY": 'auto',
}

const container = {
  height: '70vh',
  float: 'right',
  width: '40%',
}

export default DropTarget(ItemTypes.VIDEO, videoSource, collect)(SeriesList);