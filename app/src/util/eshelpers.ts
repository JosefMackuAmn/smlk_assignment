import { SearchResponse } from "@elastic/elasticsearch/api/types";
import { esclient } from "../elastic"

export const ES_INDEX = 'items';
const ES_TYPE = 'item';

export const createIndex = async () => {
    try {
      await esclient.indices.create({ index: ES_INDEX });
      console.log(`Created index ${ES_INDEX}`);
    } catch (err) {
      console.error(`An error occurred while creating the index ${ES_INDEX}`);
      console.error(err);
    }
}

export const setItemMapping = async () => {
    try {
        // Define mapping
        const schema = {
          title: { type: "text" },
          text: { type: "text" },
          author: { type: "text" },
          type: { type: "text" }
        };
    
        // Apply mapping
        await esclient.indices.putMapping({ 
          index: ES_INDEX,
          type: ES_TYPE,
          include_type_name: true,
          body: { 
            properties: schema
          } 
        })
    
        console.log(`${ES_TYPE} mapping created successfully`);
    
      } catch (err) {
        console.error("An error occurred while setting the mapping");
        console.error(err);
      }
}


interface ESItem {
    text: string;
    author: string;
    title: string;
    type: string;
}

export const getItem = async (q: string) => {
    // Search
    const { body: { hits } } = await esclient.search<SearchResponse<ESItem>>({
        index: ES_INDEX, 
        type: ES_TYPE,
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

export const addItem = async (item: ESItem) => {
    // Insert new item
    return esclient.index({
        index: ES_INDEX,
        type: ES_TYPE,
        body: { ...item }
    });
}