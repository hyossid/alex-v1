
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.10.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

import { 
    fixedWeightPool,
  } from './models/alex-tests-fixed-weight-pool.ts';
  
Clarinet.test({
    name: "Fixed Weight Pool creation, adding values and swapping",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!;
        let wallet_1 =accounts.get('wallet_1')!;
        let fixedWeightPool = new fixedWeightPool(chain, deployer);
        
        
        let block = chain.mineBlock([
            /* 
             * Add transactions with: 
             * Tx.contractCall(...)
            */
            Tx.contractCall('fixed-weight-pool','get-pool-count',[],wallet_1.address),
            Tx.contractCall('fixed-weight-pool','create-pool',[],wallet_1.address),
            Tx.contractCall('fixed-weight-pool','add-to-position',[types.utf8("testing")],wallet_1.address),
            Tx.contractCall('fixed-weight-pool','reduce-position',[],wallet_1.address)

        ]);
        assertEquals(block.receipts.length, 4);
        assertEquals(block.height, 2);

        block.receipts[0].result.expectUtf8("Hello World!");

        block = chain.mineBlock([
            /* 
             * Add transactions with: 
             * Tx.contractCall(...)
            */
           
        ]);
        assertEquals(block.receipts.length, 0);
        assertEquals(block.height, 3);
    },
});
