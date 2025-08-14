import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	authorId: { type: String, required: true },
	authorName: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	comments: [{
		authorId: { type: String, required: true },
		authorName: { type: String, required: true },
		content: { type: String, required: true },
		createdAt: { type: Date, default: Date.now }
	}],
	likes: [{ type: String, required: true }],
	saves: [{ type: String, required: true }],
	tags: [{ type: String, required: true }],
	thumbnail: { type: String, default: '' },
	slug: { type: String, required: true },
}, {timestamps: true});

export default mongoose.models.lamp_blog || mongoose.model('lamp_blog', BlogSchema);