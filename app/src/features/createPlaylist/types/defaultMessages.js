'use strict';

const defaultMessages = {
  // English language - Used by default
  en: {
    numbers: 'The field "{0}" must be a valid number.',
    email: 'The field "{0}" must be a valid email address.',
    required: 'The field "{0}" is mandatory.',
    date: 'The field "{0}" must be a valid date ({1}).',
    minlength: 'The field "{0}" length must be greater than {1}.',
    maxlength: 'The field "{0}" length must be lower than {1}.',
    equalPassword: 'Passwords are different.',
    hasUpperCase: 'The field "{0}" must contain a upper case.',
    hasLowerCase: 'The field "{0}" must contain a lower case.',
    hasNumber: 'The field "{0}" must contain a number.',
    hasSpecialCharacter: 'The field "{0}" must contain a special character.',
    range: 'Please enter a value between 3 and 100.'
  },
};

export default defaultMessages;
