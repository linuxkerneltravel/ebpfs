import algoliasearch, {SearchClient} from "algoliasearch";
import {Index} from "@/common";

export default class SearchService {
    client: SearchClient;

    constructor() {
        const algoliaApplicationID = process.env.ALGOLIA_APPLICATION_ID;
        const algoliaAPIKey = process.env.ALGOLIA_API_KEY;

        if (!algoliaApplicationID) throw new Error('ALGOLIA_APPLICATION_ID is not set');
        if (!algoliaAPIKey) throw new Error('ALGOLIA_API_KEY is not set');

        this.client = algoliasearch(algoliaApplicationID, algoliaAPIKey);
    }

    async search(query: string) {
        const index = this.client.initIndex('docs');

        return index.search(query);
    }

    async upload({id, url, organization, project, readme, content, author, tags}: Index) {
        const index = this.client.initIndex('docs');
        const save = {
            objectID: id,
            id: id,
            url: url,
            organization: organization,
            project: project,
            readme: readme,
            content: content,
            author: author,
            tags: tags
        }

        return index.saveObject(save).wait();
    }

    async update({id, url, organization, project, readme, content, author, tags}: Index) {
        const index = this.client.initIndex('docs');

        index.partialUpdateObject({
            objectID: id,
            id: id,
            url: url,
            organization: organization,
            project: project,
            readme: readme,
            content: content,
            author: author,
            tags: tags
        })
    }

    async delete(id: string) {
        const index = this.client.initIndex('docs');

        return index.deleteObject(id).wait();
    }
}