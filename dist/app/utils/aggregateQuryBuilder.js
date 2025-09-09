"use strict";
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationQueryBuilder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constant_1 = require("../constant/constant");
class AggregationQueryBuilder {
    constructor(query) {
        this.pipeline = [];
        this.query = query;
    }
    // $lookup for referenced fields (joins)
    lookup(path, from, localField = path, foreignField = "_id") {
        this.pipeline.push({
            $lookup: {
                from,
                localField,
                foreignField,
                as: path,
            },
        });
        // $unwind to make the joined object accessible
        this.pipeline.push({
            $unwind: {
                path: `$${path}`,
                preserveNullAndEmptyArrays: true,
            },
        });
        return this;
    }
    // Filtering
    filter() {
        const filters = Object.assign({}, this.query);
        for (const field of constant_1.excludeField) {
            delete filters[field];
        }
        const match = {};
        for (const [key, value] of Object.entries(filters)) {
            // handle nested _id fields
            if (key.endsWith("._id")) {
                match[key] = new mongoose_1.default.Types.ObjectId(value);
            }
            else {
                match[key] = value;
            }
        }
        if (Object.keys(match).length) {
            this.pipeline.push({ $match: match });
        }
        return this;
    }
    // Search (supports nested fields like user.name)
    search(searchableFields) {
        const searchTerm = this.query.searchTerm;
        if (searchTerm) {
            const orConditions = searchableFields.map(field => ({
                [field]: { $regex: searchTerm, $options: "i" },
            }));
            this.pipeline.push({ $match: { $or: orConditions } });
        }
        return this;
    }
    // Sort
    sort() {
        const sortStr = this.query.sort || "-createdAt";
        const sort = {};
        sortStr.split(",").forEach((field) => {
            const direction = field.startsWith("-") ? -1 : 1;
            sort[field.replace(/^-/, "")] = direction;
        });
        this.pipeline.push({ $sort: sort });
        return this;
    }
    // Fields (projection)
    fields() {
        if (this.query.fields) {
            const fieldsArray = this.query.fields.split(",");
            const project = {};
            fieldsArray.forEach(field => {
                project[field] = 1;
            });
            this.pipeline.push({ $project: project });
        }
        return this;
    }
    // Pagination
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.pipeline.push({ $skip: skip });
        this.pipeline.push({ $limit: limit });
        return this;
    }
    // Get total documents count (meta)
    getMeta(model) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const countPipeline = this.pipeline.filter(stage => !('$skip' in stage || '$limit' in stage));
            countPipeline.push({ $count: "total" });
            const result = yield model.aggregate(countPipeline);
            const total = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            return {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            };
        });
    }
    build() {
        return this.pipeline;
    }
}
exports.AggregationQueryBuilder = AggregationQueryBuilder;
