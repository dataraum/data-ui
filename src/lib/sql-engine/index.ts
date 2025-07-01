import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import duckdb_wasm_coi from '@duckdb/duckdb-wasm/dist/duckdb-coi.wasm?url';
import coi_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-coi.worker.js?url';
import coi_pt_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-coi.pthread.worker.js?url';
import type { Table } from 'apache-arrow';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
        mainModule: duckdb_wasm,
        mainWorker: mvp_worker,
    },
    eh: {
        mainModule: duckdb_wasm_eh,
        mainWorker: eh_worker,
    },
    coi: {
        mainModule: duckdb_wasm_coi,
        mainWorker: coi_worker,
        pthreadWorker: coi_pt_worker,
    },
};


let db: duckdb.AsyncDuckDB;
let connection: duckdb.AsyncDuckDBConnection | null = null;

export async function initSqlEngine(): Promise<void> {
    // Select a bundle based on browser checks
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    // Instantiate the asynchronous version of DuckDB-wasm
    const worker = new Worker(bundle.mainWorker!, { credentials: 'include', type: 'module', name: 'sql_engine' });
    const logger = new duckdb.ConsoleLogger();
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
}

async function getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
    if (connection === null) {
        connection = await db.connect();
    }
    return connection;
}

export async function closeConnection(): Promise<void> {
    if (connection !== null) {
        await connection.close();
        connection = null;
    }
}

export async function registerCsvFile(file: File, csvFileName: string): Promise<void> {
    // Execute a query to register the CSV file in DuckDB
    await db.registerFileHandle(csvFileName, file, duckdb.DuckDBDataProtocol.BROWSER_FILEREADER, true);;
}

export async function sampleCsvData(csvFileName: string): Promise<Table> {
    // Execute a query to read the CSV file with a sample size of -1 (all rows)
    return (await getConnection()).query(`SELECT * FROM read_csv('${csvFileName}', sample_size = 300);`);
}