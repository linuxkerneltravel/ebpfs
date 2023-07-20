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

    async upload(id: string, readme: string, author: string[], keywords: string[], tags: string[]) {
        const client = algoliasearch(this.applicationId, this.apiKey);
        const index = client.initIndex('docs');
        const save = {
            id: id,
            readme: readme,
            author: author,
            keywords: keywords,
            tags: tags
        }

        return index.saveObject(save).wait();
    }
}