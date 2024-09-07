import { Injectable } from '@nestjs/common';
import { HypersyncClient, presetQueryLogs } from "@envio-dev/hypersync-client";


// https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks

// http://localhost:4000/game/data?contractAddress=0x9E6Fc3Ef8850f97D7FfE5562a290c071d541bbFb
const url = 'https://sepolia.hypersync.xyz';
@Injectable()
export class DataService {

  async getLogs(contractAddress:string): Promise<any> {
    console.log('get logs from contract', contractAddress);
    // Create hypersync client using the mainnet hypersync endpoint
    const client = HypersyncClient.new({
        url
    });


    // ignore to block
    // query is inclusive of from_block, exclusive of to_block so this will return 49 blocks
    let query = presetQueryLogs(contractAddress, 17_000_000);



    console.log("Running the query...");

    // Run the query once, the query is automatically paginated so it will return when it reaches some limit (time, response size etc.)
    //  there is a nextBlock field on the response object so we can set the fromBlock of our query to this value and continue our query until
    // res.nextBlock is equal to res.archiveHeight or query.toBlock in case we specified an end block.
    const res = await client.get(query);

    console.log(`Query returned ${res.data.logs.length} logs from contract ${contractAddress}`)


    return res.data;
  }
}
