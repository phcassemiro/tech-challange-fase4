"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/route.ts
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const postRoutes_1 = __importDefault(require("./postRoutes"));
const router = express_1.default.Router();
router.use(authRoutes_1.default);
router.use(postRoutes_1.default);
exports.default = router;
//# sourceMappingURL=route.js.map