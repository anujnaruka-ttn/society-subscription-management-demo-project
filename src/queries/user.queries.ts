const FIND_BY_MAIL_QUERY = "SELECT * FROM users WHERE email = $1";
const UPDATE_AUTH_ID_QUERY = "UPDATE users SET auth0_id = $1 WHERE email = $2 RETURNING *";
const CREATE_USER_QUERY_GOOGLE = "INSERT INTO users (name, email, auth0_id, profile_image) VALUES ($1, $2, $3, $4) RETURNING *";
const CREATE_USER_QUERY = "INSERT INTO users (name, email, password, profile_image) VALUES ($1, $2, $3, $4) RETURNING *";
const UPDATE_USER_PASSWORD_QUERY = "UPDATE users SET password = $1 WHERE email = $2 RETURNING *";
const UPDATE_USER_PROFILE_QUERY = "UPDATE users SET name = $1, phone_number = $2, profile_image = $3 WHERE email = $4 RETURNING *";
const GET_ALL_USERS_QUERY = "SELECT id, name, email, role FROM users ORDER BY name ASC";

export {
    FIND_BY_MAIL_QUERY,
    UPDATE_AUTH_ID_QUERY,
    CREATE_USER_QUERY_GOOGLE,
    CREATE_USER_QUERY,
    UPDATE_USER_PASSWORD_QUERY,
    UPDATE_USER_PROFILE_QUERY,
    GET_ALL_USERS_QUERY
}   
