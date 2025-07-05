const mongoose = require("mongoose");

const credSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "customer" },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "customers", required: true } // Foreign key
});

const Cred = mongoose.model("creds", credSchema);

module.exports = Cred;
