import React, { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import './App.css';

/*
 * TODO:
 * Make the main container scale to fit all repos on screen
 * display repo list nicer
 * smooth out banding in bg gradient
 * fix in repos.sort a and b having type any (is this even an issue???) idk :skull:
 * In user info display account connections
 * In user info display profile readme.md
 * Move this shit into seperate react components
*/

function App() {
    const [data, setData] = useState<Array<{
        name: string;
        html_url: string;
        description: string;
        avatar_url: string;
        updated_at: string;
    }>>([]);

    const [userdata, setUserData] = useState<{
        login: string;
        avatar_url: string;
        html_url: string;
    }>({ login: '', avatar_url: '', html_url: '' });
    
    const username = "nyxnix"

        useEffect(() => {
                axios.get("https://api.github.com/users/" + username + "/repos")
                .then(repores => {
                        const repos = repores.data.slice();
                        repos.sort((a: any, b: any) => {
                                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                                });
                        setData(repos);
                        })
                .catch(repoerr => console.log(repoerr));
                }, [username]);

    useEffect(() => {
            axios.get("https://api.github.com/users/"+username)
            .then(userres => setUserData(userres.data))
            .catch(usererr => console.log(usererr));
            }, []);

    const [readmeContent, setReadmeContent] = useState<string>('');


    useEffect(() => {
        axios.get('https://api.github.com/repos/Nyxnix/Nyxnix/contents/README.md')
            .then(response => {
                const readme = response.data;
                const decodedContent = atob(readme.content); // Decode base64 content
                setReadmeContent(decodedContent);
            })
            .catch(error => console.error('Error fetching README:', error));
    }, []);

    return (
            <div id="app-container" className="App">
            <div id="l-container">
            <h1>GitHub Repos</h1>
            <h3>(Sorted by recently updated)</h3>
            <div id="repos">
            <table className="table">
            <thead>
            <tr>
            <th>Repo</th>
            <th>URL</th>
            <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {data.map((repo, index) => (
                        <React.Fragment key={index}>
                        <tr>
                        <td>{repo.name}</td>
                        <td><a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.html_url}</a></td>
                        <td>{repo.description}</td>
                        </tr>
                        {index !== data.length - 1 && <tr className="separator-row"><td colSpan={3}></td></tr>}
                        </React.Fragment>
                        ))}
    </tbody>
        </table>
        </div>
        </div>
        <br></br>
        <div id="r-container">
        <h1>User Info</h1>
        <div className="user-info">
        <h1>{userdata.login}</h1>
        {userdata.avatar_url && (
                <img className="user-avatar" src={userdata.avatar_url}/>
                )}
    </div>
        <a className="user-url" href={userdata.html_url} target="_blank" rel="noopener noreferrer">
        {userdata.html_url}
    </a>
        <div className="readme-content">
        <Markdown>{readmeContent}</Markdown>
        </div>
        </div>
        </div>
        );
}

export default App;
