const NumberToNaira = (x) => {
    try {
        if (x == '' || x == null) x = 0;
        if (isNaN(x) === true) x = 0;
            let y = x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "₦"+y; 
            //return "&#8358;"+y;
         
    } catch {
        let y = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if(y) return y;
        else return 0;
    }
}
export default  NumberToNaira