import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";


export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.harsh.aora",
  projectId: "66f79ff0003a20dd2c65",
  databaseId: "66f7a1d600362a5d2ae8",
  UserCollectionId: "66f7a1fd003da081e8d8",
  videoCollectionId: "66f7a2320010c346f8f2",
  storageId: "66f7abae002663ad01fe",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
// Register user
export const createUser = async (email, password, username)=>{
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
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
// Get Current User
export const getCurrentUser = async () => {
    try {
  
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('accountId', currentAccount.$id)]);
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }