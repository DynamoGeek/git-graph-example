import React, {Component} from 'react';
import {Redirect} from "react-router-dom";

class RepositoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            repositories: [],
            selectedRepository: false,
        };
        this.getRepositories = this.getRepositories.bind(this);
        this.updateSelectedRepository = this.updateSelectedRepository.bind(this);
    }

    componentDidMount() {
        this.getRepositories();
    }

    async getRepositories() {
        let repositories = await this.props.connector.getRepositories();
        this.setState({
            repositories: repositories,
        });
    }

    updateSelectedRepository(event) {
        this.props.updateSelectedRepository(event.target.value);
        this.setState({
            selectedRepository: true,
        });
    }

    render() {
        return (
            <div>
                <h1>Choose a Repository</h1>
                <div style={{maxHeight: '500px', overflow: 'auto', border: '1px solid black', padding: '5px'}}>
                    {this.state.selectedRepository && <Redirect to='/'/>}
                    {this.state.repositories.length === 0 && <span>Loading...</span>}
                    {this.state.repositories.map((repository) => (
                        <div key={repository} style={{lineHeight: '2em'}}>
                            <button value={repository} onClick={this.updateSelectedRepository}>{repository}</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default RepositoryList;
