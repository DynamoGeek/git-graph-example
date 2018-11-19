class BitbucketConnector {
    constructor(token) {
        this.api_base_url = 'https://api.bitbucket.org/2.0';
        this.token = token;
    }

    async getApiResponse(path, params) {
        let fetchObject = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
        };

        let queryParams = {
            pagelen: 100,
        };
        if (typeof params === 'object') {
            queryParams = {...queryParams, ...params};
        }
        let queryString = this.encodeQueryParams(queryParams);
        let response = await fetch(`${this.api_base_url}${path}?${queryString}`, fetchObject)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                },
                (error) => {
                    // TODO Handle boring errors
                }
            );
        let allResults = response.values || response;
        // TODO Not return every single thing at once; incrementally load
        while (true) {
            // The while true is a lazy way to wait for all the fetch results
            if (!response.hasOwnProperty('next')) {
                return allResults;
            }

            response = await fetch(response.next, fetchObject)
                .then(res => res.json())
                .then(
                    (result) => {
                        return result;
                    },
                    (error) => {
                        // TODO Handle boring errors
                    }
                );
            allResults = allResults.concat(response.values || response);
        }
    }

    async getPullRequests(accountRepository) {
        let data = await this.getApiResponse(`/repositories/${accountRepository}/pullrequests`, {pagelen: 50});
        let pullRequests = [];
        data.forEach(pr => {
            pullRequests.push({
                'source': pr.source.branch.name,
                'target': pr.destination.branch.name
            });
        });
        return pullRequests;
    }

    async getRepositories() {
        let data = await this.getApiResponse(`/repositories`, {'role': 'member'});
        let repositoryNames = [];
        data.forEach(repository => {
            repositoryNames.push(repository.full_name);
        });

        return repositoryNames;
    }

    encodeQueryParams(queryParams) {
        return Object.keys(queryParams).map(function (key) {
            return [key, queryParams[key]].map(encodeURIComponent).join("=");
        }).join("&");
    }
}

export default BitbucketConnector;