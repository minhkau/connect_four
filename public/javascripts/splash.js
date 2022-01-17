const first = document.querySelector('.first');
const second= document.querySelector('.second');
const third = document.querySelector('.third');
const fourth =  document.querySelector('.fourth');
const info = document.querySelectorAll('.information')

// console.log(first,second,third,fourth);


const upFirst = (e) =>{
    // console.log(e);
    first.classList.toggle('up');
    // console.log(first);
    info.forEach(inf=>inf.classList.toggle('active'))
};
const upSecond = (e)=>{
    // console.log(e.target);
    if(e.target===first){
        second.classList.toggle('up');
    }
};

const upThird = (e) =>{
    if(e.target===second){
        third.classList.toggle('up');
    }
};
const upFourth = (e) =>{
    if(e.target===third){
        fourth.classList.toggle('up');
    }
};


window.addEventListener('load', upFirst);
first.addEventListener('transitionend',upSecond);
second.addEventListener('transitionend',upThird);
third.addEventListener('transitionend',upFourth);
fourth.addEventListener('transitionend',upFirst);



const numberOfPlayers = document.querySelector('#players');
const numberOfGamesPlayed = document.querySelector('#gamesplayed');
const numberOfOngoingGames = document.querySelector('#ongoinggames');


// request statistics from the server
setInterval(() => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'stats', true)
    xhr.onload = function(){
        if(this.status == 200){
            let stats = JSON.parse(this.response);
            // console.log(stats['number of players']);
            numberOfPlayers.textContent = stats['number of players'];
            numberOfGamesPlayed.textContent = stats['number of games played'];
            numberOfOngoingGames.textContent = stats['number of ongoing games'];
        }
    }
    xhr.send();
},
1000)



