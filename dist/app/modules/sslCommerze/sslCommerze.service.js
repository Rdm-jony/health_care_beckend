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
exports.SSLService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sslPaymentInit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: env_1.envVars.SSL.SSL_STORE_ID,
            store_passwd: env_1.envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${env_1.envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${env_1.envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=false`,
            cancel_url: `${env_1.envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=false`,
            // ipn_url: "http://localhost:3030/ipn",
            shipping_method: "N/A",
            product_name: "Appoinment",
            product_category: "Service",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "N/A",
            cus_state: "N/A",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phone,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        };
        const response = yield (0, axios_1.default)({
            method: "POST",
            data: data,
            url: env_1.envVars.SSL.SSL_PAYMENT_API,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data;
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
    }
});
exports.SSLService = {
    sslPaymentInit
};
