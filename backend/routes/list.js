const router = require ("express").Router();
const User = require("../models/user");
const List = require("../models/list");


//create task 

router.post("/addTask",async(req , res) =>{
    try {
        const { title , body , email , deadline} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            const list = new List({title , body , user:existingUser , deadline});
            await list.save().then(()=> res.status(200).json({list}));

            existingUser.list.push(list);
            existingUser.save();
        }
    } catch (error) {
        console.log(error);
        
    }
})



// update a task
router.put("/updateTask/:id", async (req, res) => {
    try {
        const { title, body, email, deadline } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the task
        const updatedTask = await List.findByIdAndUpdate(
            req.params.id,
            { title, body, deadline },
            { new: true } // returns the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated", task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//delete 
router.delete("/deleteTask/:id", async(req, res)=>{
    try {
        const {email} = req.body;
        const existingUser = await User.findOneAndUpdate({email} , {$pull: {list: req.params.id}});
        if(existingUser){
            await List.findByIdAndDelete(req.params.id).then(()=>
                res.status(200).json({message: "Task deleted"})
            )
        }
    } catch (error) {
        console.log(error);
    }
})


//getTask

router.get("/getTasks/:id", async(req,res)=>{
    const list = await List.find({user: req.params.id}).sort({createdAt: -1});

    if(list.length !== 0){
        res.status(200).json({list: list});

    }else{
        res.status(200).json({ message: "No Tasks"});
    }
    
});








module.exports = router;