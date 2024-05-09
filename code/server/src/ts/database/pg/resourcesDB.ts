export class ResourcesDB {

    async createResource(resource) {
        return await this.database.createResource(resource);
    }
    async getResource(id) {
        return await this.database.getResource(id);
    }
    async updateResource(resource) {
        await this.database.updateResource(resource);
    }
    async deleteResource(id) {
        await this.database.deleteResource(id);
    }
}