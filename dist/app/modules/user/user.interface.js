export var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["DOCTOR"] = "DOCTOR";
})(Role || (Role = {}));
export var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
})(Gender || (Gender = {}));
export var DoctorRequest;
(function (DoctorRequest) {
    DoctorRequest["NONE"] = "NONE";
    DoctorRequest["PENDING"] = "PENDING";
    DoctorRequest["REJECTED"] = "REJECTED";
    DoctorRequest["APPROVED"] = "APPROVED";
})(DoctorRequest || (DoctorRequest = {}));
