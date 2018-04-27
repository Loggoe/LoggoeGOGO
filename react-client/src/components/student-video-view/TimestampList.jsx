import React from 'react';

import TimestampListEntry from './TimestampListEntry.jsx';

class TimestampList extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      items: null
    };
  }
  
  render() {
    return (
      <div>
        <div>
          {console.log(this.props.timestamps)}
          {this.props.timestamps.map((timestamp, index) => {
            return <TimestampListEntry 
            key={index} 
            timestamp={timestamp} 
            changeVideo={this.props.changeVideo} 
            deleteTimestamp={this.props.deleteTimestamp}
            userId={this.props.userId}/>
          })}
        </div>
      </div>
    );
  }
}

export default TimestampList;