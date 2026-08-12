import asyncHandler from "../utils/asyncHandler.js";
import { registerUser, loginUser, getCurrentUser } from "../services/authService.js";

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await registerUser({
        name,
        email,
        password
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user
        }
    });
});


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await loginUser({
        email,
        password
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
    });
});


const getMe = asyncHandler(async (req, res) => {
    const user = await getCurrentUser(req.user.userId);

    res.status(200).json({
        success: true,
        message: "Current user retrieved successfully",
        data: {
            user
        }
    });
});


export {
    register,
    login,
    getMe
};