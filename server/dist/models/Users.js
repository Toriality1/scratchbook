import mongoose from "mongoose";
const { Schema, model } = mongoose;
const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    notes: {
        type: [Schema.Types.ObjectId],
        default: [],
    },
}, {
    timestamps: true,
});
const Users = model("Users", usersSchema);
export default Users;
//# sourceMappingURL=Users.js.map