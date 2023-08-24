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

    async upload({id, url, organization, project, readme, content, author, tags}: Index) {
        const client = algoliasearch(this.applicationId, this.apiKey);
        const index = client.initIndex('docs');
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
        const client = algoliasearch(this.applicationId, this.apiKey);
        const index = client.initIndex('docs');

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
        const client = algoliasearch(this.applicationId, this.apiKey);
        const index = client.initIndex('docs');

        return index.deleteObject(id).wait();
    }
}