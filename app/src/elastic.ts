import { Client } from "@elastic/elasticsearch";
import { SearchHitsMetadata, SearchResponse } from "@elastic/elasticsearch/api/types";

import { CheckConnectionOptions, ESItem } from "./types/elastic";
import { Logger } from "./util/classes/Logger";

class Elastic {
    public readonly ES_INDEX_NAME = 'items';
    public readonly ES_MAPPING_TYPE_NAME = 'item';

    private _esclient;

    constructor(url: string) {
        this._esclient = new Client({ node: url });
    }

    // Getter for esclient
    get esclient() {
        return this._esclient;
    }

    // Resolves on establishing connection to elasticsearch
    // and conditionally creates an index and a mapping
    async checkConnection({ init = false, force = false }: CheckConnectionOptions) {
        let connected = false;
    
        while (!connected) {
            try {
                await this._esclient.cluster.health({});
                connected = true;
            } catch (err) {}
        }

        if (init) await this.initIndexAndMapping(force);

        return true;
    }

    // Initialize index and mapping
    async initIndexAndMapping(force: boolean = false) {
        const elasticIndex = await this._esclient.indices.exists({
            index: this.ES_INDEX_NAME
        });

        if (!elasticIndex) {
            await this.createIndex();
            await this.setItemMapping();
        } else if (force) {
            await this._esclient.indices.delete({ index: this.ES_INDEX_NAME });
            await this.createIndex();
            await this.setItemMapping();
        }
    }

    // Creates index
    async createIndex() {
        try {
            await this._esclient.indices.create({ index: this.ES_INDEX_NAME });
            Logger.log({
                location: Elastic.name,
                info: `Created index ${this.ES_INDEX_NAME}`
            });
        } catch (err) {
            Logger.error({
                error: err,
                location: Elastic.name,
                info: `An error occurred while creating the index ${this.ES_INDEX_NAME}`
            });
        }
    }

    // Sets item mapping
    async setItemMapping() {
        try {
            // Define mapping
            const itemSchema = {
                itemId: { type: "integer" },
                title: { type: "text" },
                text: { type: "text" },
                author: { type: "text" },
                type: { type: "text" }
            };
        
            // Apply mapping
            await this._esclient.indices.putMapping({
              index: this.ES_INDEX_NAME,
              type: this.ES_MAPPING_TYPE_NAME,
              include_type_name: true,
              body: { 
                properties: itemSchema
              } 
            })
        
            Logger.log({
                location: Elastic.name,
                info: `${this.ES_MAPPING_TYPE_NAME} mapping created successfully`
            });        
          } catch (err) {
            Logger.error({
                error: err,
                location: Elastic.name,
                info: `An error occurred while creating the ${this.ES_MAPPING_TYPE_NAME} mapping`
            });
          }
    }

    // Searches and returns items matching a query
    async searchItem(q: string) {
        // Search
        const { body: { hits } } = await this._esclient.search<SearchResponse<ESItem>>({
            index: this.ES_INDEX_NAME, 
            type: this.ES_MAPPING_TYPE_NAME,
            body: {
                query: {
                    multi_match: {
                        query: q,
                        fields: [
                            "title", "text", "author", "type"
                        ]
                    }
                }
            }
        });

        // Get important data
        const values = this.processHits(hits);
        
        return values;    
    }

    // Search for an item by itemId
    async getItemById(id: number) {
        const { body: { hits }} = await this._esclient.search<SearchResponse<ESItem>>({
            index: this.ES_INDEX_NAME,
            type: this.ES_MAPPING_TYPE_NAME,
            body: {
                query: {
                    match: {
                        itemId: {
                            query: id
                        }
                    }
                }
            }
        });

        // Get important data
        const values = await this.processHits(hits);
        
        return values[0];
    }

    // Saves new item into elasticsearch
    async addItem(item: ESItem) {
        // Insert new item
        return await this._esclient.index({
            index: this.ES_INDEX_NAME,
            type: this.ES_MAPPING_TYPE_NAME,
            refresh: true,
            body: { ...item }
        });
    }

    // Updates existing item
    async updateItem(id: string, item: ESItem) {
        return await this._esclient.update({
            index: this.ES_INDEX_NAME,
            id: id,
            refresh: true,
            body: {
                doc: {
                    ...item
                }
            }
        });
    }

    // Extract the relevant information from hits
    private async processHits(hits: SearchHitsMetadata<ESItem>) {
        return hits.hits.map((hit) => {
            return {
                id: hit._id,
                itemId: hit._source?.itemId,
                score: hit._score,
                title: hit._source?.title,
                by: hit._source?.author,
                text: hit._source?.text,
                type: hit._source?.type,
            }
        });
    }
}

const elastic = new Elastic(process.env.ELASTIC_URL!);

export { elastic };