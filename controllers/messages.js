import Message from "../models/Message.js";


export const createMessage = async (req, res) => {
    try {
        
        const newMessage = new Message(req.body);

        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            converstationId: req.params.converstationId,
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
}