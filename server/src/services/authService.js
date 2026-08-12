import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import AppError from '../utils/AppError.js';

import { findRoleByName, findUserByEmail, findUserById, createUser } from '../repositories/userRepository.js';


const registerUser = async ({ name, email, password }) => {

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new AppError(
            "User with this email already exists",
            409
        );
    }

    const role = await findRoleByName("EMPLOYEE");

    if (!role) {
        throw new AppError(
            "Default user role is not configured",
            500
        );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUser({
        roleId: role.id,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
    });

    return user;
};


const loginUser = async ({ email, password }) => {

    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    if (!user.is_active) {
        throw new AppError(
            "User account is inactive",
            403
        );
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};


const getCurrentUser = async (userId) => {

    const user = await findUserById(userId);

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    if (!user.is_active) {
        throw new AppError(
            "User account is inactive",
            403
        );
    }

    return user;
};


export {
    registerUser,
    loginUser,
    getCurrentUser
};