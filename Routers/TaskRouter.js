const express=require("express")
const {TaskModel}=require("../Models/TaskModel")
const {auth}=require("../Middleware/auth.middleware")

const taskRoutes=express.Router()

taskRoutes.use(auth)

taskRoutes.post("/create",async(req,res)=>{
    const payload=req.body
    try{
        const task=new TaskModel(payload);
        await task.save();
        res.status(200).send({message:"new task has been added ",task})
    }catch(err){
        res.status(400).send({"error":err})
    } 
})

taskRoutes.get("/get",async(req,res)=>{
    const task=await TaskModel.find({userId:req.body.userId})
    res.status(200).send(task)
})

taskRoutes.get("/get/:id",async(req,res)=>{
    const task=await TaskModel.find({userId:req.body.userId,_id:req.params.id})
    res.status(200).send(task)
})

taskRoutes.patch("/update/:id", async (req, res) => {
    const { id } = req.params;

    try {
        
        const task = await TaskModel.findOne({ _id: id, userId: req.body.userId });

        if (!task) {
            return res.status(200).send({ message: "Task not found" });
        }
        await TaskModel.findByIdAndUpdate(id, req.body);
        const updatedTask = await TaskModel.findById(id);

        res.status(200).send({ message: "Task Updated Successfully!",updatedTask });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


taskRoutes.delete("/delete/:id",auth,async(req,res)=>{
    const {id}=req.params
    const task=await TaskModel.findOne({_id:id})
    try{
        if(req.body.userId!==task.userId){
            res.status(400).send({"error":"you are not authorized"})
        }else{
            await TaskModel.findByIdAndDelete({_id:id})
            res.status(200).send({message:"Task Deleted",task})
        }

    }catch(err){
        res.status(400).send({"error":err})
    }
})

module.exports={
    taskRoutes
}

