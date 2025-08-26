const { FetchingError } =require('./errorUnit.js');
async function fetching(url) {
    try {  
        const fetching = await fetch(url);
        const res = await fetching.json();
        return res;
    } catch (error) {
        throw new FetchingError(error.message);
    }
}

module.exports = { fetching };