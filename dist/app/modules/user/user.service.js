"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const queryBuilder_1 = require("../../utils/queryBuilder");
const doctor_model_1 = require("../doctor/doctor.model");
const user_constants_1 = require("./user.constants");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const email = payload.email;
    const isUserExists = yield user_model_1.User.findOne({ email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user already exists!!");
    }
    const hashPassword = bcryptjs_1.default.hashSync(payload.password, parseInt(env_1.envVars.BCRYPT_SALT));
    const authProvider = {
        provider: 'credentials',
        providerId: email
    };
    const user = yield user_model_1.User.create(Object.assign(Object.assign({}, payload), { auth: [authProvider], password: hashPassword }));
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (isUserExists.role == user_interface_1.Role.DOCTOR) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "doctor profile is not update in this route");
    }
    if (decodedToken.role === user_interface_1.Role.USER) {
        if (decodedToken.userId !== userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are unauthorized to update another users profile");
        }
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN && isUserExists.role == user_interface_1.Role.SUPER_ADMIN) {
        if (decodedToken.userId !== userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update superadmin profile");
        }
    }
    if (payload.role) {
        if (decodedToken.role == user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        if (payload.role == user_interface_1.Role.SUPER_ADMIN && decodedToken.role == user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select("-password");
    if (isUserExists.picture) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isUserExists.picture);
    }
    return newUpdatedUser;
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = queryBuilder
        .search(user_constants_1.userSearchField)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        users.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId).select("-password");
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    return isUserExists;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId).select("-password");
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    if (isUserExists.role === user_interface_1.Role.DOCTOR) {
        const findDoctor = yield doctor_model_1.Doctor.findOne({ user: userId });
        if (!findDoctor) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "doctor profile not found!");
        }
        const specializaion = yield doctor_model_1.Specialization.findById(findDoctor.specialization);
        if (!specializaion) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "specilaization  not found!");
        }
        // Flatten the user object into the doctor document
        const doctorData = __rest(findDoctor.toObject(), []); // convert Mongoose doc to plain object
        const flattenedDoctor = Object.assign(Object.assign({}, doctorData), { specialize: specializaion.name, name: isUserExists.name, email: isUserExists.email, phone: isUserExists.phone, address: isUserExists.address, gender: isUserExists.gender, 
            // add other user fields as needed:
            picture: isUserExists.picture, isDeleted: isUserExists.isDeleted, isVerified: isUserExists.isVerified, role: isUserExists.role, auth: isUserExists.auth, permitToDoctor: isUserExists.permitToDoctor });
        return flattenedDoctor;
    }
    return isUserExists;
});
const sendDoctorRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    isUserExist.permitToDoctor = user_interface_1.DoctorRequest.PENDING;
    isUserExist.save();
});
const getAllPendingRequest = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find({ permitToDoctor: user_interface_1.DoctorRequest.PENDING }), query);
    const transaction = queryBuilder
        // .search(transactionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        transaction.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
exports.userService = {
    createUser,
    getAllUser,
    updateUser,
    getMe,
    getSingleUser,
    sendDoctorRequest,
    getAllPendingRequest
};
