import React, {Component} from 'react';
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import GitGraph from '@dynamogeek/git-graph/GitGraph';
import LoginHandler from "./components/LoginHandler";
import RepositoryList from "./components/RepositoryList";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connector: '',
            bitbucketClientId: this.props.bitbucketClientId || '',
            selectedRepository: '',
            showGitGraph: false,
            pullRequests: [],
        };

        this.updateConnector = this.updateConnector.bind(this);
        this.updateSelectedRepository = this.updateSelectedRepository.bind(this);
    }

    updateConnector(connector) {
        this.setState({
            connector: connector,
        });
    }

    updateSelectedRepository(selectedRepository) {
        this.setState({
            selectedRepository: selectedRepository,
        }, this.loadPullRequests);
    }

    async loadPullRequests() {
        let pullRequests = await this.state.connector.getPullRequests(this.state.selectedRepository);
        this.setState({
            pullRequests: pullRequests,
        });
    }

    render() {
        return (
            <Switch {...this.props}>
                {this.state.connector === '' && window.location.pathname !== '/login' && <Redirect to='/login'/>}
                <Route
                    exact
                    path='/login'
                    render={() => <LoginHandler updateConnector={this.updateConnector}{...this.props}/>}
                />
                {this.state.selectedRepository === '' && window.location.pathname !== '/select-repository' && <Redirect to='/select-repository'/>}
                <Route
                    exact
                    path='/select-repository'
                    render={() => <RepositoryList updateSelectedRepository={this.updateSelectedRepository} connector={this.state.connector}/>}
                />
                <Route
                    exact
                    path='/'
                    render={() => <GitGraph pullRequests={this.state.pullRequests}/>}
                />
            </Switch>
        );
    }
}

export default withRouter(App);
