import algoliasearch from "algoliasearch";

export default class SearchService {
    constructor(
        readonly applicationId: string,
        readonly apiKey: string,
    ) {
    }

    async search(query: string) {
        const client = algoliasearch(this.applicationId, this.apiKey);
        const index = client.initIndex('docs');

        return index.search(query).then(({hits}) => hits);
    }

    async upload(readme: string) {
        const client = algoliasearch(this.applicationId, this.apiKey);
        const index = client.initIndex('docs');

        return index.saveObject({readme: readme}).wait();
    }
}