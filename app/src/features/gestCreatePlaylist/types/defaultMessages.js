'use strict';

const defaultMessages = {
  ja: {
    numbers: '数値のみを入力してください。',
    email: '"{0}" は有効なメールアドレスでなければなりません。',
    required: '再生時間を入力してください。',
    date: '"{0}" は有効な日付である必要があります ({1}).',
    minlength: '"{0}" の長さは {1} より大きい必要があります。',
    maxlength: '"{0}" の長さは {1} より小さい必要があります。',
    equalPassword: 'パスワードが異なります。',
    hasUpperCase: '"{0}" に大文字が含まれている必要があります。',
    hasLowerCase: '"{0}" に小文字が含まれている必要があります。',
    hasNumber: '"{0}" に数字が含まれている必要があります。',
    hasSpecialCharacter: '"{0}" に特殊文字が含まれている必要があります。',
    range: '再生時間は3分から100分の間で指定してください。'
  },
  en: {
    numbers: 'The field "{0}" must be a valid number.',
    email: 'The field "{0}" must be a valid email address.',
    required: 'This field is required',
    date: 'The field "{0}" must be a valid date ({1}).',
    minlength: 'The field "{0}" length must be greater than {1}.',
    maxlength: 'The field "{0}" length must be lower than {1}.',
    equalPassword: 'Passwords are different.',
    hasUpperCase: 'The field "{0}" must contain a upper case.',
    hasLowerCase: 'The field "{0}" must contain a lower case.',
    hasNumber: 'The field "{0}" must contain a number.',
    hasSpecialCharacter: 'The field "{0}" must contain a special character.',
    range: 'Please enter a value between 3 and 100.'
  }
};

export default defaultMessages;
