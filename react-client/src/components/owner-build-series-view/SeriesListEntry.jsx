import React from 'react';
import Paper from 'material-ui/Paper';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../constants.js';

const videoSource = {
  beginDrag(props) {
    console.log('begin dragging', props)
    const item = {item: props.video}
    console.log(item)
    return item;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class SeriesListEntry extends React.Component {

  render() {
    // NEED TO UPDATE:
    const { video, redirect, removeFromSeries, connectDragSource } = this.props;
    return connectDragSource(
      <div>
        <Paper style={style} key={video.id}>
          <div key={video.id} style={{display: 'inline-block'}}>
            <div style={{width: '30%', float: 'left'}}>
              <img className="media-object" src={video.image} alt="" />
            </div>
            <div style={{width: '50%', float: 'right'}}>
              <div style={{fontWeight: 'bold'}} onClick={()=>{redirect(video)}}> {video.title} </div>
              <br/>
              <div style={{color: 'grey'}}> {video.description} </div>
              <button onClick={() => {removeFromSeries(video)}}>Remove from Series</button>
              <br/>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

const style = {
  height: 'auto',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px'
}

export default DragSource(ItemTypes.SAVED, videoSource, collect)(SeriesListEntry);
