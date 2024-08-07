module.exports = (query) => {

    for (let key in query) {
        if (typeof query[key] === 'string') {
            query[key] = query[key].trim();
        }
    }

    let objectSearch = {
        keyword: "",
        regex: ""
    }

    if (query.keyword) {
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }

    return objectSearch;
}