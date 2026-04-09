const Joi = require('joi');
module.exports.createPost = (req, res, next) => {
    const schema = Joi.object({
        'name': Joi.string()
            .required()
            .message({
                'string.empty': "Vui lòng điền tên tour!"
            }),
        'category': Joi.string().allow(""),
        'position': Joi.string().allow(""),
        'status': Joi.string().allow(""),
        'avatar': Joi.string().allow(""),
        'images': Joi.string().allow(""),
        'priceAdult': Joi.string().allow(""),
        'priceChildren': Joi.string().allow(""),
        'priceBaby': Joi.string().allow(""),
        'priceNewAdult': Joi.string().allow(""),
        'priceNewChildren': Joi.string().allow(""),
        'priceNewBaby': Joi.string().allow(""),
        'stockAdult': Joi.string().allow(""),
        'stockChildren': Joi.string().allow(""),
        'stockBaby': Joi.string().allow(""),
        'locations': Joi.string().allow(""),
        'time': Joi.string().allow(""),
        'vehicle': Joi.string().allow(""),
        'departureDate': Joi.string().allow(""),
        'information': Joi.string().allow(""),
        'schedules': Joi.string().allow("")
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.json({
            code: "error",
            message: error.details[0].message
        })
        return;
    }
    next()
}
