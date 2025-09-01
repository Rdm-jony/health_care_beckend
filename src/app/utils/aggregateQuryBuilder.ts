/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import { excludeField } from "../constant/constant";

export class AggregationQueryBuilder {
  private pipeline: any[] = [];
  private readonly query: Record<string, string>;

  constructor(query: Record<string, string>) {
    this.query = query;
  }

  // $lookup for referenced fields (joins)
  lookup(path: string, from: string, localField = path, foreignField = "_id"): this {
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
  filter(): this {
    const filters = { ...this.query };
    for (const field of excludeField) {
      delete filters[field];
    }

    const match: any = {};
    for (const [key, value] of Object.entries(filters)) {
      // handle nested _id fields
      if (key.endsWith("._id")) {
        match[key] = new mongoose.Types.ObjectId(value);
      } else {
        match[key] = value;
      }
    }

    if (Object.keys(match).length) {
      this.pipeline.push({ $match: match });
    }

    return this;
  }

  // Search (supports nested fields like user.name)
  search(searchableFields: string[]): this {
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
  sort(): this {
    const sortStr = this.query.sort || "-createdAt";
    const sort: any = {};

    sortStr.split(",").forEach((field) => {
      const direction = field.startsWith("-") ? -1 : 1;
      sort[field.replace(/^-/, "")] = direction;
    });

    this.pipeline.push({ $sort: sort });

    return this;
  }

  // Fields (projection)
  fields(): this {
    if (this.query.fields) {
      const fieldsArray = this.query.fields.split(",");
      const project: any = {};

      fieldsArray.forEach(field => {
        project[field] = 1;
      });

      this.pipeline.push({ $project: project });
    }

    return this;
  }

  // Pagination
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.pipeline.push({ $skip: skip });
    this.pipeline.push({ $limit: limit });

    return this;
  }

  // Get total documents count (meta)
  async getMeta(model: any) {
    const countPipeline = this.pipeline.filter(stage => !('$skip' in stage || '$limit' in stage));
    countPipeline.push({ $count: "total" });

    const result = await model.aggregate(countPipeline);
    const total = result[0]?.total || 0;
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }

  build() {
    return this.pipeline;
  }
}
