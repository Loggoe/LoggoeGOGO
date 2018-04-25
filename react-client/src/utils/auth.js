import axios from 'axios';

const Auth = {
    isLoggedIn: false,
    username: null,
    isOwner: null
}

Auth.getInfo = () => {
  console.log('getting user info');
  return axios.get('/user/loginstatus').then(
    res => {
      console.log('got user info response', res);
      if (res.data.isLoggedIn) {
        Auth.isLoggedIn = true;
        Auth.username = res.data.username;
        Auth.isOwner = res.data.isOwner
      } else {
          Auth.isLoggedIn = false;
          Auth.username = null,
          Auth.isOwner = null
      }
    }).catch(
      err => {
      console.log('error getting user info', err);
    })
}

// returns a promsie
Auth.login = (username, password) => {
    
}

Auth.register = (username, password) => {

}

Auth.logout = () => {

}

export default Auth