import mongoose from 'mongoose';
const { Schema } = mongoose;

const todosSchema = new Schema({
    createdBy: String,
    title: String,
    task: String,
    createdAt: Date,
    updatedAt: Date
}, { versionKey: false });

const TodosModel = mongoose.model('Todo', todosSchema);

export default TodosModel;