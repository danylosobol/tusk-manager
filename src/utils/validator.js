export const validator = {
  regexValidator: (value, regex) => !!String(value).toLowerCase().match(regex),
  email: (value) =>
    validator.regexValidator(
      value,
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ),
  password: (value) =>
    validator.regexValidator(value, /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/),
  notEmpty: (value) => typeof value === 'string' && value.trim().length > 0,
}
