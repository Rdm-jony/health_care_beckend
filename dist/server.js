// getting-started.js
import mongoose from "mongoose";
import app from "./app.js";
import { envVars } from "./app/config/env.js";
import { connectRedis } from "./app/config/redis.config.js";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin.js";
let server;
async function startSever() {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected to DB!!✅");
        server = app.listen(envVars.PORT, () => {
            console.log('user auth server running on ✔', envVars.PORT);
        });
    }
    catch (error) {
        console.log(error);
    }
}
(async () => {
    await connectRedis();
    await startSever();
    await seedSuperAdmin();
})();
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received.....Srver shutting down..❎");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..❎");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..❎", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..❎", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
