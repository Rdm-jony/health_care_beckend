"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorPopulatePath = exports.doctorSearChQueryFields = void 0;
exports.doctorSearChQueryFields = ["user.name", "about", "specialization.name"];
exports.doctorPopulatePath = [
    { path: "user", select: "name" },
    { path: "specialization", select: "name" }
];
