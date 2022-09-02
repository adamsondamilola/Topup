const Mask = (x) => {
    if(x != null){
        let first4 = x.substring(0, 4);
        let last5 = x.substring(x.length - 5);    
        let mask = x.substring(4, x.length - 5).replace(/\d/g,"*");
        mask = first4 + mask + last5;
        return mask;
    }
    else{
        return '';
    }
}

export default  Mask