export class ValidatorService {
    constructor() {}
    
    verifyPassword(password) {
        if ((password.length >= 6) && (password.length <= 16)) {
            return this._verify(password)
        } else {
            return false
        }
    }

    verifyUsername(username) {
        if (username.length <= 12) {
            return this._verify(username)
        } else {
            return false
        }
    }

    _verify(string) {
        if (string.match(/\W/g) == null) {
            return true
        }

        return false
    }
}