// Authorise as admin
function authAsAdmin(request, response, next) {
    // Check if the user is admin
    if (request.user.is_admin) {
        // If user is admin, continue to next middleware
        next();
    } else {
        // Handle error if user is not admin
        return response.status(403).json({
            error: "You do not have authorisation to proceed. You must be an administrator."
        });
    };
};

// Authorise as hairstylist
function authAsHairstylist(request, response, next) {
    // Check if the user is a hairstylist
    if (request.user.is_hairstylist) {
        // If user is hairstylist, continue to next middleware
        console.log("Authorised as hairstylist");
        next();
    } else {
        // Handle error if user is not hairstylist
        return response.status(403).json({
            error: "You do not have authorisation to proceed."
        });
    };
}

// Authorise as logged in user is target user
// uses params: userId
function authAsUser(request, response, next) {
    const loggedInUser = request.user.user_id;
    const targetUser = request.params.id;
    // Check  if the logged in user is the user
    if (loggedInUser === targetUser) {
        console.log("Authorised as logged in user");
        next();
    } else {
        // Handle error if logged in user is not the user
        return response.status(403).json({
            error: "You do not have authorisation to proceed."
        });
    };
}

// Authorise as admin or user (hairstylist/customer)
// uses params: userId
function authAsAdminOrUser(request, response, next) {
    const loggedInUser = request.user.user_id;
    const targetUser = request.params.id;
    // Check  if the logged in user is the user
    if (request.user.is_admin || loggedInUser === targetUser) {
        // console.log("Authorised as admin, or logged in user");
        next();
    } else {
        // Handle error if logged in user is not the user
        return response.status(403).json({
            error: "You do not have authorisation to proceed."
        });
    };
}


module.exports = {
    authAsAdmin,
    authAsHairstylist,
    authAsUser,
    authAsAdminOrUser
};