import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

// Create a .env file at the root of the project with your REACT_APP_BITBUCKET_CLIENT_ID in it
ReactDOM.render(<BrowserRouter><App bitbucketClientId={process.env.REACT_APP_BITBUCKET_CLIENT_ID}/></BrowserRouter>, document.getElementById('root'));