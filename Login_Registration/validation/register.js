const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    // we start of with an empty errors object and if all the input data is valid, then by the end of the function execution, this object will remain empty.
    let errors = {}

    // convert all empty input by user to an empty string. Otherwise the next set of validators are not gonna work, as the validator library only works with string
    data.fname = !isEmpty(data.fname) ? data.fname : '';
    data.lname = !isEmpty(data.lname) ? data.lname : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.rppassword = !isEmpty(data.rppassword) ? data.rppassword : '';

    if (!Validator.isLength(data.fname, {
            min: 2,
            max: 30
        })) {
        errors.fname = 'Name must be between 2 and 30 characters';
    }

    if (!Validator.isLength(data.lname, {
            min: 2,
            max: 30
        })) {
        errors.lname = 'Name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.fname)) {
        errors.fname = 'Name field is required'
    }

    if (Validator.isEmpty(data.lname)) {
        errors.lname = 'Name field is required'
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required'
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email entered is invalid'
    }

    if (Validator.isEmpty(data.phone)) {
        errors.phone = 'Phone Number field is required'
    }

    if (!Validator.isMobilePhone(data.phone)) {
        errors.phone = 'Phone Number entered is invalid'
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required'
    }

    if (!Validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = "Password must be at least 6 character"
    }

    if (Validator.isEmpty(data.rppassword)) {
        errors.rppassword = 'Confirm Password field is required'
    }

    if (!Validator.equals(data.password, data.rppassword)) {
        errors.rppassword = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

}