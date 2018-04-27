import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import filestack from 'filestack-js';
import config from '../../../../config';
import axios from 'axios';

class TeacherUploads extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploads: []
    };

    this.openPicker = this.openPicker.bind(this);
    this.getUploads = this.getUploads.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount() {
    this.getUploads();
  }

  render() {
    return (
      <Paper>
        <div>
          <div id="uploadButton">
            <RaisedButton label="Upload File" onClick={this.openPicker} />
          </div>
          <ul>
            {this.state.uploads.map((upload) => {
              console.log('in map', this.state.uploads)
              return (<div><a href={upload.url} target="_blank">{upload.filename}</a> </div>)
            })}
          </ul>
        </div>
      </Paper>
    );
  }

  openPicker() {
    var fsClient = filestack.init(config.FILESTACK_API);
    fsClient
      .pick({
        fromSources: [
          "local_file_system",
          "imagesearch",
          "googledrive",
          "dropbox",
          "evernote",
          "github"
        ]
      })
      .then(response => {
        this.handleFileUpload(response.filesUploaded);
        this.saveToDb(response.filesUploaded);
      })
      .catch(err => console.log("ERROR IN FILE UPLOAD", err));
  }

  handleFileUpload(data) {
    let uploads = [];
    data.forEach(upload => {
      upload["videoId"] = this.props.videoId;
      uploads.push(upload);
    });
    this.setState({
      uploads: [...this.state.uploads, ...uploads]
    }, () => {

    });
  }

  saveToDb(data) {
    axios
      .post("/teacherUploads", {
        data: data
      })
      .then(() => {
        console.log("successfully saved file upload to db!");
      })
      .catch(err => console.log("ERROR IN SAVING FILE UPLOAD TO DB", err));
  }

  getUploads() {
    axios
      .get("/teacherUploads", { params: { videoId: this.props.videoId } })
      .then((data) => {
        console.log("successfully getting file uploads from db!", data);
        this.setState({
          uploads: [...this.state.uploads, ...data.data]
        }, () => {
          console.log('state', this.state)
        })
      })
      .catch(err => console.log("ERROR IN GETTING UPLOADS FROM DB", err));
  }
}

let temp = {
  filesUploaded: [
    {
      filename: "zoom_0.mp4",
      handle: "VVcCQkvRg2kSE2QpAhwk",
      mimetype: "video/mp4",
      originalFile: { name: "zoom_0.mp4", type: "video/mp4", size: 27819834 },
      originalPath: "zoom_0.mp4",
      size: 27819834,
      source: "local_file_system",
      status: "Stored",
      uploadId: "71c1154dffaec2859afe59c4f429038f4",
      url: "https://cdn.filestackcontent.com/VVcCQkvRg2kSE2QpAhwk",
      videoId: 'Ukg_U3CnJWI'
    }
  ]
};

export default TeacherUploads;