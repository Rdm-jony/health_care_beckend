import httpStatus from "http-status-codes";
const notFound = (req, res) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Route Not Found"
    });
};
export default notFound;
