export async function getOneUser(collection: any, userName: string) {
	return await collection.findOne({name: userName})
}

export async function getAllUsers(collection: any) {
	return await collection.find({}).toArray()
}
