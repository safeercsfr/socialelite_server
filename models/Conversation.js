import mongoose from 'mongoose';

const converstationSchema = new mongoose.Schema(
    {
        members: {
            type:Array,
        },
    },
    {timestamps: true}
);

const Converstation = mongoose.model('Converstation', converstationSchema);

export default Converstation;
