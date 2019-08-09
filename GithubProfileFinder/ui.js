class UI {
    constructor(){
        this.profile = document.getElementById('profile');
    }

    // Display Profile
    showProfile(user) {
        this.profile.innerHTML = `
        <div class="card card-body mb-3">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="img-fluid mb-2" src="${user.avatar_url}">
                            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-3">View Profile</a>
                        </div>
                        <div class="col-md-9">
                            <span class="badge badge-primary">Public repos: ${user.public_repos}</span>
                            <span class="badge badge-secondary">Public gists: ${user.public_gists}</span>
                            <span class="badge badge-success">Followers: ${user.followers}</span>
                            <span class="badge badge-info">Following: ${user.following}</span>
                            <br><br>
                            <ul class="list-group">
                                <li class="list-group-item">Company: ${user.company}</li>
                                <li class="list-group-item">Website/Blog: ${user.blog}</li>
                                <li class="list-group-item">Location: ${user.location}</li>
                                <li class="list-group-item">Member Since: ${user.created_at}</li>
                            </ul>
                        </div>
                    </div>
        </div>
        <h3 class="page-heading mb-3">Latest Repos</h3>
        <div id="repos"></div>
        `;
    }

    //Show Repos
    showRepos(repos){
        let output = '';

        //iterate repos
        repos.forEach((repo)=>{
            output += `
            <div class="card card-body mb-2">
                    <div class="row">
                        <div class="col-md-6">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </div>
                        <div class="col-md-6">
                            <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
                            <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
                            <span class="badge badge-success">Forks: ${repo.forks_count}</span>
                        </div>
                    </div>
                </div>
            `;
        })

        // show repos
        document.getElementById('repos').innerHTML = output;
    }


    //Show Alert
    showAlert(message, className){
        //clear any remaining alerts
        this.clearAlert();
        // create a div
        const div = document.createElement('div');
        // add classname
        div.className = className;
        // add text
        div.appendChild(document.createTextNode(message));
        // Get Parent
        const container = document.querySelector('.searchContainer');
        // Get search box
        const search = document.querySelector('.search');
        // insert Alert
        container.insertBefore(div,search);

        //Aert timeout after 3secs
        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }

    //clear Alert message
    clearAlert(){
        const currentAlert = document.querySelector('.alert');

        if(currentAlert){
            currentAlert.remove();
        }
    }
    //clear Profile
    clearProfile(){
        this.profile.innerHTML = '';
    }
}