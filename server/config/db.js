import mongoose from "mongoose";


const connectDB = async() =>{
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/Connext`)
    } catch (error) {
        console.log('erorr connection with mongoDB')
        console.log(error.message)
    }
}

export default connectDB;