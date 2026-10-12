import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },

    description: {
        type: String,
        required: [true, "Product description is required"]
    },

    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0.01, "Price must be greater than 0"]
    },

    category: {
        type: String,
        required: [true, "Product category is required"]
    },

    image: {
        type: String
    },

    images: {
        type: [String],
        default: []
    },

    stock: {
        type: Number,
        required: [true, "Product stock is required"],
        min: [0, "Stock cannot be negative"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Auto-sync image and images fields
productSchema.pre('validate', function() {
    if (!this.image && this.images && this.images.length > 0) {
        this.image = this.images[0];
    }
    if ((!this.images || this.images.length === 0) && this.image) {
        this.images = [this.image];
    }
    if (!this.image && (!this.images || this.images.length === 0)) {
        this.invalidate('image', 'Product image is required');
    }
});

const Product = mongoose.model('Product', productSchema)

export default Product