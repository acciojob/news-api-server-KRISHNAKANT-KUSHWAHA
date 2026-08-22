const {db} = require("./app")
const  newsArticleModel  = require("./model");
const { data } = require("./data");

const refreshAll = async () => {
  await newsArticleModel.deleteMany({});
  // console.log(connection)
  await newsArticleModel.insertMany(data);
  console.log("done!");
};
refreshAll();
