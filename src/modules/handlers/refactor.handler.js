import {catchError} from './../../middlewares/catchError.middleware.js'
// refactoring the delete end point to avoid DRY
export const deleteOne = (model) => {
    return catchError(async (req, res, next) => { 
    const document = await model.findByIdAndDelete(req.params.id);
    if (!document) return next(new AppError("document not found",404));
    res.status(200).json({ message: "document deleted successfully" });
})
}

export const getOneById = (model) => {
    return  catchError(async (req, res, next) => { 
    const document = await model.findById(req.params.id);
    if (!document) return next(new AppError("document not found",404));
    res.status(200).json({ message: "document retrieved successfully", document });
})
}