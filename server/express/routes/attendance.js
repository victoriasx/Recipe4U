const router = require("../expressApp").Router("/api/v1/")

const auth = require("../authMiddleware")
const attendance = require("../../db/attendance")
const ResCode = require("../../db/helpers").ResCode


router.patch("/attendance/:courseID", auth, async (req, res) => {
    const response = await attendance.attend(req.userID, req.params.courseID)

    switch(response.resCode) {
        case ResCode.SUCCESS: 
            res.status(200).json({message: `Attendance updated`})
            break
        case ResCode.BAD_INPUT:
            res.status(400).json({
                message: "Bad input",
                error: response?.error
            })
            break
        case ResCode.ALREADY_FULL:
            res.status(403).json({message: "Course is already full"})
            break
        case ResCode.NOT_FOUND:
            res.status(404).json({message: "Course not found"})
            break
        case ResCode.ITEM_ALREADY_EXISTS:
            res.status(403).json({message: "Already signed up to course"})
            break

        default:
            res.status(500).json({message: `Server error. Code ${response.resCode.number}`})
            break
    }
})


router.delete("/attendance/:courseID", auth, async (req, res) => {
    const response = await attendance.leave(req.userID, req.params.courseID)

    switch(response.resCode) {
        case ResCode.SUCCESS: 
            res.status(200).json({message: `Removed from course`})
            break
        case ResCode.BAD_INPUT:
            res.status(400).json({
                message: "Bad input",
                error: response?.error
            })
            break
        case ResCode.NOT_FOUND:
            res.status(404).json({message: "Course not found"})
            break
        case ResCode.NOT_FOUND_1:
            res.status(200).json({message: "Already removed"})
            break

        default:
            res.status(500).json({message: `Server error. Code ${response.resCode.number}`})
            break
    }
})
