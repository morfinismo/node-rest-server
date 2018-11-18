// Port
process.env.PORT = process.env.PORT || 80;


// Deployment
process.env.NODE_ENV = process.env.NODE_ENV || "dev";


// Token Expiration : 60 * 60 * 24 * 30
process.env.TOKEN_EXP = 60 * 60 * 24 * 30;


//Authentication seed
process.env.SEED = process.env.SEED || "dev-seed";


//Database
let dbUrl = "mongodb://localhost:27017/cafe";
if (process.env.NODE_ENV !== "dev") {
    dbUrl = process.env.MONGO_DBURL;
}
process.env.DBURL = dbUrl;