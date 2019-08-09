//init github
const github = new Github;

//init UI class
const ui = new UI;

// Search input
const searchUser = document.getElementById('searchUser').addEventListener('keyup', (e) => {
    //Get input text
    const userText = e.target.value;

    if(userText !== ''){
        //Make http call
        github.getUser(userText)
            .then(data => {
                if(data.profile.message === 'Not Found'){
                    // show user not available alert
                    ui.showAlert('User Not Found', 'alert alert-danger');
                    ui.clearProfile();
                } else {
                    // show user profile
                    ui.showProfile(data.profile);
                    ui.showRepos(data.repos);
                }
            })

    } else {
        // clear profile
        ui.clearProfile();
    }
})