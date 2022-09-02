const RandomString = (x) => {
    try {

        return Math.random().toString(16).substr(2, x);
         
    } catch {
        return null;
    }
}
export default  RandomString