
import Joi from 'joi';
export const generalFields = {
    id: Joi.string().hex().length(24).required().messages({
        "string.hex": "ID must be a hexadecimal string.",
        "string.length": "ID must be exactly 24 characters long.",
        "any.required": "ID field is required.",
    }),
    universityId: Joi.string().pattern(/^\d{4}$|^\d{8}$/).required().messages({
        "string.pattern.base": "University ID must be either 4 or 8 digits.",
        "any.required": "University ID is required."
    }),
    email: Joi.string().pattern(/^(s\d{8}@stu\.najah\.edu|.+@najah\.edu)$/).required().messages({
        "string.pattern.base": "Email must follow one of the formats: s########@stu.najah.edu or anything@najah.edu",
        "any.required": "Email is required."
    }),
    password: Joi.string().min(8).max(32).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/).required().messages({
        "string.min": "Password must be at least 8 characters.",
        "string.max": "Password must not exceed 32 characters.",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "any.required": "Password is required.",
    }),
    userName: Joi.string().pattern(/^[a-zA-Zء-ي ]+$/).required().min(3).max(20).messages({
        "string.empty": "Username is required.",
        "any.required": "Username is required.",
        "string.min": "Username must be at least 3 characters.",
        "string.max": "Username must not exceed 20 characters.",
        "string.pattern.base": "Username must contain only alphabetic characters and spaces.",
    }),
    image: Joi.object({
        fieldname: Joi.string().required().messages({
            "string.empty": "Field name is required.",
            "any.required": "Field name is required."
        }),
        originalname: Joi.string().required().messages({
            "string.empty": "Original file name is required.",
            "any.required": "Original file name is required."
        }),
        encoding: Joi.string().required().messages({
            "string.empty": "Encoding type is required.",
            "any.required": "Encoding type is required."
        }),
        mimetype: Joi.string()
            .valid("image/png", "image/jpeg", "image/gif", "image/ico", "image/svg+xml")
            .required()
            .messages({
                "any.only": "Invalid image format. Allowed formats: PNG, JPEG, GIF, ICO, SVG.",
                "any.required": "MIME type is required."
            }),
        destination: Joi.string().required().messages({
            "string.empty": "Destination path is required.",
            "any.required": "Destination path is required."
        }),
        filename: Joi.string().required().messages({
            "string.empty": "Filename is required.",
            "any.required": "Filename is required."
        }),
        path: Joi.string().required().messages({
            "string.empty": "File path is required.",
            "any.required": "File path is required."
        }),
        size: Joi.number().max(5000000).required().messages({
            "number.max": "File size must not exceed 5MB.",
            "any.required": "File size is required."
        })
    }).required().messages({
        "any.required": "Image is required."
    }),
};
export const validation = (Schema) => {
    return (req, res, next) => {
        let fillterData = {};
        if (req.file)
            fillterData = { image: req.file, ...req.body, ...req.params, ...req.query };
        else if (req.files)
            fillterData = { ...req.files, ...req.body, ...req.params, ...req.query };
        else
            fillterData = { ...req.body, ...req.params, ...req.query };
        const errorMessages = {};
        const { error } = Schema.validate(fillterData, { abortEarly: false });
        if (error) {
            error.details.forEach((err) => {
                const key = err.context.key;
                errorMessages[key] = err.message;
            });
            return res.status(400).json({ message: "خطأ في التحقق من البيانات", error: errorMessages });
        }
        next();
    };
}  