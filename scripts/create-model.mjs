import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

if (!process.env.SEED) {
    throw new Error("Missing SEED environment variable");
}

// The seed must be provided as an environment variable
const seed = fromString(process.env.SEED, "base16");
// Create and authenticate the DID
const did = new DID({
    provider: new Ed25519Provider(seed),
    resolver: getResolver(),
});
await did.authenticate();

// Connect to the local Ceramic node
const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
ceramic.did = did;

// Create a manager for the model
const manager = new ModelManager(ceramic);

// Create the schemas
// Contents
const liveStreamSchemaID = await manager.createSchema("LiveStream", {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Live stream",
    type: "object",
    properties: {
        description: {
            type: "string",
            title: "Description",
        },
        date: {
            type: "string",
            format: "date-time",
            title: "Date",
            maxLength: 30,
        },
        livepeerId: {
            type: "string",
            format: "uuid",
            title: "Livepeer stream ID",
            maxLength: 36,
        },
        cover: {
            $ref: "#/definitions/IPFSUrl",
        },
        tags: {
            type: "string",
            title: "Tags",
        },
        lockAddress: {
            type: "string",
            title: "Lock address",
            maxLength: 42,
        },
    },
    definitions: {
        IPFSUrl: {
            type: "string",
            pattern: "^ipfs://.+",
            maxLength: 150,
        },
    },
});
const contentsSchemaID = await manager.createSchema("Contents", {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Contents list",
    type: "object",
    properties: {
        contents: {
            type: "array",
            title: "Live streams",
            items: {
                type: "string",
                title: "Live stream ID",
                $comment: `cip88:ref:${manager.getSchemaURL(
                    liveStreamSchemaID
                )}`,
                pattern: "^ceramic://.+(\\?version=.+)?",
                maxLength: 150,
            },
        },
    },
});
// Creators
const creatorSchemaID = await manager.createSchema("Creator", {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Creator",
    type: "object",
    properties: {
        artistName: {
            type: "string",
            title: "Artist name",
        },
        description: {
            type: "string",
            maxLength: 420,
        },
        youtube: {
            type: "string",
            maxLength: 50,
        },
        pfp: {
            $ref: "#/definitions/IPFSUrl",
        },
        cover: {
            $ref: "#/definitions/IPFSUrl",
        },
    },
    definitions: {
        IPFSUrl: {
            type: "string",
            pattern: "^ipfs://.+",
            maxLength: 150,
        },
    },
});
const creatorsSchemaID = await manager.createSchema("Creators", {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Creators list",
    type: "object",
    properties: {
        creators: {
            type: "array",
            title: "Creators",
            items: {
                type: "string",
                title: "Creator DID",
                maxLength: 150,
            },
        },
    },
});

// Create the definition using the created schema ID
await manager.createDefinition("contents", {
    name: "contents",
    description: "Content created by creators",
    schema: manager.getSchemaURL(contentsSchemaID),
});
await manager.createDefinition("creators", {
    name: "creators",
    description: "Creators list",
    schema: manager.getSchemaURL(creatorsSchemaID),
});
await manager.createDefinition("creator", {
    name: "creator",
    description: "Creator profile",
    schema: manager.getSchemaURL(creatorSchemaID),
});
await manager.createDefinition("liveStream", {
    name: "liveStream",
    description: "Live stream",
    schema: manager.getSchemaURL(liveStreamSchemaID),
});

// Write model to JSON file
await writeFile(
    new URL("model.json", import.meta.url),
    JSON.stringify(manager.toJSON())
);
console.log("Encoded model written to scripts/model.json file");
