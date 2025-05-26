const mongoose = require ("mongoose");

const conn = async(req , res)=>{
    try {
        await mongoose.connect("mongodb+srv://arnvk71:iu6894i2IQLdVhEh@test1.yzihtul.mongodb.net/?retryWrites=true&w=majority&appName=test1").then(()=>{
        console.log("connected to MongoDB");
    });
    } catch (error) {
        res.status(400).json({
            message: "Not Connected",
        });
        
    }
};

conn();

