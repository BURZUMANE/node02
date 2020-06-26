const fs = require("fs").promises;
const path = require("path");
const uuid = require("uuid");
const contactsPath = path.join(__dirname, "/db", "contacts.json");
const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    return data;
  });
  return JSON.parse(data);
};

const addContact = async (name, email, phone, id) => {
  const contact = { name, email, phone, id };
  const contacts = await listContacts();
  contacts.push(contact);
  await fs.writeFile(
    path.join(__dirname, "/db", "contacts.json"),
    JSON.stringify(contacts, null, 2),
    {},
    err => {
      if (err) throw err;
    },
  );
};
const removeContact = async contactId => {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(
    item => item.id !== parseInt(contactId),
  );
  if (contacts.length === filteredContacts.length) return false;
  await fs.writeFile(
    path.join(__dirname, "/db", "contacts.json"),
    JSON.stringify(filteredContacts, null, 2),
    {},
    err => {
      if (err) throw err;
    },
  );
  return true;
};

const updateContact = async body => {
  await fs.writeFile(
    path.join(__dirname, "/db", "contacts.json"),
    JSON.stringify(body, null, 2),
    {},
    err => {
      if (err) throw err;
    },
  );
  return true;
};

const validate = ({ name, email, phone }) => {
  const errors = {};
  if (name === "") {
    errors.name = "name must not be empty";
  }
  if (email === "") {
    errors.phone = "email must not be empty";
  }
  if (phone === "") {
    errors.email = "phone must not be empty";
  }
  return errors;
};
const helpers = {
  getContactById(req, res) {
    const contacts = require("./db/contacts.json");
    const actualId = req.params.contactId;
    const contactById = contacts.find(contact => contact.id == actualId);
    if (contactById) return res.status(200).json(contactById);
    return res.status(404).json({ message: "Not found" });
  },
  getContacts(req, res) {
    const contacts = require("./db/contacts.json");
    res.status(200).json(contacts);
  },
  postContact(req, res) {
    const errors = validate(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json(errors);
    } else {
      const newContact = {
        ...req.body,
        id: uuid.v4(),
      };
      addContact(
        newContact.name,
        newContact.email,
        newContact.phone,
        newContact.id,
      );
      return res.status(201).json(newContact);
    }
  },
  async deleteContact(req, res) {
    const actualId = req.params.contactId;
    const result = await removeContact(actualId);
    if (!result) {
      return res.status(404).json({ message: "Not found" });
    } else {
      return res.status(200).json({ message: "contact deleted" });
    }
  },
  async updateContact(req, res) {
    const actualId = req.params.contactId;
    const errors = validate(req.body);
    if (Object.keys(errors).length) return res.json({ ...errors });
    const contacts = await listContacts();
    const contactIdx = contacts.findIndex(
      user => user.id === parseInt(actualId),
    );
    if (contactIdx === -1)
      return res.status(200).json({ message: "Not found" });
    contacts[contactIdx] = { ...contacts[contactIdx], ...req.body };
    updateContact(contacts);
    return res.status(200).json(contacts[contactIdx]);
  },
};

module.exports = helpers;
