// signIn, login
export const confirmEmail = "SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail";

export const insertUserSql = "INSERT INTO user (email, password, nickname) VALUES (?, ?, ?);";

export const getUserID = "SELECT * FROM user WHERE user_id = ?";

export const confirmNick = "SELECT EXISTS(SELECT 1 FROM user WHERE nickname = ?) as isExistNick";

export const getUserIdFromLoginId = "SELECT user_id FROM user WHERE email = ?";

export const getUserPassword = "SELECT password FROM user WHERE email = ?";