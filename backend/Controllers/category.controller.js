const kategoriModel = require("../Model/kategori.model");
const { successResponse, errorResponse } = require("../Utils/response.utils");


const getAllCategories = async(req,res) =>{
    const category = await kategoriModel.find({}).sort({createdAt: -1});
    if(!category) return errorResponse(res, "No Categories found plis retry")
    try {
        return successResponse(res, "Successfully to get all categories", category)
    } catch (error) {
        return errorResponse(res, "somethin went wrong", {message: error.message})
    }
}

const createCategory = async(req, res) =>{
    const {nama_kategori} = req.body;

    if(!nama_kategori) return errorResponse(res, "Kategori name is required, plis retry")

    try {
        const category = await kategoriModel.create({nama_kategori})
        return successResponse(res, "Successfully to create Category", category)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
    }
}

const editCategory = async(req, res) =>{
    const {id} = req.params;
    const {nama_kategori} = req.body;

    if(!nama_kategori) return errorResponse(res, "Kategori name is required, plis retry")

    const category = await kategoriModel.findById({_id:id})
    if(!category) return errorResponse(res, "this Category is not found,plis retry")
    
    try {
        const updateCategory = await category.updateOne({nama_kategori})
        return successResponse(res, "Successfully to update Category", updateCategory)
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
    }
}

const deleteCategory = async(req, res) =>{
    const {id} = req.params;

    const category = await kategoriModel.findById({_id:id})
    if(!category) return errorResponse(res, "this Category is not found,plis retry")

    try {
        await category.deleteOne();
        return successResponse(res, "Successfully to delete Category")
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
    }
}

module.exports = {getAllCategories, createCategory, editCategory, deleteCategory}