const mongoose = require("./db").mongoose
const ValidationError = require("mongoose").Error.ValidationError


function ResCodeObj(number){
    this.number = number
    this.toString = () => {
        return this.number.toString()
    }
    this.resCode = this
}


const ResCode = {
    SUCCESS: new ResCodeObj(0),
    ERROR: new ResCodeObj(1),
    MISSING_ARGUMENT: new ResCodeObj(2),
    NOT_FOUND: new ResCodeObj(3),
    ITEM_ALREADY_EXISTS: new ResCodeObj(4),
    ALREADY_FULL: new ResCodeObj(5),
    NOT_FOUND_1: new ResCodeObj(6),
    BAD_INPUT: new ResCodeObj(7),
    UNAUTHORIZED: new ResCodeObj(8),
    MISSING_RESPONSE_CODE: new ResCodeObj(9),
}


exports.idToObj = (strID) => {
    try{
        return new mongoose.Types.ObjectId(strID)
    } catch(err){
        console.error(`Bad ID: ${strID}`)
    }
}


function SortOption(sortStr){
    switch(sortStr[0]){
        case "-":
            this.property = sortStr.substring(1)
            this.asc = false
            break
        case " ":
            console.log("Sorting property starts with space, issues with query encoding?")
        case "+":
            this.property = sortStr.substring(1)
            this.asc = true
            break

        default:
            this.property = sortStr
            this.asc = true
    }

    this.orderSmaller = this.asc ? -1 : 1
    this.orderBigger = this.asc ? 1 : -1
}


exports.sort = (sortString, elements) => {
    if(!sortString) return elements

    const sorts = sortString.split(",")
    const sortOptions = sorts.map(sort => new SortOption(sort))

    for(let i = sortOptions.length-1; i >= 0; i--){
        const sortOpt = sortOptions[i]

        elements.sort((a, b) => {
            if(a[sortOpt.property] < b[sortOpt.property]) return sortOpt.orderSmaller
            if(a[sortOpt.property] > b[sortOpt.property]) return sortOpt.orderBigger
            return 0
        })
    }
}


exports.ResCode = ResCode
exports.ValidationError = ValidationError