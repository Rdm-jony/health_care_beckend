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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const doctor_model_1 = require("../doctor/doctor.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({ isBlocked: true, role: !user_interface_1.Role.DOCTOR });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const totalPendingRequet = user_model_1.User.countDocuments({
        permitToDoctor: user_interface_1.DoctorRequest.PENDING
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        //stage -1 : Grouping users by role and count total users in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, totalPending, usersByRole] = yield Promise.all([
        totalUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        totalPendingRequet,
        usersByRolePromise,
    ]);
    return {
        totalUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        totalPending,
        usersByRole
    };
});
const getSpecailizeStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalSpecializePromise = doctor_model_1.Specialization.countDocuments();
    const totalSpecializeByName = doctor_model_1.Doctor.aggregate([
        {
            $lookup: {
                from: "specializations",
                localField: "specialization",
                foreignField: "_id",
                as: "specializationDetails"
            },
        },
        { $unwind: "$specializationDetails" },
        {
            $group: {
                _id: "$specializationDetails.name",
                count: { $sum: 1 }
            }
        },
    ]);
    const [totalSpecialize, totalSpecializeByDoctor] = yield Promise.all([
        totalSpecializePromise,
        totalSpecializeByName
    ]);
    return {
        totalSpecialize,
        totalSpecializeByDoctor
    };
});
const getDoctorStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalDoctorPromise = doctor_model_1.Doctor.countDocuments();
    const totalBlockedDoctorsPromise = user_model_1.User.countDocuments({ isBlocked: true, role: user_interface_1.Role.DOCTOR });
    const newDoctorsInLast7DaysPromise = doctor_model_1.Doctor.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newDoctorsInLast30DaysPromise = doctor_model_1.Doctor.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const [totalDoctors, totalBlockedDoctors, newDoctorsInLast7Days, newDoctorsInLast30Days] = yield Promise.all([
        totalDoctorPromise,
        totalBlockedDoctorsPromise,
        newDoctorsInLast7DaysPromise,
        newDoctorsInLast30DaysPromise
    ]);
    return {
        totalDoctors,
        totalBlockedDoctors,
        newDoctorsInLast7Days,
        newDoctorsInLast30Days
    };
});
exports.StatsService = {
    getUserStats,
    getSpecailizeStats,
    getDoctorStats
};
