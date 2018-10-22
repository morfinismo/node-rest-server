// Port
process.env.PORT = process.env.PORT || 80;

// Deployment
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//Database
let dbUrl = "mongodb://localhost:27017/cafe";
if (process.env.NODE_ENV !== "dev") {
    dbUrl = "mongodb://frank:zxc123@ds237713.mlab.com:37713/cafe";
}
process.env.DBURL = dbUrl;