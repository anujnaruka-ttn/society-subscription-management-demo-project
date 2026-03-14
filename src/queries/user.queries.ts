const FIND_BY_MAIL_QUERY = "SELECT * FROM users WHERE email = $1";
const UPDATE_AUTH_ID_QUERY = "UPDATE users SET auth0_id = $1 WHERE email = $2 RETURNING *";
const CREATE_USER_QUERY_GOOGLE = "INSERT INTO users (name, email, auth0_id) VALUES ($1, $2, $3) RETURNING *";
const CREATE_USER_QUERY = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";

export {
    FIND_BY_MAIL_QUERY,
    UPDATE_AUTH_ID_QUERY,
    CREATE_USER_QUERY_GOOGLE,
    CREATE_USER_QUERY
}
