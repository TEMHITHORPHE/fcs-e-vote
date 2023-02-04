

const { createClient } = require('@supabase/supabase-js');


// CLIENT API KEY
const SupabaseKey = process.env.SUPABASE_ANON_KEY

// PROJECT URL
const SupabaseUrl = process.env.SUPABASE_URL

const supabase = createClient(SupabaseUrl, SupabaseKey);

module.exports.supabase = supabase;



const { MongoClient } = require("mongodb");

// Connection URI
// const uri = "mongodb+srv://sample-hostname:27017/?maxPoolSize=20&w=majority";
const uri = process.env.MONGO_DB_CONNECTION_URI;

// Create a new MongoClient
const client = new MongoClient(uri);

module.exports.client = client;


async function run() {
	try {
		// Connect the client to the server (optional starting in v4.7)
		await client.connect();
		// Establish and verify connection
		await client.db("admin").command({ ping: 1 });
		console.log("Connected successfully to server");
		
		console.log(client.db('e-vote'));
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);
