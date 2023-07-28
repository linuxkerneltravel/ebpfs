import algoliasearch from "algoliasearch";
import {Index} from "@/common";

export default class SearchService {
    constructor(
        readonly applicationId: string,
        readonly apiKey: string,
    ) {
    }

    async search(query: string) {
        const client = algoliasearch(this.applicationId, this.apiKey);
        const index = client.initIndex('docs');

        return index.search(query);
    }

    async upload({id, readme, author, tags}: Index) {
        const client = algoliasearch(this.applicationId, this.apiKey);
        const index = client.initIndex('docs');
        const save = {
            id: id,
            readme: readme,
            author: author,
            tags: tags
        }

        return index.saveObject(save).wait();
    }
}