// Port
process.env.PORT = process.env.PORT || 80;

// Deployment
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//Database
let dbUrl = "mongodb://localhost:27017/cafe";
if (process.env.NODE_ENV !== "dev") {
    dbUrl = process.env.MONGO_DBURL;
}
process.env.DBURL = dbUrl;