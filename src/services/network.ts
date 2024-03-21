export default class NetworkService {
    public async fetchGithubReadme(repository: string) {
        return await fetch(`https://raw.githubusercontent.com/${repository}/master/README.md`).then(res => res.text())
    }

    public checkIfUrlIsGithub(url: string) {
        let target = new URL(url)

        return target.hostname.toLowerCase() === 'github.com'
    }
}