const Joi = require("joi");
const escapeHTML = require("escape-html");
const sanitizeHtml = require("sanitize-html");

const extensions = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

module.exports.addressSchema = Joi.object({
  address: Joi.object({
    name: Joi.string().required(),
    street: Joi.string().alphanum().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipcode: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().required(),
  }),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
