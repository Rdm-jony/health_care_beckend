"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRequest = exports.Gender = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["DOCTOR"] = "DOCTOR";
})(Role || (exports.Role = Role = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
})(Gender || (exports.Gender = Gender = {}));
var DoctorRequest;
(function (DoctorRequest) {
    DoctorRequest["NONE"] = "NONE";
    DoctorRequest["PENDING"] = "PENDING";
    DoctorRequest["REJECTED"] = "REJECTED";
    DoctorRequest["APPROVED"] = "APPROVED";
})(DoctorRequest || (exports.DoctorRequest = DoctorRequest = {}));
