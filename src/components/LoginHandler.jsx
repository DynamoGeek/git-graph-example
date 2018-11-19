import React, {Component} from 'react';
import BitbucketConnector from "../BitbucketConnector";
import {Redirect} from 'react-router-dom'

class LoginHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: '',
        };
        this.bitbucketLogin = this.bitbucketLogin.bind(this);
    }
    async bitbucketLogin() {
        let bitbucketOauthUrl = `https://bitbucket.org/site/oauth2/authorize?client_id=${this.props.bitbucketClientId}&response_type=token`;
        let oauthWindow = window.open(bitbucketOauthUrl, 'bitbucketoauth', 'height=600,width=800');

        // TODO Can this be done better? Does it make a difference?
        let oauthResponseUrl = await this.waitForBitBucketAccessTokenAndReturn(oauthWindow);
        oauthWindow.close();
        let rawParams = oauthResponseUrl.split('#')[1].split('&');
        let params = {};
        rawParams.forEach(function(rawParam){
            let keyValue = rawParam.split('=');
            params[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
        });
        this.props.updateConnector(new BitbucketConnector(params.access_token));
        this.setState({
            loggedIn: true,
        });
    }

    async waitForBitBucketAccessTokenAndReturn (oauthWindow) {
        let href = '';
        try {
            href = oauthWindow.location.href;
        } catch(err) {
            // we'll get a security error when trying to access href when they're on BitBucket; we don't care
        }

        if (oauthWindow.closed || (href !== '' && href !== 'about:blank')) {
            // empty string when href security error; 'about:blank' before bitbucket has loaded; we also don't want to keep looking if the oauthwindow has been closed
            return href;
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        return this.waitForBitBucketAccessTokenAndReturn(oauthWindow);
    }

    render() {
        return (
            <div>
                <h1>Choose Your Source Control</h1>
                {this.state.loggedIn !== '' && <Redirect to='/'/>}
                {this.props.bitbucketClientId && <button style={{height: 248, width: 248, float: 'left'}} onClick={this.bitbucketLogin}><img alt="Bitbucket" src="images/bitbucket.png"/></button>}
            </div>
        );
    }
}

export default LoginHandler;
