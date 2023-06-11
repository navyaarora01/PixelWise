/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // it is a hook

import { preview } from "../assets";
import { getRandomPrompt } from "../utils"; // when we click suprise me button we will get random prompts
import { FormField, Loader } from "../components";

const CreatePost = () => {
	const navigate = useNavigate(); // allows to navigate back to the whole page once post is created ....when we generate an image and share with community we will be redirected to the homepage
	const [form, setForm] = useState({
		name: "", // object conatining these properties
		prompt: "",
		photo: "",
	});
	//Here we will use two hooks
	//first:this is used while we are making contact with api and while we are waiting to get back the image
	const [generatingImg, setGeneratingImg] = useState(false);
	//second: this is used for the generall loading
	const [loading, setLoading] = useState(false); //loader component is used here

	const generateImage = async () => {  //connecting with the backend   
		console.log(import.meta.env.VITE_BACKEND_URL); // this func helps in generating the image and showing it on  createpost pafe 
		if (form.prompt) {
			try {
				setGeneratingImg(true);
				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_URL}/api/v1/pixelwise`,    //fetching the api from backend
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ prompt: form.prompt }),
					}
				);
				const data = await response.json();

				setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
			} catch (error) {
				alert(error);
			} finally {
				setGeneratingImg(false);
			}
		} else {
			alert("Please enter a prompt");
		}
	};

	const handleSubmit = async (e) => {  //this funcn helps to share with the community
		e.preventDefault(); //broswer doesnot reload the application after submitting

		if (form.prompt && form.photo) {  //prompt and photo exist
			console.log(form.photo);
			setLoading(true);
			try {
				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_URL}/api/v1/post`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ ...form }),
					}
				);

				await response.json();
				alert("Success");
				navigate("/"); // if we share the image with the community and it's a success then we will navigate back to the homepage with the help of usenavigate hook
			} catch (err) {
				alert(err);
			} finally {
				setLoading(false);
			}
		} else {
			alert("Please generate an image with proper details");
		}
	};

	const handleChange = (e) => {
		//firstly make sure that we can actually type values in our form field using this function
		setForm({ ...form, [e.target.name]: e.target.value });    //we used the spread operator to spread out the form values then we updated name value
	};
	const handleSurpriseMe = () => {
		//this function will be used to call our utility function to ensure that we always get a prompt
		const randomPrompt = getRandomPrompt(form.prompt);
		setForm({ ...form, prompt: randomPrompt });        //we used the spread operator to spread out the form values then we updated prompt value
	};

	return (
		<section className="max-w-7xl mx-auto">
			<div>
				<h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
				<p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
					Create imaginative and visually stunning images through PixelWise AI
					and share them with community
				</p>
			</div>
			<form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-5">
					<FormField // this is an input box where we pass our all the props
						labelName="Your Name"
						type="text"
						name="name"
						placeholder="Ex., john doe"
						value={form.name}
						handleChange={handleChange}
					/>

					<FormField
						labelName="Prompt"
						type="text"
						name="prompt"
						placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
						value={form.prompt}
						handleChange={handleChange}
						isSurpriseMe
						handleSurpriseMe={handleSurpriseMe}
					/>

					{/* here will be th place where ai generated image will be shown and preview of the image incase it has already be genegerated*/}
					<div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
						{form.photo ? ( // if photo is present then imagw will be shown
							<img
								src={form.photo}
								alt={form.prompt}
								className="w-full h-full object-contain"
							/>
						) : (
							<img // otherwise preview image will be displayed
								src={preview}
								alt="preview"
								className="w-9/12 h-9/12 object-contain opacity-40"
							/>
						)}

						{generatingImg && (
							<div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
								<Loader />
							</div>
						)}
					</div>
				</div>

				{/* //wrap or submit button */}
				<div className="mt-5 flex gap-5">
					<button
						type="button"
						onClick={generateImage}
						className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
					>
						{generatingImg ? "Generating..." : "Generate"}
					</button>
				</div>

				<div className="mt-10">
					<p className="mt-2 text-[#666e75] text-[14px]">
						** Once you have created the image you want, you can share it with
						others in the community **
					</p>
					<button
						type="submit"
						className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
					>
						{loading ? "Sharing..." : "Share with the Community"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default CreatePost;
