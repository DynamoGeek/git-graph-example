import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

// Create a .env file at the root of the project with your REACT_APP_BITBUCKET_CLIENT_ID in it, and a REACT_APP_PUBLIC_URL specifying a subfolder (or you'll get errors)
ReactDOM.render(<BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}><App bitbucketClientId={process.env.REACT_APP_BITBUCKET_CLIENT_ID}/></BrowserRouter>, document.getElementById('root'));