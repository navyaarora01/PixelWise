import express from "express";
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary'; //this is the home page so cloudinary is used to store the images

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

//GET ALL POSTS
router.route('/').get(async (req, res) => {  //route for showing all the image
    try {
      const posts = await Post.find({});
      res.status(200).json({ success: true, data: posts });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
    }
  });

//CREATE A POST
router.route('/').post(async (req, res) => {  //uploading and posting the single image
try {
    const { name, prompt, photo } = req.body;   // data getting from frontend
    const photoUrl = await cloudinary.uploader.upload(photo); //we are getting data from frontend we are uploading it to the cloudinary and then cloudinary is optimizing the url 

    const newPost = await Post.create({
    name,
    prompt,
    photo: photoUrl.url,
    });

    res.status(200).json({ success: true, data: newPost });
} catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
}
});


export default router;