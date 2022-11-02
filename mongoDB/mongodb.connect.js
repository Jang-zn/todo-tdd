const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect(
            "mongodb+srv://admin:admin@cluster0.df6liyk.mongodb.net/?retryWrites=true&w=majority",
            {useNewUrlParser:true}
        );
    }catch(err){
        console.error(err);
        console.error("Error connecting to mongoDB")
    }
}

module.exports={connect};