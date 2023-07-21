"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const DB = process?.env?.DATABASE?.replace("<password>", `${process.env.DATABASE_PASSWORD}`);
mongoose_1.default.set("strictQuery", true);
const PORT = process?.env?.PORT || 8000;
const listener = async () => {
    if (!DB) {
        console.log("A connection string is required to connect to the DB");
        return;
    }
    try {
        await mongoose_1.default.connect(DB);
        const server = app_1.default.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
    }
    catch (error) {
        console.log(error);
    }
};
listener();
