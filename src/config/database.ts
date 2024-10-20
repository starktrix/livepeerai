import mongoose from "mongoose";

const connect = async (uri: string) => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    // console.log(conn.connection.db);
    return conn;
  } catch (error: any) {
    console.error(`[MongoDB]: Error -> ${error.message}`);
    process.exit(1);
  }
};

export default connect;
