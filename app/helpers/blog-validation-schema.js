module.exports = blogValidationSchema = {
    title: {
        notEmpty: {
            errorMessage:'title is required'
        }
    },
    content: {
        notEmpty: {
            errorMessage: 'content is required'
        }
    }
}