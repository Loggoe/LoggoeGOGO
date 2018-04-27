import React from 'react';
import axios from 'axios';

import YouTube from 'react-youtube';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      videoId: this.props.videoId,
      player: null,
      comment: '',
      comments: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.getComments = this.getComments.bind(this);
  }

  componentDidMount() {
    this.getComments();
  }

  handleChange(comment) {
    this.setState({comment:comment});
  }

  onReady(event) {
    this.setState({
      player: event.target,
    });
  }
  
  onPlayVideo() {
    this.state.player.playVideo();
  }

  onPauseVideo() {
    this.state.player.pauseVideo();
  }

  saveTimeStamp() {
    const timestamp = Math.floor(this.state.player.getCurrentTime());
    this.props.saveTimeStamp(timestamp, this.state.comment);
  }

  clearInput(){
    this.setState({
      comment: ''
    })
  }

  getComments() {
    axios.get('/owner/getComments', {
      params: {
        videoId: this.state.videoId
      }
    })
    .then(({data}) => {
      this.setState({
        comments: data
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  render() {
    const opts = {
      height: '390',
      width: '500',
      playerVars: {
        autoplay: 0,
        start: this.props.startingTimestamp,
      }
    };

    return <div style={{ display: "block", margin: "20px" }}>
        <div>
          <YouTube videoId={this.state.videoId} opts={opts} onReady={this.onReady} />
        </div>
        <br />
        <div>
          <div>
            <RaisedButton onClick={this.onPlayVideo} label="Play" style={{ margin: "5px" }} />
            <RaisedButton onClick={this.onPauseVideo} label="Pause" style={{ margin: "5px" }} />
          </div>
          <label>
            <h4 style={{ display: "inline" }}>Comment: </h4>
            <AutoComplete dataSource={[]} 
                          refs={"autocomplete"} 
                          searchText={this.state.comment}
                          onUpdateInput={this.handleChange} 
                          onNewRequest={this.saveTimeStamp} />
            <RaisedButton onClick={() => {
                this.saveTimeStamp();
                this.clearInput();
              }} label="Confused" style={{ margin: "5px" }} />
          </label>
          <br/>
          <Paper>
            {this.state.comments.map((comment) => {
              return(
              <div>
                <div>{comment.begRange}-{comment.endRange}</div>
                <div>{comment.comment}</div>
              </div>
              )
            })}
          </Paper>
        </div>
      </div>;
  }

}

export default VideoPlayer;