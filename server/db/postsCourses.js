const {ResCode, idToObj, ValidationError} = require("./helpers")
const {postValidation} = require("./post")
const Course = require("./models/course")


exports.create = async (userID, strPostID, meetingLink, start, duration, city, address, maxAttendees, courseID=null) => {

	//valid post?
	const postResponse = await postValidation(userID, strPostID)
	if(postResponse.resCode !== ResCode.SUCCESS) return postResponse

	const course = new Course({
		userID: userID,
		postID: postResponse.postID,
		meetingLink: meetingLink,
		start: start,
		duration: duration,
		city: city,
		address: address,
		attendees: [],
		maxAttendees: maxAttendees
	})

	
	try{
		if(courseID) course._id = courseID

		const data = await course.save()
		
		return {
			resCode: ResCode.SUCCESS,
			data: data
		}
	} catch (err){
		if(err instanceof ValidationError){
			return {
				resCode: ResCode.BAD_INPUT,
				data: err
			}
		}

		console.log(err)
		return ResCode.ERROR
	}
}


exports.getFromPost = async (strPostID) => {
	const postID = idToObj(strPostID)
	if(!postID) return ResCode.BAD_INPUT

	const courses = await Course.find({postID: postID})
	if(!courses) return ResCode.NOT_FOUND

	return {
		resCode: ResCode.SUCCESS,
		data: courses
	}
}