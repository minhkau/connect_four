const first = document.querySelector('.first');
const second= document.querySelector('.second');
const third = document.querySelector('.third');
const fourth =  document.querySelector('.fourth');

console.log(first,second,third,fourth);


const upFirst = (e) =>{
    console.log(e);
    first.classList.toggle('up');
    console.log(first);
};
const upSecond = (e)=>{
    console.log(e.target);
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

