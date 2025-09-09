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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const payment_service_1 = require("./payment.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const initPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const result = yield payment_service_1.paymentServices.initPayment(bookingId);
    (0, sendResponse_1.sendResponse)(res, {
        data: result.paymentURL,
        success: true,
        message: "payment initiate successfully",
        statusCode: http_status_codes_1.default.CREATED
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentServices.successPayment(query);
    if (result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentServices.cancelPayment(query);
    if (!result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentServices.failPayment(query);
    if (!result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
exports.paymentController = { initPayment, successPayment, cancelPayment, failPayment };
