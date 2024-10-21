import { Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";


export const  appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.harsh.aora",
  projectId: "66f79ff0003a20dd2c65",
  databaseId: "66f7a1d600362a5d2ae8",
  userCollectionId: "66f7a1fd003da081e8d8",
  videoCollectionId: "66f7a2320010c346f8f2",
  storageId: "66f7abae002663ad01fe",
};


const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register user
export const createUser = async (email, password, username)=>{
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error();

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username:username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export const signIn = async (email, password) => {
    try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}
//singout
export const signOut = async(email,password)=>{
  try{
    const session = await account.deleteSession("current");
    return session;
  }
  catch(error){
    throw new Error(error);
  }
}
// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}
// Get Current User
export const getCurrentUser = async () => {
    try {
  
      const currentAccount = await getAccount();
      if (!currentAccount) throw  new Error();
  
      const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)]);
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
//latest posts
  export const getLatestPosts = async () => {
    try {
      const posts = await databases.listDocuments(appwriteConfig.databaseId, videoCollectionId, [
        Query.orderDesc("$createdAt", Query.limit(7)),
      ]);
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  };
  export async function getUserPosts(userId) {
    try {
      const posts = await databases.listDocuments(databaseId, videoCollectionId, [
        Query.equal("creators", userId),
      ]);
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }
  

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
} 


//searxch posts

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};



export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creators: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}




export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}