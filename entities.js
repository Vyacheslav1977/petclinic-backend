class Client {
  constructor(id, name = '', pet = null) {
    this.id = id;
    this.name = name;
    this.type = 'Client';
    if (pet !== null) pet.client = this;
    this.pet = pet;
  }
  stringify() {
    let o = {id: this.id, name: this.name};
    o.pet = this.pet === null ? null : {id: this.pet.id, name: this.pet.name};
    return o;
  }
}


class Pet {
  constructor(id, name = '', client = null) {
    this.id = id;
    this.name = name;
    this.type = 'Pet';
    this.client = client;
  }
  stringify() {
    let o = {id: this.id, name: this.name};
    o.client = this.client === null ? null : {id: this.client.id, name: this.client.name};
    return o;
  }
}


module.exports = {
  Client,
  Pet,
};

