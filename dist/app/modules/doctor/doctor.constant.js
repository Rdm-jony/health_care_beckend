export const doctorSearChQueryFields = ["user.name", "about", "specialization.name"];
export const doctorPopulatePath = [
    { path: "user", select: "name" },
    { path: "specialization", select: "name" }
];
