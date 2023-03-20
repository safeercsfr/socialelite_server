import Post from "../models/Post.js";

export const fetchFindByIdData =async (id,data)=>{
    const populatedPost=await Post.findById(id,data)
      .populate("author", "username picturePath")
      .populate("comments.author", "username picturePath")
      .sort({ createdAt: -1 })
      .exec();

      return populatedPost
}
export const fetchFindData =async (data)=>{
    const populatedPost = await Post.find(data)
      .populate("author", "username picturePath")
      .populate("comments.author", "username picturePath")
      .exec();

      return populatedPost
}