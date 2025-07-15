const Joi = require("joi");

const createResponseSchema = Joi.object({
  sawal: Joi.string().required(),
  jawab: Joi.string().required()
});

const updateRatingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required()
});

module.exports = {
  createResponseSchema,
  updateRatingSchema
};
