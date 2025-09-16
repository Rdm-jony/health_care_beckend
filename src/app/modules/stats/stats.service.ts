import { DoctorRequest } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = async () => {
    const totalUsersPromise = User.countDocuments()

    const totalBlockedUsersPromise = User.countDocuments({ isBlocked: true })

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
    const [totalUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days,totalPending, usersByRole] = await Promise.all([
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
export const StatsService = {
    getUserStats
}