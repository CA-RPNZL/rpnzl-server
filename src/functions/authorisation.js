// Authorise as admin
function authAsAdmin(request, response, next) {
    // Check if the user is admin
    if (request.user.is_admin) {
        // If user is admin, continue to next middleware
        next();
    } else {
        // Handle error if user is not admin
        return response.status(403).json({
            error: "You do not have authorisation to proceed."
        });
    };
};


// Authorise as user
function authAsUser(request, response, next) {
    // Check  if the logged in user is the user
}


module.exports = {
    authAsAdmin
};