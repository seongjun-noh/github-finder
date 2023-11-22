const searchInputEl = document.querySelector(".search-input");
const content = document.querySelector(".content");
const profileImageEl = document.querySelector('.profile-image');
const profileName = document.querySelector(".profile-name");
const publicReposCountEl = document.querySelector("#profile-public-repos-count");
const publicGistsCountEl = document.querySelector("#profile-public-gists-count");
const followersCountEl = document.querySelector("#profile-followers-count");
const followingCountEl = document.querySelector("#profile-following-count");
const companyEl = document.querySelector("#profile-info-company");
const blogEl = document.querySelector("#profile-info-blog");
const locationEl = document.querySelector("#profile-info-location");
const sinceEl = document.querySelector("#profile-info-since");
const profileButtonEl = document.querySelector("#view-profile-button");
const repoListEl = document.querySelector(".repo-list");
const userNotFoundEl = document.querySelector(".user-not-found");

class User {
    avatarUrl;
    login;
    profileUrl;
    publicRepos;
    publicGists;
    followers;
    following;
    company;
    blog;
    location;
    since;

    constructor(avatarUrl, login, profileUrl, publicRepos, publicGists, followers, following, company, blog, location, created_at) {
        this.avatarUrl = avatarUrl;
        this.login = login;
        this.profileUrl = profileUrl;
        this.publicRepos = publicRepos;
        this.publicGists = publicGists;
        this.followers = followers;
        this.following = following;
        this.company = company;
        this.blog = blog;
        this.location = location;
        this.since = created_at;
    }
}

class Repo {
    name;
    fullName;
    description;
    url;
    stars;
    watchers;
    forks;

    constructor(name, fullName, description, url, stars, watchers, forks) {
        this.name = name;
        this.fullName = fullName;
        this.description = description;
        this.url = url;
        this.stars = stars;
        this.watchers = watchers;
        this.forks = forks;
    }
}

searchInputEl.addEventListener("keyup", async (e) => {
    if (e.keyCode === 13) {
        searchInputEl.blur();
        const username = e.target.value;
        const user = await fetchUserDate(username);
        if (user.login === undefined) {
            content.style.display = "none";
            userNotFoundEl.style.display = "block";
        } else {
            renderUserProfile(user);
            const repos = await fetchUserRepoData(username);
            renderUserRepos(repos);
            content.style.display = "block";
            userNotFoundEl.style.display = "none";
        }
    }
});

function fetchUserDate(username) {
    const url = `https://api.github.com/users/${username}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return new User(
                data.avatar_url,
                data.login,
                data.html_url,
                data.public_repos,
                data.public_gists,
                data.followers,
                data.following,
                data.company,
                data.blog,
                data.location,
                data.created_at
            );
        }).catch(() => {
            console.log("유저 정보 없음");
        });
}

function renderUserProfile(user) {
    profileImageEl.src = user.avatarUrl;
    profileName.innerHTML = user.login;
    profileButtonEl.setAttribute("href", user.profileUrl);
    publicReposCountEl.innerHTML = user.publicRepos;
    publicGistsCountEl.innerHTML = user.publicGists;
    followersCountEl.innerHTML = user.followers;
    followingCountEl.innerHTML = user.following;
    companyEl.innerHTML = user.company;
    blogEl.innerHTML = user.blog;
    locationEl.innerHTML = user.location;
    sinceEl.innerHTML = user.since;
}

function fetchUserRepoData(username) {
    const url = `https://api.github.com/users/${username}/repos?sort=updated`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const repos = [];
            for (const repo of data) {
                repos.push( new Repo(
                    repo.name,
                    repo.full_name,
                    repo.description,
                    repo.url,
                    repo.stargazers_count,
                    repo.watchers_count,
                    repo.forks
                ));
            }
            return repos;
        }).catch(() => {
            console.log("레포 정보 업음");
        });
}

function renderUserRepos(repos) {
    for (const repo of repos) {
        const repoEl = document.createElement("li");
        repoEl.className = "repo";

        const repoInfoListEl1 = document.createElement("div");
        repoInfoListEl1.className = "repo-info-list1"

        const repoTitleEl = document.createElement("a");
        repoTitleEl.className = "repo-title";
        repoTitleEl.innerHTML = repo.name;
        repoTitleEl.href = `https://github.com/${repo.fullName}`;

        const repoLanguageEl = document.createElement("p");
        repoLanguageEl.className = "repo-language"

        const repoInfoListEl2 = document.createElement("div");
        repoInfoListEl2.className = "repo-info-list2"

        const repoStarsEl = document.createElement("a");
        repoStarsEl.className = "repo-info";
        repoStarsEl.id = "repo-stars";
        repoStarsEl.innerHTML = `Stars: ${repo.stars}`;

        const repoWatchersEl = document.createElement("a");
        repoWatchersEl.className = "repo-info";
        repoWatchersEl.id = "repo-watchers";
        repoWatchersEl.innerHTML = `Watchers ${repo.watchers}`;

        const repoForksEl = document.createElement("a");
        repoForksEl.className = "repo-info";
        repoForksEl.id = "repo-forks";
        repoForksEl.innerHTML = `Forks ${repo.forks}`;

        const repoDescriptionEl = document.createElement("div");
        repoDescriptionEl.className = "repo-description";
        repoDescriptionEl.innerHTML = repo.description;

        repoListEl.appendChild(repoEl);
        repoEl.appendChild(repoInfoListEl1);
        repoInfoListEl1.appendChild(repoTitleEl);
        repoInfoListEl1.appendChild(repoInfoListEl2);
        repoInfoListEl2.appendChild(repoStarsEl);
        repoInfoListEl2.appendChild(repoWatchersEl);
        repoInfoListEl2.appendChild(repoForksEl);
        repoEl.appendChild(repoDescriptionEl);
    }
}
