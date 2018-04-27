import React from 'react';
import Paper from 'material-ui/Paper';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../constants.js';

const searchSource = {
  beginDrag(props) {
    console.log('begin dragging: ', props)
    const item = {item: props.video}
    console.log('item: ', item)
    return item;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class AllVideosListEntry extends React.Component {
  render() {
    // NEED TO UPDATE
    const { isDragging, connectDragSource, video, save, redirect, addToSeries } = this.props

    return connectDragSource(
      <div>
        <Paper style={style}>
          <div style={{display: 'inline-block'}}>
            <div style={{width: '30%', float: 'left'}}>
              <img className="media-object" src={video.image} alt="" />
            </div>
            <div style={{width: '50%', float: 'right', wordWrap: 'break-word'}}>
              <div style={{fontWeight: 'bold'}}> {video.title} </div>
              <br/>
              <div style={{color: 'grey'}}> {video.description} </div>
              <br/>
              <button onClick={() => { addToSeries(video) }}>Add to Series</button>
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
  padding: '30px 5px',
  wordWrap: 'break-word'
}

export default DragSource(ItemTypes.VIDEO, searchSource, collect)(AllVideosListEntry);