const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

/**
 * POST /api/auth/signup
 * Register a new user
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Create user (password hashed via model hook)
    const user = await User.create({ name, email, password, role: role || 'member' });

    // Generate JWT
    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/profile
 * Get current authenticated user's profile
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by authenticate middleware
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/users
 * Get all users (admin only, used for task assignment)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['name', 'ASC']],
    });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getProfile, getAllUsers };
