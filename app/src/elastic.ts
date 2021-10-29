import { Client } from "@elastic/elasticsearch";

const url = process.env.ELASTIC_URL;

const esclient = new Client({ node: url });

export const checkConnection = () => {
    return new Promise(async (resolve) => {
        let connected = false;
    
        while (!connected) {
            try {
                await esclient.cluster.health({});
                connected = true;
            } catch (err) {}
        }

        resolve(true);
    });
}

export * from './util/eshelpers';
export { esclient };