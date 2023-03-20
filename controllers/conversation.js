import Converstation from "../models/Conversation.js";

export const createConverstation = async (req, res) => {
    try {
        const { id } = req.user;
        const {  friendId } = req.body;

        // Check if there is a conversation already existing between the two members
        const existingConvo = await Converstation.findOne({
            members: { $all: [id, friendId] }
        });

        if (existingConvo) {
            return res.status(200).json(existingConvo);
        }



        // Create new conversation
        const newConverstation = new Converstation({
            members: [id, friendId]
        });

        const savedConverstation = await newConverstation.save();
        res.status(200).json(savedConverstation);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getConverstation = async (req, res) => {
    try {
        const converstation = await Converstation.find({
            members: {$in:[req.params.converstationId]}
        })
        res.status(200).json(converstation)
    } catch (error) {
        res.status(500).json(error);
    }
}