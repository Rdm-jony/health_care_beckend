import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatsService } from "./stats.service.js";
const getUserStats = catchAsync(async (req, res) => {
    const stats = await StatsService.getUserStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});
const getSpecializeStats = catchAsync(async (req, res) => {
    const stats = await StatsService.getSpecailizeStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Specialization stats fetched successfully",
        data: stats,
    });
});
const getDoctorStats = catchAsync(async (req, res) => {
    const stats = await StatsService.getDoctorStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor stats fetched successfully",
        data: stats,
    });
});
export const StatsController = {
    getUserStats,
    getSpecializeStats,
    getDoctorStats
};
