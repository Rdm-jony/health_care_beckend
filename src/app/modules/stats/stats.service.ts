import { Doctor, Specialization } from "../doctor/doctor.model";
import { DoctorRequest, Role } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = async () => {
    const totalUsersPromise = User.countDocuments()

    const totalBlockedUsersPromise = User.countDocuments({ isBlocked: true, role: !Role.DOCTOR })

    const newUsersInLast7DaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newUsersInLast30DaysPromise = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })
    const totalPendingRequet = User.countDocuments({
        permitToDoctor: DoctorRequest.PENDING
    })

    const usersByRolePromise = User.aggregate([
        //stage -1 : Grouping users by role and count total users in each role

        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }

    ])
    const [totalUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, totalPending, usersByRole] = await Promise.all([
        totalUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        totalPendingRequet,
        usersByRolePromise,

    ])
    return {
        totalUsers,

        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        totalPending,
        usersByRole
    }
}

const getSpecailizeStats = async () => {
    const totalSpecializePromise = Specialization.countDocuments()
    const totalSpecializeByName = Doctor.aggregate([
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

    ])
    const [totalSpecialize, totalSpecializeByDoctor] = await Promise.all([
        totalSpecializePromise,
        totalSpecializeByName
    ])

    return {
        totalSpecialize,
        totalSpecializeByDoctor
    }

}

const getDoctorStats = async () => {
    const totalDoctorPromise = Doctor.countDocuments()
    const totalBlockedDoctorsPromise = User.countDocuments({ isBlocked: true, role: Role.DOCTOR })
    const newDoctorsInLast7DaysPromise = Doctor.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newDoctorsInLast30DaysPromise = Doctor.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const [totalDoctors, totalBlockedDoctors, newDoctorsInLast7Days, newDoctorsInLast30Days] =await Promise.all([
        totalDoctorPromise,
        totalBlockedDoctorsPromise,
        newDoctorsInLast7DaysPromise,
        newDoctorsInLast30DaysPromise
    ])
    return {
        totalDoctors,
        totalBlockedDoctors,
        newDoctorsInLast7Days,
        newDoctorsInLast30Days
    }

}
export const StatsService = {
    getUserStats,
    getSpecailizeStats,
    getDoctorStats
}