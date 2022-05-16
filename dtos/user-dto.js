module.exports = class UserDto {
  id
  email
  firstName
  lastName
  secondName
  phone
  roleId
  role
  iin

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.secondName = model.secondName;
    this.phone = model.phone;
    this.roleId = model.roleId;
    this.iin = model.iin;
    if (model.role)
      this.role = model.role;
  }
}