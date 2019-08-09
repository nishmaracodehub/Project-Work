// Get the github config
const configKeys = new Config;

// ES6 Classes


class Github {
    constructor() {
        this.client_id = configKeys.client_id;
        this.client_secret = configKeys.client_secret;
        this.repos_count = 5;
        this.repos_sort = 'created: asc';
    }

    async getUser(user) {
        const profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);
        const reposResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`);
        
        const profile = await profileResponse.json();
        const repos = await reposResponse.json();
        console.log(profile);
        return {
            profile,
            repos
        }
    }
}