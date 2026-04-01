const unidecode = require('unidecode');

module.exports.convertToSlug = (text) => {
    const unideCodeText = unidecode(text.trim());
    const slug = unideCodeText.replace(/\s+/g, "-")
    return slug;
}