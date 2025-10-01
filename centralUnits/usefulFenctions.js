const { FetchingError } = require('./errorUnit.js');

function random(array){
    return array[Math.floor(Math.random() * array.length)];
}

async function fetching(url) {
    try {  
        const fetching = await fetch(url);
        const res = await fetching.json();
        return res;
    } catch (error) {
        throw new FetchingError(error.message);
    }
}

function poemDisplay(customId, currentPage, curentLines, poemLines, pagesNum, linesPerPage) {
    if (customId === 'next' && currentPage < pagesNum) { 
        currentPage++;
        curentLines += linesPerPage;
    } else if (customId === 'befor' && currentPage > 1) {
        currentPage--;
        curentLines -= linesPerPage;
    }

    let content = '';
    for (let i = curentLines; i < curentLines + linesPerPage  && i < poemLines.length; i++) {
        content += poemLines[i] + '\n';
    }

    return { content, currentPage, curentLines };
}

module.exports = { random, fetching, poemDisplay };