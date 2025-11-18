const homeRoute = require('./home.route')
const authRoute = require('./auth.route')
const authMiddleware = require('../middleware/auth.middleware')
const socialDashboardRoute = require('./socialDashboard.route')
const profileRoute = require('./profile.route')

module.exports = (app) => {
    app.use('/auth', authRoute)
    app.use('/', authMiddleware.requireAuth, homeRoute)
    app.use('/socialDashboard', authMiddleware.requireAuth, socialDashboardRoute)
    app.use('/profile', authMiddleware.requireAuth, profileRoute)
}