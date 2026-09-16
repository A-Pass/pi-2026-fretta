import bcryptjs from 'bcryptjs';
import process from 'process';

export default class PasswordCrypt {

    /**
     * 
     * @param {string} password 
     * @returns {string}
     */
    static encrypt(password) {
        return bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
    }

    /**
     * 
     * @param {string} nonEncryptedPassword 
     * @param {string} encryptedPassword 
     * @returns {boolean}
     */
    static compare(nonEncryptedPassword, encryptedPassword) {
        return bcryptjs.compareSync(nonEncryptedPassword, encryptedPassword);
    }
}