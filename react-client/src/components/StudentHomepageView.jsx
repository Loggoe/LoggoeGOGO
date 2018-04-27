import {withRouter} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import VideoList from './student-homepage-view/VideoListView.jsx';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class StudentHomepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            videoList: [],
            teachers: [],
            selectedTeacher: null
        }
        this.sendToSelectedVideo = this.sendToSelectedVideo.bind(this);
        this.getTeachers = this.getTeachers.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getVideosByTeacher = this.getVideosByTeacher.bind(this);
        this.getAllVideos = this.getAllVideos.bind(this);
    }

    componentDidMount() {
      this.getTeachers();
      this.getAllVideos();
    }

    sendToSelectedVideo(videoId) {
      this.props.history.push({
        pathname: '/student/video',
        videoId: videoId,
        username: this.props.location.username
      })
    }

    getAllVideos() {
      axios.get('/student/homepage')
      .then(({data}) => {
        this.setState({
          videoList: data
        })
      })
      .catch((err) => {
        console.log(err);
      })
    }

    getTeachers() {
      axios.get('/student/teachers')
      .then(({data}) => {
        this.setState({
          teachers: data
        })
      })
      .catch((err) => {
        console.log(err);
      })
    }

    handleChange(event, index, value) {
      this.setState({
        selectedTeacher: value
      }, () => {
        this.getVideosByTeacher();
      })
    }

    getVideosByTeacher() {
      axios.get('/student/videos', {params: {teacher: this.state.selectedTeacher}})
      .then(({data}) => {
        this.setState({
          videoList: data
        })
      })
      .catch((err) => {
        console.log(err);
      })
    }

    render() {
        return (
            <Paper style={style} zDepth={1}>
                    <h6>You are logged in as {this.props.location.username}</h6>
                <div>
                    <Paper 
                        style={searchStyle} 
                        zDepth={1}>  
                        <div> 
                            <AutoComplete 
                                dataSource={[]} />
                            <RaisedButton 
                                label="Search" />
                        </div>
                    </Paper>
                    <br/>
                    <Paper style={searchStyle} zDepth={1}>
                    <DropDownMenu name="selectedTeacher" value={this.state.selectedTeacher} onChange={this.handleChange} style={{width: '200px'}}>
                    <MenuItem value={100000} primaryText={"Select Teacher"}/>
                    {this.state.teachers.length === 0 ? null : this.state.teachers.map((teacher) => {
                      return(
                        <MenuItem key={teacher.id} value={teacher.id} primaryText={teacher.firstName}/>
                      )
                    })}
                    </DropDownMenu>
                    </Paper>
                    <Paper style={searchStyle}>
                      <RaisedButton onClick={() => {this.getAllVideos()}} label="Back to All Videos" labelStyle={{textTransform: 'none'}}/>
                    </Paper>
                    <VideoList 
                        videos={this.state.videoList} 
                        redirect={this.sendToSelectedVideo}/>
                </div>
            </Paper>
          )
    }
}

const style = {
    height: '100%',
    width: '100%',
    margin: '30px',
    textAlign: 'center',
    display: 'block',
    padding: '30px',
    background: '#D8E4EA'
  }
  const searchStyle = {
    height: '100%',
    width: 'auto',
    margin: '20px',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px'
  }

export default withRouter(StudentHomepage);