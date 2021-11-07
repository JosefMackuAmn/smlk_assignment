import { Client } from "@elastic/elasticsearch";
import { SearchResponse } from "@elastic/elasticsearch/api/types";

import { ESItem } from "./types/elasticsearch";

class Elastic {
    public readonly ES_INDEX = 'items';
    public readonly ES_TYPE = 'item';

    private _esclient;

    constructor(url: string) {
        this._esclient = new Client({ node: url });
    }

    get esclient() {
        return this._esclient;
    }

    // Resolves on establishing connection to elasticsearch
    async checkConnection() {
        let connected = false;
    
        while (!connected) {
            try {
                await this._esclient.cluster.health({});
                connected = true;
            } catch (err) {}
        }

        return true;
    }

    // Creates index
    async createIndex() {
        try {
          await this._esclient.indices.create({ index: this.ES_INDEX });
          console.log(`Created index ${this.ES_INDEX}`);
        } catch (err) {
          console.error(`An error occurred while creating the index ${this.ES_INDEX}`);
          console.error(err);
        }
    }

    // Sets item mapping
    async setItemMapping() {
        try {
            // Define mapping
            const itemSchema = {
              title: { type: "text" },
              text: { type: "text" },
              author: { type: "text" },
              type: { type: "text" }
            };
        
            // Apply mapping
            await this._esclient.indices.putMapping({
              index: this.ES_INDEX,
              type: this.ES_TYPE,
              include_type_name: true,
              body: { 
                properties: itemSchema
              } 
            })
        
            console.log(`${this.ES_TYPE} mapping created successfully`);
        
          } catch (err) {
            console.error("An error occurred while setting the mapping");
            console.error(err);
          }
    }

    // Searches and returns items matching a query
    async getItem(q: string) {
        // Search
        const { body: { hits } } = await this._esclient.search<SearchResponse<ESItem>>({
            index: this.ES_INDEX, 
            type: this.ES_TYPE,
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
        const values = hits.hits.map((hit) => {
            return {
                id: hit._id,
                score: hit._score,
                title: hit._source?.title,
                by: hit._source?.author,
                text: hit._source?.text,
                type: hit._source?.type,
            }
        });
        
        return values;    
    }

    // Saves new item into elasticsearch
    async addItem(item: ESItem) {
        // Insert new item
        return this._esclient.index({
            index: this.ES_INDEX,
            type: this.ES_TYPE,
            body: { ...item }
        });
    }
}

const elastic = new Elastic(process.env.ELASTIC_URL!);

export { elastic };